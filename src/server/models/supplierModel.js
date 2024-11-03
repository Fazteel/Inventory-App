const { query } = require("../db");

// Mendapatkan semua supplier (tidak termasuk yang soft-deleted)
async function getAllSuppliers() {
  const result = await query("SELECT * FROM suppliers WHERE deleted_at IS NULL ORDER BY updated_at DESC, created_at DESC");
  return result.rows;
}

// Menambahkan supplier baru
async function addSupplier(name, contact_person, phone, email, address) {
  const result = await query(
    "INSERT INTO suppliers (name, contact_person, phone, email, address, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING *",
    [name, contact_person, phone, email, address]
  );
  return result.rows[0];
}

// Memperbarui data supplier
async function updateSupplier(id, name, contact_person, phone, email, address) {
  const result = await query(
    "UPDATE suppliers SET name = $1, contact_person = $2, phone = $3, email = $4, address = $5, updated_at = NOW() WHERE id = $6 AND deleted_at IS NULL RETURNING *",
    [name, contact_person, phone, email, address, id]
  );
  return result;
}

// Menghapus supplier (soft delete)
async function softDeleteSupplier(id) {
  const result = await query(
    "UPDATE suppliers SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
    [id]
  );
  return result;
}

module.exports = {
  getAllSuppliers,
  addSupplier,
  updateSupplier,
  softDeleteSupplier,
};
