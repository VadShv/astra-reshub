"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  useSuggestedToolsStore,
  TOOL_CATEGORIES,
} from "./suggested-tools-store";

interface SuggestToolDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SuggestToolDialog({ open, onOpenChange }: SuggestToolDialogProps) {
  const addTool = useSuggestedToolsStore((s) => s.addTool);
  const [name, setName] = React.useState("");
  const [url, setUrl] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [contact, setContact] = React.useState("");

  function reset() {
    setName("");
    setUrl("");
    setCategory("");
    setDescription("");
    setContact("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !url.trim()) {
      toast.error("Заполните название и URL");
      return;
    }
    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith("http")) {
      normalizedUrl = "https://" + normalizedUrl;
    }
    addTool({
      name: name.trim(),
      url: normalizedUrl,
      category: category || "other",
      description: description.trim(),
      contact: contact.trim(),
    });
    toast.success("Инструмент предложен!");
    reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Предложить инструмент</DialogTitle>
          <DialogDescription>
            Знаете полезный источник для поиска разработчиков? Предложите его —
            он появится в разделе «Предложенные» внизу страницы.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tool-name">Название *</Label>
            <Input
              id="tool-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например: Kaggle"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tool-url">URL *</Label>
            <Input
              id="tool-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://kaggle.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tool-category">Категория</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="tool-category">
                <SelectValue placeholder="Выберите категорию" />
              </SelectTrigger>
              <SelectContent>
                {TOOL_CATEGORIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tool-desc">Описание</Label>
            <Textarea
              id="tool-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Чем этот источник полезен для сорсинга?"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tool-contact">Ваше имя / контакт</Label>
            <Input
              id="tool-contact"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Необязательно"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Отмена
            </Button>
            <Button type="submit">Отправить</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
