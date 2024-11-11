const bcrypt = require("bcryptjs");
const {
  createUser ,
  assignRoleToUser ,
  getAllUsersWithRoles,
  findUserByUsername,
  checkEmail,
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
    console.log(password);
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Buat user terlebih dahulu
    const newUser = await createUser(username, hashedPassword, email);
    await assignRoleToUser(newUser.id, role_id);

    // Kirim email
    try {
      await emailService.sendMail(
        email,
        "User Account Created",
        `Hello ${username},\n\n

        Your account has been successfully created.\n
        Username: ${username}\n
        Password: ${password}\n\n
        Please change your password after logging in.\n\n
        
        Best regards,\n
        Your App Team`
      );
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
      // User sudah dibuat tapi email gagal terkirim
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
    const users = await getAllUsersWithRoles();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users." });
  }
};
