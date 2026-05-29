const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

console.log("Отриманий DATABASE_URL:", process.env.DATABASE_URL ? "ПРИСУТНІЙ (Успішно зчитано)" : "ВІДСУТНІЙ (Помилка оточення)");

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
    connectionString: connectionString,
    ssl: connectionString ? { rejectUnauthorized: false } : false
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/db-check', async (req, res) => {
    // Якщо змінна пуста, одразу кажемо про це фронтенду
    if (!connectionString) {
        return res.status(500).json({
            status: 'error',
            message: 'Помилка конфігурації: Змінна DATABASE_URL не знайдена в process.env сервера!'
        });
    }

    try {
        const result = await pool.query('SELECT NOW() as current_time;');
        res.json({
            status: 'success',
            message: 'Успішно підключено до PostgreSQL на Railway!',
            dbTime: result.rows[0].current_time
        });
    } catch (err) {
        console.error("Детальна помилка БД:", err);
        res.status(500).json({
            status: 'error',
            message: 'Помилка підключення до бази даних: ' + err.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Сервер працює на порту ${PORT}`);
});