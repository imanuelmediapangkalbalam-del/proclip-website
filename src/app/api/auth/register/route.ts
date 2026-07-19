import bcrypt from "bcryptjs";
import { jsonError, jsonOk, parseBody } from "@/lib/api";
import { hasDatabase, prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = parseBody(registerSchema, body);
  if (!parsed.ok) return jsonError("Invalid payload", 400);

  const { email, password, name } = parsed.data;

  if (!hasDatabase()) {
    return jsonOk({
      id: `demo_${email}`,
      email,
      name: name ?? email.split("@")[0],
      demo: true,
      message: "Registered in demo mode (no DATABASE_URL). Use login with same email/password.",
    });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return jsonError("Email already registered", 409);

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      email,
      name: name ?? email.split("@")[0],
      passwordHash,
      role: "FREE",
      credits: 100,
    },
    select: { id: true, email: true, name: true, role: true, credits: true },
  });

  return jsonOk(user, { status: 201 });
}
