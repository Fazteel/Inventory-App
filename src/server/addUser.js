// src/server/addUser.js
require("dotenv").config();
const bcrypt = require("bcryptjs");
const pool = require("./db");

async function addUser(username, password, email) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const userQuery =
      "INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING id";
    const userResult = await client.query(userQuery, [
      username,
      hashedPassword,
      email,
    ]);

    const userId = userResult.rows[0].id;

    // Insert default role (assuming role_id 2 is for regular users)
    const roleQuery =
      "INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)";
    await client.query(roleQuery, [userId, 2]);

    await client.query("COMMIT");

    console.log("User added successfully:", {
      id: userId,
      username: username,
    });

    return userId;
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error adding user:", err);
    throw err;
  } finally {
    client.release();
  }
}

// Update call to createInitialUser to include email
async function createInitialUser() {
  try {
    const userId = await addUser("admin", "admin123", "admin@gmail.com"); // Menyertakan email
    console.log("Initial user created with ID:", userId);
  } catch (error) {
    console.error("Failed to create initial user:", error);
  } finally {
    // Disconnect dari database
    await pool.end();
  }
}

// Jalankan fungsi
createInitialUser();
