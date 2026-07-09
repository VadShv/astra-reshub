"use client";

import { useUIStore } from "@/components/github/ui-store";
import { Launcher } from "@/components/launcher/launcher";
import { GitFindApp } from "@/components/github/gitfind-app";
import { LinkedInApp } from "@/components/linkedin/linkedin-app";
import { UrlSearchApp } from "@/components/search/url-search-app";

export default function Home() {
  const activeApp = useUIStore((s) => s.activeApp);

  if (activeApp === "gitfind") return <GitFindApp />;
  if (activeApp === "linkedin") return <LinkedInApp />;
  if (activeApp === "cse") return <UrlSearchApp systemId="cse" />;
  if (activeApp === "lor") return <UrlSearchApp systemId="lor" />;
  if (activeApp === "habr") return <UrlSearchApp systemId="habr" />;
  if (activeApp === "stackoverflow") return <UrlSearchApp systemId="stackoverflow" />;
  return <Launcher />;
}
