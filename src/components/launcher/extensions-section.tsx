"use client";

import * as React from "react";
import {
  Puzzle,
  ExternalLink,
  Search,
  Chrome,
  Github,
  Linkedin,
  Mail,
  Phone,
  Globe,
  Star,
  Users,
  FileText,
  CreditCard,
  MapPin,
  Calendar,
  ShieldCheck,
  Briefcase,
  Link2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CollapsibleSection } from "./collapsible-section";

interface Extension {
  name: string;
  url: string;
  description: string;
  rating?: string;
  browsers?: string; // "Chrome", "Firefox", "Edge"
  free?: boolean;
}

interface Category {
  id: string;
  title: string;
  icon: React.ReactNode;
  accent: string;
  blurb: string;
  extensions: Extension[];
}

const CATEGORIES: Category[] = [
  {
    id: "linkedin",
    title: "LinkedIn-сорсинг",
    icon: <Linkedin className="h-5 w-5" />,
    accent: "from-sky-500 to-blue-600",
    blurb: "Расширения для x-ray поиска, экстракта контактов и enrichment профилей LinkedIn",
    extensions: [
      {
        name: "LinkedIn Recruiter Lite",
        url: "https://www.linkedin.com/recruiter/",
        description:
          "Официальный инструмент LinkedIn для рекрутеров: расширенный поиск по 860M+ профилей, InMail, сохранённые searches, pipeline-трекинг. Базовый уровень — Lite, полный — Recruiter Corporate. Обязателен для серьёзного LinkedIn-сорсинга.",
        rating: "официальный",
        browsers: "веб",
        free: false,
      },
      {
        name: "Lusha",
        url: "https://www.lusha.com/",
        description:
          "Показывает прямые email и телефоны прямо на профиле LinkedIn. 5 бесплатных кредитов/мес, далее платно. Один из самых точных enrichment-инструментов — покрытие 60-70% для IT-профилей в РФ.",
        rating: "4.5★",
        browsers: "Chrome, Edge, Firefox",
        free: false,
      },
      {
        name: "Apollo.io",
        url: "https://www.apollo.io/",
        description:
          "Расширение показывает email/телефон/соцсети на любом LinkedIn-профиле. Большая база (275M+ контактов), бесплатный план 10 000 кредитов/мес. Сильны в B2B и tech-контактах.",
        rating: "4.6★",
        browsers: "Chrome",
        free: true,
      },
      {
        name: "Hunter",
        url: "https://hunter.io/chrome-extension",
        description:
          "Находит email-адреса по домену компании и по имени+фамилии. Проверяет deliverability через SMTP. 25 бесплатных поисков/мес. Полезен для outreach к кандидатам из конкретных компаний (Yandex, VK, Сбер).",
        rating: "4.7★",
        browsers: "Chrome, Firefox, Edge",
        free: true,
      },
      {
        name: "Snov.io",
        url: "https://snov.io/email-finder-extension",
        description:
          "Поиск email по LinkedIn-профилю + верификация + отправка dripped-кампаний. 50 бесплатных кредитов/мес. Хорош для автоматизации outreach: нашёл 50 C++-разработчиков → запустил email-серию.",
        rating: "4.5★",
        browsers: "Chrome",
        free: true,
      },
      {
        name: "ContactOut",
        url: "https://contactout.com/",
        description:
          "Извлекает личные email и телефоны из LinkedIn-профилей. Покрытие выше среднего для senior+ IT-кандидатов. Бесплатный план ограничен, платный ~$99/мес. Точность ~85%.",
        rating: "4.3★",
        browsers: "Chrome",
        free: false,
      },
      {
        name: "Hiretual (now hireEZ)",
        url: "https://hireez.com/",
        description:
          "AI-сорсинг: агрегирует профили из 45+ платформ (LinkedIn, GitHub, SO, Kaggle). Показывает контактную информацию и AI-скор релевантности. Сильны в tech-сорсинге, есть фильтр по stack.",
        rating: "4.4★",
        browsers: "Chrome",
        free: false,
      },
      {
        name: "SeekOut",
        url: "https://seekout.io/",
        description:
          "AI-платформа сорсинга: 800M+ профилей, обогащение контактами, фильтр по skill graph. Сильны в diverse hiring и tech. Интеграция с ATS (Greenhouse, Lever, Workable).",
        rating: "4.5★",
        browsers: "Chrome",
        free: false,
      },
      {
        name: "RecruitEm",
        url: "https://recruitin.net/",
        description:
          "Бесплатный генератор Google x-ray запросов для LinkedIn, GitHub, Twitter, Xing. Вводишь должность+локацию → получаешь готовый site:linkedin.com/in запрос. Простой, но мощный.",
        rating: "бесплатно",
        browsers: "веб",
        free: true,
      },
      {
        name: "LinkedR",
        url: "https://www.linkedhelper.com/",
        description:
          "Автоматизация LinkedIn: массовые просмотры профилей, подключения, сообщения. Помогает пройти лимиты вручную. Внимание: нарушает ToS LinkedIn, риск бана аккаунта — использовать с осторожностью.",
        rating: "4.2★",
        browsers: "Chrome (desktop app)",
        free: false,
      },
    ],
  },
  {
    id: "github",
    title: "GitHub / Tech-сорсинг",
    icon: <Github className="h-5 w-5" />,
    accent: "from-emerald-500 to-teal-600",
    blurb: "Расширения для анализа GitHub-профилей, поиска разработчиков по коду и репутации",
    extensions: [
      {
        name: "OctoTree",
        url: "https://www.octotree.io/",
        description:
          "Боковое дерево файлов для GitHub-репозиториев — ускоряет просмотр кода кандидата. При сорсинге по GitHub экономит время на оценку depth и стиля разработчика.",
        rating: "4.7★",
        browsers: "Chrome, Firefox, Edge, Safari",
        free: true,
      },
      {
        name: "GitHunt",
        url: "https://github.com/kamranahmedse/githunt",
        description:
          "Заменяет стартовую страницу на трендовые GitHub-репозитории по выбранному языку. Полезно для обнаружения активных разработчиков через их trending-репо (C++, Go, Rust).",
        rating: "4.5★",
        browsers: "Chrome",
        free: true,
      },
      {
        name: "GitHub Repository Size",
        url: "https://github.com/harshjv/github-repo-size",
        description:
          "Показывает размер каждого репозитория прямо на странице GitHub. Помогает быстро оценить масштаб проектов кандидата — серьёзный проект или пет-проджект.",
        rating: "4.6★",
        browsers: "Chrome, Firefox, Opera",
        free: true,
      },
      {
        name: "Refined GitHub",
        url: "https://github.com/refined-github/refined-github",
        description:
          "Улучшает UI GitHub: подсветка most-reactioned comments, кнопки copy, сворачивание irrelevant-блоков. Делает оценку профилей кандидатов быстрее и удобнее.",
        rating: "4.8★",
        browsers: "Chrome, Firefox, Edge, Safari",
        free: true,
      },
      {
        name: "Sourcegraph",
        url: "https://about.sourcegraph.com/",
        description:
          "Code search по публичным репозиториям: ищет по содержимому кода, а не только по именам. Находит разработчиков, писавших конкретные API (epoll, gRPC, shared_memory). Есть browser extension.",
        rating: "4.5★",
        browsers: "Chrome",
        free: true,
      },
      {
        name: "GitZip for GitHub",
        url: "https://github.com/gitzip/gitzip-extension",
        description:
          "Скачивает отдельные папки из GitHub-репозитория как zip. При оценке кандидата — быстро забрать portfolio-папку без клонирования всего репо.",
        rating: "4.3★",
        browsers: "Chrome",
        free: true,
      },
      {
        name: "OctoLinker",
        url: "https://octolinker.vercel.app/",
        description:
          "Делает import-ссылки в коде кликабельными на GitHub. При оценке depth кандидата — быстро перейти к зависимостям и понять, какие библиотеки он использует.",
        rating: "4.7★",
        browsers: "Chrome, Firefox, Edge, Safari",
        free: true,
      },
      {
        name: "Star History",
        url: "https://star-history.com/",
        description:
          "Показывает график роста звёзд репозитория. Помогает отличить вирусные пет-проджекты от стабильно растущих serious-проектов кандидата.",
        rating: "4.6★",
        browsers: "Chrome, Firefox",
        free: true,
      },
    ],
  },
  {
    id: "contact",
    title: "Поиск контактов (email/телефон)",
    icon: <Mail className="h-5 w-5" />,
    accent: "from-violet-500 to-fuchsia-600",
    blurb: "Инструменты для извлечения и верификации email-адресов и телефонов кандидатов",
    extensions: [
      {
        name: "Clearbit Connect",
        url: "https://connect.clearbit.com/",
        description:
          "Показывает email любого сотрудника компании прямо в Gmail. Бесплатный план — 100 поисков/мес. Полезен для outreach к senior-инженерам через корпоративные домены.",
        rating: "4.4★",
        browsers: "Chrome (Gmail)",
        free: true,
      },
      {
        name: "Voila Norbert",
        url: "https://www.voilanorbert.com/",
        description:
          "Поиск email по имени+домену с верификацией. 50 бесплатных поисков при регистрации. Точность ~90%, есть API для автоматизации.",
        rating: "4.5★",
        browsers: "Chrome",
        free: true,
      },
      {
        name: "Anymail Finder",
        url: "https://anymailfinder.com/",
        description:
          "Верифицирует email перед выдачей — оплачиваешь только подтверждённые адреса. Покрытие для РФ-доменов среднее, но точность высокая. 19 бесплатных/мес.",
        rating: "4.3★",
        browsers: "веб + Chrome",
        free: true,
      },
      {
        name: "Find That Email",
        url: "https://findthat.email/",
        description:
          "Email-finder по LinkedIn и корпоративным сайтам. 50 бесплатных кредитов/мес. Есть bulk-поиск по списку имён — удобно для long-list из 50 кандидатов.",
        rating: "4.2★",
        browsers: "Chrome",
        free: true,
      },
      {
        name: "RocketReach",
        url: "https://rocketreach.co/extension",
        description:
          "Поиск контактов по 700M+ профилям: email, телефон, соцсети. 5 бесплатных поисков/мес. Сильны в US/EMEA, для РФ покрытие ограниченное, но senior IT находит.",
        rating: "4.4★",
        browsers: "Chrome, Firefox, Edge",
        free: true,
      },
      {
        name: "Skrapp",
        url: "https://www.skrapp.io/",
        description:
          "Email-finder для LinkedIn с CRM-интеграцией. 50 бесплатных email/мес. Особенность — сохраняет найденные контакты прямо в пайплайн, без ручного копирования.",
        rating: "4.3★",
        browsers: "Chrome",
        free: true,
      },
      {
        name: "Adapt.io",
        url: "https://adapt.io/",
        description:
          "B2B-контакты: email + телефон + должность + компания. Бесплатный план с лимитами. Сильны в tech-компаниях — находят инженеров из Yandex, VK, Avito.",
        rating: "4.4★",
        browsers: "Chrome",
        free: true,
      },
      {
        name: "Email Extractor",
        url: "https://chrome.google.com/webstore/detail/email-extractor/",
        description:
          "Бесплатное расширение — извлекает все email-адреса с текущей страницы. Полезно для скрапинга контактов с корпоративных sites и страниц команд. Базовый, но быстрый.",
        rating: "4.1★",
        browsers: "Chrome",
        free: true,
      },
    ],
  },
  {
    id: "ats",
    title: "ATS / CRM-интеграции",
    icon: <Briefcase className="h-5 w-5" />,
    accent: "from-orange-500 to-amber-600",
    blurb: "Расширения для добавления кандидатов в ATS (Workable, Greenhouse, Lever) прямо со страницы",
    extensions: [
      {
        name: "Workable Chrome Extension",
        url: "https://www.workable.com/chrome-extension",
        description:
          "Добавляет кандидата в Workable прямо с LinkedIn/GitHub/hh.ru одним кликом. Извлекает имя, должность, компанию, ссылку, контакты. Экономит 2-3 минуты на каждого кандидата.",
        rating: "4.5★",
        browsers: "Chrome",
        free: true,
      },
      {
        name: "Greenhouse Chrome Extension",
        url: "https://support.greenhouse.io/hc/en-us/articles/360034719312",
        description:
          "Добавляет кандидата в Greenhouse с любого сайта. Авто-заполняет поля из LinkedIn-профиля. Для команд, использующих Greenhouse как ATS.",
        rating: "4.4★",
        browsers: "Chrome",
        free: true,
      },
      {
        name: "Lever Nurture",
        url: "https://help.lever.co/hc/en-us/articles/360050503072",
        description:
          "Расширение Lever — добавляет кандидатов и ведёт nurture-кампании. Сильны в tech-recruiting, используется Stripe, Quora, NetFlix.",
        rating: "4.3★",
        browsers: "Chrome",
        free: true,
      },
      {
        name: "HuntFlow расширение",
        url: "https://huntflow.ru/",
        description:
          "Российская ATS с Chrome-расширением: добавляет кандидатов с hh.ru, LinkedIn, Хабр.Карьеры в HuntFlow одним кликом. Идеально для РФ-рынка — экспорт CSV совместим (используется в SourcerHub).",
        rating: "4.6★",
        browsers: "Chrome",
        free: false,
      },
      {
        name: "SmartRecruiters",
        url: "https://www.smartrecruiters.com/",
        description:
          "Enterprise ATS с browser-расширением для добавления кандидатов. Интеграция с 30+ job-бордами. Для крупных команд сорсинга.",
        rating: "4.3★",
        browsers: "Chrome",
        free: false,
      },
      {
        name: "Personio",
        url: "https://www.personio.com/",
        description:
          "Европейская HR-платформа с расширением для talent acquisition. Сильны в DACH-регионе, но растут в РФ/CIS. Добавляет кандидатов в пайплайн с любой страницы.",
        rating: "4.4★",
        browsers: "Chrome",
        free: false,
      },
    ],
  },
  {
    id: "scrape",
    title: "Скрапинг и экстракция",
    icon: <Globe className="h-5 w-5" />,
    accent: "from-cyan-500 to-teal-600",
    blurb: "Инструменты для извлечения структурированных данных со страниц кандидатов и списков",
    extensions: [
      {
        name: "Data Miner",
        url: "https://dataminer.io/",
        description:
          "Скрапинг страниц в CSV/Excel по recipe-шаблонам. Есть готовые recipes для LinkedIn-поиска. Бесплатный план — 500 страниц/мес. Извлекает имя, должность, компанию, ссылку списком.",
        rating: "4.5★",
        browsers: "Chrome, Edge",
        free: true,
      },
      {
        name: "Web Scraper",
        url: "https://webscraper.io/",
        description:
          "Бесплатный скрапер с sitemap-навигацией. Для продвинутых — обходит пагинацию и dynamic-контент. Хорош для извлечения списков кандидатов с нишевых форумов (LOR, Ubuntu.ru).",
        rating: "4.6★",
        browsers: "Chrome",
        free: true,
      },
      {
        name: "SelectorGadget",
        url: "https://selectorgadget.com/",
        description:
          "Визуальный CSS-селектор — кликаешь элементы на странице, получаешь selector. Незаменим при настройке скрапинга кастомных форумов и сайтов вакансий.",
        rating: "4.7★",
        browsers: "Chrome",
        free: true,
      },
      {
        name: "Instant Data Scraper",
        url: "https://webrobots.io/instantdata/",
        description:
          "Автоматически определяет табличные данные на странице и экспортирует в CSV/XLS. Без настройки — для простых списков (каталоги резюме, списки участников форума).",
        rating: "4.6★",
        browsers: "Chrome, Edge",
        free: true,
      },
      {
        name: "Outwit Hub",
        url: "https://www.outwit.com/",
        description:
          "Продвинутый скрапер с построителем запросов. Извлекает email, ссылки, картинки, таблицы. Для сложных случаев — когда Data Miner не справляется.",
        rating: "4.3★",
        browsers: "Firefox, Chrome",
        free: false,
      },
      {
        name: "Bardeen",
        url: "https://www.bardeen.ai/",
        description:
          "No-code automation: соединяет страницы с Google Sheets, Notion, Slack. Можно построить «найди профиль → сохрани в Sheets → уведоми в Slack». Сильны в recruiting-automation.",
        rating: "4.7★",
        browsers: "Chrome",
        free: true,
      },
    ],
  },
  {
    id: "outreach",
    title: "Outreach и коммуникации",
    icon: <Mail className="h-5 w-5" />,
    accent: "from-rose-500 to-pink-600",
    blurb: "Расширения для email-кампаний, шаблонов и трекинга ответов кандидатам",
    extensions: [
      {
        name: "Mailshake",
        url: "https://mailshake.com/",
        description:
          "Email-outreach с шаблонами, auto-followups и трекингом. Создаёшь последовательность из 3 писем → запускаешь на 50 кандидатов → видишь, кто открыл и ответил.",
        rating: "4.5★",
        browsers: "Chrome (Gmail)",
        free: false,
      },
      {
        name: "Yesware",
        url: "https://www.yesware.com/",
        description:
          "Трекинг открытий и кликов в Gmail + шаблоны + campaigns. Бесплатный план с базовыми фичами. Для outreach к кандидатам — видишь, когда прочитали письмо.",
        rating: "4.4★",
        browsers: "Chrome (Gmail)",
        free: true,
      },
      {
        name: "Mixmax",
        url: "https://www.mixmax.com/",
        description:
          "Gmail-усилитель: tracking, scheduling, templates, sequences. Сильны в recruiting — есть готовые шаблоны outreach к кандидатам. Бесплатный план ограничен.",
        rating: "4.5★",
        browsers: "Chrome (Gmail)",
        free: true,
      },
      {
        name: "Boomerang",
        url: "https://www.boomeranggmail.com/",
        description:
          "Отложенная отправка и напоминания в Gmail. Написал письмо кандидату ночью — запланировал на утро. Не ответил за 3 дня — напомнил себе follow-up.",
        rating: "4.6★",
        browsers: "Chrome, Firefox",
        free: true,
      },
      {
        name: "GMass",
        url: "https://www.gmass.com/",
        description:
          "Массовая рассылка из Gmail с mail-merge (имя в subject). 50 бесплатных/день. Для outreach к long-list из 50 C++-разработчиков —_personal-письма без дорогих платформ.",
        rating: "4.7★",
        browsers: "Chrome (Gmail)",
        free: true,
      },
      {
        name: "Grammarly",
        url: "https://www.grammarly.com/",
        description:
          "Проверка грамматики и стиля в outreach-письмах. Для не-native English — критично, если пишешь кандидатам в международные компании. Бесплатная версия покрывает базовые ошибки.",
        rating: "4.7★",
        browsers: "Chrome, Firefox, Edge, Safari",
        free: true,
      },
    ],
  },
  {
    id: "notes",
    title: "Заметки и организация",
    icon: <FileText className="h-5 w-5" />,
    accent: "from-indigo-500 to-violet-600",
    blurb: "Расширения для заметок о кандидатах, сохранения профилей и организации пайплайна",
    extensions: [
      {
        name: "Notion Web Clipper",
        url: "https://www.notion.so/web-clipper",
        description:
          "Сохраняет страницу кандидата (LinkedIn/GitHub/hh.ru) в Notion с тегами и заметками. Создаёшь database кандидатов с полями: имя, стек, локация, статус. Бесплатно.",
        rating: "4.8★",
        browsers: "Chrome, Firefox, Edge, Safari",
        free: true,
      },
      {
        name: "OneNote Web Clipper",
        url: "https://www.onenote.com/clipper",
        description:
          "Аналог от Microsoft — сохраняет страницу в OneNote. Для команд на Office 365. Полный текст страницы + заметки в одном разделе.",
        rating: "4.5★",
        browsers: "Chrome, Firefox, Edge",
        free: true,
      },
      {
        name: "Toby",
        url: "https://www.gettoby.com/",
        description:
          "Менеджер вкладок — собираешь все профили кандидатов в одну сессию. Сохранил 20 LinkedIn-профилей за раз → открыл их всех одним кликом завтра. Экономит время на multi-source sourcing.",
        rating: "4.7★",
        browsers: "Chrome, Edge",
        free: true,
      },
      {
        name: "Trello",
        url: "https://trello.com/platforms",
        description:
          "Добавляет карточку кандидата на Trello-доску прямо со страницы. Колонки New → Reviewed → Contacted → Replied. Простой Kanban для персонального пайплайна.",
        rating: "4.5★",
        browsers: "Chrome",
        free: true,
      },
      {
        name: "Evernote Web Clipper",
        url: "https://evernote.com/webclipper",
        description:
          "Сохраняет профили кандидатов в Evernote с тегами и заметками. Полный текст страницы + аннотации. Для тех, кто уже использует Evernote как базу знаний.",
        rating: "4.6★",
        browsers: "Chrome, Firefox, Edge, Safari",
        free: true,
      },
      {
        name: "Raindrop.io",
        url: "https://raindrop.io/",
        description:
          "Букмарк-менеджер с тегами и фильтрами. Сохраняешь профили кандидатов с тегами «C++», «Moscow», «senior». Позже фильтруешь по комбинации тегов — получаешь shortlist.",
        rating: "4.7★",
        browsers: "Chrome, Firefox, Edge, Safari",
        free: true,
      },
    ],
  },
  {
    id: "diversity",
    title: "Diversity и проверка",
    icon: <Users className="h-5 w-5" />,
    accent: "from-teal-500 to-emerald-600",
    blurb: "Инструменты для diverse sourcing, проверки background и соцсетей",
    extensions: [
      {
        name: "Textio",
        url: "https://textio.com/",
        description:
          "AI-анализ tone-of-voice в job descriptions и outreach-письмах. Показывает, какие слова отпугивают женщин/minority. Для inclusive recruiting — критично.",
        rating: "4.6★",
        browsers: "веб (extension для JD)",
        free: false,
      },
      {
        name: "Gender Decoder",
        url: "http://gender-decoder.katmatfield.com/",
        description:
          "Бесплатный веб-инструмент — проверяет текст вакансии на gendered language. Простая, но эффективная проверка перед публикацией системной роли.",
        rating: "бесплатно",
        browsers: "веб",
        free: true,
      },
      {
        name: "Crystal",
        url: "https://www.crystalknows.com/",
        description:
          "Определяет DISC-personality типа кандидата по его LinkedIn-профилю. Помогает подобрать тон outreach-письма (формальный/дружеский/технический).",
        rating: "4.4★",
        browsers: "Chrome, Edge",
        free: false,
      },
      {
        name: "HireVue",
        url: "https://www.hirevue.com/",
        description:
          "Видео-интервью с AI-анализом ответов. Не классическое расширение, но важный инструмент для assessment. Используется крупными tech-компаниями для скрининга.",
        rating: "4.2★",
        browsers: "веб",
        free: false,
      },
      {
        name: "Checkr",
        url: "https://checkr.com/",
        description:
          "Background check: criminal records, образование, employment history. Для финальной проверки перед оффером senior-кандидатам. Compliance для US/EU.",
        rating: "4.3★",
        browsers: "веб",
        free: false,
      },
    ],
  },
  {
    id: "xray",
    title: "X-Ray и Boolean-поиск",
    icon: <Search className="h-5 w-5" />,
    accent: "from-amber-500 to-orange-600",
    blurb: "Генераторы Boolean-запросов и x-ray поиска для Google/LinkedIn/GitHub",
    extensions: [
      {
        name: "RecruitEm",
        url: "https://recruitin.net/",
        description:
          "Бесплатный генератор Google x-ray запросов для LinkedIn, GitHub, Twitter, Xing. Вводишь должность+локацию → готовый site:linkedin.com/in запрос. (Уже упомянут в LinkedIn-секции.)",
        rating: "бесплатно",
        browsers: "веб",
        free: true,
      },
      {
        name: "Boolean Search Tool",
        url: "https://www.booleansearchtool.com/",
        description:
          "Бесплатный конструктор Boolean-запросов: AND/OR/NOT, скобки, сохранённые шаблоны. Удобнее, чем писать вручную. Экспорт готовой строки в Google/LinkedIn.",
        rating: "4.4★",
        browsers: "веб",
        free: true,
      },
      {
        name: "G-Loot",
        url: "https://github.com/RayFernando/G-Loot",
        description:
          "Open-source генератор Google x-ray запросов для GitHub-сорсинга. Вводишь язык+локацию+мин-звёзды → готовый site:github.com запрос. Бесплатно, кастомизируется.",
        rating: "open-source",
        browsers: "веб",
        free: true,
      },
      {
        name: "Searchifier",
        url: "https://searchifier.com/",
        description:
          "Расширение превращает Google-запрос в x-ray-запрос для конкретного сайта одним кликом. Находишь «C++ developer Moscow» → добавляешь site:linkedin.com/in → ищешь.",
        rating: "4.3★",
        browsers: "Chrome",
        free: true,
      },
      {
        name: "Sourcing.io",
        url: "https://sourcing.io/",
        description:
          "Платформа для Boolean-сорсинга с готовыми шаблонами по tech-stack. Сильны в GitHub и StackOverflow-сорсинге. Есть browser extension для быстрого билда запросов.",
        rating: "4.4★",
        browsers: "веб + Chrome",
        free: false,
      },
    ],
  },
  {
    id: "salary",
    title: "Зарплаты и аналитика",
    icon: <CreditCard className="h-5 w-5" />,
    accent: "from-purple-500 to-fuchsia-600",
    blurb: "Инструменты для бенчмаркинга зарплат и аналитики рынка",
    extensions: [
      {
        name: "Glassdoor Extension",
        url: "https://www.glassdoor.com/",
        description:
          "Показывает зарплаты и отзывы о компании прямо на её сайте. Для кандидата — понимаешь, какую ЗП предлагать и какая культура у работодателя.",
        rating: "4.3★",
        browsers: "Chrome",
        free: true,
      },
      {
        name: "Levels.fyi",
        url: "https://www.levels.fyi/",
        description:
          "Зарплаты в tech-компаниях с разбивкой по уровням (L3/L4/L5). Для senior-кандидатов в FAANG-подобные компании — референс зарплатных ожиданий. База по РФ ограничена, но растёт.",
        rating: "4.8★",
        browsers: "веб",
        free: true,
      },
      {
        name: "Payscale",
        url: "https://www.payscale.com/",
        description:
          "Зарплатный бенчмаркинг по должности/локации/опыту. Для формирования оффера системному разработчику — обоснованная ЗП с учётом рынка.",
        rating: "4.4★",
        browsers: "веб",
        free: true,
      },
      {
        name: "Хабр.Карьера ЗП",
        url: "https://career.habr.com/salaries",
        description:
          "Российский зарплатный бенчмарк по IT: C++, Go, Rust, Python, DevOps. Лучший источник по РФ-рынку системных разработчиков. Фильтр по городу и грейду.",
        rating: "4.7★",
        browsers: "веб",
        free: true,
      },
      {
        name: "hh.ru Зарплаты",
        url: "https://hh.ru/article/salary",
        description:
          "Зарплатный калькулятор hh.ru по вакансиям и резюме. Покрытие по РФ — самое большое. Для бенчмаркинга СУБД/DevOps/Linux-админов в регионах.",
        rating: "4.5★",
        browsers: "веб",
        free: true,
      },
    ],
  },
];

