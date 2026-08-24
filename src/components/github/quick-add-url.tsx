"use client";

import * as React from "react";
import { UserPlus, Loader2 } from "lucide-react";
import { useSelectionStore, Candidate } from "./selection-store";
import { toast } from "sonner";

function detectPlatform(url: string): { platform: string; login?: string } {
  const u = url.trim();
  if (u.includes("github.com/")) {
    const parts = u.split("github.com/")[1].split(/[/?#]/);
    const login = parts[0];
    return { platform: "github", login };
  }
  if (u.includes("linkedin.com/in/")) {
    const parts = u.split("linkedin.com/in/")[1].split(/[/?#]/);
    return { platform: "linkedin", login: parts[0] };
  }
  if (u.includes("habr.com/users/")) {
    const parts = u.split("habr.com/users/")[1].split(/[/?#]/);
    return { platform: "habr", login: parts[0] };
  }
  if (u.includes("vk.com/")) {
    const parts = u.split("vk.com/")[1].split(/[/?#]/);
    return { platform: "vk", login: parts[0] };
  }
  if (u.includes("hh.ru/resume/")) {
    return { platform: "hh" };
  }
  return { platform: "unknown" };
}

export function QuickAddFromUrl() {
  const addCandidate = useSelectionStore((s) => s.addCandidate);
  const hasCandidate = useSelectionStore((s) => s.hasCandidate);
  const [url, setUrl] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function handleAdd() {
    const trimmed = url.trim();
    if (!trimmed) return;
    const { platform, login } = detectPlatform(trimmed);

    if (platform === "github" && login) {
      if (hasCandidate(login)) {
        toast.warning(`${login} уже в выборке`);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/github/user?login=${encodeURIComponent(login)}`);
        if (res.ok) {
          const profile = await res.json();
          const c: Candidate = {
            login: profile.login || login,
            id: profile.id || 0,
            avatar_url: profile.avatar_url || "",
            html_url: profile.html_url || trimmed,
            name: profile.name,
            bio: profile.bio,
            company: profile.company,
            blog: profile.blog,
            location: profile.location,
            email: profile.email,
            twitter_username: profile.twitter_username,
            public_repos: profile.public_repos,
            followers: profile.followers,
            following: profile.following,
            created_at: profile.created_at,
            status: "new",
            tags: ["github"],
            addedAt: Date.now(),
            enriched: true,
          };
          addCandidate(c);
          toast.success(`${c.name || c.login} добавлен из GitHub`);
          setUrl("");
        } else {
          throw new Error("GitHub API error");
        }
      } catch {
        toast.error("Не удалось получить профиль GitHub. Добавлен вручную.");
        addManual(platform, login, trimmed);
      } finally {
        setLoading(false);
      }
    } else {
      addManual(platform, login, trimmed);
    }
  }

  function addManual(platform: string, login: string | undefined, fullUrl: string) {
    const syntheticLogin = login || `${platform}_${Date.now().toString(36)}`;
    if (hasCandidate(syntheticLogin)) {
      toast.warning("Уже в выборке");
      return;
    }
    const c: Candidate = {
      login: syntheticLogin,
      id: Date.now(),
      avatar_url: "",
      html_url: fullUrl,
      status: "new",
      tags: [platform],
      addedAt: Date.now(),
      enriched: false,
    };
    addCandidate(c);
    toast.success("Кандидат добавлен");
    setUrl("");
  }

  return (
    <div className="flex gap-2">
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        placeholder="Вставьте URL профиля (GitHub, LinkedIn, Хабр, VK)..."
        className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <button
        onClick={handleAdd}
        disabled={loading || !url.trim()}
        className="inline-flex items-center gap-1.5 rounded-lg bg-primary text-primary-foreground px-3 py-2 text-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
        Добавить
      </button>
    </div>
  );
}
