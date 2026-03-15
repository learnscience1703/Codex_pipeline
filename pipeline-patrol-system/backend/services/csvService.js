const { parse } = require('csv-parse/sync');

function parseLocationsCsv(buffer) {
  const rows = parse(buffer, { columns: true, skip_empty_lines: true, trim: true });
  return rows.map((row) => ({
    location_name: row.location_name,
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
    remark: row.remark || null,
  }));
}

module.exports = { parseLocationsCsv };
