import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

let ffmpeg: FFmpeg | null = null;
let loading: Promise<FFmpeg> | null = null;

export async function getFFmpeg(onLog?: (msg: string) => void) {
  if (ffmpeg?.loaded) return ffmpeg;
  if (loading) return loading;

  loading = (async () => {
    const instance = new FFmpeg();
    if (onLog) {
      instance.on("log", ({ message }) => onLog(message));
    }
    // Single-thread core — works on GitHub Pages without COOP/COEP
    const base = "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/umd";
    await instance.load({
      coreURL: await toBlobURL(`${base}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${base}/ffmpeg-core.wasm`, "application/wasm"),
    });
    ffmpeg = instance;
    return instance;
  })();

  try {
    return await loading;
  } finally {
    loading = null;
  }
}

export type ExportClipInput = {
  id: string;
  inPoint: number;
  outPoint: number;
  label: string;
  watermark?: boolean;
};

export async function exportClips(
  file: File | Blob,
  clips: ExportClipInput[],
  onProgress?: (ratio: number, label: string) => void
) {
  const ff = await getFFmpeg();
  const inputName = "input.mp4";
  await ff.writeFile(inputName, await fetchFile(file));

  const outputs: { name: string; blob: Blob }[] = [];

  for (let i = 0; i < clips.length; i++) {
    const clip = clips[i];
    const duration = Math.max(0.1, clip.outPoint - clip.inPoint);
    const outName = `clip_${i + 1}_${clip.label.replace(/[^a-z0-9_-]/gi, "_") || i}.mp4`;

    onProgress?.((i + 0.2) / clips.length, `Export ${clip.label || `Clip ${i + 1}`}`);

    // Re-encode for reliable cuts; scale to 9:16 1080x1920 with center crop
    const vf = clip.watermark
      ? "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,drawtext=text='ProClip':fontsize=36:fontcolor=white@0.55:x=w-tw-40:y=h-th-60"
      : "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920";

    await ff.exec([
      "-ss",
      clip.inPoint.toFixed(3),
      "-t",
      duration.toFixed(3),
      "-i",
      inputName,
      "-vf",
      vf,
      "-c:v",
      "libx264",
      "-preset",
      "ultrafast",
      "-crf",
      "28",
      "-c:a",
      "aac",
      "-b:a",
      "128k",
      "-movflags",
      "+faststart",
      outName,
    ]);

    const data = await ff.readFile(outName);
    const bytes =
      data instanceof Uint8Array
        ? data
        : new TextEncoder().encode(String(data));
    const copy = new Uint8Array(bytes);
    outputs.push({
      name: outName,
      blob: new Blob([copy], { type: "video/mp4" }),
    });
    await ff.deleteFile(outName);
    onProgress?.((i + 1) / clips.length, `Selesai ${clip.label || `Clip ${i + 1}`}`);
  }

  await ff.deleteFile(inputName);
  return outputs;
}

export async function detectSilenceGaps(
  file: File,
  minSilenceSec = 0.45
): Promise<{ start: number; end: number }[]> {
  const arrayBuffer = await file.arrayBuffer();
  const ctx = new OfflineAudioContext(1, 1, 44100);
  const audio = await ctx.decodeAudioData(arrayBuffer.slice(0));
  const data = audio.getChannelData(0);
  const sampleRate = audio.sampleRate;
  const windowSize = Math.floor(sampleRate * 0.05);
  const threshold = 0.02;
  const gaps: { start: number; end: number }[] = [];
  let silentStart: number | null = null;

  for (let i = 0; i < data.length; i += windowSize) {
    let sum = 0;
    const end = Math.min(i + windowSize, data.length);
    for (let j = i; j < end; j++) sum += Math.abs(data[j]);
    const avg = sum / (end - i);
    const t = i / sampleRate;
    if (avg < threshold) {
      if (silentStart === null) silentStart = t;
    } else if (silentStart !== null) {
      if (t - silentStart >= minSilenceSec) {
        gaps.push({ start: silentStart, end: t });
      }
      silentStart = null;
    }
  }

  return gaps;
}

export function suggestClipsFromSilence(
  duration: number,
  gaps: { start: number; end: number }[],
  targetLen = 20,
  maxClips = 5
) {
  const points = [0, ...gaps.map((g) => (g.start + g.end) / 2), duration];
  const suggestions: { inPoint: number; outPoint: number; label: string; reason: string }[] = [];

  for (let i = 0; i < points.length - 1 && suggestions.length < maxClips; i++) {
    const start = points[i];
    let end = Math.min(start + targetLen, duration);
    if (end - start < 3) continue;
    // Prefer ending near next silence
    const nextGap = gaps.find((g) => g.start > start && g.start < start + targetLen + 5);
    if (nextGap) end = Math.min(nextGap.start, start + 45);
    suggestions.push({
      inPoint: Number(start.toFixed(2)),
      outPoint: Number(end.toFixed(2)),
      label: `AI Clip ${suggestions.length + 1}`,
      reason: "Silence / pacing heuristic",
    });
  }

  if (!suggestions.length && duration > 3) {
    suggestions.push({
      inPoint: 0,
      outPoint: Math.min(targetLen, duration),
      label: "AI Clip 1",
      reason: "Fallback opening segment",
    });
  }

  return suggestions;
}
