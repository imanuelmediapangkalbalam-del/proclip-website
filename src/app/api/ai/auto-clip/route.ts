import { auth } from "@/lib/auth";
import { jsonError, jsonOk, parseBody } from "@/lib/api";
import { suggestClipsFromSilence } from "@/lib/ffmpeg";
import { autoClipSchema } from "@/lib/validations";

const KEYWORD_RE = /\b(wow|tips|rahasia|crazy|secret|hack|cara|penting)\b/gi;

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return jsonError("Unauthorized", 401);

  const body = await req.json().catch(() => null);
  const parsed = parseBody(autoClipSchema, body);
  if (!parsed.ok) return jsonError("Invalid payload", 400);

  const { duration, gaps, transcriptText, targetLen, maxClips } = parsed.data;
  const base = suggestClipsFromSilence(duration, gaps, targetLen, maxClips);

  const keywordHits: { inPoint: number; outPoint: number; label: string; reason: string; score: number }[] = [];
  if (transcriptText) {
    // naive: if keywords appear, boost opening/middle suggestions
    const matches = transcriptText.match(KEYWORD_RE);
    if (matches?.length) {
      keywordHits.push({
        inPoint: 0,
        outPoint: Math.min(targetLen, duration),
        label: "Keyword Hook",
        reason: `Keyword: ${Array.from(new Set(matches.map((m) => m.toLowerCase()))).join(", ")}`,
        score: 0.9,
      });
    }
  }

  const suggestions = [
    ...keywordHits,
    ...base.map((s, i) => ({
      ...s,
      score: Math.max(0.4, 0.85 - i * 0.08),
    })),
  ].slice(0, maxClips);

  return jsonOk({ suggestions });
}
