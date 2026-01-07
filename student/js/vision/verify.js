import { generateDescriptor } from "./descriptor.js";
import { cosineSimilarity } from "./match.js";
import { checkLiveness } from "./liveness.js";

const THRESHOLD = 0.75;

export function verifyGate(liveLandmarks, storedDescriptor, challenge) {
  const liveDesc = generateDescriptor(liveLandmarks);
  const similarity = cosineSimilarity(liveDesc, storedDescriptor);

  const livenessPassed = checkLiveness(liveLandmarks, challenge);

  return {
    verified: similarity > THRESHOLD && livenessPassed,
    similarity,
    livenessPassed
  };
}
