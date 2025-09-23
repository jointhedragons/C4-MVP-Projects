# Requirements Document (REQ Doc)

**Project:** AI Talent Matching  
**Team:** Marvel  
**Lead:** Abdelrahman Omar Mohamed Farid Elgendy  
**Date Created:** 2025-09-17  
**Cycle:** 4

## Executive Summary
The AI Talent Matching project is a 3-day MVP designed to streamline the process of connecting employers (HR) with suitable talent. The system enables HR to post jobs and instantly receive AI-powered recommendations for talents, while talents can view matching job opportunities. The project combines a simple UI, Redux-based state management, and integration with an AI API to deliver smart recommendations quickly.

## Business Requirements

### Problem Statement
**Current Situation:** Traditional job boards require manual searching and filtering, making it difficult for HR and talent to efficiently connect.
**Desired Outcome:** Provide a platform where HR can post jobs and instantly receive recommended talents, and talents can see recommended jobs tailored to their profile.
**Impact:** HR saves time in talent sourcing, while talents discover relevant opportunities faster.

### Success Metrics
- **Primary Metric:** Primary Metric: Accuracy and relevance of AI-generated job/talent recommendations.
- **Secondary Metrics:** Number of jobs posted, number of recommendations viewed, user satisfaction in testing.
- **Timeline:** Functional MVP delivered in 3 days.

### Target Users
- **Primary Users:** HR recruiters seeking talent.
- **Secondary Users:** Job seekers (talents).
- **User Personas:** HR's and Talents

### Business Value Proposition
- **Value to Users:** Saves time and effort by providing tailored recommendations.
- **Value to Business:** Demonstrates proof-of-concept for an AI-powered job matching platform.
- **Competitive Advantage:** AI-driven recommendations reduce manual effort compared to traditional job platforms.

## Functional Requirements

### Core Features (MVP Scope)
1. **User Profiles:** [HR & Talent]
   - **Description:** Both HR and talents can create and edit their                          profiles.
   - **Priority:** High
   - **Acceptance Criteria:** Users can log in, update info, and persist changes via Redux/Local Storage.

2. **Job Posting & CRUD Operations:**
   - **Description:** HR can post, edit, and delete jobs.
   - **Priority:** High
   - **Acceptance Criteria:** CRUD operations work with Local Storage and Redux.

3. **AI Talent & Job Recommendations:** 
   - **Description:** Integrate AI API to generate recommendations for jobs and talents.
   - **Priority:** High
   - **Acceptance Criteria:** Relevant recommendations display correctly in UI.

### User Stories
- **As a** HR recruiter, **I want** post jobs easily **so that** I can quickly find talents.
- **As a** talent, **I want** to see job recommendations **so that** I can apply to relevant opportunities.
- **As a** HR, **I want** AI-generated recommendations **so that** I can save time filtering applicants.

### User Flow
1. HR logs in → posts a job.
2. AI API recommends matching talents → displayed in HR dashboard.
3. Talent logs in → sees recommended jobs
4. Users interact with recommendations.

## Technical Requirements

### Performance Requirements
- **Response Time:** < 2 seconds for UI actions, < 5 seconds for AI API response.
- **Throughput:** Support up to 50 simultaneous users (MVP).
- **Availability:** MVP hosted for demo (local/GitHub Pages).
- **Scalability:** Should be extendable to cloud backend later.
  
### Security Requirements
- **Authentication:** Simple role-based login (HR/Talent).
- **Authorization:** HR and talents have separate permissions.
- **Data Protection:** No sensitive data beyond demo profiles.
- **Privacy:** Demo-only; no real personal data collected.

### Compatibility Requirements
- **Browsers:** Chrome, Edge, Firefox (latest versions).
- **Devices:** Desktop-first; responsive design for mobile.
- **Operating Systems:** Windows, macOS, Linux.
- **Screen Sizes:** Responsive grid layout with Bootstrap.
- 
### Integration Requirements
- **External APIs:** AI API for recommendations.
- **Database:** Redux + Local Storage (MVP).
- **File Storage:** Not required for MVP.
- **Payment Processing:** Not applicable.

## AI/ML Integration (if applicable)

