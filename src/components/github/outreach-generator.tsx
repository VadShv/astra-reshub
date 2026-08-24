"use client";

import * as React from "react";
import { Copy, Check, MessageSquare, Send } from "lucide-react";
import { Candidate } from "./selection-store";
import { toast } from "sonner";

interface OutreachGeneratorProps {
  candidate: Candidate;
}

const TEMPLATES = [
  {
    id: "first",
    label: "Первый контакт",
    template: `Здравствуйте, {{name}}!

Меня зовут [Ваше имя], я технический рекрутер. Обратил внимание на ваш профиль{{source}} — впечатляет ваш опыт с {{stack}}.

У меня есть вакансия: [Позиция] в [Компания]. Удалёнка, [зарплатная вилка].

Подскажите, рассматриваете ли вы сейчас предложения? Был бы рад обсудить детали.

С уважением,
[Ваше имя]`,
  },
  {
    id: "followup",
    label: "Follow-up",
    template: `{{name}}, добрый день!

Пишу повторно по поводу вакансии [Позиция] в [Компания]. Понимаю, что вы могли быть заняты.

Если актуально — буду рад ответить на любые вопросы. Если нет — буду признателен за обратную связь.

С уважением,
[Ваше имя]`,
  },
  {
    id: "referral",
    label: "Реферал",
    template: `Здравствуйте, {{name}}!

Ищу специалиста с опытом {{stack}} для позиции [Позиция] в [Компания]. Возможно, вы знаете кого-то из коллег, кому это может быть интересно?

Буду благодарен за любую рекомендацию.

С уважением,
[Ваше имя]`,
  },
];

function getStack(c: Candidate): string {
  const tags = c.tags || [];
  if (tags.includes("github") && c.bio) {
    const langs = ["C++", "Go", "Rust", "Python", "Linux", "PostgreSQL", "Kubernetes"];
    const found = langs.filter((l) => c.bio!.includes(l));
    if (found.length > 0) return found.join(", ");
  }
  if (c.position) return c.position;
  return "системным программированием";
}

function getSource(c: Candidate): string {
  const tags = c.tags || [];
  if (tags.includes("github")) return " на GitHub";
  if (tags.includes("linkedin")) return " в LinkedIn";
  if (tags.includes("habr")) return " на Хабре";
  if (tags.includes("hh")) return " на hh.ru";
  return "";
}

export function OutreachGenerator({ candidate }: OutreachGeneratorProps) {
  const [selectedTemplate, setSelectedTemplate] = React.useState(0);
  const [copied, setCopied] = React.useState(false);
  const [customText, setCustomText] = React.useState("");

  const name = candidate.name || candidate.login;
  const stack = getStack(candidate);
  const source = getSource(candidate);

  const generated = React.useMemo(() => {
    const tpl = TEMPLATES[selectedTemplate].template;
    return tpl
      .replace(/\{\{name\}\}/g, name)
      .replace(/\{\{stack\}\}/g, stack)
      .replace(/\{\{source\}\}/g, source);
  }, [selectedTemplate, name, stack, source]);

  const text = customText || generated;

  function copy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Скопировано в буфер обмена");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-4 w-4 text-primary" />
        <span className="text-sm font-semibold">Outreach для {name}</span>
      </div>

      <div className="flex gap-2">
        {TEMPLATES.map((t, i) => (
          <button
            key={t.id}
            onClick={() => { setSelectedTemplate(i); setCustomText(""); }}
            className={`rounded-lg border px-3 py-1.5 text-xs transition-all ${
              selectedTemplate === i
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card hover:shadow-sm"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="rounded-lg border bg-muted/30 p-3">
        <div className="text-[10px] text-muted-foreground mb-1">
          Поля: {name} · {stack}{source}
        </div>
        <textarea
          value={text}
          onChange={(e) => setCustomText(e.target.value)}
          className="w-full min-h-[200px] bg-transparent text-sm font-mono resize-y focus:outline-none"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={copy}
          className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm hover:opacity-90 transition-opacity flex-1 justify-center"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Скопировано!" : "Копировать"}
        </button>
        {candidate.email && (
          <a
            href={`mailto:${candidate.email}?subject=${encodeURIComponent("Вакансия — системный разработчик")}&body=${encodeURIComponent(text)}`}
            className="inline-flex items-center gap-2 rounded-lg border bg-card px-4 py-2 text-sm hover:shadow-sm transition-all flex-1 justify-center"
          >
            <Send className="h-4 w-4 text-primary" />
            Отправить
          </a>
        )}
      </div>
    </div>
  );
}
