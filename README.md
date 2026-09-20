# Smart Course Companion

A full stack course and assessment tracker built as a team project. Students can enroll in courses and organize assessments; admins manage the course catalog and view aggregate stats.

## Features

- Student registration and login with server-side sessions and hashed passwords.
- Course catalog, enrollments, assessment templates, due dates, and personal dashboards.
- Admin course management, enable/disable controls, and aggregate enrollment statistics.
- Express API with data stored locally in `server/db.json`.

## My contributions

I worked on the courses and course details pages and the assessment forms. I also contributed backend support for course data, the course-detail flow, and assessment handling. These features were developed and integrated with the rest of the team.

## Run locally

Requires Node.js and npm. From the project root in PowerShell:

```powershell
cd server
npm ci
$env:SESSION_SECRET = ([guid]::NewGuid().ToString('N') + [guid]::NewGuid().ToString('N'))
$env:ADMIN_PASSWORD = Read-Host 'Choose a local admin password'
npm start
```

Open <http://localhost:3000>. Register for a student account, or log in as `admin@scc.ca` with the password you chose above. The server creates `server/db.json` on first launch. Keep this local data file out of Git; to reset it, stop the server and delete it. Set the two environment variables again in every new terminal session before starting the server.

See [the installation guide](docs/installation_guide.md) and [user guide](docs/user_guide.md) for more detail. This is a local demo using JSON file storage and an in-memory session store; it has not been prepared for public deployment.

## Credits

This is a team project originally developed in [nabulsi019/Soen287](https://github.com/nabulsi019/Soen287). This repository is a cleaned up working copy of that project, so lots of credit to the original team.
