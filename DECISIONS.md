# Architectural & Design Decisions (CodePath v1.0)

This document records the key architectural and product decisions made during the implementation of CodePath in adherence with the Software Requirements Specification (SRS v1.0).

---

### D-01: Zero-Dependency High-Performance Node.js Full-Stack Architecture
- **Context:** To ensure the platform can be set up in under 60 seconds without fragile external npm registry downloads or native C++ compilation issues on Windows/Linux/macOS, we implemented a pure Node.js HTTP REST API and static asset pipeline.
- **Decision:** Built the backend using Node.js built-in modules (`http`, `fs`, `path`, `crypto`, `child_process`). It delivers full RESTful API capabilities (CRUD, session cookies, input validation, rate limiting) with zero external package vulnerabilities and instant sub-second boot time.
- **Alternatives Considered:** Express / Next.js with Prisma. Rejected for v1 standalone local deployment due to heavy dependency installation overhead and network security boundary blocks.

### D-02: Multi-Language Code Execution Sandbox Strategy
- **Context:** The platform must execute code in JavaScript, React, Python, PHP, C#, and SQL while strictly respecting Section 8.3 (CPU limits of 2-5s, memory safety, isolation, no unescaped execution).
- **Decision:** 
  1. **JavaScript:** Executed in sandboxed Node.js `vm` contexts on the backend or in isolated Web Workers / sandboxes in the browser with captured standard output and hard execution timeout (3000ms).
  2. **Python:** Executed via localized subprocess sandbox invoking the system's Python 3 interpreter with strict timeout (3000ms) and argument validation.
  3. **PHP & C# (.NET):** Executed with automated test harnesses that validate algorithm return values and runtime constraints against visible and hidden test suites.
  4. **React & Frontend (HTML/CSS/JS):** Executed in an in-browser isolated iframe sandbox with automated DOM testing and event assertions (FR-F1, FR-F2, FR-F3).
  5. **SQL:** Executed with an in-memory relational SQL engine supporting `SELECT`, `WHERE`, `JOIN`, `GROUP BY`, `ORDER BY`, `LIMIT` against relational dataset tables (`departments`, `employees`, `orders`, `products`).

### D-03: Security & Hidden Test Protection (SEC-7)
- **Context:** SRS SEC-7 explicitly mandates that hidden test cases and reference solutions must never be sent to the browser before they are unlocked.
- **Decision:** The API strips `isHidden: true` test cases and reference solutions from public and problem-fetching endpoints (`/api/problems/:slug`). During "Run", only public sample tests are evaluated. During "Submit", all tests (including hidden) are evaluated securely on the backend, returning only pass/fail status and summary metrics. Reference solutions are only returned when the problem is solved or when all 3 hints have been exhausted.

### D-04: Design System Fidelity
- **Context:** The project must adopt and extend the exact CSS design system provided in the user's HTML prototype.
- **Decision:** Preserved the design tokens:
  - Theme colors: `--bg: #EEF2F6`, `--panel: #FFFFFF`, `--ink: #14213D`, `--mute: #5B6678`, `--line: #D5DDE7`, `--acc: #0E7C7B`, `--ok: #1B8A4B`, `--bad: #C0392B`, `--warm: #B7791F`, `--code: #F7F9FC`.
  - Dark mode variants: `--bg: #0F1722`, `--panel: #172230`, `--ink: #E8EDF3`, `--line: #2A3A4D`, `--acc: #3CC6BF`.
  - Font: Google Font `"Bricolage Grotesque"` for headings and brand logo `Code<span>Path</span>`.
  - Enhanced layout to provide a responsive multi-tab suite: Dashboard, Tracks, Practice, Quizzes, Interview Bank, Mini-Projects, Job Board, Profile/Portfolio, Readiness Checklist, and Admin Panel.

### D-05: 60-Day Job-Ready Plan & Spaced Repetition (Revision Queue)
- **Context:** Developer 4 (User Voice) emphasized that learners need structured daily guidance and retention mechanics.
- **Decision:** Implemented a dynamic daily plan generator that schedules 1 lesson, 2-3 targeted problems, 1 revision task, and weekly mini-project milestones. Integrated a 1-3-7 day spaced repetition algorithm where missed quiz questions or difficult problems automatically schedule for review.

