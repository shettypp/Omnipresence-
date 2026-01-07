import FingerprintJS from "https://cdn.jsdelivr.net/npm/@fingerprintjs/fingerprintjs/+esm";
import QrScanner from "https://cdn.jsdelivr.net/npm/qr-scanner@1.4.2/qr-scanner.min.js";

const video = document.getElementById("qrVideo");
const status = document.getElementById("status");

const usn = sessionStorage.getItem("usn");
if (!usn) location.href = "login.html";

// Device ID
const fp = await FingerprintJS.load();
const { visitorId } = await fp.get();

const scanner = new QrScanner(video, async result => {
  scanner.stop();

  status.innerText = "Validating QR…";

  const res = await fetch("http://192.168.x.x:5000/api/student/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      usn,
      deviceId: visitorId,
      sessionToken: result.data
    })
  });

  if (!res.ok) {
    status.innerText = "❌ QR expired. Rescan.";
    scanner.start();
    return;
  }

  // Save token for verify page
  sessionStorage.setItem("sessionToken", result.data);
  sessionStorage.setItem("deviceId", visitorId);

  location.href = "verify.html";
});

await scanner.start();