### AI Component Description
- **Type of AI:** Recommendation system (via API).
- **Purpose:** Match jobs with talents and vice versa.
- **Model Source:** External API.

### Data Requirements
- **Training Data:** Not applicable (using API).
- **Input Data:** Job descriptions, talent skills.
- **Data Quality:** Basic structured inputs.
- **Data Privacy:** Minimal, no sensitive data.

### Performance Expectations
- **Accuracy:** 70–80% relevance in recommendations.
- **Speed:** < 5 seconds per query.
- **Reliability:** API fallback to mock data.

### Fallback Strategy
- **When AI Fails:** Show static mock recommendations from Redux.
- **Manual Override:** Users can still browse job/talent listings.
- **Error Handling:** Clear UI message when API unavailable.
- 
## Project Constraints

### Time Constraints
- **Development Window:** 3 days
- **Daily Time Commitment:** ~6–8 hours per member.
- **Milestone Deadlines:** Daily standups, end-of-day deliverables.

### Resource Constraints
- **Team Size:** 2 members (2 developers)
- **Budget:** Zero (student MVP).
- **Technology Stack:** React, Redux, Local Storage, Bootstrap, AI API.
- **External Dependencies:** AI API availability.

### Scope Constraints
- **Must Have:** Job posting, profiles, AI recommendations.
- **Should Have:** CRUD persistence in Local Storage.
- **Could Have:** Advanced filtering, analytics.
- **Won't Have:** Full backend or real authentication system.

## Technical Architecture

### System Architecture
- **Frontend:** React + Redux Toolkit + Bootstrap.
- **Backend:** None (dummy data with Local Storage).
- **Database:** Local Storage (temporary).
- **Hosting:** GitHub Pages.

### Technology Stack
- **Frontend Technologies:** React, Redux Toolkit, Bootstrap.
- **Backend Technologies:** None for MVP.
- **Database Technologies:** Local Storage.
- **DevOps/Deployment:** GitHub repository + GitHub Pages.

### Data Model (if applicable)
```
Entity: Job
- id: string
- title: string
- description: string
- skillsRequired: array
- location: string

Entity: Talent
- id: string
- name: string
- skills: array
- experience: string
```

## Acceptance Criteria

### Definition of Done

 ✅Core features implemented and tested.

 ✅Code documented and readable.

 ✅MVP deployed on GitHub Pages.

 ✅Documentation complete.

### Quality Gates
- ✅ Code passes all tests
- ✅ Performance meets requirements
- ✅ User experience is acceptable
- ✅ Documentation is complete

### Success Criteria
- ✅ Users can post jobs.
- ✅ Users can edit and delete jobs.
- ✅ Talents can see recommendations.
- ✅ HR can see recommended talents.

## Risks and Mitigation

### Technical Risks
- **Risk 1:** AI API downtime → Mitigation: Mock data fallback.
- **Risk 2:** Local Storage limitations → Mitigation: Keep scope minimal.

### Timeline Risks
- **Risk 1:** Limited 3-day window → Mitigation: Strict task breakdown.
- **Risk 2:** Risk 2: Unexpected bugs → Mitigation: Allocate final day to testing.
### Team Risks
- **Risk 1:** Miscommunication → Mitigation: Daily standups.
- **Risk 2:** Unequal workload → Mitigation: Task assignment tracking.

## Communication Plan

### Daily Standups
- **Time:** 9:00 AM.
- **Duration:** 15–20 minutes.
- **Format:** In-person meeting.

### Progress Tracking
- **Method:** Daily iteration summaries.
- **Frequency:** Once Daily
- **Tools:** GitHub, Notion/Docs.

### Decision Making
- **Process:** Consensus with lead final decision.
- **Authority:** Team lead has final say.
- **Documentation:** Logged in GitHub repo.
## Appendices

### Glossary
- **CRUD:** Create, Read, Update, Delete.
- **AI API:** External service providing recommendations.

### References
- Redux Toolkit Documentation (https://redux-toolkit.js.org/)
- [React Official Docs](https://react.dev/)

### Version History
- **v1.0:** [2025-09-17] - Initial requirements document
- **v1.1:** [2025-09-19] - Updated with final MVP scope.

---
*This requirements document serves as the foundation for our 3-day MVP development process.*
