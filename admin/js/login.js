import { supabase } from "./supabase.js";

const status = document.getElementById("status");

document.getElementById("loginBtn").onclick = async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  status.innerText = "Logging in…";

  /* ---------- AUTH LOGIN ---------- */
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    status.innerText = error.message;
    return;
  }

  /* ---------- VERIFY ADMIN EXISTS ---------- */
  const { data, error: adminError } = await supabase
    .from("admins")
    .select("id")
    .single();

  if (adminError || !data) {
    status.innerText = "Not an admin account";
    await supabase.auth.signOut();
    return;
  }

  status.innerText = "✅ Login successful";
  setTimeout(() => {
    location.href = "admin-dashboard.html";
  }, 800);
};  