const fs = require('fs').promises;
const path = require('path');

const dataDir = path.join(__dirname, 'data');
const files = {
  notes: path.join(dataDir, 'notes.json'),
  grades: path.join(dataDir, 'grades.json'),
  assignments: path.join(dataDir, 'assignments.json'),
  announcements: path.join(dataDir, 'announcements.json'),
  users: path.join(dataDir, 'users.json'),
  attendance: path.join(dataDir, 'attendance.json')
};

async function ensureDataFile(filePath, defaultValue) {
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, JSON.stringify(defaultValue, null, 2));
  }
}

async function init() {
  await Promise.all([
    ensureDataFile(files.notes, []),
    ensureDataFile(files.grades, []),
    ensureDataFile(files.assignments, []),
    ensureDataFile(files.announcements, []),
    ensureDataFile(files.users, []),
    ensureDataFile(files.attendance, [])
  ]);
}

async function readJson(filePath) {
  const raw = await fs.readFile(filePath, 'utf8');
  return JSON.parse(raw || '[]');
}

async function writeJson(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

module.exports = {
  init,
  async getNotes() {
    return readJson(files.notes);
  },
  async saveNotes(notes) {
    return writeJson(files.notes, notes);
  },
  async getGrades() {
    return readJson(files.grades);
  },
  async saveGrades(grades) {
    return writeJson(files.grades, grades);
  },
  async getAssignments() {
    return readJson(files.assignments);
  },
  async saveAssignments(assignments) {
    return writeJson(files.assignments, assignments);
  },
  async getAnnouncements() {
    return readJson(files.announcements);
  },
  async saveAnnouncements(announcements) {
    return writeJson(files.announcements, announcements);
  },
  async getUsers() {
    return readJson(files.users);
  },
  async saveUsers(users) {
    return writeJson(files.users, users);
  },
  async getAttendance() {
    return readJson(files.attendance);
  },
  async saveAttendance(attendance) {
    return writeJson(files.attendance, attendance);
  }
};
