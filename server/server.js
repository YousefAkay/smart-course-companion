const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const createAuthRoutes = require('./routes/auth');
const createCourseRoutes = require('./routes/courses');
const createAssessmentRoutes = require('./routes/assessments');
const createAdminRoutes = require('./routes/admin');

const app = express();
const PORT = 3000;
const SESSION_SECRET = process.env.SESSION_SECRET;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
if (!SESSION_SECRET || !ADMIN_PASSWORD) {
  console.error('Set SESSION_SECRET and ADMIN_PASSWORD before starting the server.');
  process.exit(1);
}
const DB_PATH = path.join(__dirname, 'db.json');
const DEFAULT_DB = {
  users: [],
  adminCourses: [],
  adminCourseAssessments: [],
  enrollments: [],
  assessments: []
};

function normalizeDB(data) {
  return {
    users: Array.isArray(data.users) ? data.users : [],
    adminCourses: Array.isArray(data.adminCourses) ? data.adminCourses : [],
    adminCourseAssessments: Array.isArray(data.adminCourseAssessments) ? data.adminCourseAssessments : [],
    enrollments: Array.isArray(data.enrollments) ? data.enrollments : [],
    assessments: Array.isArray(data.assessments) ? data.assessments : []
  };
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(normalizeDB(data), null, 2));
}

function readDB() {
  if (!fs.existsSync(DB_PATH)) {
    writeDB(DEFAULT_DB);
  }

  const raw = fs.readFileSync(DB_PATH, 'utf8');
  const parsed = raw ? JSON.parse(raw) : DEFAULT_DB;
  const normalized = normalizeDB(parsed);

  if (JSON.stringify(parsed) !== JSON.stringify(normalized)) {
    writeDB(normalized);
  }

  return normalized;
}

function seedAdminUser() {
  const db = readDB();
  const adminExists = db.users.some(function (user) {
    return user.role === 'admin';
  });

  if (adminExists) {
    return;
  }

  db.users.push({
    id: Date.now(),
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@scc.ca',
    password: bcrypt.hashSync(ADMIN_PASSWORD, 10),
    role: 'admin'
  });

  writeDB(db);
  console.log('Seeded local admin account: admin@scc.ca');
}

seedAdminUser();

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use('/api/auth', createAuthRoutes({
  readDB: readDB,
  writeDB: writeDB
}));
app.use('/api', createCourseRoutes({
  readDB: readDB,
  writeDB: writeDB
}));
app.use('/api', createAssessmentRoutes({
  readDB: readDB,
  writeDB: writeDB
}));
app.use('/api', createAdminRoutes({
  readDB: readDB,
  writeDB: writeDB
}));

app.use(express.static(path.join(__dirname, '../client')));

app.use('/api', function (req, res) {
  res.status(404).json({ error: 'API route not found.' });
});

app.listen(PORT, function () {
  console.log('Smart Course Companion server running on http://localhost:' + PORT);
});
