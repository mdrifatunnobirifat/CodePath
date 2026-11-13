# CodePath – Coding Practice & Job-Readiness Platform 🚀

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-0E7C7B.svg)](https://github.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero-brightgreen.svg)](package.json)

> **CodePath** is an accelerated coding practice and interview readiness platform designed for learners preparing to land developer roles within **60 days**. Built strictly according to the **CodePath Software Requirements Specification (SRS v1.0)** and incorporating the bespoke design system from the prototype.

---

## 🌟 Key Features

### 1. ⚡ Practice Problems & In-Browser Code Workspace
- **Multi-Language Support:** Practice algorithms and functions across **JavaScript, React, Python, PHP, C# (.NET), and SQL**.
- **LeetCode-Style 3-Pane Workspace:** Filterable problem directory on the left; problem description, hints, code editor, and live execution results on the right.
- **3-Level Progressive Hints:**
  - **Level 1:** Nudge
  - **Level 2:** Algorithmic approach
  - **Level 3:** Near-solution code structure
- **Reference Solution Unlock:** Solutions and complexity breakdowns unlock upon solving or after exhausting all 3 hints.
- **Hidden Test Case Protection (SEC-7):** Hidden test cases are never transmitted to the browser prior to grading.
- **Keyboard Shortcuts:** `Ctrl+Enter` to Run visible tests; `Ctrl+Shift+Enter` to Submit all test suites.
- **Draft Autosave & Reset:** Real-time draft persistence and instant reset to starter code.

### 2. ⚛️ Frontend & React Live Interactive Sandbox
- **Live Preview Iframe:** Instant rendering for HTML/CSS/DOM challenges and React component challenges.
- **Automated Frontend Test Runner (FR-F3):** Runs programmatic DOM event assertions (e.g., verifying elements, button clicks, counter state changes, toggle animations) in the browser.

### 3. 🗄️ Interactive SQL Relational Query Runner
- Run real relational SQL queries (`SELECT`, `WHERE`, `GROUP BY`, `ORDER BY`, `HAVING`) against relational dataset tables (`employees`, `departments`).
- Visual tabular results formatted with headers and types.

### 4. 🗺️ Career Role Tracks & Curriculum
- **Frontend Engineer Track:** JavaScript Core & ES6+, Asynchronous DOM manipulation, React Components, Hooks & Architecture.
- **Backend Engineer Track:** Python Core, Relational SQL Databases, C# & .NET Web Architecture, PHP Backend Logic.
- **Full-Stack Developer Track:** End-to-end integration combining modern React UI with backend APIs and databases.

### 5. 📖 Interactive Lessons with "Try It" Sandbox
- Clean Markdown lessons with syntax highlighting and tips.
- Embedded runnable "Try It" code execution playgrounds directly inside lessons.
- Lesson completion tracking that automatically updates role track progress.

### 6. 📅 60-Day Job-Ready Plan Generator
- Schedules daily tasks: 1 lesson, 2-3 target problems, and 1 spaced repetition review item.
- Interactive daily checklist with progress tracking and streak maintenance.

### 7. ⏱️ Quizzes & Timed Quiz Mode
- Multiple-choice quizzes per technology with instant, comprehensive answer explanations.
- **Timed Quiz Mode:** 15-minute countdown timer with automatic submission and scoring.

### 8. 🔄 Spaced Repetition Revision Queue
- Missed quiz questions and challenging problems automatically re-enter a 1-day, 3-day, and 7-day spaced review queue.

### 9. 💼 Guided Mini-Projects & Recruiter README Generator
- 6 production mini-projects with step-by-step checklists, requirements, and suggested folder structures:
  - Interactive Task Manager with LocalStorage & Filters
  - Async Weather Forecast Dashboard
  - React Interactive Kanban Board
  - RESTful Blog API with Authentication & SQLite
  - ASP.NET Core Web API Order Management System
  - Full-Stack Job Application Tracker
- **One-Click README Generator:** Generates formatted, recruiter-ready Markdown README templates with badges, setup steps, and directory trees ready for GitHub.

### 10. 💼 Developer Job Board
- Curated developer jobs filtered by technology and Remote status.
- Save job toggle, seniority badges, and application checklist modal.

### 11. 📋 "Am I Ready to Apply?" Checklist
- Evaluates the 4 core pillars required to start applying for jobs:
  1. 30+ Problems Solved
  2. 3 Production Mini-Projects on GitHub
  3. Tailored 1-Page Tech CV
  4. Core Interview Questions Mastered

### 12. 👤 Public Portfolio Page & Badges
- Showcase solved counts, streak count, GitHub project links, and unlocked achievement badges (`First Blood`, `3-Day Fire`, `Unstoppable`, `Shipper`, `Theory Master`, `Interview Ready`).

### 13. 🛡️ Admin Content Management
- Role-based admin access control (`admin@codepath.dev`).
- Create, edit, and delete problems and tests without touching source code.
- One-click database JSON export and import.

---

## 📐 Architecture & Technology Stack

```
codepath/
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore configuration
├── DECISIONS.md              # Architectural Decisions Record
├── README.md                 # Project documentation
├── package.json              # Node.js configuration & scripts
├── server.js                 # Zero-dependency Node.js HTTP server & REST API
├── start.bat                 # One-click Windows startup script
├── data/
│   ├── seed.json             # Comprehensive curriculum starter data
│   └── database.json         # Persistent JSON database
├── scripts/
│   └── seed.js               # Database seeding utility
├── test/
│   └── test_runner.js        # Automated unit and integration test suite
└── public/
    ├── index.html            # Main HTML shell
    ├── css/
    │   └── style.css         # Complete design system & responsive styling
    └── js/
        ├── store.js          # Reactive state & API client
        ├── app.js            # Router & event orchestrator
        ├── components/
        │   ├── editor.js     # Code editor with line numbers & shortcuts
        │   ├── frontend-runner.js # Live preview & DOM test runner
        │   └── sql-engine.js # Relational SQL table renderer
        └── views/
            ├── dashboard.js  # 60-Day plan & skill radar
            ├── tracks.js     # Career tracks & modules
            ├── lessons.js    # Markdown lessons with "Try It"
            ├── practice.js   # 3-pane problem workspace
            ├── quizzes.js    # Quizzes & timed quiz mode
            ├── interview.js  # Technical interview Q&A bank
            ├── projects.js   # Guided mini-projects & README generator
            ├── jobs.js       # Developer job board
            ├── readiness.js  # Job readiness assessment
            ├── profile.js    # Public portfolio & badge showcase
            └── admin.js      # Admin CMS & JSON export
```

---

## 🚀 Quick Setup & Installation

CodePath is built with pure Node.js standard libraries, meaning **zero external npm install dependencies are required**. It runs instantly offline without any package installation delays!

### Prerequisites
- Node.js v18.0.0 or higher (Tested with Node v24.12.0)
- Python 3.8+ (Optional, for Python algorithm execution)

### 1. Launch the Application
Double-click `start.bat` on Windows, or run:

```bash
# Start server
node server.js
```

The application will start immediately at:
👉 **`http://localhost:3000`**

### 2. Run the Automated Test Suite

```bash
node test/test_runner.js
```
*Executes all 13 unit and integration tests including sandboxed execution, streak math, and API security.*

### 3. Re-seed Starter Database

```bash
node scripts/seed.js
```

---

## 🔑 Demo Accounts

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Learner (Default)** | `learner@codepath.dev` | `learner` | Solves problems, tracks streak, takes quizzes, builds portfolio |
| **Administrator** | `admin@codepath.dev` | `admin` | Full CRUD access to problems, lessons, telemetry, and JSON export |

*Visitors can also practice problems immediately without creating an account (FR-A6).*

---

## 🎨 Design System

Preserved directly from the prototype design:
- **Light Palette:** `--bg: #EEF2F6`, `--panel: #FFFFFF`, `--ink: #14213D`, `--mute: #5B6678`, `--line: #D5DDE7`, `--acc: #0E7C7B`, `--ok: #1B8A4B`, `--bad: #C0392B`, `--warm: #B7791F`, `--code: #F7F9FC`.
- **Dark Palette:** `--bg: #0F1722`, `--panel: #172230`, `--ink: #E8EDF3`, `--mute: #9AA7B8`, `--line: #2A3A4D`, `--acc: #3CC6BF`.
- **Typography:** Google Fonts `Bricolage Grotesque` (Headings) and monospace font stack (Code & Output).

---

## 📜 License
MIT License. Created for accelerated coding mastery and developer job readiness.

