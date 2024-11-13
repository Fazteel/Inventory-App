const bcrypt = require("bcryptjs");
const {
  createUser,
  updateUser,
  updateUserRole,
  deleteUser,
  assignRoleToUser ,
  getAllUsersWithRoles,
  getUserWithRole,
  findUserByUsername,
  checkEmail,
  getUserRoleByUserId
} = require("../models/userModel");
const emailService = require("../services/emailService");
 
// Fungsi untuk generate password acak
const generateRandomPassword = () => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0; i < 12; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};

exports.createUser = async (req, res) => {
  console.log("Received data:", req.body);
  try {
    const { username, email, role_id } = req.body;

    // Validasi email
    if (!email || !email.includes('@')) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check existing user
    const existingUser = await findUserByUsername(username);
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists." });
    }

    const password = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Buat user terlebih dahulu
    const newUser = await createUser(username, hashedPassword, email, true);
    await assignRoleToUser(newUser.id, role_id);

    // Kirim email
    try {
      await emailService.sendWelcomeEmail(
        email,
        username,
        password
      );
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
      return res.status(201).json({ 
        message: "User created successfully but failed to send email notification.",
        user: newUser
      });
    }

    res.status(201).json({ 
      message: "User created successfully and notification email sent",
      user: newUser 
    });
    
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json({ message: "This email is already in use." });
    }
    console.error("Error creating user:", error);
    res.status(500).json({ message: `Failed to create user: ${error.message}` });
  }
};

exports.checkEmail = async (req, res) => {
  try {
    const email = req.query.email; 
    const result = await checkEmail(email);  
    res.json(result);
  } catch (error) {
    console.error("Error checking email:", error);
    return res.status(500).send("Internal server error");
  }
};

exports.getUsers = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const users = await getAllUsersWithRoles(currentUserId);
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users." });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, role_id } = req.body;
    
    // Update user basic info
    const updatedUser = await updateUser(id, { username, email });
    
    // Update user role if provided
    if (role_id) {
      await updateUserRole(id, role_id);
    }
    
    // Fetch updated user with role
    const userWithRole = await getUserWithRole(id);
    
    res.json(userWithRole);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Error updating user." });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { deletedBy } = req.body;

    // Pastikan pengguna yang sedang login memiliki izin untuk menghapus
    if (!deletedBy) {
      return res.status(401).json({ message: "Unauthorized to delete user" });
    }

    // Lakukan soft delete
    const deletedUser = await deleteUser(id, deletedBy);

    if (deletedUser) {
      res.json({ message: "User deleted successfully", user: deletedUser });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Error deleting user" });
  }
};

exports.getUserRole = async (req, res) => {
  try {
    const userId = req.user.id; 

    const roles = await getUserRoleByUserId(userId);

    if (roles.length === 0) {
      return res.status(404).json({ message: "User role not found" });
    }

    res.json(roles[0]);
  } catch (error) {
    console.error("Error fetching user role:", error);
    res.status(500).json({ message: "Failed to fetch user role" });
  }
};