require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const guardRoutes = require('./routes/guardRoutes');
const locationRoutes = require('./routes/locationRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const reportRoutes = require('./routes/reportRoutes');
const exportRoutes = require('./routes/exportRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const { getGuardAssignments } = require('./controllers/assignmentController');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/health', (_, res) => res.json({ status: 'ok' }));
app.use('/auth', authRoutes);
app.use('/guards', guardRoutes);
app.use('/locations', locationRoutes);
app.use('/assignments', assignmentRoutes);
app.get('/guard/assignments', authMiddleware('guard'), getGuardAssignments);
app.use('/', reportRoutes);
app.use('/export', exportRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});
