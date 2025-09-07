const mysql = require('mysql2/promise'); // Ensure you are using promise-based connection
require('dotenv').config(); // Load environment variables from .env file

const pool = mysql.createPool({
    // user: 'jaivikrathod',
    // password: '9844@Mysql',
    // database: 'care_insurance',
    // host: 'localhost',

    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
});


const testDbConnection = async () => {
    try {
        const [rows] = await pool.query('SELECT 1 + 1 AS solution'); // Simple test query
        console.log('Database connection successful:', rows);
    } catch (error) {
        console.error('Database connection error:', error);
    }
};

testDbConnection();


module.exports = pool;
