# Requirements Document (REQ Doc)

**Project:** AI-Travel-Guide  
**Team:** DragonSquad  
**Lead:** Yousef Bakier  
**Date Created:** 2025-09-22  
**Cycle:** 1

## Executive Summary
AI-Travel-Guide is a lightweight web-based travel planner that helps users generate a simple, customized travel plan within a specific time period. The system will provide suggested hotels and activities, organized into a timeline. The goal is to demonstrate a working prototype in under three days.

## Business Requirements

### Problem Statement
**Current Situation:** Trip planning is time-consuming, scattered across multiple platforms (hotel sites, activity sites, itineraries) and prices are often inconsistent or manipulated.
**Desired Outcome:** Provide users with a single platform where they input trip details and instantly get a structured plan with transparent, reliable pricing.
**Impact:** Saves time for travelers, ensures fair pricing, and improves overall trip planning convenience.

### Success Metrics
- **Primary Metric:** User can generate a full trip plan (hotel + activities) within 2 minutes.
- **Secondary Metrics:** Response time < 2 seconds per request
- **Timeline:** Demo-ready MVP in 3 days

### Target Users
- **Primary Users:** Travelers looking for a quick trip plan.
- **Secondary Users:** Students, young professionals, or tourists planning short trips.
- **User Personas:**
   - **Persona 1:** Sarah, 28, a young professional who wants to plan a weekend getaway.
   - **Persona 2:** Ahmed, 35, a budget-conscious traveler looking for affordable options.

### Business Value Proposition
- **Value to Users:** Faster, easier travel planning in one place.
- **Value to Business:** Proof of concept for future AI-powered travel products.
- **Competitive Advantage:** Quick setup, AI-driven, simple UX.

## Functional Requirements

### Core Features (MVP Scope)
1. **Feature 1:** Trip Input Form
   - **Description:** Users enter destination, travel dates, and budget.
   - **Priority:** High
   - **Acceptance Criteria:** Form collects data and passes it to backend.

2. **Feature 2:** Hotel Suggestions
   - **Description:** Fetch hotel options (dummy API/static data for MVP).
   - **Priority:** High
   - **Acceptance Criteria:** At least 2 hotel options displayed in plan.

3. **Feature 3:** Activity Timeline
   - **Description:** AI recommends 2–3 activities per day in order.
   - **Priority:** High
   - **Acceptance Criteria:** Timeline is generated and displayed with activities.

### User Stories
* **As a traveler**, I want to enter my destination and dates so that I can get a personalized plan.
* **As a traveler**, I want to see hotel suggestions so that I can pick where to stay.
* **As a traveler**, I want a timeline of activities so that I know what to do each day.

### User Flow
1. User opens app → sees trip input form.
2. User enters destination, dates, budget → submits.
3. Backend processes request → fetches hotel + activities.
4. AI composes structured plan.
5. User sees hotel options + daily activity timeline.

## Technical Requirements

### Performance Requirements

* **Response Time:** <2s per request (for MVP).
* **Throughput:** Support up to 20 demo users.
* **Availability:** 95% uptime during demo.
* **Scalability:** Not required for MVP.

### Security Requirements
* **Authentication:** Basic account login (email/password) for MVP.
* **Authorization:** Users can only access and edit their own plans.
* **Data Protection:** Store minimal trip and user data in SQLite or MongoDB with hashed passwords.
* **Privacy:** User accounts enabled; personal data limited to login and saved plans.

### Compatibility Requirements
* **Browsers:** Latest Chrome/Edge/Firefox.
* **Devices:** Desktop first, responsive for others.
* **Operating Systems:** Cross-platform browser support.
* **Screen Sizes:** Responsive design (basic level).

### Integration Requirements
- **External APIs:** Use static data or free API (if available) for hotels/activities.
- **Database:** SQLite or MongoDB.
- **File Storage:** Logs and backups if needed.
- **Payment Processing:** N/A for MVP.

## AI/ML Integration (if applicable)

### AI Component Description
- **Type of AI:** [Recommendation System + NLP]
- **Purpose:** [Suggest hotels and activities for a given destination, 
               Generate a simplified travel timeline based on the selected period]
- **Model Source:** [TripAdvisor API , Google Places API]

### Data Requirements
- **Training Data:** [MVP may not require custom training → use open datasets on tourism/activities,
                      Optionally use pre-trained models without additional training]
- **Input Data:** [Destination , Number of days / travel period, User interests (history, nature,
                  shopping, food)]
- **Data Quality:** [Clean datasets of hotels/activities (name, location, description, rating),
                    Avoid missing values to ensure complete recommendations]
