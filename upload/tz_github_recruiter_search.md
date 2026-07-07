# Техническое задание

## GitHub Talent Radar — сервис поиска разработчиков для рекрутеров

**Версия:** 1.0
**Дата:** июль 2026
**Автор:** Владимир
**Статус:** Draft для обсуждения

---

## 1. Vision и продуктовая философия

### 1.1. Проблема

Рекрутеры технических вакансий тратят **60–80% времени** на ручной сорсинг: перебор LinkedIn, кросс-матч с GitHub, догадки о реальном скилле кандидата по резюме. GitHub — самая честная база разработчиков в мире (код не врёт), но:

- Нативный поиск GitHub заточен под разработчиков, а не рекрутеров (нет фильтров по «активности за 90 дней», «open to work», «senior по коду»).
- Инструменты типа AmazingHiring/HireEZ дорогие ($500–2000/мес), медленные, не показывают **почему** кандидат подходит.
- Нет ни одного сервиса, где рекрутер **хочет** проводить рабочий день — все они functional, но не delightful.

### 1.2. Миссия

> Сделать инструмент, в который рекрутер заходит **каждое утро с кофе**, потому что там красиво, быстро и каждый клик приносит инсайт.

### 1.3. Ключевые продуктовые принципы

1. **Speed first.** Любой поиск — < 800 мс до первых результатов (стриминг).
2. **Explainability.** Каждый кандидат в выдаче объяснён: «почему он в топе».
3. **Signal over noise.** Не 10 000 профилей, а 50 релевантных с dossier.
4. **Recruiter joy.** UI-игровизация: streaks, achievements, saved hunts, «карточки» как в Tinder.
5. **AI-native, не AI-wrapper.** LLM встроен в pipeline извлечения сигналов, а не прикручен как чат сбоку.

---

## 2. Целевая аудитория и персоны

### 2.1. Primary: Tech Recruiter (внутренний или агентский)

- **Боль:** нужно закрыть 8–15 сложных tech-вакансий, LinkedIn выжат, менеджер требует «purple squirrels».
- **Цель:** найти 20 качественных лидов в день, из них 5 ответят.

### 2.2. Secondary: Sourcer / Researcher

- **Боль:** нужно быстро собрать long-list из 200 инженеров по узкому стеку (например, «Rust + CUDA + опыт с vLLM»).
- **Цель:** экспорт в CSV/ATS за 15 минут.

### 2.3. Tertiary: Hiring Manager / Tech Lead

- **Боль:** валидация shortlist от рекрутера, проверка «а он реально писал такое?»
- **Цель:** 2 клика — увидеть код, стиль, review-этику.

---

## 3. Функциональные требования

### 3.1. Поиск и фильтрация

#### 3.1.1. Query Builder (три режима)

**A. Natural Language (default для новичка)**
```
"Senior Python-разработчик из Восточной Европы,
последние 6 месяцев коммитил в LLM-проекты,
знает PyTorch и работал с inference-серверами"
```
LLM парсит в structured filters → показывает пользователю что понял → даёт править.

**B. Structured Filters (default для sourcer)**
- Языки (с весами): `Python >= 60%, Rust >= 20%`
- Локация: страна, город, timezone-диапазон
- Опыт: годы активности на GitHub (proxy для seniority)
- Активность: коммиты за N дней, PRs, issues, stars
- Стек / библиотеки: `imports: torch, transformers, vllm`
- Компания (из bio / email / коммитов): `NOT in [Google, Meta, ...]`
- Followers/following, «socialness»
- Наличие контактов: email из commits, twitter, personal site
- Open source-этика: mergerate, review-culture

**C. Query DSL (для power-user)**
```
lang:python>=0.6 lang:rust>=0.1
loc:(RU|BY|KZ|GE|AM)
active:>=commits(30d, 15)
imports:(torch, transformers)
!company:(faang)
has:email
```

#### 3.1.2. Semantic Search по коду и профилю

- Векторная БД (**pgvector** — знакомо тебе) на README + bio + топ-репо.
- Запрос «people who build RAG systems» → релевантно, даже если слова «RAG» нет в профиле.
- Гибрид: **BM25 + vector rerank** (Reciprocal Rank Fusion).

#### 3.1.3. Similar Profiles («more like this»)

- Клик на профиль → «покажи 20 похожих».
- Векторная близость по эмбеддингам кода + профиля.

