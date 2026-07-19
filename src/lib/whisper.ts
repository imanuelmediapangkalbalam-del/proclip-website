"use client";

export type TranscriptSegment = {
  start: number;
  end: number;
  text: string;
  words?: { word: string; start: number; end: number; confidence?: number }[];
};

export type TranscriptResult = {
  language: string;
  segments: TranscriptSegment[];
  provider: "whisper-tiny" | "fallback";
};

/**
 * Client-side transcription via Transformers.js (Whisper tiny).
 * Falls back to empty segments if model download fails / low memory.
 */
export async function transcribeAudioBlob(
  audioBlob: Blob,
  onProgress?: (status: string, progress?: number) => void
): Promise<TranscriptResult> {
  try {
    onProgress?.("loading-model", 0);
    const { pipeline } = await import("@xenova/transformers");
    const transcriber = await pipeline(
      "automatic-speech-recognition",
      "Xenova/whisper-tiny",
      {
        progress_callback: (p: { status?: string; progress?: number }) => {
          onProgress?.(p.status ?? "loading", p.progress);
        },
      }
    );

    onProgress?.("transcribing", 0.5);
    const url = URL.createObjectURL(audioBlob);
    try {
      const result = (await transcriber(url, {
        language: "indonesian",
        return_timestamps: true,
        chunk_length_s: 30,
        stride_length_s: 5,
      })) as {
        text?: string;
        chunks?: { text: string; timestamp: [number, number | null] }[];
      };

      const segments: TranscriptSegment[] =
        result.chunks?.map((c) => ({
          start: c.timestamp?.[0] ?? 0,
          end: c.timestamp?.[1] ?? (c.timestamp?.[0] ?? 0) + 2,
          text: c.text?.trim() ?? "",
        })) ??
        (result.text
          ? [{ start: 0, end: 5, text: result.text.trim() }]
          : []);

      return { language: "id", segments, provider: "whisper-tiny" };
    } finally {
      URL.revokeObjectURL(url);
    }
  } catch (err) {
    console.warn("Whisper WASM failed", err);
    onProgress?.("fallback", 1);
    return {
      language: "id",
      segments: [],
      provider: "fallback",
    };
  }
}

export async function extractAudioBlobFromVideo(file: File): Promise<Blob> {
  // Prefer original file — Whisper/transformers can decode many containers.
  // For stubborn codecs, editor can pass a wav extracted via FFmpeg.
  return file;
}
