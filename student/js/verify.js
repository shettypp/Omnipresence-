import { startCamera } from "./vision/camera.js";
import { initLandmarker, getLandmarks } from "./vision/landmarks.js";
import { loadFace } from "./vision/db.js";
import { randomChallenge, startChallenge } from "./vision/liveness.js";
import { verifyGate } from "./vision/verify.js";

const video = document.getElementById("video");
const status = document.getElementById("status");

let cameraStarted = false;

// 1. Ensure we have the Student USN and the Scanned QR Token
const usn = sessionStorage.getItem("student_usn"); // Using your project's naming
const scannedToken = sessionStorage.getItem("scanned_qr_token"); 

if (!usn || !scannedToken) {
    status.innerText = "Data missing. Restart scan.";
    setTimeout(() => location.href = "qr-scan.html", 1500);
}

await initLandmarker();

/* ---------- START CAMERA ---------- */
document.getElementById("startCamera").onclick = async () => {
    try {
        await startCamera(video);
        cameraStarted = true;
        status.innerText = "Camera active. Center your face.";
    } catch {
        status.innerText = "Camera permission denied";
    }
};

/* ---------- BIOMETRIC + BACKEND VERIFICATION ---------- */
document.getElementById("verifyBtn").onclick = async () => {
    if (!cameraStarted) {
        status.innerText = "Start camera first";
        return;
    }

    const stored = await loadFace(usn);
    if (!stored) {
        status.innerText = "No face enrollment found";
        return;
    }

    const challenge = randomChallenge();
    status.innerText = 
        challenge === "TURN" ? "Turn your head left or right" :
        challenge === "NOD" ? "Move your head up or down" : "Open your mouth clearly";

    const base = getLandmarks(video);
    if (!base) {
        status.innerText = "Face not visible";
        return;
    }

    startChallenge(base);
    const startTime = Date.now();

    const interval = setInterval(async () => {
        const lm = getLandmarks(video);
        if (!lm) return;

        const result = verifyGate(lm, stored, challenge);

        if (result.verified) {
            clearInterval(interval);
            status.innerText = "Face Verified! Saving to Server...";
            
            // 2. NOW SEND TO BACKEND TO CHECK FOR DEVICE FRAUD AND QR EXPIRY
            await recordAttendanceOnServer(scannedToken);
        }

        if (Date.now() - startTime > 8000) {
            clearInterval(interval);
            status.innerText = "Verification timeout. Try again.";
        }
    }, 300);
};

/* ---------- SERVER COMMUNICATION FUNCTION ---------- */
async function recordAttendanceOnServer(token) {
    // Replace with your laptop's IP address
    const serverIP = "192.168.x.x"; 
    const deviceId = localStorage.getItem("device_id") || "mobile_client";

    try {
        // Replace 192.168.x.x with your ACTUAL laptop IP
const response = await fetch(`http://192.168.20.163:5000/api/student/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        usn: usn,
        deviceId: deviceId,
        sessionToken: token
    })
});

        const data = await response.json();

        if (response.ok && data.success) {
            status.innerText = "Success! Attendance Marked.";
            setTimeout(() => {
                location.href = `dashboard.html?status=${data.status}`;
            }, 1000);
        } else {
            status.innerText = data.error || "Server Verification Failed";
            setTimeout(() => location.href = "qr-scan.html", 2000);
        }
    } catch (err) {
        console.error(err);
        status.innerText = "Network Error. Is the server running?";
    }
}