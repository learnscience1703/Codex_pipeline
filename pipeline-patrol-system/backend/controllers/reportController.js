const db = require('../config/db');
const { calculateDistance } = require('../utils/distance');
const { storeImageLocally } = require('../services/storageService');

async function submitPatrolReport(req, res) {
  const { location_id, comment, actual_latitude, actual_longitude, submitted_at } = req.body;
  const guardId = req.user.id;

  const locationResult = await db.query('SELECT latitude, longitude FROM locations WHERE id=$1', [location_id]);
  if (!locationResult.rows[0]) {
    return res.status(404).json({ message: 'Location not found' });
  }

  const target = locationResult.rows[0];
  const distance = calculateDistance(
    Number(actual_latitude),
    Number(actual_longitude),
    Number(target.latitude),
    Number(target.longitude),
  );

  if (distance > 50) {
    return res.status(400).json({ message: 'Report rejected: You must be within 50 meters', distance });
  }

  const result = await db.query(
    `INSERT INTO patrol_reports(location_id, guard_id, comment, actual_latitude, actual_longitude,
      distance_from_target, submitted_at, sync_status)
     VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [location_id, guardId, comment, actual_latitude, actual_longitude, distance, submitted_at || new Date(), 'synced'],
  );

  await db.query('UPDATE assignments SET status=$1 WHERE location_id=$2 AND guard_id=$3', ['completed', location_id, guardId]);
  return res.status(201).json(result.rows[0]);
}

async function uploadImage(req, res) {
  const { report_id, location_id } = req.body;
  const guardId = req.user.id;
  const stored = storeImageLocally(req.file, guardId, location_id);

  const result = await db.query(
    'INSERT INTO patrol_images(report_id, image_url, timestamp) VALUES($1,$2,NOW()) RETURNING *',
    [report_id, stored.imageUrl],
  );
  res.status(201).json(result.rows[0]);
}

async function getReports(req, res) {
  const result = await db.query(
    `SELECT pr.*, l.location_name, u.name as guard_name,
    (SELECT pi.image_url FROM patrol_images pi WHERE pi.report_id=pr.id ORDER BY pi.id DESC LIMIT 1) as image_url
    FROM patrol_reports pr
    JOIN locations l ON l.id = pr.location_id
    JOIN users u ON u.id = pr.guard_id
    ORDER BY pr.submitted_at DESC`,
  );
  res.json(result.rows);
}

module.exports = { submitPatrolReport, uploadImage, getReports };
