// Demo Data Seeder - Run this once to populate sample data
const dataStore = require('./dataStore');

async function seedData() {
  console.log('🌱 Seeding College Management System with demo data...\n');

  try {
    // Initialize
    await dataStore.init();

    // Seed Users
    const demoUsers = [
      {
        id: 'user-teacher-001',
        email: 'teacher@college.edu',
        password: 'password123',
        name: 'Dr. John Anderson',
        role: 'teacher',
        enrollmentId: '',
        department: 'Computer Science',
        createdAt: new Date().toISOString()
      },
      {
        id: 'user-student-001',
        email: 'student@college.edu',
        password: 'password123',
        name: 'Alice Johnson',
        role: 'student',
        enrollmentId: 'STU-2024-001',
        department: 'Computer Science',
        createdAt: new Date().toISOString()
      },
      {
        id: 'user-student-002',
        email: 'bob@college.edu',
        password: 'password123',
        name: 'Bob Smith',
        role: 'student',
        enrollmentId: 'STU-2024-002',
        department: 'Information Technology',
        createdAt: new Date().toISOString()
      },
      {
        id: 'user-admin-001',
        email: 'admin@college.edu',
        password: 'password123',
        name: 'Admin User',
        role: 'admin',
        enrollmentId: '',
        department: 'Administration',
        createdAt: new Date().toISOString()
      }
    ];

    await dataStore.saveUsers(demoUsers);
    console.log('✓ Users seeded:', demoUsers.length);

    // Seed Assignments
    const demoAssignments = [
      {
        id: 'assign-001',
        title: 'Data Structures Implementation',
        description: 'Implement various data structures including linked lists, stacks, and queues',
        course: 'CS-101',
        dueDate: '2024-07-15T23:59:59Z',
        createdAt: new Date().toISOString()
      },
      {
        id: 'assign-002',
        title: 'Database Design Project',
        description: 'Design and implement a relational database for a college management system',
        course: 'CS-201',
        dueDate: '2024-08-01T23:59:59Z',
        createdAt: new Date().toISOString()
      }
    ];

    await dataStore.saveAssignments(demoAssignments);
    console.log('✓ Assignments seeded:', demoAssignments.length);

    // Seed Announcements
    const demoAnnouncements = [
      {
        id: 'announce-001',
        title: 'Semester Starts Monday',
        message: 'Welcome back to the college! The new semester starts on Monday. Please ensure you are enrolled in all your courses.',
        course: 'All Courses',
        expiresAt: '2024-07-30T23:59:59Z',
        postedAt: new Date().toISOString()
      },
      {
        id: 'announce-002',
        title: 'Library Extended Hours',
        message: 'The college library will be open until 9 PM during the exam period.',
        course: 'All Courses',
        expiresAt: null,
        postedAt: new Date().toISOString()
      }
    ];

    await dataStore.saveAnnouncements(demoAnnouncements);
    console.log('✓ Announcements seeded:', demoAnnouncements.length);

    // Seed Grades
    const demoGrades = [
      {
        id: 'grade-001',
        studentId: 'STU-2024-001',
        assignmentId: 'assign-001',
        grade: 85,
        feedback: 'Good implementation, well structured code',
        course: 'CS-101',
        gradedAt: new Date().toISOString()
      },
      {
        id: 'grade-002',
        studentId: 'STU-2024-002',
        assignmentId: 'assign-001',
        grade: 92,
        feedback: 'Excellent work, very clean code with good documentation',
        course: 'CS-101',
        gradedAt: new Date().toISOString()
      }
    ];

    await dataStore.saveGrades(demoGrades);
    console.log('✓ Grades seeded:', demoGrades.length);

    // Seed Attendance
    const today = new Date();
    const demoAttendance = [];
    
    for (let i = 0; i < 20; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const statuses = ['present', 'absent', 'late', 'excused'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      
      demoAttendance.push({
        id: `attend-${i}`,
        studentId: 'STU-2024-001',
        courseId: 'CS-101',
        date: date.toISOString().split('T')[0],
        status: randomStatus,
        markedAt: new Date().toISOString()
      });
    }

    await dataStore.saveAttendance(demoAttendance);
    console.log('✓ Attendance records seeded:', demoAttendance.length);

    console.log('\n✅ Demo data successfully seeded!\n');
    console.log('Demo Login Credentials:');
    console.log('------------------------');
    console.log('Teacher: teacher@college.edu / password123');
    console.log('Student: student@college.edu / password123');
    console.log('Admin:   admin@college.edu / password123');
    console.log('------------------------\n');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

// Run seeder
seedData().then(() => {
  console.log('Done! You can now start the server with: npm start');
  process.exit(0);
});
