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
  if (activeApp === "vk") return <UrlSearchApp systemId="vk" />;
  if (activeApp === "facebook") return <UrlSearchApp systemId="facebook" />;
  if (activeApp === "yandex") return <UrlSearchApp systemId="yandex" />;
  if (activeApp === "bing") return <UrlSearchApp systemId="bing" />;
  if (activeApp === "ddg") return <UrlSearchApp systemId="ddg" />;
  if (activeApp === "zarplata") return <UrlSearchApp systemId="zarplata" />;
  if (activeApp === "rabota") return <UrlSearchApp systemId="rabota" />;
  if (activeApp === "habrfreelance") return <UrlSearchApp systemId="habrfreelance" />;
  if (activeApp === "flru") return <UrlSearchApp systemId="flru" />;
  if (activeApp === "hackerrank") return <UrlSearchApp systemId="hackerrank" />;
  if (activeApp === "codewars") return <UrlSearchApp systemId="codewars" />;
  if (activeApp === "sourcegraph") return <UrlSearchApp systemId="sourcegraph" />;
  if (activeApp === "grepapp") return <UrlSearchApp systemId="grepapp" />;
  if (activeApp === "lobsters") return <UrlSearchApp systemId="lobsters" />;
  if (activeApp === "dreamjob") return <UrlSearchApp systemId="dreamjob" />;
  return <Launcher />;
}
