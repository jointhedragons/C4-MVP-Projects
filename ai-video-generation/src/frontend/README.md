# Frontend - React App

## 🚀 Technology Stack

* **React** – JavaScript library for building user interfaces.
* **Axios** – for HTTP requests to Flask backend.
* **React Router DOM** – client-side routing for navigation.
* **Context API** – manage global authentication and project state.
* **CSS / Tailwind (optional)** – for styling.

---

## 📂 Project Structure

```
src/frontend/
│── README.md              # This file
│── package.json           # Frontend dependencies
│
├── public/                # Static files
└── src/
    ├── index.js           # Entry point for React app
    ├── App.js             # Root component with routes
    ├── components/        # Reusable UI components (Navbar, Forms, Buttons)
    ├── pages/             # Main pages (Login, Dashboard, Editor)
    ├── services/          # API calls to backend (axios config)
    └── context/           # Global state management (auth, projects)
```

---

## ⚡ Getting Started

### 1. Install dependencies

```bash
cd src/frontend
npm install
```

### 2. Run the development server

```bash
npm start
```

App will run at: **[http://localhost:3000](http://localhost:3000)**

---

## 🔗 API Integration

The frontend communicates with the backend Flask API (`http://localhost:5000`) using **Axios**.

Example `src/services/api.js`:

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
});

export default api;
```

---

## 🖥 Example Pages

* `LoginPage` – user authentication
* `Dashboard` – list of projects
* `ProjectEditor` – script editing, asset management
