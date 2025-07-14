const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const users = require('../data/users');
const { v4: uuidv4 } = require('uuid');

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  const existing = users.find((u) => u.email === email);
  if (existing) return res.status(400).json({ message: 'User already exists.' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { id: uuidv4(), name, email, password: hashedPassword, role };
  users.push(newUser);
  res.status(201).json({ message: 'User registered successfully.' });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);
  if (!user) return res.status(400).json({ message: 'Invalid credentials.' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials.' });

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  res.json({ token });
};