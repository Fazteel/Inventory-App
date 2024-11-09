// controllers/roleController.js
const { query } = require("../db");

const getRoles = async (req, res) => {
  try {
    const result = await query("SELECT * FROM roles");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({ message: "Failed to fetch roles" });
  }
};

const createRole = async (req, res) => {
  const { name, permissions } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Role name is required" });
  }

  if (!permissions || permissions.length === 0) {
    return res.status(400).json({ message: "At least one permission is required" });
  }

  try {
    // Membuat role baru
    const result = await query(
      "INSERT INTO roles (name) VALUES ($1) RETURNING *",
      [name]
    );
    
    const roleId = result.rows[0].id;

    // Menambahkan permissions pada role
    const permissionQueries = permissions.map((permission) => {
      return query(
        "SELECT id FROM permissions WHERE name = $1",
        [permission]
      );
    });

    const permissionResults = await Promise.all(permissionQueries);
    const permissionIds = permissionResults
      .map((result) => result.rows[0]?.id)
      .filter((id) => id !== undefined);

    if (permissionIds.length > 0) {
      const rolePermissionQueries = permissionIds.map((permissionId) => {
        return query(
          "INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2)",
          [roleId, permissionId]
        );
      });

      await Promise.all(rolePermissionQueries);
      res.status(201).json({ message: "Role created successfully!" });
    } else {
      res.status(400).json({ message: "No valid permissions to add" });
    }
  } catch (error) {
    console.error("Error creating role:", error);
    res.status(500).json({ message: "Failed to create role" });
  }
};

const updateRole = async (req, res) => {
  const { id } = req.params;
  const { name, permissions } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Role name is required" });
  }

  try {
    const result = await query(
      "UPDATE roles SET name = $1 WHERE id = $2 RETURNING *",
      [name, id]
    );
    
    if (permissions) {
      // Menghapus permissions yang lama
      await query("DELETE FROM role_permissions WHERE role_id = $1", [id]);

      // Menambahkan permissions yang baru
      const permissionQueries = permissions.map((permission) => {
        return query(
          "SELECT id FROM permissions WHERE name = $1",
          [permission]
        );
      });

      const permissionResults = await Promise.all(permissionQueries);
      const permissionIds = permissionResults
        .map((result) => result.rows[0]?.id)
        .filter((id) => id !== undefined);

      if (permissionIds.length > 0) {
        const rolePermissionQueries = permissionIds.map((permissionId) => {
          return query(
            "INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2)",
            [id, permissionId]
          );
        });

        await Promise.all(rolePermissionQueries);
      }
    }

    res.status(200).json({ message: "Role updated successfully!" });
  } catch (error) {
    console.error("Error updating role:", error);
    res.status(500).json({ message: "Failed to update role" });
  }
};

const deleteRole = async (req, res) => {
  const { id } = req.params;

  try {
    // Menghapus role
    await query("DELETE FROM roles WHERE id = $1", [id]);
    res.status(200).json({ message: "Role deleted successfully!" });
  } catch (error) {
    console.error("Error deleting role:", error);
    res.status(500).json({ message: "Failed to delete role" });
  }
};

module.exports = {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
};
