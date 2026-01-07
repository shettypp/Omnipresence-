import { supabase } from "./supabase.js";

const status = document.getElementById("status");

document.getElementById("loginBtn").onclick = async () => {
  const usn = document.getElementById("usn").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!usn || !email || !password) {
    status.innerText = "Fill all fields";
    return;
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    status.innerText = error.message;
    return;
  }

  // 🔑 Save USN for next steps
  sessionStorage.setItem("usn", usn);

  status.innerText = "Login successful. Scan QR code…";

  setTimeout(() => {
    window.location.href = "qr-scan.html";
  }, 800);
};
