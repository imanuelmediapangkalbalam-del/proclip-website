"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import JSZip from "jszip";
import {
  Download,
  Link2,
  Loader2,
  Pause,
  Play,
  Plus,
  Scissors,
  Sparkles,
  Subtitles,
  Trash2,
  Upload,
  ScanFace,
} from "lucide-react";
import type { ClipMarker } from "@/lib/constants";
import {
  detectSilenceGaps,
  exportClips,
  suggestClipsFromSilence,
} from "@/lib/ffmpeg";
import { buildReframeKeyframes } from "@/lib/mediapipe";
import { extractAudioBlobFromVideo, transcribeAudioBlob, type TranscriptSegment } from "@/lib/whisper";
import { useAuthStore, useProjectStore } from "@/lib/store";
import { cn, formatBytes, formatDuration, uid } from "@/lib/utils";

export default function EditorPage() {
  const user = useAuthStore((s) => s.user);
  const upsert = useProjectStore((s) => s.upsert);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [markIn, setMarkIn] = useState(0);
  const [markOut, setMarkOut] = useState(10);
  const [clips, setClips] = useState<ClipMarker[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [projectId] = useState(() => uid("proj"));
  const [title, setTitle] = useState("Untitled project");
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");
  const [suggesting, setSuggesting] = useState(false);
  const [aspectPreview, setAspectPreview] = useState<"16:9" | "9:16">("9:16");
  const [importUrl, setImportUrl] = useState("");
  const [importingUrl, setImportingUrl] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [transcriptStatus, setTranscriptStatus] = useState("");
  const [segments, setSegments] = useState<TranscriptSegment[]>([]);
  const [reframing, setReframing] = useState(false);
  const [reframeMode, setReframeMode] = useState<"face" | "center">("center");

  const selected = useMemo(
    () => clips.find((c) => c.id === selectedId) ?? null,
    [clips, selectedId]
  );

  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  const onDrop = useCallback((accepted: File[]) => {
    const f = accepted[0];
    if (!f) return;
    if (f.size > 2 * 1024 * 1024 * 1024) {
      toast.error("Max 2GB");
      return;
    }
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    const url = URL.createObjectURL(f);
    setFile(f);
    setObjectUrl(url);
    setClips([]);
    setSelectedId(null);
    setTitle(f.name.replace(/\.[^.]+$/, ""));
    toast.success("Video siap di timeline");
  }, [objectUrl]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "video/*": [".mp4", ".mov", ".webm", ".mkv"] },
    multiple: false,
    maxFiles: 1,
  });

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => setCurrent(v.currentTime);
    const onMeta = () => {
      setDuration(v.duration || 0);
      setMarkOut(Math.min(10, v.duration || 10));
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("loadedmetadata", onMeta);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("loadedmetadata", onMeta);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
    };
  }, [objectUrl]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const v = videoRef.current;
      if (!v) return;
      if (e.code === "Space") {
        e.preventDefault();
        if (v.paused) void v.play();
        else v.pause();
      }
      if (e.key === "i" || e.key === "I") setMarkIn(v.currentTime);
      if (e.key === "o" || e.key === "O") setMarkOut(v.currentTime);
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        v.currentTime = Math.max(0, v.currentTime - (e.shiftKey ? 1 / 30 : 1));
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        v.currentTime = Math.min(duration, v.currentTime + (e.shiftKey ? 1 / 30 : 1));
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [duration]);

  function addClip() {
    const inPoint = Math.min(markIn, markOut);
    const outPoint = Math.max(markIn, markOut);
    if (outPoint - inPoint < 0.3) {
      toast.error("Clip minimal 0.3 detik");
      return;
    }
    if (user?.plan === "FREE" && outPoint - inPoint > 120) {
      toast.error("Free plan: max 2 menit per clip");
      return;
    }
    const clip: ClipMarker = {
      id: uid("clip"),
      inPoint: Number(inPoint.toFixed(3)),
      outPoint: Number(outPoint.toFixed(3)),
      label: `Clip ${clips.length + 1}`,
      caption: "",
    };
    setClips((c) => [...c, clip]);
    setSelectedId(clip.id);
    toast.success("Clip ditambahkan");
  }

  function updateSelected(patch: Partial<ClipMarker>) {
    if (!selectedId) return;
    setClips((list) =>
      list.map((c) => (c.id === selectedId ? { ...c, ...patch } : c))
    );
  }

  function removeSelected() {
    if (!selectedId) return;
    setClips((list) => list.filter((c) => c.id !== selectedId));
    setSelectedId(null);
  }

  async function runAutoClip() {
    if (!file || !duration) return;
    setSuggesting(true);
    try {
      let gaps: { start: number; end: number }[] = [];
      try {
        gaps = await detectSilenceGaps(file);
      } catch {
        gaps = [];
      }

      const transcriptText = segments.map((s) => s.text).join(" ");
      const apiRes = await fetch("/api/ai/auto-clip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          duration,
          gaps,
          transcriptText,
          targetLen: 20,
          maxClips: 5,
        }),
      }).catch(() => null);

      let mapped: ClipMarker[] = [];
      if (apiRes?.ok) {
        const data = await apiRes.json();
        mapped = (data.suggestions ?? []).map(
          (s: { inPoint: number; outPoint: number; label: string; reason: string }) => ({
            id: uid("clip"),
            inPoint: s.inPoint,
            outPoint: s.outPoint,
            label: s.label,
            caption: s.reason,
          })
        );
      } else {
        const suggestions = suggestClipsFromSilence(duration, gaps);
        mapped = suggestions.map((s) => ({
          id: uid("clip"),
          inPoint: s.inPoint,
          outPoint: s.outPoint,
          label: s.label,
          caption: s.reason,
        }));
      }

      setClips(mapped);
      setSelectedId(mapped[0]?.id ?? null);
      toast.success(`${mapped.length} saran clip`);
    } catch (err) {
      console.error(err);
      toast.error("Gagal membuat saran clip");
    } finally {
      setSuggesting(false);
    }
  }

  async function runUrlImport() {
    if (!importUrl.trim()) return;
    setImportingUrl(true);
    try {
      const res = await fetch("/api/url-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: importUrl.trim(), title }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Import gagal");
        return;
      }
      toast.message(data.message ?? "URL di-queue");
    } finally {
      setImportingUrl(false);
    }
  }

  async function runTranscript() {
    if (!file) return;
    setTranscribing(true);
    setTranscriptStatus("starting");
    try {
      const audio = await extractAudioBlobFromVideo(file);
      const result = await transcribeAudioBlob(audio, (status, p) => {
        setTranscriptStatus(
          `${status}${typeof p === "number" ? ` ${Math.round(p * 100)}%` : ""}`
        );
      });
      setSegments(result.segments);
      if (!result.segments.length) {
        toast.message("Whisper tidak menghasilkan teks — coba video berbahasa jelas / lebih pendek");
      } else {
        toast.success(`${result.segments.length} segment transcript (${result.provider})`);
        if (selectedId && result.segments[0]) {
          updateSelected({ caption: result.segments.map((s) => s.text).join(" ") });
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Transkripsi gagal");
    } finally {
      setTranscribing(false);
    }
  }

  async function runReframe() {
    const v = videoRef.current;
    if (!v || !duration) return;
    setReframing(true);
    try {
      const result = await buildReframeKeyframes(v, { mode: "face", stepSec: 1 });
      setReframeMode(result.mode);
      setAspectPreview("9:16");
      toast.success(
        result.mode === "face"
          ? `Face track: ${result.keyframes.length} keyframes`
          : "Center crop 9:16 (MediaPipe fallback)"
      );
    } finally {
      setReframing(false);
    }
  }

  function persistMeta(clipCount: number) {
    if (!file) return;
    upsert({
      id: projectId,
      title,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      duration,
      fileName: file.name,
      fileSize: file.size,
      clipCount,
    });
  }

  async function runExport() {
    if (!file || !clips.length) {
      toast.error("Tambahkan minimal 1 clip");
      return;
    }
    setExporting(true);
    setProgress(0);
    try {
      const watermark = user?.plan === "FREE";
      const outputs = await exportClips(
        file,
        clips.map((c) => ({ ...c, watermark })),
        (ratio, label) => {
          setProgress(ratio);
          setProgressLabel(label);
        }
      );
      const zip = new JSZip();
      outputs.forEach((o) => zip.file(o.name, o.blob));
      const blob = await zip.generateAsync({ type: "blob" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${title || "proclip"}-export.zip`;
      a.click();
      URL.revokeObjectURL(a.href);
      persistMeta(clips.length);
      toast.success("Export ZIP siap diunduh");
    } catch (err) {
      console.error(err);
      toast.error("Export gagal — coba file lebih kecil / clip lebih pendek");
    } finally {
      setExporting(false);
      setProgress(0);
      setProgressLabel("");
    }
  }

  const playheadPct = duration ? (current / duration) * 100 : 0;
  const inPct = duration ? (Math.min(markIn, markOut) / duration) * 100 : 0;
  const outPct = duration ? (Math.max(markIn, markOut) / duration) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold">Editor</h1>
          <p className="mt-1 text-sm text-muted">
            Shortcuts: Space play · I/O mark · ←/→ seek · Shift+←/→ frame
          </p>
        </div>
        <input
          className="field max-w-sm"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label="Judul project"
        />
      </div>

      {!file ? (
        <div className="space-y-4">
          <div
            {...getRootProps()}
            className={cn(
              "card flex min-h-[240px] cursor-pointer flex-col items-center justify-center gap-3 border-dashed p-8 text-center",
              isDragActive && "border-accent bg-accent/5"
            )}
          >
            <input {...getInputProps()} />
            <Upload className="h-8 w-8 text-accent" />
            <p className="font-medium">Drop video di sini, atau klik untuk pilih</p>
            <p className="text-sm text-muted">MP4 / MOV / WEBM · max 2GB · FFmpeg.wasm lokal</p>
          </div>
          <div className="card p-4">
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <Link2 className="h-4 w-4 text-accent" />
              Atau paste URL (YouTube/TikTok/…)
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                className="field"
                placeholder="https://..."
                value={importUrl}
                onChange={(e) => setImportUrl(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-soft"
                disabled={importingUrl || !importUrl.trim()}
                onClick={() => void runUrlImport()}
              >
                {importingUrl ? <Loader2 className="h-4 w-4 animate-spin" /> : "Import URL"}
              </button>
            </div>
            <p className="mt-2 text-xs text-muted">
              Butuh Upstash + yt-dlp worker. Tanpa itu, job di-queue sebagai PENDING_WORKER.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
          <div className="space-y-4">
            <div
              className={cn(
                "card overflow-hidden bg-black",
                aspectPreview === "9:16" ? "mx-auto max-w-sm" : "w-full"
              )}
            >
              <div
                className={cn(
                  "relative mx-auto bg-black",
                  aspectPreview === "9:16" ? "aspect-[9/16]" : "aspect-video"
                )}
              >
                <video
                  ref={videoRef}
                  src={objectUrl ?? undefined}
                  className={cn(
                    "h-full w-full",
                    aspectPreview === "9:16" ? "object-cover" : "object-contain"
                  )}
                  playsInline
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className="btn btn-soft"
                onClick={() => {
                  const v = videoRef.current;
                  if (!v) return;
                  if (v.paused) void v.play();
                  else v.pause();
                }}
              >
                {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {playing ? "Pause" : "Play"}
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => setMarkIn(current)}>
                Mark In (I)
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => setMarkOut(current)}>
                Mark Out (O)
              </button>
              <button type="button" className="btn btn-accent" onClick={addClip}>
                <Plus className="h-4 w-4" />
                Add clip
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() =>
                  setAspectPreview((a) => (a === "9:16" ? "16:9" : "9:16"))
                }
              >
                Preview {aspectPreview}
              </button>
              <span className="ml-auto text-sm text-muted">
                {formatDuration(current)} / {formatDuration(duration)} ·{" "}
                {file ? formatBytes(file.size) : ""}
              </span>
            </div>

            <div className="card p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
                Timeline
              </p>
              <div
                className="relative h-16 cursor-pointer rounded-lg bg-bg-soft"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const ratio = (e.clientX - rect.left) / rect.width;
                  const t = ratio * duration;
                  if (videoRef.current) videoRef.current.currentTime = t;
                }}
              >
                <div
                  className="absolute inset-y-2 rounded bg-accent/25"
                  style={{ left: `${inPct}%`, width: `${Math.max(outPct - inPct, 0.5)}%` }}
                />
                {clips.map((c) => {
                  const left = duration ? (c.inPoint / duration) * 100 : 0;
                  const width = duration
                    ? ((c.outPoint - c.inPoint) / duration) * 100
                    : 0;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      className={cn(
                        "absolute top-1 h-6 rounded px-1 text-[10px] font-medium",
                        selectedId === c.id
                          ? "bg-accent text-bg"
                          : "bg-sky-500/70 text-white"
                      )}
                      style={{ left: `${left}%`, width: `${Math.max(width, 1.5)}%` }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedId(c.id);
                        setMarkIn(c.inPoint);
                        setMarkOut(c.outPoint);
                        if (videoRef.current) videoRef.current.currentTime = c.inPoint;
                      }}
                    >
                      {c.label}
                    </button>
                  );
                })}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-white"
                  style={{ left: `${playheadPct}%` }}
                />
              </div>
              <div className="mt-3 flex justify-between text-xs text-muted">
                <span>In {formatDuration(Math.min(markIn, markOut))}</span>
                <span>Out {formatDuration(Math.max(markIn, markOut))}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="card p-4">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="btn btn-soft"
                  disabled={suggesting || !file}
                  onClick={() => void runAutoClip()}
                >
                  {suggesting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  Auto-clip
                </button>
                <button
                  type="button"
                  className="btn btn-soft"
                  disabled={transcribing || !file}
                  onClick={() => void runTranscript()}
                >
                  {transcribing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Subtitles className="h-4 w-4" />
                  )}
                  Transcript
                </button>
                <button
                  type="button"
                  className="btn btn-soft"
                  disabled={reframing || !file}
                  onClick={() => void runReframe()}
                >
                  {reframing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ScanFace className="h-4 w-4" />
                  )}
                  Reframe {reframeMode}
                </button>
                <button
                  type="button"
                  className="btn btn-accent"
                  disabled={exporting || !clips.length}
                  onClick={() => void runExport()}
                >
                  {exporting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  Export ZIP
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => {
                    persistMeta(clips.length);
                    toast.success("Project disimpan lokal");
                  }}
                >
                  Save
                </button>
              </div>
              {transcribing && (
                <p className="mt-2 text-xs text-muted">Whisper: {transcriptStatus}</p>
              )}
              {!!segments.length && (
                <div className="mt-3 max-h-28 overflow-y-auto rounded-lg border border-line bg-bg-soft p-2 text-xs text-muted">
                  {segments.slice(0, 12).map((s, i) => (
                    <p key={`${s.start}-${i}`}>
                      [{formatDuration(s.start)}] {s.text}
                    </p>
                  ))}
                </div>
              )}
              {exporting && (
                <div className="mt-4">
                  <div className="mb-1 flex justify-between text-xs text-muted">
                    <span>{progressLabel}</span>
                    <span>{Math.round(progress * 100)}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded bg-bg-soft">
                    <div
                      className="h-full bg-accent transition-all"
                      style={{ width: `${progress * 100}%` }}
                    />
                  </div>
                </div>
              )}
              <p className="mt-3 text-xs text-muted">
                Free plan menambahkan watermark &quot;ProClip&quot;. Upgrade Pro di Billing.
              </p>
            </div>

            <div className="card p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold">Clips ({clips.length})</p>
                <Scissors className="h-4 w-4 text-muted" />
              </div>
              {!clips.length ? (
                <p className="text-sm text-muted">Belum ada clip. Mark In/Out lalu Add.</p>
              ) : (
                <ul className="max-h-56 space-y-2 overflow-y-auto">
                  {clips.map((c) => (
                    <li key={c.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedId(c.id);
                          setMarkIn(c.inPoint);
                          setMarkOut(c.outPoint);
                          if (videoRef.current) videoRef.current.currentTime = c.inPoint;
                        }}
                        className={cn(
                          "w-full rounded-lg border px-3 py-2 text-left text-sm",
                          selectedId === c.id
                            ? "border-accent bg-accent/10"
                            : "border-line bg-bg-soft"
                        )}
                      >
                        <span className="font-medium">{c.label}</span>
                        <span className="mt-0.5 block text-xs text-muted">
                          {formatDuration(c.inPoint)} – {formatDuration(c.outPoint)}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {selected && (
              <div className="card space-y-3 p-4">
                <p className="text-sm font-semibold">Caption / detail</p>
                <label className="block text-xs text-muted">
                  Label
                  <input
                    className="field mt-1"
                    value={selected.label}
                    onChange={(e) => updateSelected({ label: e.target.value })}
                  />
                </label>
                <label className="block text-xs text-muted">
                  Caption
                  <textarea
                    className="field mt-1 min-h-24"
                    value={selected.caption}
                    onChange={(e) => updateSelected({ caption: e.target.value })}
                    placeholder="Tulis caption untuk Shorts/Reels..."
                  />
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="block text-xs text-muted">
                    In (detik)
                    <input
                      className="field mt-1"
                      type="number"
                      step="0.01"
                      value={selected.inPoint}
                      onChange={(e) =>
                        updateSelected({ inPoint: Number(e.target.value) })
                      }
                    />
                  </label>
                  <label className="block text-xs text-muted">
                    Out (detik)
                    <input
                      className="field mt-1"
                      type="number"
                      step="0.01"
                      value={selected.outPoint}
                      onChange={(e) =>
                        updateSelected({ outPoint: Number(e.target.value) })
                      }
                    />
                  </label>
                </div>
                <button type="button" className="btn btn-ghost w-full" onClick={removeSelected}>
                  <Trash2 className="h-4 w-4" />
                  Hapus clip
                </button>
              </div>
            )}

            <div
              {...getRootProps()}
              className="card cursor-pointer border-dashed p-4 text-center text-sm text-muted"
            >
              <input {...getInputProps()} />
              Ganti video (drop file baru)
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
