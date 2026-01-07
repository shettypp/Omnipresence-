import { supabase } from "./supabase.js";
import { startCamera } from "./vision/camera.js";
import { initLandmarker, getLandmarks } from "./vision/landmarks.js";
import { generateDescriptor } from "./vision/descriptor.js";
import { saveFace } from "./vision/db.js";

/* ---------- ELEMENTS ---------- */
const video = document.getElementById("video");
const status = document.getElementById("status");

const startCameraBtn = document.getElementById("startCamera");
const signupBtn = document.getElementById("signupBtn");

/* ---------- STATE ---------- */
let camStarted = false;

/* ---------- INIT MEDIAPIPE (NO CAMERA) ---------- */
await initLandmarker();
status.innerText = "Click Start Camera to enroll face";

/* ---------- START CAMERA ---------- */
startCameraBtn.onclick = async () => {
  try {
    await startCamera(video);
    camStarted = true;
    status.innerText = "Camera started. You can sign up now.";
  } catch (err) {
    console.error(err);
    status.innerText = "❌ Camera access denied";
  }
};

/* ---------- SIGNUP + FACE ENROLLMENT ---------- */
signupBtn.onclick = async () => {
  if (!camStarted) {
    status.innerText = "⚠️ Please start camera first";
    return;
  }

  const name = document.getElementById("name").value.trim();
  const usn = document.getElementById("usn").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!name || !usn || !email || !password) {
    status.innerText = "⚠️ Fill all fields";
    return;
  }

  status.innerText = "Creating account…";

  /* ---------- SUPABASE AUTH SIGNUP ---------- */
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    status.innerText = error.message;
    return;
  }

  const userId = data.user.id;

  /* ---------- INSERT INTO PROFILES TABLE ---------- */
  const { error: profileError } = await supabase
    .from("profiles")
    .insert([
      {
        id: userId,
        usn: usn,
        name: name
      }
    ]);

  if (profileError) {
    status.innerText = "Profile creation failed: " + profileError.message;
    return;
  }

  /* ---------- FACE ENROLLMENT ---------- */
  status.innerText = "Enrolling face… Look at the camera";

  await new Promise(r => setTimeout(r, 1500));

  const lm = getLandmarks(video);
  if (!lm) {
    status.innerText = "❌ No face detected. Signup incomplete.";
    return;
  }

  const descriptor = generateDescriptor(lm);
  await saveFace(usn, descriptor);

  status.innerText = "✅ Signup & enrollment successful";

  setTimeout(() => {
    window.location.href = "login.html";
  }, 1500);
};
