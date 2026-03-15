const db = require('../config/db');
const { parseLocationsCsv } = require('../services/csvService');

async function uploadLocations(req, res) {
  const rows = parseLocationsCsv(req.file.buffer);

  const inserted = [];
  for (const row of rows) {
    const result = await db.query(
      'INSERT INTO locations(location_name, latitude, longitude, remark, created_by) VALUES($1,$2,$3,$4,$5) RETURNING *',
      [row.location_name, row.latitude, row.longitude, row.remark, req.user.id],
    );
    inserted.push(result.rows[0]);
  }

  res.status(201).json({ count: inserted.length, locations: inserted });
}

async function getLocations(req, res) {
  const result = await db.query('SELECT * FROM locations ORDER BY created_at DESC');
  res.json(result.rows);
}

module.exports = { uploadLocations, getLocations };
