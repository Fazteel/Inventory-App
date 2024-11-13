// models/roleModel.js
const { query } = require("../db");

async function getAllRoles(excludeAdmin = false) {
  try {
    let queryStr = "SELECT * FROM roles WHERE deleted_at IS NULL";
    if (excludeAdmin) {
      queryStr += " AND id != 1"; 
    }
    queryStr += " ORDER BY updated_at DESC, created_at DESC";
    
    const result = await query(queryStr);
    return result.rows;
  } catch (error) {
    console.error("Error fetching roles:", error);
    throw error;
  }
}

async function getUserRole(userId) {
  try {
    const result = await query(
      `SELECT r.* 
       FROM roles r
       JOIN user_roles ur ON ur.role_id = r.id
       WHERE ur.user_id = $1 AND r.deleted_at IS NULL`,
      [userId]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error fetching user role:", error);
    throw error;
  }
}

async function createNewRole(name, permissions) {
  try {
    const roleResult = await query(
      "INSERT INTO roles (name) VALUES ($1) RETURNING *",
      [name]
    );
    const roleId = roleResult.rows[0].id;

    const permissionIds = await getPermissionIds(permissions);
    if (permissionIds.length > 0) {
      await assignPermissionsToRole(roleId, permissionIds);
    }
    return roleResult.rows[0];
  } catch (error) {
    console.error("Error creating new role:", error);
    throw error;
  }
}

async function updateExistingRole(id, name, permissions) {
  try {
    // Update the role name and updated_at timestamp
    const result = await query(
      "UPDATE roles SET name = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
      [name, id]
    );

    // If permissions are provided, update them
    if (permissions !== undefined) {
      // First, delete existing permissions
      await query("DELETE FROM role_permissions WHERE role_id = $1", [id]);

      // Only assign new permissions if they exist
      if (permissions.length > 0) {
        const permissionIds = await getPermissionIds(permissions);
        if (permissionIds.length > 0) {
          await assignPermissionsToRole(id, permissionIds);
        }
      }
    }

    return result.rows[0];
  } catch (error) {
    console.error("Error updating role:", error);
    throw error;
  }
}

async function softDeleteRole(id) {
  try {
    const result = await query(
      "UPDATE roles SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
      [id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error soft deleting role:", error);
    throw error;
  }
}

async function getPermissionIds(permissions) {
  try {
    const permissionQueries = permissions.map((permission) =>
      query("SELECT id FROM permissions WHERE name = $1", [permission])
    );
    const permissionResults = await Promise.all(permissionQueries);
    return permissionResults
      .map((result) => result.rows[0]?.id)
      .filter((id) => id !== undefined);
  } catch (error) {
    console.error("Error fetching permission IDs:", error);
    throw error;
  }
}

async function assignPermissionsToRole(roleId, permissionIds) {
  try {
    const rolePermissionQueries = permissionIds.map((permissionId) =>
      query(
        "INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2)",
        [roleId, permissionId]
      )
    );
    await Promise.all(rolePermissionQueries);
  } catch (error) {
    console.error("Error assigning permissions to role:", error);
    throw error;
  }
}

async function getPermissionsByRoleId(roleId) {
  try {
    const result = await query(
      `SELECT p.name FROM permissions p
       JOIN role_permissions rp ON rp.permission_id = p.id
       WHERE rp.role_id = $1`,
      [roleId]
    );
    return result.rows.map((row) => row.name); 
  } catch (error) {
    console.error("Error fetching permissions by role ID:", error);
    throw error;
  }
}

module.exports = {
  getAllRoles,
  getUserRole,
  createNewRole,
  updateExistingRole,
  softDeleteRole,
  getPermissionsByRoleId,
};
