const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const dataStore = require('./dataStore');

const app = express();
const port = process.env.PORT || 4000;

const upload = multer({
  dest: path.join(__dirname, 'uploads'),
  limits: { fileSize: 20 * 1024 * 1024 }
});

// Enable CORS for frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function makeId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

app.post('/notes/upload', upload.single('file'), async (req, res) => {
  try {
    const { title, description, course, author } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: 'Missing file upload.' });
    }

    const notes = await dataStore.getNotes();
    const note = {
      id: makeId(),
      title: title || req.file.originalname,
      description: description || '',
      course: course || '',
      author: author || '',
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      uploadedAt: new Date().toISOString(),
      mimeType: req.file.mimetype
    };

    notes.push(note);
    await dataStore.saveNotes(notes);
    res.status(201).json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to upload note.' });
  }
});

app.get('/notes', async (req, res) => {
  const notes = await dataStore.getNotes();
  res.json(notes);
});

app.get('/notes/:id', async (req, res) => {
  const notes = await dataStore.getNotes();
  const note = notes.find((item) => item.id === req.params.id);
  if (!note) {
    return res.status(404).json({ error: 'Note not found.' });
  }
  res.json(note);
});

app.post('/grading', async (req, res) => {
  try {
    const { studentId, assignmentId, grade, feedback, course } = req.body;
    if (!studentId || !assignmentId || grade === undefined) {
      return res.status(400).json({ error: 'studentId, assignmentId and grade are required.' });
    }

    const grades = await dataStore.getGrades();
    const entry = {
      id: makeId(),
      studentId,
      assignmentId,
      course: course || '',
      grade,
      feedback: feedback || '',
      gradedAt: new Date().toISOString()
    };

    grades.push(entry);
    await dataStore.saveGrades(grades);
    res.status(201).json(entry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to save grade.' });
  }
});

app.get('/grading', async (req, res) => {
  const { studentId, assignmentId, course } = req.query;
  let grades = await dataStore.getGrades();
  if (studentId) grades = grades.filter((g) => g.studentId === studentId);
  if (assignmentId) grades = grades.filter((g) => g.assignmentId === assignmentId);
  if (course) grades = grades.filter((g) => g.course === course);
  res.json(grades);
});

app.post('/assignments', async (req, res) => {
  try {
    const { title, description, dueDate, course } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'title is required.' });
    }

    const assignments = await dataStore.getAssignments();
    const assignment = {
      id: makeId(),
      title,
      description: description || '',
      course: course || '',
      dueDate: dueDate || null,
      createdAt: new Date().toISOString()
    };

    assignments.push(assignment);
    await dataStore.saveAssignments(assignments);
    res.status(201).json(assignment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to create assignment.' });
  }
});

app.get('/assignments', async (req, res) => {
  const assignments = await dataStore.getAssignments();
  res.json(assignments);
});

app.post('/announcements', async (req, res) => {
  try {
    const { title, message, course, expiresAt } = req.body;
    if (!title || !message) {
      return res.status(400).json({ error: 'title and message are required.' });
    }

    const announcements = await dataStore.getAnnouncements();
    const announcement = {
      id: makeId(),
      title,
      message,
      course: course || '',
      expiresAt: expiresAt || null,
      postedAt: new Date().toISOString()
    };

    announcements.push(announcement);
    await dataStore.saveAnnouncements(announcements);
    res.status(201).json(announcement);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to create announcement.' });
  }
});

app.get('/announcements', async (req, res) => {
  const announcements = await dataStore.getAnnouncements();
  res.json(announcements);
});

// ============ AUTHENTICATION ENDPOINTS ============

