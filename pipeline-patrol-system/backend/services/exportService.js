const ExcelJS = require('exceljs');
const JSZip = require('jszip');
const { create } = require('xmlbuilder2');

async function buildExcel(reports) {
  const workbook = new ExcelJS.Workbook();
  const ws = workbook.addWorksheet('Patrol Reports');

  ws.columns = [
    { header: 'Location', key: 'location_name' },
    { header: 'Guard', key: 'guard_name' },
    { header: 'Comment', key: 'comment' },
    { header: 'Date', key: 'submitted_at' },
    { header: 'Coordinates', key: 'coordinates' },
  ];

  reports.forEach((report) => {
    ws.addRow({
      ...report,
      coordinates: `${report.actual_latitude}, ${report.actual_longitude}`,
    });
  });

  return workbook.xlsx.writeBuffer();
}

async function buildKmz(reports) {
  const doc = create({ version: '1.0', encoding: 'UTF-8' })
    .ele('kml', { xmlns: 'http://www.opengis.net/kml/2.2' })
    .ele('Document');

  reports.forEach((report) => {
    const placemark = doc.ele('Placemark');
    placemark.ele('name').txt(report.location_name);
    placemark
      .ele('description')
      .txt(`Comment: ${report.comment || ''}\nImage: ${report.image_url || 'N/A'}\nDate: ${report.submitted_at}`);
    placemark.ele('Point').ele('coordinates').txt(`${report.actual_longitude},${report.actual_latitude},0`);
  });

  const kmlData = doc.end({ prettyPrint: true });
  const zip = new JSZip();
  zip.file('doc.kml', kmlData);
  return zip.generateAsync({ type: 'nodebuffer' });
}

module.exports = { buildExcel, buildKmz };
