const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('./db');

function createToken(userId) {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
}

async function register(email, password) {
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await pool.query(
        `
        SELECT id
        FROM users
        WHERE email = $1
        `,
        [normalizedEmail]
    );

    if (existingUser.rows.length > 0) {
        throw new Error('USER_EXISTS');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
        `
        INSERT INTO users (
            email,
            password_hash,
            username,
            name
        )
        VALUES ($1, $2, $3, $4)
        RETURNING id, email, username, name
        `,
        [
            normalizedEmail,
            passwordHash,
            normalizedEmail.split('@')[0],
            normalizedEmail.split('@')[0]
        ]
    );

    const user = result.rows[0];

    return {
        user,
        token: createToken(user.id)
    };
}

async function login(email, password) {
    const normalizedEmail = email.trim().toLowerCase();

    const result = await pool.query(
        `
        SELECT id, email, username, name, password_hash
        FROM users
        WHERE email = $1
        `,
        [normalizedEmail]
    );

    if (result.rows.length === 0) {
        throw new Error('INVALID_CREDENTIALS');
    }

    const user = result.rows[0];

    const validPassword = await bcrypt.compare(
        password,
        user.password_hash
    );

    if (!validPassword) {
        throw new Error('INVALID_CREDENTIALS');
    }

    delete user.password_hash;

    return {
        user,
        token: createToken(user.id)
    };
}

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            error: 'Authorization token required'
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.userId = payload.userId;

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            error: 'Invalid or expired token'
        });
    }
}

module.exports = {
    register,
    login,
    authMiddleware
};