---

### 3.2. Candidate Card (сердце продукта)

Профиль — не список полей, а **dossier с историей**:

**Верхняя секция**
- Аватар, имя, локация (с флагом), timezone, «активен X часов назад».
- **Match Score 0–100** с брейкдауном по критериям (bar chart).
- **Seniority Estimate** (Junior/Mid/Senior/Staff) — вычислена ML-моделью на основе:
  - глубины коммитов (не только «fix typo»),
  - review-активности,
  - сложности мерджей,
  - возраста аккаунта × активности.
- **Availability Signal:** зелёный / жёлтый / красный:
  - 🟢 «Open to work» в bio, недавняя смена компании, всплеск pet-project активности
  - 🟡 стабильная активность, «дремлет»
  - 🔴 недавно нанят / супер-активен на текущей работе

**Средняя секция — «Почему он в топе»**
LLM-генерируемый абзац на 3–4 предложения:
> «Владимир — senior Python-разработчик из Москвы. Последние 4 месяца активно контрибьютит в vLLM и собственный ATS-проект с pgvector. Судя по коммитам, глубоко понимает inference-оптимизацию и attention-механизмы. Стабильный ритм 20+ коммитов в неделю указывает на full-time-занятость, но pet-project на Nuxt 4 намекает на желание сменить фокус.»

**Нижняя секция — вкладки**
1. **Code** — топ-5 репо с языками, звёздами, последним пушем.
2. **Timeline** — heatmap контрибуций + аннотированные пики («перешёл на Rust», «начал новый проект»).
3. **Stack** — облако технологий с частотой (Python 62%, Docker 15%…).
4. **Network** — граф связей: коллеги по орг-репо, кого ревьюит, кто ревьюит его.
5. **Contact** — email (из public commits), twitter, LinkedIn (найденный кросс-матч), сайт.
6. **AI Insights** — сгенерированный по требованию отчёт: strengths, weaknesses, best pitch angle.

---

### 3.3. Sourcing Workflow

#### 3.3.1. Hunts (сохранённые поиски)

- Именованный набор фильтров + список кандидатов.
- Уведомление, когда в hunt попадает новый матч (по расписанию).
- Совместное использование внутри команды.

#### 3.3.2. Pipelines (Kanban)

Колонки: **New → Reviewed → Contacted → Replied → Interested → Rejected**. Drag-and-drop. Bulk-actions.

#### 3.3.3. Outreach Assistant

- LLM генерирует **персонализированный первый месседж** на основе профиля:
  - на английском / русском / немецком (авто-детект языка бывшей активности),
  - с конкретной отсылкой к репо кандидата («видел твой PR в vLLM про paged attention…»),
  - в 3 tone-стилях: formal / casual / technical-peer.
- A/B-тест сравнения response-rate по темплейтам.
- Отправка через интеграции (Gmail / Outlook / LinkedIn API, где возможно).

#### 3.3.4. Экспорт

- CSV / XLSX / JSON.
- **Direct push в ATS:** Greenhouse, Lever, Workable, HuntFlow (для RU-рынка), + твой собственный ATS через Webhook.
- Формат совместим с bulk-import.

---

### 3.4. Recruiter Delight (то, почему он ХОЧЕТ заходить)

#### 3.4.1. Daily Radar
Утренний экран: «Сегодня 12 новых кандидатов подходят под твои активные hunts. 3 из них — high-signal».

#### 3.4.2. Streaks & Achievements
- 🔥 «7 дней подряд сорсинга»
- 🏆 «Первый ответ от Staff Engineer»
- 🎯 «Заполнил pipeline на 100%»
(опционально включается на уровне организации)

#### 3.4.3. Serendipity Widget
«Случайный интересный профиль дня» — тот, кого рекрутер бы не нашёл, но кто удивит: например, разработчик из редкой страны с уникальным стеком.

#### 3.4.4. Insights Feed
Аналитика по рынку:
- «В Тбилиси за месяц +34% активных Rust-разработчиков»
- «Ex-Yandex инженеры массово переходят в open-source»

#### 3.4.5. Speed
Всё, что можно сделать клавиатурой — делается клавиатурой (`Cmd+K` command palette, hotkeys как в Linear).

---

## 4. Нефункциональные требования

