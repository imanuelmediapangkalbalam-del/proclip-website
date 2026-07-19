"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProjectMeta, SessionUser } from "@/lib/constants";
import { uid } from "@/lib/utils";

type AuthState = {
  user: SessionUser | null;
  login: (email: string, name?: string) => void;
  logout: () => void;
  setPlan: (plan: "FREE" | "PRO") => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: (email, name) =>
        set({
          user: {
            id: uid("user"),
            email,
            name: name || email.split("@")[0],
            plan: "FREE",
            credits: 100,
          },
        }),
      logout: () => set({ user: null }),
      setPlan: (plan) =>
        set((s) =>
          s.user
            ? {
                user: {
                  ...s.user,
                  plan,
                  credits: plan === "PRO" ? 2000 : 100,
                },
              }
            : s
        ),
    }),
    { name: "proclip-auth" }
  )
);

type ProjectState = {
  projects: ProjectMeta[];
  upsert: (p: ProjectMeta) => void;
  remove: (id: string) => void;
  rename: (id: string, title: string) => void;
};

export const useProjectStore = create<ProjectState>()(
  persist(
    (set) => ({
      projects: [],
      upsert: (p) =>
        set((s) => {
          const exists = s.projects.some((x) => x.id === p.id);
          return {
            projects: exists
              ? s.projects.map((x) => (x.id === p.id ? p : x))
              : [p, ...s.projects],
          };
        }),
      remove: (id) =>
        set((s) => ({ projects: s.projects.filter((p) => p.id !== id) })),
      rename: (id, title) =>
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === id ? { ...p, title, updatedAt: new Date().toISOString() } : p
          ),
        })),
    }),
    { name: "proclip-projects" }
  )
);
