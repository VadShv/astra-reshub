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
  // URL-based search systems rendered by the shared <UrlSearchApp>.
  if (activeApp === "cse") return <UrlSearchApp systemId="cse" />;
  if (activeApp === "lor") return <UrlSearchApp systemId="lor" />;
  if (activeApp === "habr") return <UrlSearchApp systemId="habr" />;
  if (activeApp === "stackoverflow") return <UrlSearchApp systemId="stackoverflow" />;
  if (activeApp === "hh") return <UrlSearchApp systemId="hh" />;
  if (activeApp === "superjob") return <UrlSearchApp systemId="superjob" />;
  if (activeApp === "opennet") return <UrlSearchApp systemId="opennet" />;
  if (activeApp === "vc") return <UrlSearchApp systemId="vc" />;
  if (activeApp === "habrqa") return <UrlSearchApp systemId="habrqa" />;
  if (activeApp === "ruso") return <UrlSearchApp systemId="ruso" />;
  if (activeApp === "ubuntu") return <UrlSearchApp systemId="ubuntu" />;
  if (activeApp === "telegram") return <UrlSearchApp systemId="telegram" />;
  if (activeApp === "gitlab") return <UrlSearchApp systemId="gitlab" />;
  if (activeApp === "codeforces") return <UrlSearchApp systemId="codeforces" />;
  if (activeApp === "reddit") return <UrlSearchApp systemId="reddit" />;
  if (activeApp === "devto") return <UrlSearchApp systemId="devto" />;
  if (activeApp === "sourcehut") return <UrlSearchApp systemId="sourcehut" />;
  if (activeApp === "hackersnews") return <UrlSearchApp systemId="hackersnews" />;
  if (activeApp === "bitbucket") return <UrlSearchApp systemId="bitbucket" />;
  if (activeApp === "kaggle") return <UrlSearchApp systemId="kaggle" />;
  if (activeApp === "dockerhub") return <UrlSearchApp systemId="dockerhub" />;
  if (activeApp === "gopkg") return <UrlSearchApp systemId="gopkg" />;
  if (activeApp === "crates") return <UrlSearchApp systemId="crates" />;
  if (activeApp === "pypi") return <UrlSearchApp systemId="pypi" />;
  if (activeApp === "codeberg") return <UrlSearchApp systemId="codeberg" />;
  if (activeApp === "leetcode") return <UrlSearchApp systemId="leetcode" />;
  if (activeApp === "medium") return <UrlSearchApp systemId="medium" />;
  return <Launcher />;
}
