# Backend - Flask API

## 🚀 Technology Stack

* **Flask** – lightweight Python web framework for APIs.
* **Flask-CORS** – enable cross-origin requests from the React frontend.
* **PyMongo** – interact with MongoDB database.
* **Flask-JWT-Extended** – authentication & authorization using JWT tokens.
* **dnspython** – support for MongoDB Atlas (cloud database connections).

---

## 📂 Project Structure

```
src/backend/
│── README.md               # This file
│── run.py                  # Entry point to start the Flask server
│── requirements.txt        # Python dependencies
│
├── app/
│   ├── __init__.py         # App factory, MongoDB setup, blueprint registration
│   ├── models/             # MongoDB models (User, Project, Asset)
│   │   └── __init__.py
│   ├── routes/             # API endpoints (auth, projects, scripts)
│   │   └── __init__.py
│   ├── services/           # AI, audio, video services (Generation logic)
│   │   └── __init__.py
│   └── utils/              # Helpers, middleware, error handlers
│
└── database/
    └── init_db.py          # Initial database setup or seeding
```

---

## ⚡ Getting Started

### 1. Create and activate a virtual environment

```bash
cd src/backend
python3 -m venv env
source env/bin/activate   # On Linux/Mac
env\Scripts\activate      # On Windows
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Run the server

```bash
python run.py
```

Server will start at: **[http://localhost:5000](http://localhost:5000)**

---

## 🛠 Example API Endpoints

* `POST /auth/login` – login with user credentials
* `POST /auth/register` – register a new user
* `GET /projects` – get all user projects
* `POST /projects` – create a new project
