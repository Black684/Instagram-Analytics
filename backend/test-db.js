require('dotenv').config();

const pool = require('./db');

async function test() {
    try {
        const result = await pool.query('SELECT NOW()');
        console.log('Подключение к PostgreSQL успешно!');
        console.log(result.rows[0]);
    } catch (error) {
        console.error('Ошибка подключения:', error);
    } finally {
        await pool.end();
    }
}

test();