| Параметр | Требование |
|---|---|
| Time to first result | < 800 мс (стриминг) |
| Full search (10k candidates) | < 4 с |
| Индекс актуальности | обновление профиля не старше 24 ч |
| Uptime | 99.5% |
| Concurrent users | 500 rps на search |
| GDPR / 152-ФЗ | full compliance, право на удаление |
| Роли | Admin / Recruiter / Viewer / Guest-link |
| SSO | Google, Microsoft, Okta |
| Языки UI | RU, EN (архитектура под i18n) |
| Accessibility | WCAG 2.1 AA |

---

## 5. Архитектура

### 5.1. High-level

```
┌────────────────────────────────────────────────────────────┐
│  Frontend: Nuxt 4 (Vue 3), TailwindCSS, Pinia              │
└────────────────────────────────────────────────────────────┘
                            │  GraphQL + SSE (streaming)
┌────────────────────────────────────────────────────────────┐
│  API Gateway: FastAPI / Nest                               │
│  ├── Auth (JWT + SSO)                                      │
│  ├── Rate limiter                                          │
│  └── GraphQL router                                        │
└────────────────────────────────────────────────────────────┘
      │                    │                    │
┌──────────┐        ┌──────────────┐    ┌────────────────┐
│ Search   │        │ Enrichment   │    │ LLM Gateway    │
│ Service  │        │ Service      │    │ (vLLM / API)   │
│ (BM25 +  │        │ (email, LI   │    │ Qwen/DeepSeek  │
│ pgvector)│        │ crossmatch)  │    │ + fallback     │
└──────────┘        └──────────────┘    └────────────────┘
      │                    │                    │
      └──────────┬─────────┴────────────────────┘
                 │
       ┌─────────────────────┐
       │  PostgreSQL 16      │
       │  + pgvector         │
       │  + timescale        │
       └─────────────────────┘
                 │
       ┌─────────────────────┐
       │  Ingestion Workers  │
       │  (Celery / Arq)     │
       │  ├── GitHub GraphQL │
       │  ├── GH REST        │
       │  ├── GH Archive     │
       │  └── Enrichers      │
       └─────────────────────┘
```

### 5.2. Data Ingestion

**Источники:**
1. **GitHub GraphQL API v4** — профили, репо, коммиты, реакции.
2. **GitHub REST API** — то, чего нет в GraphQL (events, contributions detail).
3. **GHArchive (gharchive.org)** — исторические события, для батч-заливки.
4. **Public commit emails** — извлечение из `git log` клонированных репо (только public).
5. **Cross-match источники:** LinkedIn public (Bright Data / аналог), Twitter/X, personal sites из bio.

**Стратегия обхода rate-limits GitHub:**
- Пул из **20–50 App-токенов** (GitHub Apps с ротацией).
- Приоритетная очередь: свежие поиски рекрутеров > фоновый refresh.
- Кэш профиля: TTL 24 ч, инвалидируется по webhook, если репо кандидата обновился.

### 5.3. ML / LLM Pipeline

| Задача | Модель | Где крутится |
|---|---|---|
| Парсинг NL-запроса → фильтры | Qwen2.5-7B fine-tuned | vLLM self-hosted |
| Эмбеддинги профилей | bge-m3 или Qwen3-embed | self-hosted |
| Seniority classifier | XGBoost на 40 признаках | on-prem |
| Availability predictor | LightGBM | on-prem |
| Dossier generation | DeepSeek-V3 / Claude Sonnet | API + cache |
| Outreach messages | Claude Opus / GPT-5 | API |

**Fine-tune датасет для NL-парсинга:** 5 000 запросов рекрутеров, размеченных вручную (стартовый seed) + RLHF по кликам в проде.

### 5.4. Индекс

- PostgreSQL как source of truth.
- **Meilisearch / Typesense** для full-text (языки, био, репо-имена).
- **pgvector (HNSW)** для семантики.
- **Redis** для hot-cache профилей.
- Разделение по шардам: по регионам активности (RU/EU/US/APAC).

---

## 6. Основные пользовательские сценарии (User Flows)

### 6.1. Первый вход рекрутера
1. SSO-логин через Google.
2. Онбординг: 3 вопроса («какие роли закрываешь?», «регион?», «стек?»).
3. Готовый demo-hunt заполняется — вау-эффект в первые 30 секунд.

