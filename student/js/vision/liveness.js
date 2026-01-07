let baseline = null;
let completed = false;

/* ---------- RANDOM CHALLENGE ---------- */
export function randomChallenge() {
  const actions = ["TURN", "NOD", "MOUTH"];
  return actions[Math.floor(Math.random() * actions.length)];
}

/* ---------- START CHALLENGE ---------- */
export function startChallenge(lm) {
  baseline = lm;
  completed = false;
}

/* ---------- CHECK LIVENESS ---------- */
export function checkLiveness(lm, challenge) {
  if (!baseline || completed) return completed;

  // 1️⃣ Head Turn (Left / Right)
  if (challenge === "TURN") {
    const baseX = baseline[1].x;   // nose
    const nowX  = lm[1].x;

    if (Math.abs(nowX - baseX) > 0.08) {
      completed = true;
    }
  }

  // 2️⃣ Head Nod (Up / Down)
  if (challenge === "NOD") {
    const baseY = baseline[1].y;   // nose
    const nowY  = lm[1].y;

    if (Math.abs(nowY - baseY) > 0.06) {
      completed = true;
    }
  }

  // 3️⃣ Mouth Open
  if (challenge === "MOUTH") {
    const baseGap =
      baseline[14].y - baseline[13].y; // lips
    const nowGap =
      lm[14].y - lm[13].y;

    if (nowGap > baseGap * 1.8) {
      completed = true;
    }
  }

  return completed;
}
