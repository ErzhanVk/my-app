const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false 
    }
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/db-check', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW() as current_time;');
        res.json({
            status: 'success',
            message: 'Успішно підключено до PostgreSQL на Railway!',
            dbTime: result.rows[0].current_time
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: 'error',
            message: 'Помилка підключення до бази даних: ' + err.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Сервер працює на порту ${PORT}`);
});