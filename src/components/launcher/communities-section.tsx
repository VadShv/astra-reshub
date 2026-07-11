"use client";

import * as React from "react";
import {
  Users,
  ExternalLink,
  Terminal,
  Database,
  HardDrive,
  Layers,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useResearchStore } from "./research-store";

interface CommunityLink {
  title: string;
  url: string;
  description: string;
  searchUrl?: string; // optional search URL pattern for the forum
}

interface CommunityGroup {
  id: string;
  title: string;
  icon: React.ReactNode;
  accent: string;
  blurb: string;
  links: CommunityLink[];
}

const GROUPS: CommunityGroup[] = [
  {
    id: "linux",
    title: "Linux / Ядро / ОС",
    icon: <Terminal className="h-5 w-5" />,
    accent: "from-amber-500 to-yellow-600",
    blurb: "Форумы и списки рассылки по Linux-дистрибутивам и ядру",
    links: [
      { title: "Linux.org.ru", url: "https://www.linux.org.ru/", description: "Крупнейший RU-форум по Linux (есть в системах)", searchUrl: "https://www.linux.org.ru/search?q=" },
      { title: "Ubuntu.ru форум", url: "https://forum.ubuntu.ru/", description: "RU-сообщество Ubuntu (есть в системах)", searchUrl: "https://forum.ubuntu.ru/index.php?action=search&keywords=" },
      { title: "Arch Linux (RU)", url: "https://bbs.archlinux.org.ru/", description: "Русскоязычный форум Arch Linux", searchUrl: "https://bbs.archlinux.org.ru/search.php?q=" },
      { title: "ALT Linux форум", url: "https://forum.altlinux.org/", description: "Отечественный дистрибутив, гос-сектор", searchUrl: "https://forum.altlinux.org/search?q=" },
      { title: "Gentoo forums", url: "https://forums.gentoo.org/", description: "Источник-дистрибутив, системные инженеры", searchUrl: "https://forums.gentoo.org/search.php?search_keywords=" },
      { title: "openSUSE forum", url: "https://forum.opensuse.org/", description: "Корпоративный SUSE, системное ПО", searchUrl: "https://forum.opensuse.org/search?q=" },
      { title: "LKML (lore.kernel.org)", url: "https://lore.kernel.org/lkml/", description: "Список рассылки ядра Linux — патчи, драйверы", searchUrl: "https://lore.kernel.org/lkml/?q=" },
      { title: "OpenNET", url: "https://www.opennet.ru/", description: "UNIX/Linux портал (есть в системах)", searchUrl: "https://www.opennet.ru/search.cgi?sctxt=" },
    ],
  },
  {
    id: "dbms",
    title: "СУБД",
    icon: <Database className="h-5 w-5" />,
    accent: "from-emerald-500 to-teal-600",
    blurb: "Списки рассылки и форумы по базам данных",
    links: [
      { title: "Postgres Pro", url: "https://postgrespro.ru/list", description: "Списки рассылки Postgres Pro (RU)", searchUrl: "https://postgrespro.ru/list" },
      { title: "PostgreSQL.org (community)", url: "https://www.postgresql.org/community/", description: "Международное сообщество + рус. список", searchUrl: "https://www.postgresql.org/search/?q=" },
      { title: "pgsql-ru-general", url: "https://www.postgresql.org/list/pgsql-ru-general/", description: "Русскоязычный список рассылки PostgreSQL", searchUrl: "https://www.postgresql.org/list/pgsql-ru-general/" },
      { title: "ClickHouse GitHub", url: "https://github.com/ClickHouse/ClickHouse/discussions", description: "Discussions по ClickHouse — column-store СУБД", searchUrl: "https://github.com/ClickHouse/ClickHouse/discussions?discussions_q=" },
      { title: "Percona forum", url: "https://forums.percona.com/", description: "MySQL, PostgreSQL, MongoDB — DBA-форум", searchUrl: "https://forums.percona.com/search?q=" },
      { title: "DBA StackExchange", url: "https://dba.stackexchange.com/", description: "Q&A для DBA и администраторов БД", searchUrl: "https://dba.stackexchange.com/search?q=" },
      { title: "Redis community", url: "https://redis.io/community/", description: "Сообщество Redis — in-memory СУБД", searchUrl: "https://redis.io/community/" },
    ],
  },
  {
    id: "storage",
    title: "СХД / Хранение",
    icon: <HardDrive className="h-5 w-5" />,
    accent: "from-cyan-500 to-blue-600",
    blurb: "Сообщества по системам хранения данных и файловым системам",
    links: [
      { title: "Ceph community", url: "https://ceph.io/community/", description: "Сообщество Ceph — распределённое хранение", searchUrl: "https://ceph.io/community/" },
      { title: "Ceph mailing lists", url: "https://lists.ceph.io/", description: "Списки рассылки Ceph — dev, users", searchUrl: "https://lists.ceph.io/" },
      { title: "TrueNAS forum", url: "https://www.truenas.com/community/", description: "Форум TrueNAS/FreeNAS — NAS, ZFS", searchUrl: "https://www.truenas.com/community/search?q=" },
      { title: "OpenZFS", url: "https://openzfs.github.io/", description: "OpenZFS — файловая система, сообщество", searchUrl: "https://openzfs.github.io/" },
      { title: "MinIO community", url: "https://min.io/community?", description: "S3-совместимое объектное хранение", searchUrl: "https://min.io/community" },
      { title: "LINBIT (DRBD)", url: "https://linbit.com/community/", description: "DRBD/LINSTOR — репликация хранилищ", searchUrl: "https://linbit.com/community/" },
      { title: "GlusterFS", url: "https://www.gluster.org/community/", description: "Распределённая файловая система", searchUrl: "https://www.gluster.org/community/" },
    ],
  },
  {
    id: "srk",
    title: "СРК / Очереди",
    icon: <Layers className="h-5 w-5" />,
    accent: "from-violet-500 to-fuchsia-600",
    blurb: "Системы распределённых вычислений и брокеры сообщений",
    links: [
      { title: "Apache Kafka community", url: "https://kafka.apache.org/community", description: "Списки рассылки Kafka — dev, users", searchUrl: "https://kafka.apache.org/community" },
      { title: "RabbitMQ lists", url: "https://lists.rabbitmq.com/", description: "Списки рассылки RabbitMQ", searchUrl: "https://lists.rabbitmq.com/" },
      { title: "Apache Pulsar", url: "https://pulsar.apache.org/community/", description: "Сообщество Pulsar — распределённый messaging", searchUrl: "https://pulsar.apache.org/community/" },
      { title: "NATS community", url: "https://nats.io/community/", description: "Сообщество NATS — лёгкий messaging", searchUrl: "https://nats.io/community/" },
      { title: "Apache Flink", url: "https://flink.apache.org/community/", description: "Flink — stream processing, СРК", searchUrl: "https://flink.apache.org/community/" },
      { title: "Redis Streams (community)", url: "https://redis.io/community/", description: "Redis Streams — очереди и стримы", searchUrl: "https://redis.io/community/" },
      { title: "Apache Ignite", url: "https://ignite.apache.org/community/", description: "In-memory data grid, СРК", searchUrl: "https://ignite.apache.org/community/" },
    ],
  },
];

