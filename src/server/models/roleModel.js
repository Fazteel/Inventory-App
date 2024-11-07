// models/roleModel.js
const { query } = require("../db");

const Role = {
  create: async (name) => {
    const result = await query(
      "INSERT INTO roles (name) VALUES ($1) RETURNING *",
      [name]
    );
    return result.rows[0];
  },

  update: async (id, name) => {
    const result = await query(
      "UPDATE roles SET name = $1 WHERE id = $2 RETURNING *",
      [name, id]
    );
    return result.rows[0];
  },

  findAll: async () => {
    const result = await query("SELECT * FROM roles"); 
    return result.rows; 
  },

  getPermissions: async (roleId) => {
    const result = await query(
      `
      SELECT p.* FROM permissions p
      JOIN role_permissions rp ON p.id = rp.permission_id
      WHERE rp.role_id = $1
    `,
      [roleId]
    );
    return result.rows;
  },

  addPermissions: async (roleId, permissions) => {
    // Mendapatkan permission IDs
    const permissionQueries = permissions.map((permission) => {
      return query("SELECT id FROM permissions WHERE name = $1", [permission]);
    });

    const permissionResults = await Promise.all(permissionQueries);
    const permissionIds = permissionResults
      .map((result) => result.rows[0]?.id)
      .filter((id) => id !== undefined);

    console.log("Permission IDs:", permissionIds); // Log permission IDs

    if (permissionIds.length > 0) {
      // Menyimpan role permissions
      const rolePermissionQueries = permissionIds.map((permissionId) => {
        return query(
          "INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2)",
          [roleId, permissionId]
        );
      });

      await Promise.all(rolePermissionQueries); // Tunggu hingga semua query selesai
      console.log("Role permissions added for role ID:", roleId); // Log setelah menambahkan
    } else {
      console.log("No valid permissions to add for role ID:", roleId);
    }

    return permissionIds;
  },
};

module.exports = { Role };
