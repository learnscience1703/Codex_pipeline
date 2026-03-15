# PIPELINE PATROL VERIFICATION SYSTEM

Production-ready monorepo for patrol verification with offline mobile reporting, admin dashboard, backend API, PostgreSQL, CSV import, Excel/KMZ export, and map monitoring.

## Monorepo Structure

```
pipeline-patrol-system/
  backend/
  mobile-app/
  admin-dashboard/
  database/
  scripts/
```

## 1) Prerequisites

- Node.js 18+
- npm 9+
- PostgreSQL 14+
- Expo Go app (for mobile testing)

## 2) Database Setup

```bash
createdb pipeline_patrol
psql -d pipeline_patrol -f database/schema.sql
```

## 3) Backend Setup (Express + PostgreSQL)

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Default runs on `http://localhost:5000`.

### Key API Endpoints

- `POST /auth/register`
- `POST /auth/login`
- `GET /guards`
- `POST /guards/approve`
- `POST /locations/upload`
- `GET /locations`
- `POST /assignments`
- `GET /guard/assignments`
- `GET /assignments` (admin list)
- `POST /patrol-report`
- `POST /upload-image`
- `GET /reports`
- `GET /export/excel`
- `GET /export/kmz`

## 4) Mobile App Setup (React Native + Expo)

```bash
cd mobile-app
npm install
npx expo start
```

### Mobile Features Implemented

- Guard login via mobile number/password
- Approval check (`Waiting for admin approval`)
- Assignment list with distance
- Patrol map with current location + assigned points
- Location detail with navigation shortcut
- Patrol report with camera-only capture (no gallery path)
- Offline SQLite queues:
  - `offline_reports`
  - `offline_images`
- Auto-sync every 30 seconds when online

## 5) Admin Dashboard Setup (Next.js + Tailwind + Leaflet)

```bash
cd admin-dashboard
npm install
npm run dev
```

Default runs on `http://localhost:3000`.

### Admin Features Implemented

- Dashboard statistics
- Guard approval/rejection
- CSV location upload
- Leaflet monitoring map (red/pending, yellow/assigned, green/completed)
- Patrol report list with images
- Excel and KMZ export links

## 6) CSV Upload Format

Required headers:

```csv
location_name,latitude,longitude,remark
Valve Point A,6.5244,3.3792,Near station gate
```

## 7) Export Scripts

### CSV parser utility

```bash
node scripts/csv-parser.js ./sample-locations.csv
```

### KMZ generator utility

```bash
node scripts/kmz-generator.js ./reports.json patrol-reports.kmz
```

Generated KMZ contains `doc.kml` and opens in Google Earth.

## 8) Sample Bootstrap Data

Register admin:

```bash
curl -X POST http://localhost:5000/auth/register \
 -H "Content-Type: application/json" \
 -d '{"name":"Admin","mobile_number":"9990001111","role":"admin","password":"123456"}'
```

Register guard:

```bash
curl -X POST http://localhost:5000/auth/register \
 -H "Content-Type: application/json" \
 -d '{"name":"Guard One","mobile_number":"8880001111","role":"guard","password":"123456"}'
```

Approve guard from admin dashboard or API.

## 9) Image Storage Path

Uploads are stored using this route convention:

`/uploads/patrol_images/{guard_id}/{location_id}/{image_name}.jpg`

Backed by local disk in development (`backend/uploads`). This can be replaced with AWS S3 or Firebase in `backend/services/storageService.js`.

## 10) Security + Validation

- JWT auth middleware
- Role-protected endpoints
- GPS verification using Haversine formula
- Submission rejection when distance > 50m
- Automatic server timestamp fallback
