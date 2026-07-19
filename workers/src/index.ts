/**
 * Background worker stubs (deploy separately on Railway/Render/Fly).
 * Queues (Upstash Redis lists): download-url, transcribe, render-server, publish, thumbnail.
 *
 * Example consumer (Node):
 *   const job = await redis.rpop("queue:download-url")
 *   // run yt-dlp → upload R2 → update VideoAsset
 */

export const WORKER_QUEUES = [
  "download-url",
  "transcribe",
  "auto-clip",
  "render-server",
  "publish",
  "thumbnail-waveform",
] as const;

export type WorkerQueue = (typeof WORKER_QUEUES)[number];
