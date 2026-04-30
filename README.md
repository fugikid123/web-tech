# Minh Tran Portfolio & Hypertrophy Lab

A modern, responsive personal portfolio and fitness education platform featuring a synchronized **Dark & Red** aesthetic. This project showcases web development skills through interactive UI components, API integrations, and user-centric design.

## 🚀 Live Features

### 1. Professional Portfolio (`index.html`)
*   **Interactive Project Gallery:** A split-pane display highlighting academic and personal projects (Web Tech, Java Systems, Databases).
*   **Responsive Design:** Fully optimized for mobile, tablet, and desktop views.
*   **Skill Showcase:** Categorized technical skills and educational background.

### 2. Hypertrophy Online Course (`pages/hypertrophy/`)
*   **Real Transformations:** An interactive side-bar album gallery showcasing fitness and posture progress with smooth expansion logic.
*   **Exercise Explorer:** A dynamic tool powered by the **API-Ninjas Exercise API** to find targeted workouts by muscle group.
*   **Interactive Learning:** Detailed modules for Posture Correction and Mobility Limitations using hover-trigger displays.
*   **Training Signup:** A validated form for users to request personalized training guides.

### 3. Member's Dashboard (`pages/dashboard/`)
*   **Progress Tracking:** Visualized timelines and workout schedules.
*   **User Persistence:** Simple login simulation with local storage handling.

## 🛠️ Tech Stack
*   **Frontend:** HTML5, CSS3 (Custom Variables, Flexbox/Grid), ES6+ JavaScript.
*   **Backend:** Node.js, Express.js.
*   **Database:** MongoDB with Mongoose ODM.
*   **Interactivity:** Vanilla JS (no heavy frameworks) for fast performance.
*   **API Integration:** RESTful API fetching for real-time exercise data.
*   **Version Control:** Managed via Git/GitHub.

## 📂 Folder Structure
```text
├── assets/
│   ├── css/          # Core styling and theme variables
│   ├── js/           # Shared logic and database simulations
│   ├── images/       # Transformation albums and branding assets
│   └── data/         # JSON-based mock database
├── pages/
│   ├── hypertrophy/  # Course pages and interactive scripts
│   └── dashboard/    # Member-only dashboard interface
├── server.js         # MongoDB/Express backend server
├── package.json      # Node.js dependencies and scripts
└── index.html        # Main Portfolio Landing Page
```

## 🔧 Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/fugikid123/web-tech.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Ensure **MongoDB** is running locally on port `27017`.
4. Start the backend server:
   ```bash
   npm start
   ```
5. Open `index.html` in any modern web browser.
6. Use credentials `user1 / 12345` to explore the dashboard.

## 🛡️ CRUD Operations (MongoDB)
The hypertrophy page now integrates with a real MongoDB database for user signups:
- **CREATE:** User submits the training guide form, saving data to the `signups` collection.
- **READ:** Signups can be retrieved via the `/api/signups` endpoint.
- **DELETE:** (Optional) Signups can be removed via `/api/signup/:id`.

---
*Created by Minh Tran — MICT Student at Western Sydney University.*
