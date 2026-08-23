"use client";

import * as React from "react";
import {
  Github,
  Linkedin,
  ArrowRight,
  Cpu,
  Search,
  Sparkles,
  ClipboardList,
  Users,
  Filter,
  ExternalLink,
  Globe,
  Terminal,
  Newspaper,
  HelpCircle,
  Star,
  Briefcase,
  MessageSquare,
  Send,
  Plus,
  Book,
  X,
} from "lucide-react";
import { useUIStore, AppId } from "@/components/github/ui-store";
import { useSelectionStore } from "@/components/github/selection-store";
import { SYSTEMS_DOMAINS } from "@/lib/github";
import { LINKEDIN_PRESETS } from "@/lib/linkedin";
import { URL_SYSTEMS, UrlSystemId } from "@/lib/search-systems";
import { ThemeToggle } from "@/components/theme-toggle";
import { Input } from "@/components/ui/input";
import { ResearchSection } from "./research-section";
import { AggregatorsSection } from "./aggregators-section";
import { CandidateAggregatorsSection } from "./candidate-aggregators-section";
import { CommunitiesSection } from "./communities-section";
import { ExtensionsSection } from "./extensions-section";
import { SuggestToolDialog } from "./suggest-tool-dialog";
import { SuggestedToolsSection } from "./suggested-tools-section";
import { SocialNetworksSection } from "./social-networks-section";

interface SystemCard {
  id: AppId;
  name: string;
  tagline: string;
  description: string;
  icon: React.ReactNode;
  accent: string;
  featured?: boolean;
  features: { icon: React.ReactNode; text: string }[];
  stats: { label: string; value: string }[];
}