export function CommunitiesSection() {
  const [query, setQuery] = React.useState("");

  // Filter links across all groups by the search query.
  const filteredGroups = React.useMemo(() => {
    if (!query.trim()) return GROUPS;
    const q = query.toLowerCase();
    return GROUPS.map((g) => ({
      ...g,
      links: g.links.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q)
      ),
    })).filter((g) => g.links.length > 0);
  }, [query]);

  const totalLinks = GROUPS.reduce((s, g) => s + g.links.length, 0);

  return (
    <section className="mt-14">
      {/* Section header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground text-background shadow-sm">
            <Users className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold tracking-tight">
              Профильные сообщества{" "}
              <span className="text-muted-foreground font-normal text-sm">
                {totalLinks} форумов и списков рассылки
              </span>
            </h2>
            <p className="text-xs text-muted-foreground">
              Специфичные форумы и mailing-листы по Linux, СУБД, СХД и СРК — где
              обитают системные инженеры. Активные участники — сильные кандидаты.
            </p>
          </div>
        </div>

        {/* Search filter */}
        <div className="relative max-w-md mt-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Фильтр по названию или описанию..."
            className="pl-9 h-9 text-sm"
          />
        </div>
      </div>

      {/* Groups grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredGroups.map((group) => (
          <CommunityGroupCard key={group.id} group={group} />
        ))}
      </div>

      {filteredGroups.length === 0 && (
        <div className="text-center py-8 text-sm text-muted-foreground">
          Ничего не найдено по запросу «{query}»
        </div>
      )}
    </section>
  );
}

function CommunityGroupCard({ group }: { group: CommunityGroup }) {
  return (
    <div className="relative rounded-2xl border bg-card p-5 overflow-hidden">
      <div
        className={`absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br ${group.accent} opacity-10 blur-2xl`}
      />

      <div className="relative">
        {/* Group header */}
        <div className="flex items-center gap-2.5 mb-1">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${group.accent} text-white shadow-md shrink-0`}
          >
            {group.icon}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold leading-tight">{group.title}</h3>
            <p className="text-[11px] text-muted-foreground">{group.blurb}</p>
          </div>
          <Badge variant="secondary" className="ml-auto text-[10px] shrink-0">
            {group.links.length}
          </Badge>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-1.5 mt-3">
          {group.links.map((link, i) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded-lg border bg-card/60 px-3 py-2 hover:border-primary/50 hover:shadow-sm transition-all"
            >
              <a
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-2 min-w-0 flex-1"
              >
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary shrink-0 transition-colors" />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                    {link.title}
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    {link.description}
                  </div>
                </div>
              </a>
              {link.searchUrl && (
                <a
                  href={`${link.searchUrl}${encodeURIComponent("C++ developer")}`}
                  target="_blank"
                  rel="noreferrer"
                  title="Поиск «C++ developer» в этом форуме"
                  className="inline-flex items-center gap-1 rounded-md border bg-background px-2 py-1 text-[10px] text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors shrink-0"
                >
                  <Search className="h-3 w-3" />
                  test
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
