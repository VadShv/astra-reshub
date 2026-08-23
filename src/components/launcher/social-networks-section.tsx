"use client";

import * as React from "react";
import { Share2, ExternalLink, Search, Globe } from "lucide-react";
import { CollapsibleSection } from "./collapsible-section";

interface SocialNetwork {
  id: string;
  name: string;
  description: string;
  url: string;
  searchUrl?: string;
  xraySite?: string;
  accent: string;
  category: "russian" | "international" | "professional";
}

const NETWORKS: SocialNetwork[] = [
  // Russian
  {
    id: "sn-pikabu",
    name: "Pikabu",
    description: "Русскоязычное социальное новостное сообщество. Есть IT-раздел с обсуждениями про C++, Go, Linux, базы данных.",
    url: "https://pikabu.ru",
    searchUrl: "https://pikabu.ru/search?q=",
    accent: "from-green-500 to-emerald-600",
    category: "russian",
  },
  {
    id: "sn-d3",
    name: "D3.ru",
    description: "Русскоязычная социальная новостная платформа. Обсуждения IT, программирования, системного ПО.",
    url: "https://d3.ru",
    searchUrl: "https://d3.ru/search?q=",
    accent: "from-orange-500 to-amber-600",
    category: "russian",
  },
  // International
  {
    id: "sn-twitter",
    name: "X / Twitter",
    description: "Крупнейшее англоязычное dev-сообщество. BIOS с tech-ключевыми словами, обсуждения, треды. X-ray через Google.",
    url: "https://x.com",
    searchUrl: "https://x.com/search?q=",
    xraySite: "x.com OR twitter.com",
    accent: "from-slate-700 to-gray-900",
    category: "international",
  },
  {
    id: "sn-instagram",
    name: "Instagram",
    description: "Некоторые разработчики ведут профили с tech-контентом. Google x-ray поиск по site:instagram.com.",
    url: "https://www.instagram.com",
    xraySite: "instagram.com",
    accent: "from-pink-500 to-purple-600",
    category: "international",
  },
  {
    id: "sn-youtube",
    name: "YouTube",
    description: "Tech-каналы: C++, Go, Rust, Linux kernel, базы данных. Авторы каналов — опытные инженеры.",
    url: "https://www.youtube.com",
    searchUrl: "https://www.youtube.com/results?search_query=",
    accent: "from-red-500 to-rose-600",
    category: "international",
  },
  {
    id: "sn-twitch",
    name: "Twitch",
    description: "Стримы программирования: coding sessions на C++, Go, Rust, Python. Стримеры — практикующие разработчики.",
    url: "https://www.twitch.tv",
    searchUrl: "https://www.twitch.tv/search?term=",
    accent: "from-purple-500 to-violet-600",
    category: "international",
  },
  {
    id: "sn-tiktok",
    name: "TikTok",
    description: "Растущий tech-контент: короткие видео про программирование, Linux, базы данных. Google x-ray поиск.",
    url: "https://www.tiktok.com",
    searchUrl: "https://www.tiktok.com/search?q=",
    xraySite: "tiktok.com",
    accent: "from-slate-600 to-gray-800",
    category: "international",
  },
  {
    id: "sn-mastodon",
    name: "Mastodon",
    description: "Децентрализованная соцсеть. Tech-инстансы (fosstodon.org, hachyderm.io) с активными разработчиками. X-ray через Google.",
    url: "https://mastodon.social",
    searchUrl: "https://mastodon.social/search?tag=",
    xraySite: "mastodon.social OR fosstodon.org",
    accent: "from-indigo-500 to-purple-600",
    category: "international",
  },
  {
    id: "sn-bluesky",
    name: "Bluesky",
    description: "Растущая децентрализованная соцсеть. Растущее dev-сообщество, профили с tech-био.",
    url: "https://bsky.app",
    searchUrl: "https://bsky.app/search?q=",
    accent: "from-sky-500 to-blue-600",
    category: "international",
  },
  {
    id: "sn-threads",
    name: "Threads",
    description: "Соцсеть от Meta. Профили разработчиков, tech-обсуждения. Google x-ray поиск.",
    url: "https://www.threads.net",
    xraySite: "threads.net",
    accent: "from-slate-700 to-gray-900",
    category: "international",
  },
  {
    id: "sn-discord",
    name: "Discord",
    description: "Dev-сообщества и серверы по C++, Go, Rust, Python. Поиск серверов через Disboard + Google x-ray.",
    url: "https://discord.com",
    searchUrl: "https://disboard.org/search?keyword=",
    xraySite: "discord.com OR discord.gg",
    accent: "from-indigo-500 to-blue-600",
    category: "international",
  },
  // Professional
  {
    id: "sn-wellfound",
    name: "Wellfound (AngelList)",
    description: "Платформа стартапов: профили разработчиков, вакансии. Системные разработчики в стартапах.",
    url: "https://wellfound.com",
    searchUrl: "https://wellfound.com/role/r/developer",
    accent: "from-black to-gray-800",
    category: "professional",
  },
  {
    id: "sn-stackshare",
    name: "StackShare",
    description: "Платформа для обмена tech-стеками. Профили компаний и инженеров с указанием технологий.",
    url: "https://stackshare.io",
    searchUrl: "https://stackshare.io/search?q=",
    accent: "from-teal-500 to-cyan-600",
    category: "professional",
  },
];

const CATEGORY_LABELS: Record<string, string> = {
  russian: "Российские",
  international: "Международные",
  professional: "Профессиональные",
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  russian: <Globe className="h-4 w-4" />,
  international: <Globe className="h-4 w-4" />,
  professional: <Share2 className="h-4 w-4" />,
};

function buildXrayUrl(xraySite: string): string {
  return `https://www.google.com/search?q=site:${xraySite}+%22C%2B%2B+developer%22`;
}

export function SocialNetworksSection() {
  const categories = ["russian", "international", "professional"];

  return (
    <CollapsibleSection
      icon={<Share2 className="h-5 w-5" />}
      iconAccent="from-purple-500 to-pink-600"
      title="Социальные сети"
      subtitle="Поиск разработчиков в соцсетях"
      count={NETWORKS.length}
    >
      <div className="space-y-4">
        {categories.map((cat) => {
          const items = NETWORKS.filter((n) => n.category === cat);
          if (items.length === 0) return null;
          return (
            <div key={cat}>
              <div className="flex items-center gap-2 mb-2">
                {CATEGORY_ICONS[cat]}
                <span className="text-sm font-semibold text-muted-foreground">
                  {CATEGORY_LABELS[cat]}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({items.length})
                </span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {items.map((net) => (
                  <div
                    key={net.id}
                    className="rounded-lg border bg-card p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="font-semibold text-sm">{net.name}</span>
                      <div
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gradient-to-br ${net.accent} text-white`}
                      >
                        <Globe className="h-3.5 w-3.5" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                      {net.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <a
                        href={net.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-md border bg-background px-2 py-1 text-xs hover:bg-muted transition-colors"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Открыть
                      </a>
                      {net.searchUrl && (
                        <a
                          href={`${net.searchUrl}${encodeURIComponent("C++ developer")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-md border bg-background px-2 py-1 text-xs hover:bg-muted transition-colors"
                        >
                          <Search className="h-3 w-3" />
                          Поиск
                        </a>
                      )}
                      {net.xraySite && (
                        <a
                          href={buildXrayUrl(net.xraySite)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-md border bg-background px-2 py-1 text-xs hover:bg-muted transition-colors"
                        >
                          <Search className="h-3 w-3" />
                          Google x-ray
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </CollapsibleSection>
  );
}
