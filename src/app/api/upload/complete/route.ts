import { auth } from "@/lib/auth";
import { jsonError, jsonOk, parseBody } from "@/lib/api";
import { hasDatabase, prisma } from "@/lib/prisma";
import { uploadCompleteSchema } from "@/lib/validations";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return jsonError("Unauthorized", 401);

  const body = await req.json().catch(() => null);
  const parsed = parseBody(uploadCompleteSchema, body);
  if (!parsed.ok) return jsonError("Invalid payload", 400);

  if (!hasDatabase()) {
    return jsonOk({
      id: `local_${Date.now()}`,
      ...parsed.data,
      status: "READY",
      demo: true,
    });
  }

  const video = await prisma.videoAsset.create({
    data: {
      userId: session.user.id,
      filename: parsed.data.key.split("/").pop() ?? parsed.data.originalName,
      originalName: parsed.data.originalName,
      duration: parsed.data.duration ?? 0,
      size: BigInt(parsed.data.size),
      mimeType: parsed.data.mimeType,
      s3Key: parsed.data.key,
      status: "READY",
    },
  });

  return jsonOk({
    id: video.id,
    status: video.status,
    s3Key: video.s3Key,
  });
}
