// server/models/userModel.js
const db = require('../config/db'); // Pastikan Anda sudah mengonfigurasi koneksi PostgreSQL

const User = {
  getAll: async () => {
    const result = await db.query('SELECT * FROM users');
    return result.rows;
  },
  create: async (userData) => {
    const result = await db.query('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *', [userData.name, userData.email]);
    return result.rows[0];
  },
  update: async (id, userData) => {
    const result = await db.query('UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *', [userData.name, userData.email, id]);
    return result.rows[0];
  },
  delete: async (id) => {
    await db.query('DELETE FROM users WHERE id = $1', [id]);
  }
};

module.exports = User;