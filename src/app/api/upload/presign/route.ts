import { auth } from "@/lib/auth";
import { jsonError, jsonOk, parseBody } from "@/lib/api";
import { createUploadUrl, hasR2 } from "@/lib/storage";
import { uid } from "@/lib/utils";
import { presignSchema } from "@/lib/validations";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return jsonError("Unauthorized", 401);

  const body = await req.json().catch(() => null);
  const parsed = parseBody(presignSchema, body);
  if (!parsed.ok) return jsonError("Invalid payload", 400);

  if (!hasR2()) {
    // Client-side fallback: instruct browser to keep file local
    return jsonOk({
      mode: "local",
      key: `local/${session.user.id}/${uid("vid")}-${parsed.data.filename}`,
      message: "R2 not configured — use local browser upload (FFmpeg.wasm).",
    });
  }

  const key = `uploads/${session.user.id}/${Date.now()}-${parsed.data.filename}`;
  const signed = await createUploadUrl(key, parsed.data.contentType);
  return jsonOk({ mode: "r2", ...signed });
}
