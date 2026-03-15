const fs = require('fs');
const JSZip = require('jszip');
const { create } = require('xmlbuilder2');

async function generateKmz(reports, outputPath = 'patrol-reports.kmz') {
  const doc = create({ version: '1.0', encoding: 'UTF-8' })
    .ele('kml', { xmlns: 'http://www.opengis.net/kml/2.2' })
    .ele('Document');

  reports.forEach((report) => {
    const placemark = doc.ele('Placemark');
    placemark.ele('name').txt(report.location_name);
    placemark
      .ele('description')
      .txt(`Comment: ${report.comment}\nImage: ${report.image_url || 'N/A'}\nDate: ${report.submitted_at}`);
    placemark.ele('Point').ele('coordinates').txt(`${report.actual_longitude},${report.actual_latitude},0`);
  });

  const zip = new JSZip();
  zip.file('doc.kml', doc.end({ prettyPrint: true }));
  const kmzBuffer = await zip.generateAsync({ type: 'nodebuffer' });
  fs.writeFileSync(outputPath, kmzBuffer);
}

if (require.main === module) {
  const inputFile = process.argv[2];
  const outputFile = process.argv[3] || 'patrol-reports.kmz';

  if (!inputFile) {
    console.error('Usage: node kmz-generator.js <reports.json> [output.kmz]');
    process.exit(1);
  }

  const reports = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
  generateKmz(reports, outputFile).then(() => console.log(`KMZ generated: ${outputFile}`));
}

module.exports = { generateKmz };
