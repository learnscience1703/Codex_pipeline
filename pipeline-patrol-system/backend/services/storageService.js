const path = require('path');
const fs = require('fs');

const localStorageRoot = path.join(__dirname, '..', 'uploads');

function storeImageLocally(file, guardId, locationId) {
  const folder = path.join(localStorageRoot, 'patrol_images', String(guardId), String(locationId));
  fs.mkdirSync(folder, { recursive: true });
  const filename = `${Date.now()}-${file.originalname}`;
  const fullPath = path.join(folder, filename);
  fs.renameSync(file.path, fullPath);
  const imageUrl = `/uploads/patrol_images/${guardId}/${locationId}/${filename}`;
  return { imageUrl, fullPath };
}

module.exports = { storeImageLocally };
