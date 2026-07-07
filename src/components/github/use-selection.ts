"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  Candidate,
  useSelectionStore,
} from "./selection-store";
import { useSearchStore } from "./store";

/**
 * Hook that exposes helpers to add/remove GitHub users from the recruiter
 * selection (shortlist). Adding fetches the full user profile (bio, location,
 * company, email, followers) so the export to «ХАНТ» is rich.
 */
export function useSelectionActions() {
  const {
    addCandidate,
    removeCandidate,
    hasCandidate,
    candidates,
  } = useSelectionStore();
  const githubToken = useSearchStore((s) => s.githubToken);
  const [loadingLogin, setLoadingLogin] = React.useState<string | null>(null);

  const fetchProfile = React.useCallback(
    async (login: string): Promise<Partial<Candidate> | null> => {
      try {
        const headers: Record<string, string> = {};
        if (githubToken) headers["x-github-token"] = githubToken;
        const res = await fetch(
          `/api/github/user?login=${encodeURIComponent(login)}`,
          { headers }
        );
        if (!res.ok) return null;
        return await res.json();
      } catch {
        return null;
      }
    },
    [githubToken]
  );

  const addToSelection = React.useCallback(
    async (item: any) => {
      const login = item.login;
      if (!login) return;
      if (hasCandidate(login)) {
        toast.info(`${login} уже в выборке`);
        return;
      }
      setLoadingLogin(login);
      // Build a base candidate from search-result fields, then enrich.
      const base: Candidate = {
        login,
        id: item.id,
        avatar_url: item.avatar_url,
        html_url: item.html_url,
        type: item.type,
        name: item.name || null,
        bio: item.bio || null,
        company: item.company || null,
        blog: item.blog || null,
        location: item.location || null,
        email: item.email || null,
        twitter_username: item.twitter_username || null,
        public_repos: item.public_repos,
        followers: item.followers,
        following: item.following,
        public_gists: item.public_gists,
        created_at: item.created_at,
        updated_at: item.updated_at,
        status: "new",
        note: "",
        tags: [],
        addedAt: Date.now(),
        enriched: false,
      };

      addCandidate(base);

      // Enrich with full profile (the search-users endpoint omits bio/company/email).
      const profile = await fetchProfile(login);
      if (profile) {
        useSelectionStore.getState().updateCandidate(login, {
          name: profile.name ?? base.name,
          bio: profile.bio ?? base.bio,
          company: profile.company ?? base.company,
          blog: profile.blog ?? base.blog,
          location: profile.location ?? base.location,
          email: profile.email ?? base.email,
          twitter_username: profile.twitter_username ?? base.twitter_username,
          public_repos: profile.public_repos ?? base.public_repos,
          followers: profile.followers ?? base.followers,
          following: profile.following ?? base.following,
          public_gists: profile.public_gists ?? base.public_gists,
          created_at: profile.created_at ?? base.created_at,
          updated_at: profile.updated_at ?? base.updated_at,
          enriched: true,
        });
      }
      setLoadingLogin(null);
      toast.success(`${login} добавлен в выборку`, {
        description: profile ? "Профиль обогащён данными" : "Базовые данные",
      });
    },
    [addCandidate, hasCandidate, fetchProfile]
  );

  const removeFromSelection = React.useCallback(
    (login: string) => {
      removeCandidate(login);
      toast.message(`${login} удалён из выборки`);
    },
    [removeCandidate]
  );

  return {
    addToSelection,
    removeFromSelection,
    hasCandidate,
    count: candidates.length,
    loadingLogin,
  };
}
