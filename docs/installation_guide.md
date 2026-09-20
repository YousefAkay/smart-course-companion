# Installation Guide

This version requires the Express backend to be running. The frontend is served by the backend from the `client` folder.

## 1. Install Node.js

- Install a recent version of Node.js if it is not already installed.

## 2. Install Server Dependencies

From the project root, open a terminal and go to the `server` folder:

```bash
cd server
npm ci
```

This installs:

- `express`
- `express-session`
- `bcryptjs`
- `cors`

## 3. Start the Server

From the `server` folder in PowerShell, set local credentials and run:

```powershell
$env:SESSION_SECRET = ([guid]::NewGuid().ToString('N') + [guid]::NewGuid().ToString('N'))
$env:ADMIN_PASSWORD = Read-Host 'Choose a local admin password'
npm start
```

The app runs on:

```text
http://localhost:3000
```

## 4. Open the App

Open this URL in your browser:

```text
http://localhost:3000
```

Do not open the HTML files directly with `file://`. The app needs the backend session and API routes.

## 5. Database File

- The app stores all data in `server/db.json`.
- This file is the only database for this app.
- It stores users, admin-created courses, admin assessment templates, student enrollments, and student assessments.

## 6. Local admin account

Set `SESSION_SECRET` and `ADMIN_PASSWORD` before every new server process (see step 3).
The first startup creates a local admin account with email `admin@scc.ca` and your chosen password.
Do not put your password or session secret in source files or commit a `.env` file.
If an older `server/db.json` already contains an admin account, remove that local file while the server is stopped before starting with a new password.

## 7. Important Note

- The backend must stay running while you use the app.
- If the server is stopped, login, course management, enrollments, and assessment actions will not work.

## 8. Resetting Data

To reset the app data, stop the server and replace the contents of `server/db.json` with:

```json
{
  "users": [],
  "adminCourses": [],
  "adminCourseAssessments": [],
  "enrollments": [],
  "assessments": []
}
```

When you restart the server, the default admin account will be seeded again automatically.
