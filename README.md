# Omnipresence-
Turning "Checking In" into "Proving Presence" via a decentralized verification stack. Built to block proxy attendance using real-time micro-challenges, GPS geofencing, and secure hardware-linked identification.

🚀 Omnipresence: AI-Powered Attendance System
Omnipresence is a high-security, multi-layered attendance solution designed to eliminate proxy attendance. It combines dynamic QR rotation, biometric face liveness detection, and hardware-based fraud prevention.

✨ Key Features
🛡️ Biometric Liveness Detection: Uses MediaPipe Landmarker to ensure students perform a real-time challenge (Nod, Turn, or Open Mouth) to prevent the use of static photos.

🔄 Dynamic QR Rotation: The Admin dashboard generates a unique encrypted token that rotates every 30 seconds, making screenshots useless.

🚫 Device Fraud Prevention: The backend automatically flags and prevents multiple students from marking attendance using the same physical device.

📊 Real-time Admin Analytics: Admins can view live attendance logs, filter by class/subject, and identify "Verified" vs "Fraud" entries instantly.

📱 Mobile-First Design: Fully responsive Pink & Black theme optimized for both laptop classroom displays and student mobile devices.

🛠️ Tech Stack
Frontend: HTML5, CSS3, JavaScript (ES6+ Modules)

Backend: Node.js, Express.js

Database: Supabase (PostgreSQL + Auth)

Vision AI: Google MediaPipe (Face Landmarker)

Security: UUID v4 for session tokens, Supabase Service Role for protected DB operations

📁 Project Structure
Plaintext

GD-HACK/
├── admin/               # Admin Portal (QR Generation & Logs)
├── student/             # Student Portal (Scan & Biometrics)
├── server/              # Node.js Backend 
│   ├── server.js        # Main API Logic
│   └── .env             # Supabase API Keys
├── style.css            # Global Styling
└── index.html           # Landing Page
🚀 Getting Started
1. Prerequisites
Node.js installed

A Supabase Project

2. Database Setup
Create an attendance_logs table in Supabase with the following columns:

usn (text), student_name (text), device_id (text), session_id (text), status (text), class_id (text), subject (text).

3. Installation
Bash

cd server
npm install
4. Environment Variables
Create a .env file in the /server folder:

Code snippet

SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_role_key
5. Run the Server
Bash

node server.js
📸 Demo Logic
Admin logs in and starts a session for "Web Design - Class A".

Student scans the dynamic QR code.

Student passes the AI Face Liveness challenge.

Backend checks if the device was already used and records the status as verified or fraud.
