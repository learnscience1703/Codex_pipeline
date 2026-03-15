const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

async function register(req, res) {
  const { name, mobile_number, role = 'guard', password = '123456' } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const status = role === 'admin' ? 'approved' : 'pending';
  const result = await db.query(
    'INSERT INTO users(name, mobile_number, role, status, password_hash) VALUES($1,$2,$3,$4,$5) RETURNING id, name, mobile_number, role, status',
    [name, mobile_number, role, status, hash],
  );
  res.status(201).json(result.rows[0]);
}

async function login(req, res) {
  const { mobile_number, password = '123456' } = req.body;
  const result = await db.query('SELECT * FROM users WHERE mobile_number=$1', [mobile_number]);
  const user = result.rows[0];
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  if (user.role === 'guard' && user.status !== 'approved') {
    return res.status(403).json({ message: 'Waiting for admin approval' });
  }

  const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
  return res.json({ token, user: { id: user.id, name: user.name, role: user.role, status: user.status } });
}

module.exports = { register, login };
