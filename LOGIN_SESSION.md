# Authentication and Session Management Documentation

This document explains in detail how the user and admin login sessions work within the project.

## 1. Authentication Overview

The system uses a simple frontend-based authentication mechanism. Since there is no backend server, credentials and session states are managed using the browser's `localStorage` and client-side JavaScript.

### Credentials
Two types of roles are predefined in the system:

| Role | Username | Password |
| :--- | :--- | :--- |
| **Standard User** | `user1` | `12345` |
| **Administrator** | `ad` | `123` |

---

## 2. Login Process

The login logic is primarily located in `pages/hypertrophy/hypertrophy-script.js`.

1.  **Form Submission:** When the user submits the login form, the `submit` event listener captures the values of the `#username` and `#password` fields.
2.  **Validation:** The script checks the input against the predefined credentials.
3.  **Session Creation:**
    *   If the credentials match, the script saves a key-value pair in `localStorage`:
        *   For a standard user: `localStorage.setItem('logged_in_user', 'user1')`
        *   For an admin: `localStorage.setItem('logged_in_user', 'admin')`
4.  **Redirection:** Upon successful session creation, the user is redirected to the dashboard: `window.location.href = '../dashboard/dashboard.html'`.
5.  **Error Handling:** If the credentials do not match, an error message is displayed briefly by setting the opacity of the `#login-error` element.

---

## 3. Session Persistence and Security

### Session Verification
Every time the Dashboard page (`pages/dashboard/dashboard.html`) is loaded, the `dashboard-script.js` performs an immediate check:

```javascript
const authUser = localStorage.getItem('logged_in_user');
if (!authUser) {
    window.location.href = '../hypertrophy/hypertrophy.html';
    return;
}
```

If no session is found, the user is automatically redirected back to the login page (Hypertrophy).

### Role Identification
The dashboard distinguishes between a regular user and an admin using a boolean flag:
`const isAdmin = (authUser === 'admin');`

---

## 4. User vs. Admin Capabilities

The UI dynamically adapts based on the `isAdmin` flag to provide different levels of access.

### Standard User (`user1`)
*   **View-Only Access:** Can view their progress timeline, workout plans, and tracker charts.
*   **Interactivity:** Can check off items in the workout routine (saved only for the current session).
*   **Progress Tracking:** Can use the "Add new record" button to update their daily weight and steps trend.

### Administrator (`admin`)
In addition to all user capabilities, the Admin has exclusive management rights:
*   **Admin Mode Indicator:** A "ADMIN MODE" badge is displayed in the hero section.
*   **Content Management:**
    *   **Timeline:** Can add new phases to the progress timeline and delete existing ones.
    *   **Workouts:** Can edit the functional and physical workout plans directly via administrative modals.
    *   **Profile:** Has access to the "Edit" button for the user's avatar.
*   **Persistent Changes:** All changes made by the Admin are saved back to `localStorage` using the `daniel_data` key, ensuring they persist across reloads.

---

## 5. Logout and Session Termination

The logout process is straightforward:
1.  The user clicks the **Logout** button in the navigation bar.
2.  The `localStorage.removeItem('logged_in_user')` command is executed, clearing the session.
3.  The user is redirected back to the login/landing page.

---

## 6. Implementation Files
*   **Login Logic:** `pages/hypertrophy/hypertrophy-script.js`
*   **Session & Dashboard Management:** `pages/dashboard/dashboard-script.js`
*   **Shared Helpers:** `assets/js/shared.js` (provides basic DB helpers if needed)
