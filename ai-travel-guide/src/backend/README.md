```
backend/
├─ package.json
├─ .env.example
├─ src/
│  ├─ server.js            # start server
│  ├─ app.js               # express app and middleware
│  ├─ config/
│  │   └─ db.js
│  ├─ models/
│  │   ├─ User.js
│  │   ├─ TripRequest.js
│  │   ├─ Hotel.js
│  │   └─ Activity.js
│  ├─ routes/
│  │   ├─ auth.js
│  │   ├─ trips.js
│  │   ├─ hotels.js
│  │   └─ activities.js
│  ├─ controllers/
│  │   ├─ authController.js
│  │   ├─ tripController.js
│  │   └─ dataController.js
│  ├─ middleware/
│  │   ├─ auth.js
│  │   └─ errorHandler.js
│  └─ seed/
│      └─ seed.js
└─ README.md

```

## Key API endpoints (MVP)

POST /api/auth/register — register with { name, email, password }.

POST /api/auth/login — login returns JWT (HttpOnly cookie recommended).

GET /api/hotels?destination=... — list hotels (seed/static).

GET /api/activities?destination=... — list activities (seed/static).

POST /api/trips — create/generate trip plan (requires auth). Body: { destination, start_date, end_date, budget, interests? }.

GET /api/trips — list user's trips (auth).

GET /api/trips/:id — get trip (auth & ownership).

PUT /api/trips/:id — edit trip (auth & ownership).

POST /api/seed — (dev-only) seed DB with hotels & activities.