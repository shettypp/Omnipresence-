export async function startCamera(video) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" },
      audio: false
    });

    video.srcObject = stream;

    // CRITICAL for browser compatibility
    video.muted = true;
    video.autoplay = true;
    video.playsInline = true;

    await video.play();
    return true;

  } catch (err) {
    console.error("Camera error:", err);
    throw err;
  }
}
