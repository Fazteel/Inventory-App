// controllers/roleController.js
const {
  getAllRoles,
  createNewRole,
  updateExistingRole,
  softDeleteRole,
  getPermissionsByRoleId
} = require("../models/roleModel");

exports.getRoles = async (req, res) => {
  try {
    const roles = await getAllRoles();
    res.json(roles);
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({ message: "Failed to fetch roles" });
  }
};

exports.getRolePermissions = async (req, res) => {
  const { id } = req.params;

  try {
    const permissions = await getPermissionsByRoleId(id);
    res.json(permissions);
  } catch (error) {
    console.error("Error fetching role permissions:", error);
    res.status(500).json({ message: "Failed to fetch role permissions" });
  }
};

exports.createRole = async (req, res) => {
  const { name, permissions } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Role name is required" });
  }

  if (!permissions || permissions.length === 0) {
    return res.status(400).json({ message: "At least one permission is required" });
  }

  try {
    const role = await createNewRole(name, permissions);
    res.status(201).json(role);
  } catch (error) {
    console.error("Error creating role:", error);
    res.status(500).json({ message: "Failed to create role" });
  }
};

exports.updateRole = async (req, res) => {
  const { id } = req.params;
  const { name, permissions } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Role name is required" });
  }

  try {
    const updatedRole = await updateExistingRole(id, name, permissions);
    res.json(updatedRole);
  } catch (error) {
    console.error("Error updating role:", error);
    res.status(500).json({ message: "Failed to update role" });
  }
};

// Soft delete a role
exports.softDeleteRole = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedRole = await softDeleteRole(id);
    res.status(200).json(deletedRole);
  } catch (error) {
    res.status(500).json({ message: "Failed to delete role" });
  }
};

