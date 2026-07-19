"use client";

import Link from "next/link";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { useProjectStore } from "@/lib/store";
import { formatBytes, formatDuration } from "@/lib/utils";

export default function ProjectsPage() {
  const projects = useProjectStore((s) => s.projects);
  const remove = useProjectStore((s) => s.remove);

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold">Projects</h1>
          <p className="mt-1 text-muted">Disimpan di localStorage browser.</p>
        </div>
        <Link href="/app/editor/" className="btn btn-accent">
          New project
        </Link>
      </div>

      {!projects.length ? (
        <div className="card mt-8 p-10 text-center text-muted">
          Belum ada project.
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl border border-line">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-bg-elevated text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">File</th>
                <th className="px-4 py-3 font-medium">Duration</th>
                <th className="px-4 py-3 font-medium">Clips</th>
                <th className="px-4 py-3 font-medium">Updated</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id} className="border-t border-line">
                  <td className="px-4 py-3">
                    <Link href="/app/editor/" className="font-medium hover:text-accent">
                      {p.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {p.fileName}
                    <span className="block text-xs">{formatBytes(p.fileSize)}</span>
                  </td>
                  <td className="px-4 py-3">{formatDuration(p.duration)}</td>
                  <td className="px-4 py-3">{p.clipCount}</td>
                  <td className="px-4 py-3 text-muted">
                    {new Date(p.updatedAt).toLocaleString("id-ID")}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={() => {
                        remove(p.id);
                        toast.success("Project dihapus");
                      }}
                      aria-label="Hapus"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
