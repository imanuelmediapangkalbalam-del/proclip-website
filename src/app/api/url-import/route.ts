import { auth } from "@/lib/auth";
import { jsonError, jsonOk, parseBody } from "@/lib/api";
import { hasDatabase, prisma } from "@/lib/prisma";
import { urlImportSchema } from "@/lib/validations";
import { uid } from "@/lib/utils";

/**
 * URL import enqueue.
 * Production: BullMQ worker runs yt-dlp → streams to R2.
 * Without Redis/R2: returns queued demo job for client-side handling notice.
 */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return jsonError("Unauthorized", 401);

  const body = await req.json().catch(() => null);
  const parsed = parseBody(urlImportSchema, body);
  if (!parsed.ok) return jsonError("Invalid URL", 400);

  const jobId = uid("urljob");

  if (hasDatabase()) {
    await prisma.renderJob.create({
      data: {
        userId: session.user.id,
        status: "QUEUED",
        progress: 0,
        preset: "url-import",
        error: null,
      },
    });
  }

  const hasQueue = Boolean(process.env.UPSTASH_REDIS_REST_URL);
  return jsonOk({
    jobId,
    status: hasQueue ? "QUEUED" : "PENDING_WORKER",
    url: parsed.data.url,
    message: hasQueue
      ? "Queued yt-dlp worker to download into R2."
      : "Queue not configured. Paste-URL import needs Upstash + yt-dlp worker (workers/download-url).",
  });
}