const BROWSER_BADGE: Record<string, { label: string; color: string }> = {
  Chrome: { label: "Chrome", color: "bg-emerald-500/15 text-emerald-600" },
  Firefox: { label: "Firefox", color: "bg-orange-500/15 text-orange-600" },
  Edge: { label: "Edge", color: "bg-blue-500/15 text-blue-600" },
  Safari: { label: "Safari", color: "bg-sky-500/15 text-sky-600" },
};

export function ExtensionsSection() {
  const [query, setQuery] = React.useState("");

  const totalExtensions = CATEGORIES.reduce(
    (s, c) => s + c.extensions.length,
    0
  );

  // Filter extensions across all categories.
  const filteredCategories = React.useMemo(() => {
    if (!query.trim()) return CATEGORIES;
    const q = query.toLowerCase();
    return CATEGORIES.map((c) => ({
      ...c,
      extensions: c.extensions.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q)
      ),
    })).filter((c) => c.extensions.length > 0);
  }, [query]);

  return (
    <CollapsibleSection
      icon={<Puzzle className="h-5 w-5" />}
      iconAccent="from-fuchsia-500 to-purple-600"
      title="Расширения для браузера"
      subtitle={`${totalExtensions} расширений для рекрутмента — от LinkedIn-сорсинга и поиска контактов до ATS-интеграций и скрапинга`}
      count={totalExtensions}
    >
      {/* Search filter */}
      <div className="relative max-w-md mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск по названию или описанию..."
          className="pl-9 h-9 text-sm"
        />
      </div>

      {/* Categories */}
      <div className="space-y-6">
        {filteredCategories.map((cat) => (
          <ExtensionCategory key={cat.id} category={cat} />
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <div className="text-center py-8 text-sm text-muted-foreground">
          Ничего не найдено по запросу «{query}»
        </div>
      )}
    </CollapsibleSection>
  );
}