- **Data Privacy:** [Minimal user data storage, No collection of sensitive personal information]

### Performance Expectations
- **Accuracy:** [For MVP: 60–70% relevance in recommendations is acceptable]
- **Speed:** [Response time under 2 seconds per request]
- **Reliability:** [If AI cannot generate results, fall back to default “Top rated” options from APIs]

### Fallback Strategy
- **When AI Fails:** [Display a default list]
- **Manual Override:** [Allow the user to edit the generated plan (add/remove activities)]
- **Error Handling:** [Show clear error messages: “Recommendation service unavailable, showing default options.” , Log errors for debugging later.]

## Project Constraints

### Time Constraints

- **Development Window:** 3 days
- **Daily Time Commitment:**  \~3–5 hours per member
- **Milestone Deadlines:** [Key checkpoints]

  * Day 1: Requirements + basic skeleton.
  * Day 2: Feature implementation.
  * Day 3: Integration + testing + demo.

### Resource Constraints
- **Team Size:** 3 members (1 lead + 2 developers)
- **Budget:** \$0 (free tools only).
- **Technology Stack:** Node.js/Express backend, React frontend, DB (MongoDB).
- **External Dependencies:** Free APIs or static data.

### Scope Constraints

* **Must Have:** Trip input, hotel suggestion, activity timeline.
* **Should Have:** Basic responsive UI.
* **Could Have:** Simple filtering (budget, preference), user accounts.
* **Won't Have:** Payments, booking integrations.

## Technical Architecture

### System Architecture
* **Frontend:** React app with simple forms + results display.
* **Backend:** Node.js/Express handling requests + data composition.
- **Database:** MongoDB (light storage for demo).
- **Hosting:** Local server or public cloud.

### Technology Stack
- **Frontend Technologies:** React, TailwindCSS (optional).
- **Backend Technologies:** Node.js/Express.
- **Database Technologies:** MongoDB / JSON static file.
- **DevOps/Deployment:** Deploy on free-tier hosting.

### Data Model (if applicable)
```markdown
### Entities

#### User
- `id`: int — Unique identifier
- `email`: string — User login email
- `password_hash`: string — Hashed password
- `name`: string (optional)

#### TripRequest
- `id`: int — Unique identifier
- `user_id`: int — Reference to User
- `destination`: string — City/place name
- `start_date`: date
- `end_date`: date
- `budget`: int

#### Hotel
- `id`: int — Unique identifier
- `name`: string — Hotel name
- `price`: int — Price per night
- `location`: string — Hotel location

#### Activity
- `id`: int — Unique identifier
- `name`: string — Activity name
- `description`: string — Activity description
- `day`: int — Day of trip
```

## Acceptance Criteria

### Definition of Done
- [ ] All core features implemented and tested
- [ ] Code is documented and follows team standards
- [ ] Application is deployed and accessible
- [ ] Documentation is complete and up-to-date
- [ ] Team presentation is prepared

### Quality Gates
- [ ] Code passes all tests
- [ ] Performance meets requirements
- [ ] Security requirements are met
- [ ] User experience is acceptable
- [ ] Documentation is complete

### Success Criteria
- [ ] [Specific measurable criterion 1]
- [ ] [Specific measurable criterion 2]
- [ ] [Specific measurable criterion 3]
- [ ] [Specific measurable criterion 4]

## Risks and Mitigation

### Technical Risks
- **Risk 1:** [Description] → **Mitigation:** [Strategy]
- **Risk 2:** [Description] → **Mitigation:** [Strategy]

### Timeline Risks
- **Risk 1:** [Description] → **Mitigation:** [Strategy]
- **Risk 2:** [Description] → **Mitigation:** [Strategy]

### Team Risks
- **Risk 1:** [Description] → **Mitigation:** [Strategy]
- **Risk 2:** [Description] → **Mitigation:** [Strategy]

## Communication Plan

### Daily Standups
- **Time:** [When daily check-ins occur]
- **Duration:** [How long]
- **Format:** [In-person, video call, etc.]

### Progress Tracking
- **Method:** [How progress is tracked]
- **Frequency:** [How often updates are shared]
- **Tools:** [What tools are used]

### Decision Making
- **Process:** [How decisions are made]
- **Authority:** [Who has final say]
- **Documentation:** [How decisions are recorded]

## Appendices

### Glossary
- **Term 1:** [Definition]
- **Term 2:** [Definition]

### References
- [Link 1: Description]
- [Link 2: Description]

### Version History
- **v1.0:** [Date] - Initial requirements document
- **v1.1:** [Date] - [Description of changes]

---
*This requirements document serves as the foundation for our 3-day MVP development process.*
