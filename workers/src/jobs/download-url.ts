/**
 * yt-dlp URL download job (server worker).
 * Payload: { jobId, userId, url, r2Key }
 *
 * Pseudo:
 * 1. yt-dlp -f mp4 -o tmp.mp4 <url>
 * 2. upload tmp.mp4 to R2
 * 3. prisma.videoAsset.create(... status READY)
 * 4. enqueue thumbnail-waveform
 */
export async function downloadUrlJob(_payload: {
  jobId: string;
  userId: string;
  url: string;
}) {
  throw new Error(
    "Deploy workers/ separately with yt-dlp binary + R2 credentials to enable URL import."
  );
}
