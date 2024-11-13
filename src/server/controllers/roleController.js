// controllers/roleController.js
const {
  getAllRoles,
  getUserRole,
  createNewRole,
  updateExistingRole,
  softDeleteRole,
  getPermissionsByRoleId,
} = require("../models/roleModel");

const getUserRoleMiddleware = async (req, res, next) => {
  try {
    const userId = req.user.id; // Asumsi data user tersedia dari middleware auth
    const userRole = await getUserRole(userId);
    req.userRole = userRole;
    next();
  } catch (error) {
    console.error("Error fetching user role:", error);
    res.status(500).json({ message: "Failed to verify user role" });
  }
};

exports.getRoles = async (req, res) => {
  try {
    const excludeAdmin = req.query.excludeAdmin === "true";
    const roles = await getAllRoles(excludeAdmin);
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
    return res
      .status(400)
      .json({ message: "At least one permission is required" });
  }

  try {
    const role = await createNewRole(name, permissions);
    res.status(201).json(role);
  } catch (error) {
    console.error("Error creating role:", error);
    res.status(500).json({ message: "Failed to create role" });
  }
};

exports.updateRole = [
  getUserRoleMiddleware,
  async (req, res) => {
    const { id } = req.params;
    const { name, permissions } = req.body;
    const userRoleId = req.userRole.id;

    if (parseInt(id) === userRoleId) {
      return res.status(403).json({
        message: "You cannot edit your own role",
      });
    }

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
  },
];

exports.softDeleteRole = [
  getUserRoleMiddleware,
  async (req, res) => {
    const { id } = req.params;
    const userRoleId = req.userRole.id;

    if (parseInt(id) === userRoleId) {
      return res.status(403).json({
        message: "You cannot delete your own role",
      });
    }

    try {
      const deletedRole = await softDeleteRole(id);
      res.status(200).json(deletedRole);
    } catch (error) {
      res.status(500).json({ message: "Failed to delete role" });
    }
  },
];