app.post('/auth/signup', async (req, res) => {
  try {
    const { email, password, name, role, enrollmentId, department } = req.body;
    if (!email || !password || !name || !role) {
      return res.status(400).json({ error: 'email, password, name, and role are required.' });
    }

    const users = await dataStore.getUsers();
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered.' });
    }

    const user = {
      id: makeId(),
      email,
      password, // In production, use bcrypt
      name,
      role, // 'student', 'teacher', 'admin'
      enrollmentId: enrollmentId || '',
      department: department || '',
      createdAt: new Date().toISOString()
    };

    users.push(user);
    await dataStore.saveUsers(users);
    res.status(201).json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      enrollmentId: user.enrollmentId,
      department: user.department
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to sign up.' });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required.' });
    }

    const users = await dataStore.getUsers();
    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      enrollmentId: user.enrollmentId,
      department: user.department,
      token: 'basic_token_' + user.id // Simple token for demo
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to login.' });
  }
});

app.get('/auth/profile/:userId', async (req, res) => {
  try {
    const users = await dataStore.getUsers();
    const user = users.find((u) => u.id === req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      enrollmentId: user.enrollmentId,
      department: user.department
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch profile.' });
  }
});

// ============ ATTENDANCE ENDPOINTS ============

app.post('/attendance/mark', async (req, res) => {
  try {
    const { studentId, courseId, date, status } = req.body;
    if (!studentId || !courseId || !date || !status) {
      return res.status(400).json({ error: 'studentId, courseId, date, and status are required.' });
    }

    const attendance = await dataStore.getAttendance();
    const entry = {
      id: makeId(),
      studentId,
      courseId,
      date,
      status, // 'present', 'absent', 'late', 'excused'
      markedAt: new Date().toISOString()
    };

    attendance.push(entry);
    await dataStore.saveAttendance(attendance);
    res.status(201).json(entry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to mark attendance.' });
  }
});

app.get('/attendance/student/:studentId', async (req, res) => {
  try {
    const { courseId } = req.query;
    let attendance = await dataStore.getAttendance();
    attendance = attendance.filter((a) => a.studentId === req.params.studentId);
    
    if (courseId) {
      attendance = attendance.filter((a) => a.courseId === courseId);
    }

    // Calculate attendance percentage
    const total = attendance.length;
    const present = attendance.filter((a) => a.status === 'present').length;
    const percentage = total > 0 ? ((present / total) * 100).toFixed(2) : 0;

    res.json({
      studentId: req.params.studentId,
      records: attendance,
      summary: { total, present, percentage }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch attendance.' });
  }
});

app.get('/attendance/course/:courseId', async (req, res) => {
  try {
    const attendance = await dataStore.getAttendance();
    const courseAttendance = attendance.filter((a) => a.courseId === req.params.courseId);
    res.json(courseAttendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch course attendance.' });
  }
});

app.get('/attendance/report/:studentId', async (req, res) => {
  try {
    const attendance = await dataStore.getAttendance();
    const studentRecords = attendance.filter((a) => a.studentId === req.params.studentId);

    // Group by course
    const byCourse = {};
    studentRecords.forEach((record) => {
      if (!byCourse[record.courseId]) {
        byCourse[record.courseId] = [];
      }
      byCourse[record.courseId].push(record);
    });

    // Calculate stats per course
    const report = {};
    Object.keys(byCourse).forEach((courseId) => {
      const records = byCourse[courseId];
      const total = records.length;
      const present = records.filter((r) => r.status === 'present').length;
      const absent = records.filter((r) => r.status === 'absent').length;
      const late = records.filter((r) => r.status === 'late').length;
      const excused = records.filter((r) => r.status === 'excused').length;

      report[courseId] = {
        total,
        present,
        absent,
        late,
        excused,
        percentage: total > 0 ? ((present / total) * 100).toFixed(2) : 0
      };
    });

    res.json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to generate report.' });
  }
});

app.get('/uploads/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found.' });
  }
  res.sendFile(filePath);
});

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found.' });
});

(async () => {
  await dataStore.init();
  app.listen(port, () => {
    console.log(`🎓 College Management System backend listening on http://localhost:${port}`);
  });
})();
