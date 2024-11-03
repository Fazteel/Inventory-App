// permissionController.js
const pool = require("../db");

// Daftar permission yang tersedia
const PERMISSIONS = {
  USER: {
    CREATE: "create:user",
    READ: "read:user",
    UPDATE: "update:user",
    DELETE: "delete:user",
  },
  PRODUCT: {
    CREATE: "create:product",
    READ: "read:product",
    UPDATE: "update:product",
    DELETE: "delete:product",
  },
  SUPPLIER: {
    CREATE: "create:supplier",
    READ: "read:supplier",
    UPDATE: "update:supplier",
    DELETE: "delete:supplier",
  },
  TRANSACTION: {
    CREATE: "create:transaction",
    READ: "read:transaction",
    UPDATE: "update:transaction",
    DELETE: "delete:transaction",
  },
  ROLE: {
    CREATE: "create:role",
    READ: "read:role",
    UPDATE: "update:role",
    DELETE: "delete:role",
  },
};

// Inisialisasi permissions di database
exports.initializePermissions = async () => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Flatten PERMISSIONS object
    const allPermissions = Object.values(PERMISSIONS).reduce(
      (acc, curr) => ({ ...acc, ...curr }),
      {}
    );

    for (const [key, value] of Object.entries(allPermissions)) {
      await client.query(
        "INSERT INTO permissions (name, description) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING",
        [value, `Permission to ${value.replace(":", " ")}`]
      );
    }

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

// Fungsi untuk setup role default
exports.setupDefaultRoles = async () => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Setup Admin Role
    const adminRole = await client.query(
      "INSERT INTO roles (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = $1 RETURNING id",
      ["admin"]
    );

    // Setup Manager Role
    const managerRole = await client.query(
      "INSERT INTO roles (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = $1 RETURNING id",
      ["manager"]
    );

    // Setup Staff Role
    const staffRole = await client.query(
      "INSERT INTO roles (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = $1 RETURNING id",
      ["staff"]
    );

    // Get all permissions
    const permissions = await client.query("SELECT id, name FROM permissions");
    const permissionMap = permissions.rows.reduce(
      (acc, curr) => ({ ...acc, [curr.name]: curr.id }),
      {}
    );

    // Setup Admin Permissions
    const adminPermissions = [
      // User management (except staff)
      PERMISSIONS.USER.CREATE,
      PERMISSIONS.USER.READ,
      PERMISSIONS.USER.UPDATE,
      PERMISSIONS.USER.DELETE,
      // Full product access
      ...Object.values(PERMISSIONS.PRODUCT),
      // Full supplier access
      ...Object.values(PERMISSIONS.SUPPLIER),
      // Transaction create only
      PERMISSIONS.TRANSACTION.CREATE,
      // Full role management
      ...Object.values(PERMISSIONS.ROLE),
    ];

    // Setup Manager Permissions
    const managerPermissions = [
      // Staff management only
      ...Object.values(PERMISSIONS.USER),
      // Full product access
      ...Object.values(PERMISSIONS.PRODUCT),
      // Full supplier access
      ...Object.values(PERMISSIONS.SUPPLIER),
      // Create and read transactions
      PERMISSIONS.TRANSACTION.CREATE,
      PERMISSIONS.TRANSACTION.READ,
    ];

    // Setup Staff Permissions
    const staffPermissions = [
      // Read staff only
      PERMISSIONS.USER.READ,
      // Full product access
      ...Object.values(PERMISSIONS.PRODUCT),
      // Read supplier only
      PERMISSIONS.SUPPLIER.READ,
      // Create and read transactions
      PERMISSIONS.TRANSACTION.CREATE,
      PERMISSIONS.TRANSACTION.READ,
    ];

    // Assign permissions to roles
    for (const permission of adminPermissions) {
      await client.query(
        "INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2) ON CONFLICT (role_id, permission_id) DO NOTHING",
        [adminRole.rows[0].id, permissionMap[permission]]
      );
    }

    for (const permission of managerPermissions) {
      await client.query(
        "INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2) ON CONFLICT (role_id, permission_id) DO NOTHING",
        [managerRole.rows[0].id, permissionMap[permission]]
      );
    }

    for (const permission of staffPermissions) {
      await client.query(
        "INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2) ON CONFLICT (role_id, permission_id) DO NOTHING",
        [staffRole.rows[0].id, permissionMap[permission]]
      );
    }

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

// Get permissions for a specific role
exports.getRolePermissions = async (req, res) => {
  const { roleId } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT p.name, p.description
      FROM permissions p
      INNER JOIN role_permissions rp ON p.id = rp.permission_id
      WHERE rp.role_id = $1
    `,
      [roleId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Get Role Permissions Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Update role permissions
exports.updateRolePermissions = async (req, res) => {
  const { roleId } = req.params;
  const { permissions } = req.body;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Remove existing permissions
    await client.query("DELETE FROM role_permissions WHERE role_id = $1", [
      roleId,
    ]);

    // Add new permissions
    for (const permissionId of permissions) {
      await client.query(
        "INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2)",
        [roleId, permissionId]
      );
    }

    await client.query("COMMIT");
    res.json({ msg: "Role permissions updated successfully" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Update Role Permissions Error:", err);
    res.status(500).json({ msg: "Server error" });
  } finally {
    client.release();
  }
};

module.exports.PERMISSIONS = PERMISSIONS;
