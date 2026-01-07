import QRCode from "https://cdn.jsdelivr.net/npm/qrcode/+esm";
import { supabase } from "./supabase.js"; // Fixed path relative to admin/js/

/* ---------- GET SESSION CONTEXT ---------- */
const class_id = sessionStorage.getItem("class_id");
const subject = sessionStorage.getItem("subject");
const time = sessionStorage.getItem("time");

const qrImg = document.getElementById("qrImg");
const info = document.getElementById("sessionInfo");
const endBtn = document.getElementById("endSessionBtn");

// Fixed: Matches admin_dashboard.html in your folder
if (!class_id || !subject || !time) {
  alert("Session details missing.");
  location.href = "admin_dashboard.html";
}

/* ---------- DISPLAY SESSION INFO ---------- */
info.innerText = `Class: ${class_id}\nSubject: ${subject}\nTime: ${time}`;

/* ---------- FETCH QR FROM BACKEND ---------- */
async function fetchQR() {
  try {
    // FIXED: Changed endpoint to match server.js GET /api/admin/qr
    const res = await fetch("http://localhost:5000/api/admin/qr");

    if (!res.ok) throw new Error("QR fetch failed");

    const data = await res.json();
    
    // Generates the QR image from the token string
    qrImg.src = await QRCode.toDataURL(data.token);

  } catch (err) {
    console.error(err);
    alert("Error generating QR. Ensure server.js is running.");
  }
}

/* ---------- INITIAL LOAD + ROTATION ---------- */
fetchQR();
const qrInterval = setInterval(fetchQR, 30000); // Rotates every 30s to match server

/* ---------- END SESSION ---------- */
endBtn.onclick = () => {
  clearInterval(qrInterval);
  sessionStorage.clear();
  location.href = "admin-menu.html"; // Redirect back to menu
};