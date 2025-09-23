# AI_LMS - Team ِAI LMS

## Project Overview

**Lead:** Mohamed_Ayman_Ahmed  
**Team Members:** Moahmed Ayman Ahmed, Esraa Emad Ahmed El-Behery, Menna Maher Elwan  
**Cycle:** 4  
**Project Code:** MVP1  
**Timeline:** 2025-09-21 - 2025-09-23 (3 days)

## Thought Process & Architecture

### Initial Meeting & Requirements

- **Business Problem:** Students need an interactive platform to manage courses and receive personalized AI recommendations.
- **Target Users:** University students and lifelong learners.
- **Core Features:**
  1. Authentication (login/signup).
  2. Course browsing and enrollment.
  3. Progress tracking (hours, completion rate).
  4. AI-powered course recommendations.
- **Success Criteria:** Working MVP with connected frontend, backend, and a minimal AI recommendation system.

### Technical Decisions

- **Tech Stack:**
  - Frontend: React (Vite, TailwindCSS, React Router, React Query).
  - Backend/DB: Supabase (Auth + PostgreSQL).
  - AI Integration: OpenAI API for recommendations.
- **Architecture Pattern:** Simple client-server model with AI service integration.
- **Database/Storage:** Supabase PostgreSQL.
- **Deployment Strategy:** Netlify for frontend + Supabase hosting for backend.

---

## Task Breakdown & Assignments

1. **Frontend Scaffolding** – Assigned to: Mohamed – Status: ✅ DONE

   - Setup Vite + Tailwind + React Router.
   - **ETA:** 4h

## Three-Day Workflow

### Day 1: Planning & Foundation

- [x] Team alignment & requirements
- [x] Task breakdown
- [x] Repo setup
- [ ] Initial scaffolding
- [ ] Base architecture

**Evening Goal:** Project structure ready.

### Day 2: Core Development

- [✅] Implement UI pages (Login, Courses, Profile)
- [❌] Supabase integration (Auth + DB)
- [❌] AI recommender service

**Evening Goal:** Core functionality for front-end working.

### Day 3: Integration & Polish

- [ ❌ ] End-to-end testing
- [❌ ] Bug fixing & optimization
- [ ❌] Documentation & presentation prep

**Evening Goal:** MVP front-end just ready for demo.

# Implementation Details

### Key Components

1. **Auth Component:** Handles login/signup/logout.
2. **Courses Page:** Displays enrolled and available courses.

### Data Flow

```
[User] → [React UI] → [Supabase API] → [Database]
↓
[OpenAI API]
```

### API Endpoints (example)

- `GET /courses` → fetch courses
- `POST /auth/login` → login
- `POST /recommendations` → get AI recommendations

### Database Schema (if applicable)

```
Table: [table_name]
- id: primary key
- [field1]: [type] - [description]
- [field2]: [type] - [description]
```

## Challenges & Solutions

## Challenges & Solutions

- **Challenge:** Tight 3-day timeline.
  - **Solution:** Focus on MVP features only.

## Testing Strategy

- **Unit Testing:** [Approach for component testing]
- **Integration Testing:** [Approach for system testing]
- **Manual Testing:** [Key scenarios to test manually]
- **Performance Testing:** [If applicable]

## Deployment & Environment

- **Development Environment:** [Setup instructions]
- **Production Environment:** [Deployment platform]
- **Environment Variables:** [Required configurations]
- **Dependencies:** [External services needed]

## How to Run the Project

1. **Prerequisites:**

   - [Requirement 1]
   - [Requirement 2]

## How to Run

```bash
# Clone repo
git clone <repo-url>
cd ai_lms

# Install dependencies
npm install

# Start development
npm run dev

# Run server for back-end
npm run server


## Team Reflection

### What Worked Well

- [Strength 1]: [Description]
- [Strength 2]: [Description]
- [Strength 3]: [Description]

### What Could Be Improved

- [Area 1]: [Improvement suggestion]
- [Area 2]: [Improvement suggestion]
- [Area 3]: [Improvement suggestion]

### Key Learnings

- **Technical:** [Technology or architecture insights]
- **Process:** [Workflow or collaboration insights]
- **Team:** [Team dynamics and communication insights]

### Individual Contributions

- **[Lead Name]:** [Key contributions and learnings]
- **[Member 1]:** [Key contributions and learnings]
- **[Member 2]:** [Key contributions and learnings]
- **[Member 3]:** [Key contributions and learnings]

## Presentation Notes

- **Demo Flow:** [Steps for presenting the MVP]
- **Key Features to Highlight:** [Most important aspects to show]
- **Backup Plan:** [What to do if live demo fails]

---

_This document captures our complete thought process from conception to completion. Total length: [X] lines (target: 200-400 lines)_
```