const SYSTEMS: SystemCard[] = [
  {
    id: "cse",
    name: "CSE — Google",
    tagline: "Генератор Google-поиска · главная система",
    description:
      "X-ray сорсинг через Google: операторы site:, filetype:, intitle:, исключения и точные фразы. Находит резюме на LinkedIn, GitHub, Хабре и StackOverflow.",
    icon: <Globe className="h-7 w-7" />,
    accent: "from-rose-500 to-orange-500",
    featured: true,
    features: [
      { icon: <Search className="h-4 w-4" />, text: "Операторы: site:, filetype:, intitle:, -, OR" },
      { icon: <Star className="h-4 w-4" />, text: "Пресеты: LinkedIn x-ray, GitHub, PDF-резюме" },
      { icon: <ClipboardList className="h-4 w-4" />, text: "Ручное добавление → общий экспорт в ХАНТ" },
    ],
    stats: [
      { label: "Источник", value: "Google" },
      { label: "Тип", value: "URL-билдер" },
    ],
  },
  {
    id: "gitfind",
    name: "GitFind",
    tagline: "Поиск по GitHub",
    description:
      "Системные разработчики на GitHub: C, C++, Go, Python, Rust. Анализ профиля, языков, звёзд и активности. Экспорт выборки в ХАНТ.",
    icon: <Github className="h-7 w-7" />,
    accent: "from-emerald-500 to-emerald-700",
    features: [
      { icon: <Users className="h-4 w-4" />, text: "6 типов поиска + дашборд профиля" },
      { icon: <Cpu className="h-4 w-4" />, text: "Анализ: языки, звёзды, seniority" },
      { icon: <ClipboardList className="h-4 w-4" />, text: "Выборка → экспорт в ХАНТ" },
    ],
    stats: [
      { label: "Источник", value: "GitHub API" },
      { label: "Профиль", value: "Анализ кода" },
    ],
  },
  {
    id: "linkedin",
    name: "LinkedIn Search",
    tagline: "Поиск по LinkedIn",
    description:
      "Структурированный поиск кандидатов в LinkedIn: грейд, навыки, локация, компания, ВУЗ. Готовый URL для открытия в LinkedIn.",
    icon: <Linkedin className="h-7 w-7" />,
    accent: "from-sky-500 to-blue-600",
    features: [
      { icon: <Filter className="h-4 w-4" />, text: "Фильтры: грейд, навыки, локация, компания, ВУЗ" },
      { icon: <Search className="h-4 w-4" />, text: "Пресеты: C++, Go, Rust, DBA, DevOps" },
      { icon: <ClipboardList className="h-4 w-4" />, text: "Ручное добавление → экспорт в ХАНТ" },
    ],
    stats: [
      { label: "Источник", value: "LinkedIn" },
      { label: "Профиль", value: "URL-билдер" },
    ],
  },
  {
    id: "habr",
    name: "Хабр / Карьера",
    tagline: "Хабр + Хабр.Карьера",
    description:
      "Поиск резюме на Хабр.Карьере и статей на Хабре. Системные разработчики публикуют резюме и статьи про C++, Go, Rust, базы данных.",
    icon: <Newspaper className="h-7 w-7" />,
    accent: "from-violet-500 to-fuchsia-600",
    features: [
      { icon: <Filter className="h-4 w-4" />, text: "Два режима: резюме / статьи" },
      { icon: <Search className="h-4 w-4" />, text: "Пресеты: C++, Go, Rust, DBA, kernel" },
      { icon: <ClipboardList className="h-4 w-4" />, text: "Ручное добавление → экспорт в ХАНТ" },
    ],
    stats: [
      { label: "Источник", value: "Habr" },
      { label: "Профиль", value: "URL-билдер" },
    ],
  },
  {
    id: "stackoverflow",
    name: "StackOverflow",
    tagline: "Поиск по StackOverflow",
    description:
      "Поиск пользователей StackOverflow по тегам (C, C++, Go, Rust, postgresql, linux) и локации. Топ по репутации — сильные инженеры.",
    icon: <HelpCircle className="h-7 w-7" />,
    accent: "from-orange-500 to-amber-600",
    features: [
      { icon: <Filter className="h-4 w-4" />, text: "Фильтр по тегам и локации" },
      { icon: <Search className="h-4 w-4" />, text: "Пресеты: C+Linux, C+++DB, Go+Kafka, Rust" },
      { icon: <ClipboardList className="h-4 w-4" />, text: "Ручное добавление → экспорт в ХАНТ" },
    ],
    stats: [
      { label: "Источник", value: "StackOverflow" },
      { label: "Профиль", value: "URL-билдер" },
    ],
  },
  {
    id: "lor",
    name: "Linux.org.ru",
    tagline: "Поиск по форуму LOR",
    description:
      "Поиск по крупнейшему русскоязычному Linux-сообществу. Найдите разработчиков, обсуждающих ядро, драйверы, СУБД и системное ПО.",
    icon: <Terminal className="h-7 w-7" />,
    accent: "from-amber-500 to-yellow-600",
    features: [
      { icon: <Search className="h-4 w-4" />, text: "Поиск по темам и комментариям" },
      { icon: <Cpu className="h-4 w-4" />, text: "Пресеты: C++, Go, kernel, DBA, Rust" },
      { icon: <ClipboardList className="h-4 w-4" />, text: "Ручное добавление → экспорт в ХАНТ" },
    ],
    stats: [
      { label: "Источник", value: "LOR" },
      { label: "Профиль", value: "URL-билдер" },
    ],
  },
  {
    id: "hh",
    name: "hh.ru",
    tagline: "HeadHunter · резюме",
    description:
      "Крупнейший российский job-сайт. Поиск резюме системных разработчиков (C, C++, Go, Python, Rust, DBA, DevOps) с фильтром по регионам РФ.",
    icon: <Briefcase className="h-7 w-7" />,
    accent: "from-red-500 to-rose-600",
    features: [
      { icon: <Briefcase className="h-4 w-4" />, text: "Резюме по регионам: Москва, СПб, Россия" },
      { icon: <Search className="h-4 w-4" />, text: "Пресеты: C++, Go, DBA, Rust, DevOps" },
      { icon: <ClipboardList className="h-4 w-4" />, text: "Ручное добавление → экспорт в ХАНТ" },
    ],
    stats: [
      { label: "Источник", value: "hh.ru" },
      { label: "Профиль", value: "URL-билдер" },
    ],
  },
  {
    id: "superjob",
    name: "Superjob",
    tagline: "резюме · Россия",
    description:
      "Второй по величине российский job-сайт. Поиск резюме системных разработчиков и Linux-администраторов по городам РФ.",
    icon: <Briefcase className="h-7 w-7" />,
    accent: "from-pink-500 to-rose-500",
    features: [
      { icon: <Briefcase className="h-4 w-4" />, text: "Резюме по городам РФ" },
      { icon: <Search className="h-4 w-4" />, text: "Пресеты: C++, Go, DBA, Python, DevOps" },
      { icon: <ClipboardList className="h-4 w-4" />, text: "Ручное добавление → экспорт в ХАНТ" },
    ],
    stats: [
      { label: "Источник", value: "Superjob" },
      { label: "Профиль", value: "URL-билдер" },
    ],
  },
  {
    id: "opennet",
    name: "OpenNet",
    tagline: "opennet.ru · UNIX/Linux",
    description:
      "Крупнейший русскоязычный портал по open-source, UNIX/Linux. Новости, статьи и обсуждения про ядро, СУБД, системное ПО. Активные комментаторы — инженеры.",
    icon: <Globe className="h-7 w-7" />,
    accent: "from-cyan-500 to-teal-600",
    features: [
      { icon: <Globe className="h-4 w-4" />, text: "Новости и обсуждения UNIX/Linux" },
      { icon: <Search className="h-4 w-4" />, text: "Пресеты: C++, PostgreSQL, kernel, Ceph, Rust" },
      { icon: <ClipboardList className="h-4 w-4" />, text: "Ручное добавление → экспорт в ХАНТ" },
    ],
    stats: [
      { label: "Источник", value: "opennet.ru" },
      { label: "Профиль", value: "URL-билдер" },
    ],
  },
  {
    id: "vc",
    name: "VC.ru",
    tagline: "IT-медиа · авторы",
    description:
      "Крупнейшее российское IT-медиа. Авторы статей про C++, Go, Rust, базы данных, DevOps и инфраструктуру — часто действующие инженеры и техлиды.",
    icon: <Newspaper className="h-7 w-7" />,
    accent: "from-indigo-500 to-violet-600",
    features: [
      { icon: <Newspaper className="h-4 w-4" />, text: "Статьи и авторы" },
      { icon: <Search className="h-4 w-4" />, text: "Пресеты: C++, Go, БД, kernel, DevOps, Rust" },
      { icon: <ClipboardList className="h-4 w-4" />, text: "Ручное добавление → экспорт в ХАНТ" },
    ],
    stats: [
      { label: "Источник", value: "VC.ru" },
      { label: "Профиль", value: "URL-билдер" },
    ],
  },
  {
    id: "habrqa",
    name: "Habr Q&A",
    tagline: "qna.habr.com · вопросы",
    description:
      "Русскоязычный Q&A-сервис от Хабра. Поиск экспертов по C++, Go, Rust, PostgreSQL, Linux и ядру через ответы на технические вопросы.",
    icon: <MessageSquare className="h-7 w-7" />,
    accent: "from-teal-500 to-emerald-600",
    features: [
      { icon: <MessageSquare className="h-4 w-4" />, text: "Вопросы и ответы" },
      { icon: <Search className="h-4 w-4" />, text: "Пресеты: C++, Go, PostgreSQL, Linux, Rust" },
      { icon: <ClipboardList className="h-4 w-4" />, text: "Ручное добавление → экспорт в ХАНТ" },
    ],
    stats: [
      { label: "Источник", value: "Habr Q&A" },
      { label: "Профиль", value: "URL-билдер" },
    ],
  },
  {
    id: "ruso",
    name: "ru.SO",
    tagline: "StackOverflow на русском",
    description:
      "Русская версия StackOverflow. Поиск пользователей по тегам (c, c++, go, postgresql, rust, bash, linux) с топом по репутации.",
    icon: <HelpCircle className="h-7 w-7" />,
    accent: "from-amber-500 to-orange-600",
    features: [
      { icon: <HelpCircle className="h-4 w-4" />, text: "Пользователи по тегам" },
      { icon: <Search className="h-4 w-4" />, text: "Пресеты: C+linux, C+++БД, Go, PostgreSQL, Rust" },
      { icon: <ClipboardList className="h-4 w-4" />, text: "Ручное добавление → экспорт в ХАНТ" },
    ],
    stats: [
      { label: "Источник", value: "ru.SO" },
      { label: "Профиль", value: "URL-билдер" },
    ],
  },
  {
    id: "ubuntu",
    name: "Ubuntu.ru",
    tagline: "forum.ubuntu.ru · Linux",
    description:
      "Крупнейшее русскоязычное Ubuntu-сообщество. Форум с обсуждениями драйверов, ядра, системного ПО и администрирования — активные участники часто инженеры.",
    icon: <Terminal className="h-7 w-7" />,
    accent: "from-orange-500 to-red-600",
    features: [
      { icon: <Terminal className="h-4 w-4" />, text: "Форум Ubuntu-сообщества" },
      { icon: <Search className="h-4 w-4" />, text: "Пресеты: C, C++, kernel, DevOps, PostgreSQL" },
      { icon: <ClipboardList className="h-4 w-4" />, text: "Ручное добавление → экспорт в ХАНТ" },
    ],
    stats: [
      { label: "Источник", value: "Ubuntu.ru" },
      { label: "Профиль", value: "URL-билдер" },
    ],
  },
  {
    id: "telegram",
    name: "Telegram",
    tagline: "TG-каналы и поиск · главная RU-среда",
    description:
      "Telegram — основная среда общения русскоязычных разработчиков. X-ray поиск через Google (site:t.me), TG-агрегаторы + курируемая база из 15 профильных каналов: C++, Go, Rust, Python, DBA, DevOps, Linux.",
    icon: <Send className="h-7 w-7" />,
    accent: "from-sky-500 to-cyan-600",
    features: [
      { icon: <Search className="h-4 w-4" />, text: "X-ray (site:t.me) + TG-агрегатор" },
      { icon: <MessageSquare className="h-4 w-4" />, text: "База: 15 профильных TG-каналов" },
      { icon: <ClipboardList className="h-4 w-4" />, text: "Ручное добавление → экспорт в ХАНТ" },
    ],
    stats: [
      { label: "Источник", value: "Telegram" },
      { label: "Каналов", value: "15 в базе" },
    ],
  },
  {
    id: "gitlab",
    name: "GitLab",
    tagline: "gitlab.com · код и профили",
    description:
      "GitLab — вторая по величине платформа хостинга кода. Поиск проектов и профилей разработчиков C, C++, Go, Rust. Многие системные проекты размещены здесь.",
    icon: <Github className="h-7 w-7" />,
    accent: "from-orange-500 to-red-600",
    features: [
      { icon: <Search className="h-4 w-4" />, text: "Поиск проектов и пользователей" },
      { icon: <Star className="h-4 w-4" />, text: "Пресеты: C/C++, Go, Rust" },
      { icon: <ClipboardList className="h-4 w-4" />, text: "Ручное добавление → экспорт в ХАНТ" },
    ],
    stats: [
      { label: "Источник", value: "GitLab" },
      { label: "Профиль", value: "URL-билдер" },
    ],
  },
  {
    id: "codeforces",
    name: "Codeforces",
    tagline: "Спортивное программирование",
    description:
      "Codeforces — крупнейшая платформа спортивного программирования, основанная в России. Рейтинг по странам, поиск профилей сильных C++/Go разработчиков.",
    icon: <Cpu className="h-7 w-7" />,
    accent: "from-blue-500 to-indigo-600",
    features: [
      { icon: <Star className="h-4 w-4" />, text: "Рейтинг по странам (RU, BY, KZ)" },
      { icon: <Search className="h-4 w-4" />, text: "Google x-ray: site:codeforces.com" },
      { icon: <ClipboardList className="h-4 w-4" />, text: "Ручное добавление → экспорт в ХАНТ" },
    ],
    stats: [
      { label: "Источник", value: "Codeforces" },
      { label: "Профиль", value: "URL-билдер" },
    ],
  },
  {
    id: "reddit",
    name: "Reddit",
    tagline: "r/cpp · r/golang · r/rust",
    description:
      "Reddit — англоязычные developer-сообщества. Поиск по сабреддитам: r/cpp, r/golang, r/rust, r/linuxdev, r/Python. Активные авторы — практикующие инженеры.",
    icon: <Globe className="h-7 w-7" />,
    accent: "from-orange-500 to-amber-600",
    features: [
      { icon: <Search className="h-4 w-4" />, text: "Поиск по 7+ сабреддитам" },
      { icon: <Star className="h-4 w-4" />, text: "Пресеты: C++, Go, Rust, Linux, Python" },
      { icon: <ClipboardList className="h-4 w-4" />, text: "Ручное добавление → экспорт в ХАНТ" },
    ],
    stats: [
      { label: "Источник", value: "Reddit" },
      { label: "Профиль", value: "URL-билдер" },
    ],
  },
  {
    id: "devto",
    name: "Dev.to",
    tagline: "dev.to · статьи разработчиков",
    description:
      "Dev.to — сообщество разработчиков со статьями про C++, Go, Rust, Linux, базы данных. Авторы технических статей — опытные инженеры.",
    icon: <Book className="h-7 w-7" />,
    accent: "from-slate-500 to-gray-700",
    features: [
      { icon: <Search className="h-4 w-4" />, text: "Поиск статей по ключевым словам" },
      { icon: <Star className="h-4 w-4" />, text: "Пресеты: C++, Go, Rust, Linux, БД" },
      { icon: <ClipboardList className="h-4 w-4" />, text: "Ручное добавление → экспорт в ХАНТ" },
    ],
    stats: [
      { label: "Источник", value: "Dev.to" },
      { label: "Профиль", value: "URL-билдер" },
    ],
  },
  {
    id: "sourcehut",
    name: "Sourcehut",
    tagline: "sr.ht · минималистичный хостинг",
    description:
      "Sourcehut — минималистичная платформа хостинга кода, популярная среди C/Go/Rust разработчиков. Поиск проектов: ядро, CLI, системное ПО.",
    icon: <Github className="h-7 w-7" />,
    accent: "from-emerald-500 to-green-700",
    features: [
      { icon: <Search className="h-4 w-4" />, text: "Поиск проектов по языку" },
      { icon: <Star className="h-4 w-4" />, text: "Пресеты: C, Go, Rust, Linux" },
      { icon: <ClipboardList className="h-4 w-4" />, text: "Ручное добавление → экспорт в ХАНТ" },
    ],
    stats: [
      { label: "Источник", value: "Sourcehut" },
      { label: "Профиль", value: "URL-билдер" },
    ],
  },
  {
    id: "hackersnews",
    name: "HackerNews",
    tagline: "news.ycombinator.com · дискуссии",
    description:
      "HackerNews — главное англоязычное dev-сообщество. Поиск по обсуждениям, тредам «Who is hiring» и профилям.",
    icon: <Globe className="h-7 w-7" />,
    accent: "from-orange-500 to-amber-600",
    features: [
      { icon: <Search className="h-4 w-4" />, text: "Поиск через Algolia API" },
      { icon: <Star className="h-4 w-4" />, text: "Пресеты: C++, Go, Rust, who is hiring" },
      { icon: <ClipboardList className="h-4 w-4" />, text: "Ручное добавление → экспорт в ХАНТ" },
    ],
    stats: [
      { label: "Источник", value: "HackerNews" },
      { label: "Профиль", value: "URL-билдер" },
    ],
  },
  {
    id: "bitbucket",
    name: "Bitbucket",
    tagline: "bitbucket.org · Atlassian",
    description:
      "Bitbucket — платформа хостинга кода от Atlassian. Поиск репозиториев C, C++, Go, Rust. Enterprise-проекты.",
    icon: <Github className="h-7 w-7" />,
    accent: "from-blue-500 to-sky-600",
    features: [
      { icon: <Search className="h-4 w-4" />, text: "Поиск репозиториев" },
      { icon: <Star className="h-4 w-4" />, text: "Пресеты: C++, Go, Rust, Python" },
      { icon: <ClipboardList className="h-4 w-4" />, text: "Ручное добавление → экспорт в ХАНТ" },
    ],
    stats: [
      { label: "Источник", value: "Bitbucket" },
      { label: "Профиль", value: "URL-билдер" },
    ],
  },
  {
    id: "kaggle",
    name: "Kaggle",
    tagline: "kaggle.com · Data Science",
    description:
      "Kaggle — платформа для data science и ML. Поиск профилей дата-сайентистов, Python-разработчиков и DBA.",
    icon: <Book className="h-7 w-7" />,
    accent: "from-sky-500 to-blue-600",
    features: [
      { icon: <Search className="h-4 w-4" />, text: "Поиск по профилям и ноутбукам" },
      { icon: <Star className="h-4 w-4" />, text: "Пресеты: Python, C++, PostgreSQL" },
      { icon: <ClipboardList className="h-4 w-4" />, text: "Ручное добавление → экспорт в ХАНТ" },
    ],
    stats: [
      { label: "Источник", value: "Kaggle" },
      { label: "Профиль", value: "URL-билдер" },
    ],
  },
  {
    id: "dockerhub",
    name: "Docker Hub",
    tagline: "hub.docker.com · DevOps",
    description:
      "Docker Hub — реестр контейнерных образов. Поиск авторов образов PostgreSQL, Redis, Kafka, Nginx — DevOps-инженеры.",
    icon: <Cpu className="h-7 w-7" />,
    accent: "from-blue-500 to-cyan-600",
    features: [
      { icon: <Search className="h-4 w-4" />, text: "Поиск по образам и авторам" },
      { icon: <Star className="h-4 w-4" />, text: "Пресеты: postgres, redis, kafka, nginx" },
      { icon: <ClipboardList className="h-4 w-4" />, text: "Ручное добавление → экспорт в ХАНТ" },
    ],
    stats: [
      { label: "Источник", value: "Docker Hub" },
      { label: "Профиль", value: "URL-билдер" },
    ],
  },
  {
    id: "gopkg",
    name: "pkg.go.dev",
    tagline: "Go-пакеты · авторы",
    description:
      "pkg.go.dev — реестр Go-пакетов. Поиск авторов пакетов для PostgreSQL, Kafka, gRPC, системного программирования.",
    icon: <Cpu className="h-7 w-7" />,
    accent: "from-cyan-500 to-teal-600",
    features: [
      { icon: <Search className="h-4 w-4" />, text: "Поиск по Go-пакетам" },
      { icon: <Star className="h-4 w-4" />, text: "Пресеты: postgres, kafka, grpc, linux" },
      { icon: <ClipboardList className="h-4 w-4" />, text: "Ручное добавление → экспорт в ХАНТ" },
    ],
    stats: [
      { label: "Источник", value: "pkg.go.dev" },
      { label: "Профиль", value: "URL-билдер" },
    ],
  },
  {
    id: "crates",
    name: "crates.io",
    tagline: "Rust-пакеты · авторы",
    description:
      "crates.io — реестр Rust-пакетов. Поиск авторов пакетов для Linux, баз данных, сетевого программирования.",
    icon: <Cpu className="h-7 w-7" />,
    accent: "from-orange-500 to-red-600",
    features: [
      { icon: <Search className="h-4 w-4" />, text: "Поиск по Rust-пакетам" },
      { icon: <Star className="h-4 w-4" />, text: "Пресеты: linux, database, networking, cli" },
      { icon: <ClipboardList className="h-4 w-4" />, text: "Ручное добавление → экспорт в ХАНТ" },
    ],
    stats: [
      { label: "Источник", value: "crates.io" },
      { label: "Профиль", value: "URL-билдер" },
    ],
  },
  {
    id: "pypi",
    name: "PyPI",
    tagline: "pypi.org · Python-пакеты",
    description:
      "PyPI — реестр Python-пакетов. Поиск авторов пакетов для PostgreSQL, Linux, asyncio, C bindings.",
    icon: <Cpu className="h-7 w-7" />,
    accent: "from-blue-500 to-indigo-600",
    features: [
      { icon: <Search className="h-4 w-4" />, text: "Поиск по Python-пакетам" },
      { icon: <Star className="h-4 w-4" />, text: "Пресеты: postgres, linux, asyncio, ctypes" },
      { icon: <ClipboardList className="h-4 w-4" />, text: "Ручное добавление → экспорт в ХАНТ" },
    ],
    stats: [
      { label: "Источник", value: "PyPI" },
      { label: "Профиль", value: "URL-билдер" },
    ],
  },
  {
    id: "codeberg",
    name: "Codeberg",
    tagline: "codeberg.org · open source",
    description:
      "Codeberg — некоммерческая платформа хостинга кода (Gitea). Популярна среди open-source C/Go/Rust разработчиков.",
    icon: <Github className="h-7 w-7" />,
    accent: "from-teal-500 to-cyan-700",
    features: [
      { icon: <Search className="h-4 w-4" />, text: "Поиск проектов по языку" },
      { icon: <Star className="h-4 w-4" />, text: "Пресеты: C, Go, Rust, kernel" },
      { icon: <ClipboardList className="h-4 w-4" />, text: "Ручное добавление → экспорт в ХАНТ" },
    ],
    stats: [
      { label: "Источник", value: "Codeberg" },
      { label: "Профиль", value: "URL-билдер" },
    ],
  },
  {
    id: "leetcode",
    name: "LeetCode",
    tagline: "leetcode.com · алгоритмика",
    description:
      "LeetCode — платформа алгоритмических задач. Google x-ray поиск профилей по языку и региону. Сильные алгоритмисты.",
    icon: <Cpu className="h-7 w-7" />,
    accent: "from-amber-500 to-yellow-600",
    features: [
      { icon: <Search className="h-4 w-4" />, text: "Google x-ray: site:leetcode.com" },
      { icon: <Star className="h-4 w-4" />, text: "Пресеты: C++, Go, Python, Rust" },
      { icon: <ClipboardList className="h-4 w-4" />, text: "Ручное добавление → экспорт в ХАНТ" },
    ],
    stats: [
      { label: "Источник", value: "LeetCode" },
      { label: "Профиль", value: "URL-билдер" },
    ],
  },
  {
    id: "medium",
    name: "Medium",
    tagline: "medium.com · статьи",
    description:
      "Medium — платформа статей. Технические статьи про C++, Go, Rust, Linux kernel, базы данных. Авторы — опытные инженеры.",
    icon: <Book className="h-7 w-7" />,
    accent: "from-slate-500 to-gray-700",
    features: [
      { icon: <Search className="h-4 w-4" />, text: "Поиск статей по ключевым словам" },
      { icon: <Star className="h-4 w-4" />, text: "Пресеты: C++, Go, Rust, Linux, БД" },
      { icon: <ClipboardList className="h-4 w-4" />, text: "Ручное добавление → экспорт в ХАНТ" },
    ],
    stats: [
      { label: "Источник", value: "Medium" },
      { label: "Профиль", value: "URL-билдер" },
    ],
  },
  {
    id: "vk",
    name: "ВКонтакте",
    tagline: "vk.com · Google x-ray",
    description:
      "ВКонтакте — крупнейшая российская соцсеть. Google x-ray поиск профилей и групп разработчиков C, C++, Go, Python, Rust, DevOps.",
    icon: <Globe className="h-7 w-7" />,
    accent: "from-blue-500 to-indigo-600",
    features: [
      { icon: <Search className="h-4 w-4" />, text: "Google x-ray: site:vk.com" },
      { icon: <Star className="h-4 w-4" />, text: "Пресеты: C++, Go, Python, Linux, DevOps" },
      { icon: <ClipboardList className="h-4 w-4" />, text: "Ручное добавление → экспорт в ХАНТ" },
    ],
    stats: [
      { label: "Источник", value: "ВКонтакте" },
      { label: "Профиль", value: "URL-билдер" },
    ],
  },
  {
    id: "facebook",
    name: "Facebook",
    tagline: "facebook.com · Google x-ray",
    description:
      "Facebook — международная соцсеть. Google x-ray поиск профилей разработчиков C++, Go, Python, Rust, Linux engineer.",
    icon: <Globe className="h-7 w-7" />,
    accent: "from-blue-600 to-sky-700",
    features: [
      { icon: <Search className="h-4 w-4" />, text: "Google x-ray: site:facebook.com" },
      { icon: <Star className="h-4 w-4" />, text: "Пресеты: C++, Go, Python, Rust, Linux" },
      { icon: <ClipboardList className="h-4 w-4" />, text: "Ручное добавление → экспорт в ХАНТ" },
    ],
    stats: [
      { label: "Источник", value: "Facebook" },
      { label: "Профиль", value: "URL-билдер" },
    ],
  },
];