function ExtensionCategory({ category }: { category: Category }) {
  return (
    <div>
      {/* Category header */}
      <div className="flex items-center gap-2.5 mb-3">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${category.accent} text-white shadow-sm shrink-0`}
        >
          {category.icon}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-sm leading-tight">{category.title}</h3>
          <p className="text-[11px] text-muted-foreground leading-snug line-clamp-1">
            {category.blurb}
          </p>
        </div>
        <Badge variant="secondary" className="text-[10px] shrink-0">
          {category.extensions.length}
        </Badge>
      </div>

      {/* Extensions grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {category.extensions.map((ext, i) => (
          <ExtensionCard key={i} ext={ext} />
        ))}
      </div>
    </div>
  );
}

function ExtensionCard({ ext }: { ext: Extension }) {
  return (
    <a
      href={ext.url}
      target="_blank"
      rel="noreferrer"
      className="group relative flex flex-col rounded-xl border bg-card p-3.5 hover:border-primary/50 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <h4 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors">
          {ext.name}
        </h4>
        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 shrink-0 transition-opacity" />
      </div>

      <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-3 mb-2 flex-1">
        {ext.description}
      </p>

      {/* Meta: rating, browsers, free/paid */}
      <div className="flex items-center gap-1.5 flex-wrap mt-auto">
        {ext.rating && (
          <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400">
            <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
            {ext.rating}
          </span>
        )}
        {ext.browsers &&
          ext.browsers
            .split(/[,()]/)
            .map((b) => b.trim())
            .filter(Boolean)
            .slice(0, 2)
            .map((b, i) => {
              const badge = BROWSER_BADGE[b];
              return (
                <span
                  key={i}
                  className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[9px] font-medium ${
                    badge ? badge.color : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Chrome className="h-2.5 w-2.5 mr-0.5" />
                  {b}
                </span>
              );
            })}
        {ext.free !== undefined && (
          <span
            className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[9px] font-medium ${
              ext.free
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                : "bg-rose-500/15 text-rose-600 dark:text-rose-400"
            }`}
          >
            {ext.free ? "free" : "paid"}
          </span>
        )}
      </div>
    </a>
  );
}
