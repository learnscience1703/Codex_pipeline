const fs = require('fs');
const { parse } = require('csv-parse/sync');

function parseCsvFile(filePath) {
  const content = fs.readFileSync(filePath);
  return parse(content, { columns: true, skip_empty_lines: true, trim: true }).map((row) => ({
    location_name: row.location_name,
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
    remark: row.remark || null,
  }));
}

if (require.main === module) {
  const file = process.argv[2];
  if (!file) {
    console.error('Usage: node csv-parser.js <file.csv>');
    process.exit(1);
  }
  console.log(JSON.stringify(parseCsvFile(file), null, 2));
}

module.exports = { parseCsvFile };