export function Launcher() {
  const setApp = useUIStore((s) => s.setApp);
  const selectionCount = useSelectionStore((s) => s.candidates.length);
  const [suggestOpen, setSuggestOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const featured = SYSTEMS.find((s) => s.featured)!;
  const rest = SYSTEMS.filter((s) => !s.featured);

  const isSearching = searchQuery.trim().length > 0;
  const filteredRest = React.useMemo(() => {
    if (!isSearching) return rest;
    const q = searchQuery.toLowerCase();
    return rest.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.tagline.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
    );
  }, [searchQuery, rest]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-background/85 backdrop-blur-xl sticky top-0 z-50">
        <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground text-background shadow-sm">
              <Search className="h-5 w-5" />
            </div>
            <div className="leading-none">
              <span className="font-bold text-base tracking-tight">SourcerHub</span>
              <span className="block text-[10px] text-muted-foreground mt-0.5">
                поисковые системы для рекрутера
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSuggestOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-sm hover:shadow-sm transition-all"
            >
              <Plus className="h-3.5 w-3.5 text-primary" />
              <span className="hidden sm:inline">Предложить</span>
            </button>
            <ThemeToggle />
            {selectionCount > 0 && (
              <button
                onClick={() => setApp("gitfind")}
                className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-sm hover:shadow-sm transition-all"
              >
                <ClipboardList className="h-3.5 w-3.5 text-primary" />
                <span>Выборка</span>
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold px-1">
                  {selectionCount}
                </span>
              </button>
            )}
          </div>
        </div>
      </header>

      <SuggestToolDialog open={suggestOpen} onOpenChange={setSuggestOpen} />

      {/* Main */}
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 pt-6 pb-10">
          {/* Global search */}
          <div className="relative mb-6">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск системы: GitLab, Хабр, Docker, Reddit..."
              className="pl-10 pr-10 h-12 rounded-xl text-base"
            />
            {isSearching && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {isSearching && (
            <div className="mb-4 text-sm text-muted-foreground">
              Найдено систем: <span className="font-semibold text-foreground">{filteredRest.length}</span>
              {filteredRest.length === 0 && " — попробуйте другой запрос"}
            </div>
          )}

          {/* Hero */}
          {!isSearching && (
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1 text-xs text-muted-foreground mb-5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              31 поисковая система в одном месте
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
              Сорсинг{" "}
              <span className="bg-gradient-to-r from-rose-500 via-sky-500 to-violet-600 bg-clip-text text-transparent">
                системных инженеров
              </span>
            </h1>
            <p className="mt-4 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              Google CSE, GitFind, LinkedIn, Telegram, hh.ru, Superjob, Хабр,
              StackOverflow, GitLab, Codeforces, Reddit, HackerNews, Docker Hub,
              pkg.go.dev, crates.io, PyPI, LeetCode, Medium и др.
              Единая выборка и экспорт в ХАНТ для всех источников.
            </p>
          </div>
          )}

          {/* Featured system (CSE) */}
          {!isSearching && (
          <div className="mb-5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2.5">
              <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
              Главная поисковая система
            </div>
            <button
              onClick={() => setApp(featured.id)}
              className="group relative w-full text-left rounded-2xl border bg-card p-6 hover:shadow-lg hover:border-primary/40 transition-all overflow-hidden"
            >
              <div
                className={`absolute -top-16 -right-16 h-56 w-56 rounded-full bg-gradient-to-br ${featured.accent} opacity-15 blur-3xl group-hover:opacity-25 transition-opacity`}
              />
              <div className="relative flex flex-col md:flex-row items-start gap-5">
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${featured.accent} text-white shadow-lg shrink-0`}
                >
                  {featured.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-2xl font-bold leading-tight">{featured.name}</h2>
                    <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30">
                      <Star className="h-3 w-3 mr-1 fill-amber-500 text-amber-500" />
                      главная
                    </Badge>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all ml-auto" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                    {featured.description}
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {featured.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs">
                        <span className="text-primary mt-0.5 shrink-0">{f.icon}</span>
                        <span className="text-muted-foreground">{f.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </button>
          </div>
          )}

          {/* Other systems grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRest.map((sys) => (
              <button
                key={sys.id}
                onClick={() => setApp(sys.id)}
                className="group relative text-left rounded-2xl border bg-card p-5 hover:shadow-lg hover:border-primary/40 transition-all overflow-hidden"
              >
                <div
                  className={`absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br ${sys.accent} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`}
                />
                <div className="relative">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${sys.accent} text-white shadow-md`}
                      >
                        {sys.icon}
                      </div>
                      <div>
                        <h2 className="font-bold leading-tight">{sys.name}</h2>
                        <p className="text-[11px] text-muted-foreground">{sys.tagline}</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                  </div>

                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed line-clamp-3">
                    {sys.description}
                  </p>

                  <div className="flex items-center gap-3 pt-3 border-t">
                    {sys.stats.map((s, i) => (
                      <div key={i} className="flex flex-col">
                        <span className="text-[9px] uppercase tracking-wide text-muted-foreground">
                          {s.label}
                        </span>
                        <span className="text-[11px] font-semibold">{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Quick presets preview */}
          {!isSearching && (
          <>
          <div className="mt-10">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3 justify-center">
              <Sparkles className="h-3.5 w-3.5" />
              Готовые пресеты для старта
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {SYSTEMS_DOMAINS.slice(0, 4).map((d) => (
                <button
                  key={d.id}
                  onClick={() => setApp("gitfind")}
                  className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-xs hover:border-primary/50 hover:shadow-sm transition-all"
                >
                  <Github className="h-3 w-3 text-emerald-600" />
                  <span>{d.label}</span>
                </button>
              ))}
              <span className="text-muted-foreground/40 px-1">·</span>
              {LINKEDIN_PRESETS.slice(0, 3).map((p) => (
                <button
                  key={p.id}
                  onClick={() => setApp("linkedin")}
                  className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-xs hover:border-primary/50 hover:shadow-sm transition-all"
                >
                  <Linkedin className="h-3 w-3 text-sky-600" />
                  <span>{p.label}</span>
                </button>
              ))}
              <span className="text-muted-foreground/40 px-1">·</span>
              {(["cse", "telegram", "hh", "habr", "stackoverflow", "opennet", "vc", "habrqa", "ruso", "ubuntu", "superjob"] as UrlSystemId[]).map((sid) => (
                <button
                  key={sid}
                  onClick={() => setApp(sid)}
                  className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-xs hover:border-primary/50 hover:shadow-sm transition-all"
                >
                  {sid === "cse" && <Globe className="h-3 w-3 text-rose-500" />}
                  {sid === "telegram" && <Send className="h-3 w-3 text-sky-500" />}
                  {sid === "hh" && <Briefcase className="h-3 w-3 text-red-500" />}
                  {sid === "habr" && <Newspaper className="h-3 w-3 text-violet-600" />}
                  {sid === "stackoverflow" && <HelpCircle className="h-3 w-3 text-orange-500" />}
                  {sid === "opennet" && <Globe className="h-3 w-3 text-cyan-600" />}
                  {sid === "vc" && <Newspaper className="h-3 w-3 text-indigo-600" />}
                  {sid === "habrqa" && <MessageSquare className="h-3 w-3 text-teal-600" />}
                  {sid === "ruso" && <HelpCircle className="h-3 w-3 text-amber-600" />}
                  {sid === "ubuntu" && <Terminal className="h-3 w-3 text-orange-600" />}
                  {sid === "superjob" && <Briefcase className="h-3 w-3 text-pink-500" />}
                  <span>{URL_SYSTEMS[sid].name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Browser extensions for recruitment */}
          <ExtensionsSection />

          {/* Aggregators section — vacancy aggregators */}
          <AggregatorsSection />

          {/* Candidate aggregators — profile aggregators + sharing */}
          <CandidateAggregatorsSection />

          {/* Communities section — niche forums by domain */}
          <CommunitiesSection />

          {/* Social networks section */}
          <SocialNetworksSection />

          {/* Research section — study new APIs */}
          <ResearchSection />

          {/* Suggested tools — user-submitted tools */}
          <SuggestedToolsSection />
          </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t bg-card/40">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <span>
              <span className="font-semibold text-foreground">SourcerHub</span> — системные
              разработчики C/C++/Go/Python/Rust · Москва и Россия
            </span>
            <span className="flex items-center gap-1 flex-wrap justify-center">
              <ExternalLink className="h-3 w-3" />
              Google · GitHub · LinkedIn · Telegram · hh.ru · Хабр · GitLab · Codeforces · Reddit · HackerNews · Docker Hub · pkg.go.dev · crates.io · PyPI · LeetCode · Medium · Codeberg · Bitbucket · Kaggle · LOR
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Badge({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${className}`}
    >
      {children}
    </span>
  );
}
