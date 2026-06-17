# College Management System - Frontend

A modern React-based frontend for the College Management System with authentication, role-based access, and comprehensive academic management features.

## Features

🎓 **User Authentication**
- Secure login and signup
- Role-based access (Student, Teacher, Admin)
- Persistent session management

📝 **Notes Management**
- Upload course notes with metadata
- View and download notes
- Filter notes by course and author

✅ **Grading System**
- View and manage student grades
- Add feedback for assignments
- Filter grades by student or assignment
- Visual grade indicators (Pass/Fail)

📋 **Assignments Management**
- View all assignments
- Track assignment deadlines
- Visual indicators for overdue assignments

📢 **Announcements**
- View course announcements
- Track announcement dates
- Visual indicators for expired announcements

📊 **Attendance Tracking**
- View attendance records
- Track attendance by course
- Generate attendance reports
- Calculate attendance percentages

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Configure the backend API URL in `.env`:
```
REACT_APP_API_URL=http://localhost:4000
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Project Structure

```
frontend/
├── src/
│   ├── context/
│   │   └── AuthContext.js         # Authentication context & hooks
│   ├── pages/
│   │   └── AuthPages.js           # Login & Signup pages
│   ├── components/
│   │   ├── NotesSection.js        # Notes management
│   │   ├── GradingSection.js      # Grading management
│   │   ├── AssignmentsSection.js  # Assignments management
│   │   ├── AnnouncementsSection.js # Announcements
│   │   └── AttendanceSection.js   # Attendance tracking
│   ├── api/
│   │   └── apiClient.js           # API integration layer
│   ├── App.js                      # Main application component
│   └── index.js                    # React entry point
├── public/
│   └── index.html                 # HTML entry point
└── package.json                   # Dependencies & scripts
```

## Available Scripts

- `npm start` - Run development server (port 3000)
- `npm build` - Build for production
- `npm test` - Run tests

## Demo Credentials

```
Teacher: teacher@college.edu / password123
Student: student@college.edu / password123
Admin:   admin@college.edu / password123
```

## Authentication

The application uses React Context for state management:

```javascript
import { useAuth } from './context/AuthContext';

function MyComponent() {
  const { user, login, logout, signup } = useAuth();
  
  if (!user) {
    return <LoginPage />;
  }
  
  return <Dashboard />;
}
```

## Role-Based Access

Different features are available based on user role:

**Student:**
- View notes
- View assignments
- View announcements
- Track own attendance

**Teacher:**
- Upload notes
- Create and manage grades
- Create assignments
- Post announcements
- Mark student attendance

**Admin:**
- Access to all features

## API Integration

The frontend uses Axios for API calls:

```javascript
import { notesAPI, gradingAPI } from './api/apiClient';

// Fetch notes
const response = await notesAPI.getAll();

// Create grade
await gradingAPI.create({
  studentId: 'STU-001',
  assignmentId: 'ASSIGN-001',
  grade: 85,
  feedback: 'Good work'
});
```

## Styling

Modern responsive design with:
- Gradient backgrounds (Purple #667eea to Deep Purple #764ba2)
- Mobile-friendly layout
- Smooth transitions and animations
- Accessible color scheme

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Environment Variables

Create a `.env` file:

```
REACT_APP_API_URL=http://localhost:4000
```

## Production Build

```bash
npm run build
```

This creates an optimized build in the `build/` directory ready for deployment.

## Troubleshooting

### Frontend can't connect to backend
- Ensure backend is running on port 4000
- Check `.env` file has correct API URL
- Check browser console for specific errors

### Login issues
- Ensure demo users are seeded: `npm run seed` in backend
- Check credentials match exactly
- Clear browser cache/cookies

### State not persisting
- Check browser localStorage is enabled
- Check browser console for errors
- Try clearing browser cache

## Performance Optimization

- React lazy loading for components
- Optimized API calls with batching
- Memoization of expensive computations
- CSS optimizations

## Contributing

For improvements or bug fixes:
1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## Support

Check the main SETUP_GUIDE.md for comprehensive documentation.
