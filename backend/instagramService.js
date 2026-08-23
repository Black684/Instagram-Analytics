const pool = require('./db');

async function saveInstagramReel(data, instagramUrl, authUserId) {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Пользователь сайта, который добавляет Reel
        const userResult = await client.query(
            `
            SELECT id
            FROM users
            WHERE id = $1
            `,
            [authUserId]
        );

        if (userResult.rows.length === 0) {
            throw new Error('USER_NOT_FOUND');
        }

        const userId = userResult.rows[0].id;

        // Проверяем, есть ли уже такой Reel
        const reelResult = await client.query(
            `
            SELECT id
            FROM reels
            WHERE instagram_id = $1
            AND user_id = $2
            `,
            [data.instagramId, userId]
        );

        if (reelResult.rows.length > 0) {
            await client.query('COMMIT');

            return {
                isNew: false,
                userId,
                reelId: reelResult.rows[0].id
            };
        }

        // Создаём Reel и привязываем его к аккаунту
        const newReelResult = await client.query(
            `
            INSERT INTO reels (
                user_id,
                instagram_id,
                shortcode,
                url,
                caption,
                thumbnail_url,
                views,
                likes,
                comments,
                duration,
                published_at
            )
            VALUES (
                $1, $2, $3, $4, $5, $6,
                $7, $8, $9, $10, $11
            )
            RETURNING id
            `,
            [
                userId,
                data.instagramId,
                data.shortcode,
                instagramUrl,
                data.caption,
                data.thumbnail,
                data.views,
                data.likes,
                data.comments,
                data.duration,
                data.publishedAt
            ]
        );

        await client.query('COMMIT');

        return {
            isNew: true,
            userId,
            reelId: newReelResult.rows[0].id
        };

    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

module.exports = saveInstagramReel;