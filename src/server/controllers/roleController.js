const { Role } = require("../models/roleModel");

const getRoles = async (req, res) => {
  try {
    const roles = await Role.findAll(); // Mengambil semua roles
    res.json(roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ error: 'Failed to fetch roles' });
  }
};

const createRole = async (req, res) => {
  const { name, permissions } = req.body; // Pastikan permissions diambil dari request body

  try {
    // Membuat role baru
    const role = await Role.create(name);

    // Menambahkan permissions jika ada
    if (permissions && permissions.length > 0) {
      await Role.addPermissions(role.id, permissions); // Panggil fungsi addPermissions
    }

    // Mendapatkan permissions yang baru ditambahkan
    const rolePermissions = await Role.getPermissions(role.id);

    res.status(201).json({
      ...role,
      permissions: rolePermissions,
    });
  } catch (error) {
    console.error("Error creating role:", error);
    res.status(500).json({ error: "Error creating role" });
  }
};

const updateRole = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  
  try {
    const updatedRole = await Role.update(id, name);
    if (!updatedRole) {
      return res.status(404).json({ error: 'Role not found' });
    }

    const permissions = await Role.getPermissions(id);
    res.json({
      ...updatedRole,
      permissions
    });
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({ error: 'Error updating role' });
  }
};

module.exports = {
  getRoles,
  createRole,
  updateRole
};
