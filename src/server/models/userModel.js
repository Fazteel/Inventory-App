// models/userModel.js
const db = require("../db");

const User = {
  create: async (userData) => {
    const result = await db.query(
      "INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *",
      [userData.username, userData.password, userData.email]
    );
    return result.rows[0];
  },
  assignRole: async (userId, roleId) => {
    await db.query("INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)", [userId, roleId]);
  },
  getAllUsersWithRoles: async () => {
    const result = await db.query(`
      SELECT u.id, u.username, u.email, r.name AS role_name 
      FROM users u 
      LEFT JOIN user_roles ur ON u.id = ur.user_id 
      LEFT JOIN roles r ON ur.role_id = r.id
    `);
    return result.rows;
  }
};

const Role = {
  beginTransaction: async () => {
    await db.query("BEGIN");
  },
  addRole: async (roleName) => {
    const result = await db.query(
      "INSERT INTO roles (name, created_at) VALUES ($1, CURRENT_TIMESTAMP) RETURNING id",
      [roleName]
    );
    return result.rows[0].id;
  },
  assignPermissions: async (roleId, permissions) => {
    const permissionPromises = permissions.map(async (permission) => {
      const permissionResult = await db.query("SELECT id FROM permissions WHERE name = $1", [permission]);
      const permissionId = permissionResult.rows[0].id;

      return db.query("INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2)", [roleId, permissionId]);
    });
    await Promise.all(permissionPromises);
  },
  commitTransaction: async () => {
    await db.query("COMMIT");
  },
  rollbackTransaction: async () => {
    await db.query("ROLLBACK");
  }
};

module.exports = {User, Role};
