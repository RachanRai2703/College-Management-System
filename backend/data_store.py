import json
from pathlib import Path
from typing import Any

BASE_DIR = Path(__file__).parent
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)

FILES = {
    "notes": DATA_DIR / "notes.json",
    "grades": DATA_DIR / "grades.json",
    "assignments": DATA_DIR / "assignments.json",
    "announcements": DATA_DIR / "announcements.json",
}

for path in FILES.values():
    if not path.exists():
        path.write_text(json.dumps([], indent=2), encoding="utf-8")


def read_json(file_path: Path, default: Any = None) -> Any:
    if default is None:
        default = []
    if not file_path.exists():
        return default
    return json.loads(file_path.read_text(encoding="utf-8"))


def write_json(file_path: Path, data: Any) -> None:
    file_path.write_text(json.dumps(data, indent=2), encoding="utf-8")


def get_notes() -> list:
    return read_json(FILES["notes"])


def save_notes(notes: list) -> None:
    write_json(FILES["notes"], notes)


def get_grades() -> list:
    return read_json(FILES["grades"])


def save_grades(grades: list) -> None:
    write_json(FILES["grades"], grades)


def get_assignments() -> list:
    return read_json(FILES["assignments"])


def save_assignments(assignments: list) -> None:
    write_json(FILES["assignments"], assignments)


def get_announcements() -> list:
    return read_json(FILES["announcements"])


def save_announcements(announcements: list) -> None:
    write_json(FILES["announcements"], announcements)
