const classInput = document.getElementById("classInput");
const subjectInput = document.getElementById("subjectInput");
const timeInput = document.getElementById("timeInput");

document.getElementById("qrForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const class_id = classInput.value.trim();
  const subject = subjectInput.value.trim();
  const time = timeInput.value.trim();

  if (!class_id || !subject || !time) {
    alert("Fill all fields");
    return;
  }

  // Store context for QR page
  sessionStorage.setItem("class_id", class_id);
  sessionStorage.setItem("subject", subject);
  sessionStorage.setItem("time", time);

  // Move to QR display page
  window.location.href = "admin-qr.html";
});
