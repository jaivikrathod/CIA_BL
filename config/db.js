
const mysql = require('mysql2/promise'); // Ensure you are using promise-based connection

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'care_insurance',
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
