import { auth } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/api";
import { hasDatabase, prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return jsonError("Unauthorized", 401);

  if (!hasDatabase()) {
    return jsonOk({
      credits: session.user.credits ?? 100,
      role: session.user.role ?? "FREE",
      demo: true,
    });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { credits: true, role: true },
  });
  if (!user) return jsonError("User not found", 404);
  return jsonOk(user);
}
