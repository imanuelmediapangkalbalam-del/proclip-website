import { Redis } from "@upstash/redis";

export function hasQueue() {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  );
}

export function getRedis() {
  if (!hasQueue()) throw new Error("Upstash Redis not configured");
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
}

export async function enqueueJob(queue: string, payload: Record<string, unknown>) {
  if (!hasQueue()) {
    return { queued: false as const, reason: "UPSTASH_REDIS not set" };
  }
  const redis = getRedis();
  const id = `${queue}_${Date.now()}`;
  await redis.lpush(`queue:${queue}`, JSON.stringify({ id, payload, createdAt: Date.now() }));
  return { queued: true as const, id };
}
