require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { getInstagramReel } = require('./instagram');
const saveInstagramReel = require('./instagramService');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

const {
    register,
    login,
    authMiddleware
} = require('./auth');

app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
    ],
}));

app.use(express.json());

app.post('/api/reels', authMiddleware, async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({
                success: false,
                error: 'Instagram URL is required',
            });
        }

        const reel = await getInstagramReel(url);

        const result = await saveInstagramReel(
            reel,
            url,
            req.userId
        );

        return res.json({
            success: true,
            isNew: result.isNew,
            userId: result.userId,
            reelId: result.reelId,
            reel,
        });

    } catch (error) {
        console.error('POST /api/reels error:', error);

        return res.status(500).json({
            success: false,
            error: 'Failed to process Instagram Reel',
        });
    }
});

app.get('/api/reels', authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(
            `
            SELECT
                r.id,
                r.instagram_id AS "instagramId",
                r.shortcode,
                r.url,
                r.caption,
                r.thumbnail_url AS "thumbnail",
                r.views,
                r.likes,
                r.comments,
                r.duration,
                r.published_at AS "publishedAt",

                u.username,
                u.name,
                u.avatar_url AS "avatar"

            FROM reels r
            JOIN users u ON u.id = r.user_id
            WHERE r.user_id = $1
            ORDER BY r.published_at DESC NULLS LAST, r.created_at DESC
            `,
            [req.userId]
        );

        res.json({
            success: true,
            reels: result.rows
        });

    } catch (error) {
        console.error('GET /api/reels error:', error);

        res.status(500).json({
            success: false,
            error: 'Failed to load Reels'
        });
    }
});

app.delete('/api/reels/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `
            DELETE FROM reels
            WHERE id = $1
              AND user_id = $2
            RETURNING id
            `,
            [id, req.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Reel not found',
            });
        }

        res.json({
            success: true,
            deletedId: result.rows[0].id,
        });

    } catch (error) {
        console.error('DELETE /api/reels/:id error:', error);

        res.status(500).json({
            success: false,
            error: 'Failed to delete Reel',
        });
    }
});

app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password are required'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                error: 'Password must contain at least 6 characters'
            });
        }

        const result = await register(email, password);

        res.status(201).json({
            success: true,
            ...result
        });

    } catch (error) {
        console.error('Register error:', error);

        if (error.message === 'USER_EXISTS') {
            return res.status(409).json({
                success: false,
                error: 'User already exists'
            });
        }

        res.status(500).json({
            success: false,
            error: 'Registration failed'
        });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password are required'
            });
        }

        const result = await login(email, password);

        res.json({
            success: true,
            ...result
        });

    } catch (error) {
        console.error('Login error:', error);

        if (error.message === 'INVALID_CREDENTIALS') {
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password'
            });
        }

        res.status(500).json({
            success: false,
            error: 'Login failed'
        });
    }
});

app.get('/api/me', authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(
            `
            SELECT id, email, username, name, avatar_url
            FROM users
            WHERE id = $1
            `,
            [req.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        res.json({
            success: true,
            user: result.rows[0]
        });

    } catch (error) {
        console.error('GET /api/me error:', error);

        res.status(500).json({
            success: false,
            error: 'Failed to load user'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});