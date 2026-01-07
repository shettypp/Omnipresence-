import { supabase } from "./supabase.js";

const status = document.getElementById("status");

document.getElementById("signupBtn").onclick = async () => {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!name || !email || !password) {
    status.innerText = "Fill all fields";
    return;
  }

  status.innerText = "Creating admin account…";

  /* ---------- SUPABASE AUTH ---------- */
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    status.innerText = error.message;
    return;
  }

  const userId = data.user.id;

  /* ---------- INSERT INTO ADMINS TABLE ---------- */
  const { error: adminError } = await supabase
    .from("admins")
    .insert([{
      id: userId,
      name,
      email
    }]);

  if (adminError) {
    status.innerText = adminError.message;
    return;
  }

  status.innerText = "✅ Admin created successfully";
  setTimeout(() => {
    location.href = "admin-login.html";
  }, 1200);
};