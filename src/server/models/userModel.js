const { query } = require("../db");

async function createUser(username, password, email) {
  try {
    const result = await query(
      "INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *",
      [username, password, email]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

async function checkEmail(email) {
  try {
    const result = await query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length > 0) {
      return { exists: true };  // Return the result as an object
    }
    return { exists: false };  // If no record is found
  } catch (error) {
    console.error('Error checking email:', error);  // Log the actual error
    throw error;  // Throw the error to be handled in the controller
  }
}


async function assignRoleToUser(userId, roleId) {
  try {
    await query("INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)", [
      userId,
      roleId,
    ]);
  } catch (error) {
    console.error("Error assigning role to user:", error);
    throw error;
  }
}

findUserByUsername = async (username) => {
  const { rows } = await query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  return rows[0];
};

async function getAllUsersWithRoles() {
  try {
    const result = await query(`
      SELECT u.id, u.username, u.email, r.name AS role_name 
      FROM users u 
      LEFT JOIN user_roles ur ON u.id = ur.user_id 
      LEFT JOIN roles r ON ur.role_id = r.id
    `);
    return result.rows;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

module.exports = {
  createUser,
  assignRoleToUser,
  getAllUsersWithRoles,
  findUserByUsername,
  checkEmail
};
