export async function saveFace(usn, descriptor) {
  localStorage.setItem("face_" + usn, JSON.stringify(descriptor));
}

export async function loadFace(usn) {
  const d = localStorage.getItem("face_" + usn);
  return d ? JSON.parse(d) : null;
}
