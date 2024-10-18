// server/controllers/userController.js
const User = require('../models/userModel');

const getAllUsers = async (req, res) => {
  const users = await User.getAll();
  res.json(users);
};

const createUser  = async (req, res) => {
  const newUser  = await User.create(req.body);
  res.status(201).json(newUser );
};

const updateUser  = async (req, res) => {
  const updatedUser  = await User.update(req.params.id, req.body);
  res.json(updatedUser );
};

const deleteUser  = async (req, res) => {
  await User.delete(req.params.id);
  res.status(204).send();
};

module.exports = { getAllUsers, createUser , updateUser , deleteUser  };