from datetime import datetime
from pathlib import Path
from typing import List, Optional
from uuid import uuid4

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.responses import FileResponse
from pydantic import BaseModel

from data_store import (
    get_announcements,
    get_assignments,
    get_grades,
    get_notes,
    save_announcements,
    save_assignments,
    save_grades,
    save_notes,
)

app = FastAPI(title="Teacher Backend")
UPLOADS_DIR = Path(__file__).parent / "uploads"
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)


def make_id() -> str:
    return uuid4().hex


class NoteResponse(BaseModel):
    id: str
    title: str
    description: str
    course: str
    author: str
    filename: str
    original_name: str
    size: int
    uploaded_at: str
    mime_type: str


class GradeRequest(BaseModel):
    studentId: str
    assignmentId: str
    grade: float
    feedback: Optional[str] = ""
    course: Optional[str] = ""


class GradeResponse(GradeRequest):
    id: str
    gradedAt: str


class AssignmentRequest(BaseModel):
    title: str
    description: Optional[str] = ""
    dueDate: Optional[str] = None
    course: Optional[str] = ""


class AssignmentResponse(AssignmentRequest):
    id: str
    createdAt: str


class AnnouncementRequest(BaseModel):
    title: str
    message: str
    course: Optional[str] = ""
    expiresAt: Optional[str] = None


class AnnouncementResponse(AnnouncementRequest):
    id: str
    postedAt: str


@app.post("/notes/upload", response_model=NoteResponse)
async def upload_note(
    file: UploadFile = File(...),
    title: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    course: Optional[str] = Form(None),
    author: Optional[str] = Form(None),
):
    metadata = {
        "title": title or file.filename,
        "description": description or "",
        "course": course or "",
        "author": author or "",
    }
    destination = UPLOADS_DIR / f"{make_id()}_{file.filename}"
    content = await file.read()
    destination.write_bytes(content)

    notes = get_notes()
    entry = {
        "id": make_id(),
        "title": metadata["title"],
        "description": metadata["description"],
        "course": metadata["course"],
        "author": metadata["author"],
        "filename": destination.name,
        "original_name": file.filename,
        "size": len(content),
        "uploaded_at": datetime.utcnow().isoformat() + "Z",
        "mime_type": file.content_type,
    }
    notes.append(entry)
    save_notes(notes)
    return entry


@app.get("/notes", response_model=List[NoteResponse])
def list_notes() -> List[NoteResponse]:
    return get_notes()


@app.get("/notes/{note_id}", response_model=NoteResponse)
def get_note(note_id: str) -> NoteResponse:
    notes = get_notes()
    note = next((item for item in notes if item["id"] == note_id), None)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found.")
    return note


@app.get("/uploads/{filename}")
def download_note_file(filename: str):
    file_path = UPLOADS_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found.")
    return FileResponse(path=file_path, filename=file_path.name)


@app.post("/grading", response_model=GradeResponse)
def grade_student(entry: GradeRequest) -> GradeResponse:
    grades = get_grades()
    record = {
        "id": make_id(),
        "studentId": entry.studentId,
        "assignmentId": entry.assignmentId,
        "grade": entry.grade,
        "feedback": entry.feedback or "",
        "course": entry.course or "",
        "gradedAt": datetime.utcnow().isoformat() + "Z",
    }
    grades.append(record)
    save_grades(grades)
    return record


@app.get("/grading", response_model=List[GradeResponse])
def list_grades(
    studentId: Optional[str] = None,
    assignmentId: Optional[str] = None,
    course: Optional[str] = None,
) -> List[GradeResponse]:
    grades = get_grades()
    if studentId:
        grades = [g for g in grades if g["studentId"] == studentId]
    if assignmentId:
        grades = [g for g in grades if g["assignmentId"] == assignmentId]
    if course:
        grades = [g for g in grades if g["course"] == course]
    return grades


@app.post("/assignments", response_model=AssignmentResponse)
def create_assignment(entry: AssignmentRequest) -> AssignmentResponse:
    assignments = get_assignments()
    record = {
        "id": make_id(),
        "title": entry.title,
        "description": entry.description or "",
        "dueDate": entry.dueDate,
        "course": entry.course or "",
        "createdAt": datetime.utcnow().isoformat() + "Z",
    }
    assignments.append(record)
    save_assignments(assignments)
    return record


@app.get("/assignments", response_model=List[AssignmentResponse])
def list_assignments() -> List[AssignmentResponse]:
    return get_assignments()


@app.post("/announcements", response_model=AnnouncementResponse)
def create_announcement(entry: AnnouncementRequest) -> AnnouncementResponse:
    announcements = get_announcements()
    record = {
        "id": make_id(),
        "title": entry.title,
        "message": entry.message,
        "course": entry.course or "",
        "expiresAt": entry.expiresAt,
        "postedAt": datetime.utcnow().isoformat() + "Z",
    }
    announcements.append(record)
    save_announcements(announcements)
    return record


@app.get("/announcements", response_model=List[AnnouncementResponse])
def list_announcements() -> List[AnnouncementResponse]:
    return get_announcements()
