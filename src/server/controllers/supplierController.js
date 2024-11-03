const {
  getAllSuppliers,
  addSupplier,
  updateSupplier,
  softDeleteSupplier,
} = require("../models/supplierModel");

exports.getSuppliers = async (req, res) => {
  try {
    const suppliers = await getAllSuppliers();
    res.json(suppliers);
  } catch (err) {
    console.error("Error fetching suppliers:", err);
    res.status(500).json({ error: "Error fetching suppliers" });
  }
};

exports.createSupplier = async (req, res) => {
  const { name, contact_person, phone, email, address } = req.body;

  if (!name || !contact_person || !phone || !email || !address) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const supplier = await addSupplier(name, contact_person, phone, email, address);
    res.status(201).json(supplier);
  } catch (err) {
    console.error("Error adding supplier:", err);
    res.status(500).json({ error: "Error adding supplier", details: err.message });
  }
};

exports.updateSupplier = async (req, res) => {
  const { id } = req.params;
  const { name, contact_person, phone, email, address } = req.body;

  try {
    const result = await updateSupplier(id, name, contact_person, phone, email, address);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Supplier not found or already deleted" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating supplier:", err);
    res.status(500).json({ error: "Error updating supplier", details: err.message });
  }
};

exports.deleteSupplier = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await softDeleteSupplier(id);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Supplier not found or already deleted" });
    }

    res.json({ message: "Supplier soft deleted successfully" });
  } catch (err) {
    console.error("Error deleting supplier:", err);
    res.status(500).json({ error: "Error deleting supplier", details: err.message });
  }
};
