const db = require('../config/db');

async function createAssignment(req, res) {
  const { location_id, guard_id } = req.body;
  const result = await db.query(
    `INSERT INTO assignments(location_id, guard_id, status, assigned_date)
     VALUES($1,$2,$3,NOW())
     ON CONFLICT (location_id, guard_id)
     DO UPDATE SET status = EXCLUDED.status, assigned_date = NOW()
     RETURNING *`,
    [location_id, guard_id, 'assigned'],
  );
  res.status(201).json(result.rows[0]);
}

async function getGuardAssignments(req, res) {
  const guardId = req.user.id;
  const result = await db.query(
    `SELECT a.id, a.status, l.id as location_id, l.location_name, l.latitude, l.longitude, l.remark
     FROM assignments a
     JOIN locations l ON l.id = a.location_id
     WHERE a.guard_id = $1
     ORDER BY a.assigned_date DESC`,
    [guardId],
  );
  res.json(result.rows);
}

async function getAllAssignments(req, res) {
  const result = await db.query(
    `SELECT a.id, a.location_id, a.guard_id, a.status, a.assigned_date,
            l.location_name, l.latitude, l.longitude,
            u.name AS guard_name
     FROM assignments a
     JOIN locations l ON l.id = a.location_id
     JOIN users u ON u.id = a.guard_id
     ORDER BY a.assigned_date DESC`,
  );
  res.json(result.rows);
}

module.exports = { createAssignment, getGuardAssignments, getAllAssignments };
