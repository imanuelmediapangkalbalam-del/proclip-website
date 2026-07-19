import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1).max(80).optional(),
  email: z.string().email(),
  password: z.string().min(6).max(128),
});

export const presignSchema = z.object({
  filename: z.string().min(1),
  contentType: z.string().min(1),
  size: z.number().int().positive().max(2 * 1024 * 1024 * 1024),
});

export const uploadCompleteSchema = z.object({
  key: z.string().min(1),
  originalName: z.string().min(1),
  size: z.number().int().positive(),
  mimeType: z.string().min(1),
  duration: z.number().nonnegative().optional(),
});

export const urlImportSchema = z.object({
  url: z.string().url(),
  title: z.string().max(200).optional(),
});

export const projectCreateSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().max(500).optional(),
  aspectRatio: z
    .enum(["VERTICAL_9_16", "HORIZONTAL_16_9", "SQUARE_1_1"])
    .optional(),
});

export const clipCreateSchema = z.object({
  projectId: z.string().min(1),
  videoId: z.string().min(1),
  inPoint: z.number().nonnegative(),
  outPoint: z.number().positive(),
  label: z.string().max(80).optional(),
  order: z.number().int().nonnegative().optional(),
});

export const autoClipSchema = z.object({
  duration: z.number().positive(),
  gaps: z
    .array(z.object({ start: z.number(), end: z.number() }))
    .default([]),
  keywords: z.array(z.string()).optional(),
  transcriptText: z.string().optional(),
  targetLen: z.number().positive().default(20),
  maxClips: z.number().int().positive().max(20).default(5),
});

export const renderQueueSchema = z.object({
  projectId: z.string().optional(),
  clipIds: z.array(z.string()).min(1),
  preset: z.string().default("tiktok-1080p"),
  mode: z.enum(["client", "server"]).default("client"),
});
