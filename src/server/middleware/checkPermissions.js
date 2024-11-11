const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const checkPermissions = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id || req.user.user_id;
      if (!userId) {
        console.log('User ID is undefined');
        return res.status(401).json({ message: 'User not authenticated' });
      }

      // console.log('User ID:', userId);

      // Ambil roles dari user
      const userRolesQuery = `
        SELECT r.id 
        FROM roles r
        JOIN user_roles ur ON r.id = ur.role_id
        WHERE ur.user_id = $1
      `;
      const { rows: userRoles } = await pool.query(userRolesQuery, [userId]);

      if (userRoles.length === 0) {
        console.log('User has no roles');
        return res.status(403).json({ message: 'Forbidden: User has no roles' });
      }

      // console.log('User Roles:', userRoles);

      // Ambil permissions berdasarkan role
      const roleIds = userRoles.map((row) => row.id);
      const rolePermissionsQuery = `
        SELECT p.name
        FROM permissions p
        JOIN role_permissions rp ON p.id = rp.permission_id
        JOIN roles r ON rp.role_id = r.id
        WHERE r.id = ANY($1::int[])
      `;
      const { rows: rolePermissions } = await pool.query(rolePermissionsQuery, [
        roleIds,
      ]);

      // console.log('Role Permissions:', rolePermissions);

      const permissions = rolePermissions.map((perm) => perm.name);
      if (!permissions.includes(requiredPermission)) {
        return res.status(403).json({ message: "Forbidden: You do not have access to this resource." });
      }

      next();
    } catch (error) {
      console.error("Error checking permissions:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
};
module.exports = checkPermissions;
