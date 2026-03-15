const db = require('../config/db');

async function getGuards(req, res) {
  const result = await db.query("SELECT id, name, mobile_number, status, created_at FROM users WHERE role='guard' ORDER BY created_at DESC");
  res.json(result.rows);
}

async function approveGuard(req, res) {
  const { guard_id, status } = req.body;
  const result = await db.query('UPDATE users SET status=$1 WHERE id=$2 AND role=\'guard\' RETURNING id, name, status', [
    status,
    guard_id,
  ]);
  res.json(result.rows[0]);
}

module.exports = { getGuards, approveGuard };
