const db = require('../config/db');
const { buildExcel, buildKmz } = require('../services/exportService');

async function loadReportRows() {
  const result = await db.query(
    `SELECT pr.*, l.location_name, u.name as guard_name,
    (SELECT pi.image_url FROM patrol_images pi WHERE pi.report_id=pr.id ORDER BY pi.id DESC LIMIT 1) as image_url
     FROM patrol_reports pr
     JOIN locations l ON l.id = pr.location_id
     JOIN users u ON u.id = pr.guard_id
     ORDER BY pr.submitted_at DESC`,
  );
  return result.rows;
}

async function exportExcel(req, res) {
  const rows = await loadReportRows();
  const file = await buildExcel(rows);
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=patrol-reports.xlsx');
  res.send(file);
}

async function exportKmz(req, res) {
  const rows = await loadReportRows();
  const file = await buildKmz(rows);
  res.setHeader('Content-Type', 'application/vnd.google-earth.kmz');
  res.setHeader('Content-Disposition', 'attachment; filename=patrol-reports.kmz');
  res.send(file);
}

module.exports = { exportExcel, exportKmz };
