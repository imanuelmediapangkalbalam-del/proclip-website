"use client";

export type ReframeKeyframe = { time: number; x: number; y: number };

export type ReframeResult = {
  mode: "face" | "center";
  keyframes: ReframeKeyframe[];
};

/**
 * Sample video frames and estimate face center.
 * Uses MediaPipe Tasks Vision when available; otherwise center crop.
 */
export async function buildReframeKeyframes(
  video: HTMLVideoElement,
  opts?: { stepSec?: number; mode?: "face" | "center" }
): Promise<ReframeResult> {
  const step = opts?.stepSec ?? 0.5;
  const duration = video.duration || 0;
  const mode = opts?.mode ?? "face";

  if (mode === "center" || !duration) {
    return {
      mode: "center",
      keyframes: [{ time: 0, x: 0.5, y: 0.5 }],
    };
  }

  try {
    // Dynamic import — optional dependency path
    const vision = await import("@mediapipe/tasks-vision").catch(() => null);
    if (!vision) {
      return { mode: "center", keyframes: [{ time: 0, x: 0.5, y: 0.5 }] };
    }

    const { FaceDetector, FilesetResolver } = vision;
    const fileset = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
    );
    const detector = await FaceDetector.createFromOptions(fileset, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite",
        delegate: "GPU",
      },
      runningMode: "IMAGE",
    });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas");

    const keyframes: ReframeKeyframe[] = [];
    const prevTime = video.currentTime;

    for (let t = 0; t < duration; t += step) {
      video.currentTime = t;
      await waitSeek(video);
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);
      const result = detector.detect(canvas);
      const box = result.detections?.[0]?.boundingBox;
      if (box) {
        keyframes.push({
          time: t,
          x: (box.originX + box.width / 2) / canvas.width,
          y: (box.originY + box.height / 2) / canvas.height,
        });
      } else if (keyframes.length) {
        keyframes.push({ ...keyframes[keyframes.length - 1], time: t });
      } else {
        keyframes.push({ time: t, x: 0.5, y: 0.5 });
      }
    }

    video.currentTime = prevTime;
    detector.close();
    return { mode: "face", keyframes: smoothKeyframes(keyframes) };
  } catch (err) {
    console.warn("MediaPipe reframe fallback to center", err);
    return { mode: "center", keyframes: [{ time: 0, x: 0.5, y: 0.5 }] };
  }
}

function waitSeek(video: HTMLVideoElement) {
  return new Promise<void>((resolve) => {
    const done = () => {
      video.removeEventListener("seeked", done);
      resolve();
    };
    video.addEventListener("seeked", done);
  });
}

function smoothKeyframes(frames: ReframeKeyframe[]) {
  if (frames.length < 3) return frames;
  return frames.map((f, i) => {
    if (i === 0 || i === frames.length - 1) return f;
    const a = frames[i - 1];
    const b = frames[i + 1];
    return {
      time: f.time,
      x: a.x * 0.25 + f.x * 0.5 + b.x * 0.25,
      y: a.y * 0.25 + f.y * 0.5 + b.y * 0.25,
    };
  });
}

export function cropFilterFromKeyframe(kf: ReframeKeyframe) {
  // FFmpeg expression helper for 9:16 crop around normalized center
  const x = `max(0\\,min(iw-ow\\,${kf.x.toFixed(4)}*iw-ow/2))`;
  const y = `max(0\\,min(ih-oh\\,${kf.y.toFixed(4)}*ih-oh/2))`;
  return `crop=ih*9/16:ih:${x}:${y}`;
}
