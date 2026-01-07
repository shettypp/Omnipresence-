export function generateDescriptor(landmarks) {
  const vec = [];
  landmarks.forEach(p => vec.push(p.x, p.y, p.z));

  const norm = Math.sqrt(vec.reduce((s,v)=>s+v*v,0));
  return vec.map(v => v / norm);
}
