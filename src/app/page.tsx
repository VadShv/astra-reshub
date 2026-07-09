"use client";

import { useUIStore } from "@/components/github/ui-store";
import { Launcher } from "@/components/launcher/launcher";
import { GitFindApp } from "@/components/github/gitfind-app";
import { LinkedInApp } from "@/components/linkedin/linkedin-app";

export default function Home() {
  const activeApp = useUIStore((s) => s.activeApp);

  if (activeApp === "gitfind") return <GitFindApp />;
  if (activeApp === "linkedin") return <LinkedInApp />;
  return <Launcher />;
}
