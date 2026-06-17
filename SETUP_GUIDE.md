# Teacher Management System - Full Setup Guide

Complete setup and running instructions for both frontend and backend.

## Project Structure

```
teacher/
├── backend/                 # Node.js Express Backend
│   ├── app.py              # FastAPI (optional alternative)
│   ├── index.js            # Main backend server
│   ├── package.json
│   ├── requirements.txt
│   ├── data/               # JSON data storage
│   ├── uploads/            # File uploads directory
│   └── README.md
│
└── frontend/               # React Frontend
    ├── package.json
    ├── .env
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── App.js
    │   ├── index.js
    │   ├── api/
    │   │   └── apiClient.js
    │   ├── components/
    │   │   ├── NotesSection.js
    │   │   ├── GradingSection.js
    │   │   ├── AssignmentsSection.js
    │   │   └── AnnouncementsSection.js
    └── README.md
```

## Backend Setup

### Using Node.js/Express (Recommended)

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the backend server:**
```bash
npm start
```

The backend will run on `http://localhost:4000`

### Using Python/FastAPI (Alternative)

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Create virtual environment:**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Start the server:**
```bash
uvicorn app:app --reload --port 4000
```

## Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure API URL (if needed):**
   - Edit `.env` and set `REACT_APP_API_URL` to your backend URL
   - Default: `http://localhost:4000`

4. **Start the frontend development server:**
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Running Full Stack (Both Frontend & Backend)

### Option 1: Separate Terminals

**Terminal 1 - Backend:**
```bash
cd backend
npm start
# Runs on http://localhost:4000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
# Runs on http://localhost:3000
```

### Option 2: Using npm-run-all (Parallel)

From root directory:
```bash
npm install -g npm-run-all
npm-run-all --parallel backend frontend
```

## Features & Endpoints

### 📝 Notes Management
- Upload course notes with metadata
- View all uploaded notes
- Download note files
- Track upload author, course, and date

**Backend Endpoints:**
- `POST /notes/upload` - Upload new note
- `GET /notes` - List all notes
- `GET /notes/:id` - Get specific note
- `GET /uploads/:filename` - Download file

### ✅ Grading System
- Grade students on assignments
- Add feedback for each grade
- Filter grades by student or assignment
- Track grading date and course

**Backend Endpoints:**
- `POST /grading` - Create grade
- `GET /grading` - List grades (with filters)
- `GET /grading?studentId=STU001` - Filter by student
- `GET /grading?assignmentId=ASS001` - Filter by assignment

### 📋 Assignments Management
- Create assignments with title and description
- Set due dates
- Organize by course
- Visual indicators for overdue assignments

**Backend Endpoints:**
- `POST /assignments` - Create assignment
- `GET /assignments` - List all assignments

### 📢 Announcements
- Post course announcements
- Set expiration dates
- Organize by course
- Track posting date

**Backend Endpoints:**
- `POST /announcements` - Create announcement
- `GET /announcements` - List all announcements

## Available Scripts

### Backend
```bash
npm start              # Start Express server
npm run start         # Alternative start
```

### Frontend
```bash
npm start             # Start dev server (port 3000)
npm build             # Build for production
npm test              # Run tests
```

## Environment Variables

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:4000
```

### Backend (Node.js)
```
PORT=4000            # Server port (default: 4000)
NODE_ENV=development
```

## Data Storage

All data is stored in JSON files in the `backend/data/` directory:
- `announcements.json` - Announcements data
- `assignments.json` - Assignments data
- `grades.json` - Grading records
- `notes.json` - Notes metadata

Uploaded files are stored in `backend/uploads/`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Frontend can't connect to backend

1. Ensure backend is running on port 4000
2. Check `.env` file in frontend directory
3. Verify CORS is enabled in backend (already configured)
4. Check browser console for specific errors

### File upload issues

1. Ensure `backend/uploads/` directory exists
2. Check file size is under 20MB limit
3. Verify backend has write permissions

### Port already in use

**For Backend (port 4000):**
```bash
# Windows
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :4000
kill -9 <PID>
```

**For Frontend (port 3000):**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3000
kill -9 <PID>
```

## Development Notes

- Frontend uses React 18.2.0 with Axios for API calls
- Backend uses Express.js with file upload support via multer
- All data is persisted in JSON files (no database)
- CORS is enabled for cross-origin requests
- Responsive design works on mobile, tablet, and desktop

## Production Build

### Frontend
```bash
cd frontend
npm run build
# Creates optimized build in frontend/build/
```

To serve production build:
```bash
npm install -g serve
serve -s build -l 3000
```

### Backend
```bash
cd backend
NODE_ENV=production npm start
```

## Support

For issues or questions, check:
1. Browser console for frontend errors
2. Terminal output for backend errors
3. Network tab in DevTools to verify API calls
