import { supabase } from "./supabase.js";

/* ---------- PROTECT PAGE ---------- */
const { data } = await supabase.auth.getSession();
if (!data.session) {
  location.href = "admin-login.html";
}

const tbody = document.querySelector("#attendanceTable tbody");
const status = document.getElementById("status");

document.getElementById("filterBtn").onclick = fetchAttendance;

async function fetchAttendance() {
  tbody.innerHTML = "";
  status.innerText = "Loading...";

  const classVal = document.getElementById("classFilter").value.trim();
  const subjectVal = document.getElementById("subjectFilter").value.trim();
  const dateVal = document.getElementById("dateFilter").value;

  let query = supabase
    .from("attendance_logs")
    .select("usn, class_id, subject, status, created_at")
    .order("created_at", { ascending: false });

  if (classVal) query = query.eq("class_id", classVal);
  if (subjectVal) query = query.eq("subject", subjectVal);

  if (dateVal) {
    const start = `${dateVal}T00:00:00`;
    const end = `${dateVal}T23:59:59`;
    query = query.gte("created_at", start).lte("created_at", end);
  }

  const { data, error } = await query;

  if (error) {
    status.innerText = error.message;
    return;
  }

  if (data.length === 0) {
    status.innerText = "No records found";
    return;
  }

  data.forEach(row => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.usn}</td>
      <td>${row.class_id}</td>
      <td>${row.subject}</td>
      <td style="color:${row.status === "fraud" ? "red" : "lightgreen"}">
        ${row.status}
      </td>
      <td>${new Date(row.created_at).toLocaleString()}</td>
    `;
    tbody.appendChild(tr);
  });

  status.innerText = `${data.length} record(s) found`;
}