const bcrypt = require("bcryptjs");
const { User, Role } = require("../models/userModel");

// Admin creating a new user with a role
exports.createUser = async (req, res) => {
  try {
    const { username, password, email, role_id } = req.body;

    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Admin role required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      password: hashedPassword,
      email,
    });

    await User.assignRole(newUser.id, role_id);

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Failed to create user." });
  }
};

// Get all users with their roles
exports.getUsers = async (req, res) => {
  try {
    const users = await User.getAllUsersWithRoles();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users." });
  }
};

// Add a new role with permissions
exports.addRole = async (req, res) => {
  const { role_name, permissions } = req.body;

  try {
    // Start a transaction
    await Role.startTransaction();

    // Insert the new role into the roles table
    const roleResult = await Role.createRole(role_name);
    const roleId = roleResult.id;

    // Insert permissions associated with the role into role_permissions
    const permissionPromises = permissions.map(async (permission) => {
      const permissionId = await Role.getPermissionIdByName(permission);

      return Role.assignPermissionToRole(roleId, permissionId);
    });

    await Promise.all(permissionPromises);

    // Commit the transaction
    await Role.commitTransaction();

    res.status(200).json({ message: "Role and permissions added successfully." });
  } catch (error) {
    await Role.rollbackTransaction();
    console.error("Error adding role and permissions:", error);
    res.status(500).json({ message: "Failed to add role and permissions." });
  }
};
