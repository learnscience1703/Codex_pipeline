CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  mobile_number VARCHAR(20) UNIQUE NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'guard')),
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS locations (
  id SERIAL PRIMARY KEY,
  location_name VARCHAR(255) NOT NULL,
  latitude DECIMAL(10, 7) NOT NULL,
  longitude DECIMAL(10, 7) NOT NULL,
  remark TEXT,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assignments (
  id SERIAL PRIMARY KEY,
  location_id INTEGER NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  guard_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'assigned',
  assigned_date TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(location_id, guard_id)
);

CREATE TABLE IF NOT EXISTS patrol_reports (
  id SERIAL PRIMARY KEY,
  location_id INTEGER NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  guard_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  comment TEXT,
  actual_latitude DECIMAL(10, 7) NOT NULL,
  actual_longitude DECIMAL(10, 7) NOT NULL,
  distance_from_target DECIMAL(10, 2) NOT NULL,
  submitted_at TIMESTAMP NOT NULL DEFAULT NOW(),
  sync_status VARCHAR(20) NOT NULL DEFAULT 'synced'
);

CREATE TABLE IF NOT EXISTS patrol_images (
  id SERIAL PRIMARY KEY,
  report_id INTEGER NOT NULL REFERENCES patrol_reports(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  timestamp TIMESTAMP NOT NULL DEFAULT NOW()
);
