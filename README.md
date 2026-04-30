TripTrack - Trip Management System

A full-stack application designed for managing and monitoring annual school trips. The system allows teachers to track student locations in real-time on an interactive map and manages student/teacher registrations.

 Features

Role-Based Registration:  Separate registration flows for Teachers and Students.

Secure Authentication: Teacher-only login authentication.

Teacher Dashboard: Comprehensive display of student and teacher data, including filtering by class.

Real-Time Tracking:  Interactive map using Leaflet to track student locations based on coordinates.

Distance Calculation: Integrated services for computing distances between locations.
Registration
1. Open the application in your browser.
2. Choose whether you are registering as a Teacher (to the system) or a Student (to the trip).
3. Fill in the required information and submit

<img width="716" height="637" alt="image" src="https://github.com/user-attachments/assets/10fd8371-ec7a-4d07-b94a-df9997dbb06c" />

    Login
1. Go to the login page.
2. Select the "Teacher" role.
3. Enter your credentials to access the management dashboard.


<img width="719" height="407" alt="image" src="https://github.com/user-attachments/assets/ae68cb5c-4738-4407-9687-cadf00809674" />

 Teacher Dashboard
After logging in, teachers can:
*   View all registered students and teachers.
*   View specific users by ID.
*   Monitor real-time locations of students on the map

  <img width="987" height="713" alt="image" src="https://github.com/user-attachments/assets/e4cac81f-80ed-49f0-bd1f-232ef6fc8dd8" />
  <img width="445" height="323" alt="image" src="https://github.com/user-attachments/assets/7b817205-ef6c-47a8-b968-c04c39b736be" />
  Technologies Used

 Frontend
React  (Vite)
Axios (for API communication)

Backend
Node.js & NestJS
console.neon

 Installation

1.
    ```bash
    git clone [https://github.com/batziyon/BatziyonNeventhal.git](https://github.com/batziyon/BatziyonNeventhal.git)
    cd TripTrack
    ```

2. Install Backend dependencies:
    ```bash
    cd school-system-backend
    npm install
    ```

3.  Install Frontend dependencies:
    ```bash
    cd ../school-system-frontend
    npm install
    ```

 Running the Application

You need to run both the server and the client:

 Run Backend (NestJS)
```bash
cd school-system-backend
npm run start:dev



