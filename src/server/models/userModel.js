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

async function updateUser(id, updates) {
  try {
    const result = await query(
      "UPDATE users SET username = $1, email = $2, updated_at = NOW()  WHERE id = $3 RETURNING *",
      [updates.username, updates.email, id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

async function updateUserRole(userId, roleId) {
  try {
    // Delete existing role
    await query("DELETE FROM user_roles WHERE user_id = $1", [userId]);
    // Assign new role
    await query("INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)", [
      userId,
      roleId,
    ]);
  } catch (error) {
    console.error("Error updating user role:", error);
    throw error;
  }
}

async function deleteUser(id, deletedBy) {
  try {
    const result = await query(
      "UPDATE users SET is_deleted = true, deleted_by = $2, updated_at = NOW() WHERE id = $1 RETURNING *",
      [id, deletedBy]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error soft deleting user:", error);
    throw error;
  }
}

async function checkEmail(email) {
  try {
    const result = await query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length > 0) {
      return { exists: true }; 
    }
    return { exists: false };  
  } catch (error) {
    console.error('Error checking email:', error); 
    throw error;  
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

async function getAllUsersWithRoles(excludedUserId) {
  try {
    const result = await query(`
      SELECT u.id, u.username, u.email, r.name AS role_name
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      WHERE u.id <> $1 AND u.is_deleted = false
      ORDER BY COALESCE(u.updated_at, u.created_at) DESC
    `, [excludedUserId]);
    return result.rows;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

async function getUserWithRole(userId) {
  try {
    const result = await query(`
      SELECT u.id, u.username, u.email, r.id as role_id, r.name as role_name
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      WHERE u.id = $1
    `, [userId]);
    return result.rows[0];
  } catch (error) {
    console.error("Error fetching user with role:", error);
    throw error;
  }
}

module.exports = {
  createUser,
  updateUser,
  updateUserRole,
  deleteUser,
  assignRoleToUser,
  getAllUsersWithRoles,
  getUserWithRole,
  findUserByUsername,
  checkEmail
};
