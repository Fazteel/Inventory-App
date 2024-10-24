require('dotenv').config();
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Test koneksi saat startup
const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('Database connected successfully. Server time:', result.rows[0].now);
  } catch (err) {
    console.error('Database connection error:', err.message);
    process.exit(1);
  }
};

// Jalankan test koneksi
testConnection();

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
  connect: () => pool.connect()
};