import { auth } from "@/lib/auth";
import { jsonError, jsonOk, parseBody } from "@/lib/api";
import { hasDatabase, prisma } from "@/lib/prisma";
import { projectCreateSchema } from "@/lib/validations";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return jsonError("Unauthorized", 401);

  if (!hasDatabase()) {
    return jsonOk({ items: [], demo: true });
  }

  const items = await prisma.project.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { clips: true } } },
  });
  return jsonOk({ items });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return jsonError("Unauthorized", 401);

  const body = await req.json().catch(() => null);
  const parsed = parseBody(projectCreateSchema, body);
  if (!parsed.ok) return jsonError("Invalid payload", 400);

  if (!hasDatabase()) {
    return jsonOk({
      id: `demo_proj_${Date.now()}`,
      ...parsed.data,
      demo: true,
    }, { status: 201 });
  }

  const project = await prisma.project.create({
    data: {
      userId: session.user.id,
      title: parsed.data.title,
      description: parsed.data.description,
      aspectRatio: parsed.data.aspectRatio ?? "VERTICAL_9_16",
    },
  });
  return jsonOk(project, { status: 201 });
}
