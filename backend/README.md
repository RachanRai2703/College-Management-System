# College Management System - Backend API

A comprehensive Express.js backend API for managing college operations including authentication, notes, grades, assignments, announcements, and attendance tracking.

## Features

✅ **User Authentication**
- User signup and login
- Role-based access (Student, Teacher, Admin)
- User profile management

✅ **Notes Management**
- Upload course notes with file attachments
- View and download notes
- Track upload metadata

✅ **Grading System**
- Create and manage student grades
- Add feedback for assignments
- Filter grades by student or assignment
- Track grading date

✅ **Assignments**
- Create and manage assignments
- Set due dates
- Organize by course

✅ **Announcements**
- Post course announcements
- Set expiration dates
- Track posting date

✅ **Attendance Tracking**
- Mark student attendance
- Track attendance by student and course
- Generate attendance reports
- Calculate attendance percentage

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Seed demo data (optional):
```bash
npm run seed
```

4. Start the server:
```bash
npm start
```

The backend API will run on `http://localhost:4000`

## API Endpoints

### Authentication

#### Sign Up
```http
POST /auth/signup
Content-Type: application/json

{
  "email": "student@college.edu",
  "password": "password123",
  "name": "John Doe",
  "role": "student",
  "enrollmentId": "STU-2024-001",
  "department": "Computer Science"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "student@college.edu",
  "password": "password123"
}
```

#### Get Profile
```http
GET /auth/profile/:userId
```

### Notes

#### Upload Note
```http
POST /notes/upload
Content-Type: multipart/form-data

file: <binary>
title: "Math Notes"
description: "Chapter 1-5"
course: "MATH-101"
author: "John Doe"
```

#### List Notes
```http
GET /notes
```

#### Get Note
```http
GET /notes/:id
```

#### Download File
```http
GET /uploads/:filename
```

### Grading

#### Create Grade
```http
POST /grading
Content-Type: application/json

{
  "studentId": "STU-2024-001",
  "assignmentId": "assign-001",
  "grade": 85,
  "feedback": "Good work",
  "course": "CS-101"
}
```

#### List Grades
```http
GET /grading
GET /grading?studentId=STU-2024-001
GET /grading?assignmentId=assign-001
GET /grading?course=CS-101
```

### Assignments

#### Create Assignment
```http
POST /assignments
Content-Type: application/json

{
  "title": "Project 1",
  "description": "Build a web app",
  "dueDate": "2024-07-20T23:59:59Z",
  "course": "CS-101"
}
```

#### List Assignments
```http
GET /assignments
```

### Announcements

#### Create Announcement
```http
POST /announcements
Content-Type: application/json

{
  "title": "Class Cancelled",
  "message": "Class is cancelled tomorrow",
  "course": "CS-101",
  "expiresAt": "2024-07-20T23:59:59Z"
}
```

#### List Announcements
```http
GET /announcements
```

### Attendance

#### Mark Attendance
```http
POST /attendance/mark
Content-Type: application/json

{
  "studentId": "STU-2024-001",
  "courseId": "CS-101",
  "date": "2024-06-17",
  "status": "present"
}
```

Status can be: `present`, `absent`, `late`, `excused`

#### Get Student Attendance
```http
GET /attendance/student/:studentId
GET /attendance/student/:studentId?courseId=CS-101
```

#### Get Course Attendance
```http
GET /attendance/course/:courseId
```

#### Get Attendance Report
```http
GET /attendance/report/:studentId
```

## Data Storage

All data is stored in JSON files in the `data/` directory:
- `users.json` - User accounts
- `notes.json` - Uploaded notes metadata
- `grades.json` - Grade records
- `assignments.json` - Assignment data
- `announcements.json` - Announcements
- `attendance.json` - Attendance records

Uploaded files are stored in the `uploads/` directory.

## Demo Credentials

After running `npm run seed`:

```
Teacher: teacher@college.edu / password123
Student: student@college.edu / password123
Admin:   admin@college.edu / password123
```

## Available Scripts

- `npm start` - Start Express server
- `npm run seed` - Seed demo data

## Troubleshooting

### Port already in use
```bash
netstat -ano | findstr :4000
taskkill /PID <PID> /F
```

### Data not persisting
- Ensure `data/` directory exists and is writable
- Check file permissions