### 6.2. Дневной цикл
1. **Утром:** Daily Radar → 12 новых матчей → 3 быстрых review.
2. **Днём:** новый hunt по свежей вакансии → NL-запрос → 40 кандидатов → shortlist из 8.
3. **Аутрич:** генерация писем → отправка → трек ответов.
4. **Вечером:** insights feed + achievement pop-up.

### 6.3. Массовый сорсинг
1. Sourcer открывает Query Builder → 15 фильтров → 500 кандидатов.
2. Bulk-review в режиме «Tinder» (свайп vs. list-view).
3. Экспорт 120 отобранных в CSV → пуш в ATS.

---

## 7. Метрики успеха

| Метрика | Целевое значение к 6 мес |
|---|---|
| DAU / MAU | ≥ 55% (реально «залипают») |
| Среднее время сессии | ≥ 22 мин |
| Кандидатов сохранено на юзера/день | ≥ 15 |
| Response rate на LLM-outreach vs baseline | +40% |
| Time-to-shortlist для новой вакансии | −70% |
| NPS среди рекрутеров | ≥ 55 |
| Retention M3 | ≥ 60% |

---

## 8. Roadmap (MVP → v1.0)

### Sprint 1–2 (недели 1–4): Foundation
- Инжест GitHub-данных по 3 стартовым регионам (RU, EU, US).
- PostgreSQL + pgvector схема.
- Basic search (structured filters), no LLM.

### Sprint 3–4 (недели 5–8): Core Search
- Query Builder UI (Nuxt).
- Candidate Card v1.
- BM25 + vector hybrid.

### Sprint 5–6 (недели 9–12): AI Layer
- NL-парсинг запросов.
- LLM-генерация dossier «почему в топе».
- Seniority classifier.

### Sprint 7–8 (недели 13–16): Recruiter Delight
- Hunts + Pipelines.
- Outreach Assistant.
- Экспорт + первый ATS-коннектор (Greenhouse / HuntFlow).

### Sprint 9–10 (недели 17–20): Polish
- Daily Radar, streaks, achievements.
- Insights feed.
- SSO, роли, GDPR-контур.

### Post-MVP
- LinkedIn cross-match.
- Team collaboration (комментарии, @-mentions).
- Кастомные ML-скоры (клиент задаёт свою формулу).
- Mobile companion app (свайп-режим в метро).

---

## 9. Риски и меры

| Риск | Меры |
|---|---|
| GitHub rate-limits | Пул токенов, GHArchive для истории, aggressive cache |
| GDPR / 152-ФЗ по личным данным | Только public data, opt-out эндпоинт, DPA-документация |
| LinkedIn ToS при кросс-матче | Использовать licensed providers (Bright Data / Coresignal) |
| Галлюцинации LLM в dossier | Все факты — с цитатой источника (repo URL, commit hash) |
| Стоимость LLM на масштабе | Self-hosted для базовых задач (Qwen), API только для premium |
| Конкуренция с HireEZ / AmazingHiring | Ставка на UX + Recruiter Delight, а не на объём БД |

---

## 10. Стек (рекомендация с учётом твоих предпочтений)

- **Frontend:** Nuxt 4, Vue 3, TailwindCSS, shadcn-vue, Pinia
- **Backend:** FastAPI (Python), gRPC для inter-service
- **DB:** PostgreSQL 16, pgvector, TimescaleDB для метрик
- **Search:** Meilisearch + pgvector hybrid
- **Queue:** Arq (Redis-based, легковеснее Celery)
- **LLM Infra:** vLLM на Yandex Cloud GPU (A100/H100), API-fallback на Claude/DeepSeek
- **Observability:** OpenTelemetry, Grafana, Loki
- **CI/CD:** GitHub Actions → Yandex Cloud K8s
- **IaC:** Terraform

---

## 11. Открытые вопросы для обсуждения

1. **Монетизация:** SaaS-подписка ($99–299/мес per seat) или credit-based (за раскрытие контакта)?
2. **Гео-приоритет запуска:** RU/СНГ (нет сильного локального конкурента) или глобально сразу?
3. **Данные вне GitHub:** LinkedIn через licensed providers или только органика?
4. **Публичный API:** предоставлять сторонним ATS-разработчикам?
5. **On-prem-версия** для крупных клиентов с requirement данных внутри контура?

---

*Документ живой. Следующий шаг — валидация с 5 действующими tech-рекрутерами и уточнение приоритетов MVP.*
