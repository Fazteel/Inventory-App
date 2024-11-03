// permissionMiddleware.js
const pool = require("../db");

const checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      // Get user's permissions based on their roles
      const result = await pool.query(
        `
        SELECT DISTINCT p.name as permission_name
        FROM permissions p
        INNER JOIN role_permissions rp ON p.id = rp.permission_id
        INNER JOIN user_roles ur ON rp.role_id = ur.role_id
        WHERE ur.user_id = $1
      `,
        [req.user.id]
      );

      const userPermissions = result.rows.map((row) => row.permission_name);

      if (!userPermissions.includes(requiredPermission)) {
        return res.status(403).json({
          msg: "Permission denied",
          required: requiredPermission,
          userPermissions: userPermissions,
        });
      }

      // Add permissions to request object for potential use in controllers
      req.userPermissions = userPermissions;
      next();
    } catch (err) {
      console.error("Permission Check Error:", err);
      res.status(500).json({ msg: "Server error" });
    }
  };
};

module.exports = checkPermission;
