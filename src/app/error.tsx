"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h2 className="text-2xl font-bold">Что-то пошло не так</h2>
      <p className="max-w-md text-center text-muted-foreground">
        Произошла непредвиденная ошибка. Попробуйте перезагрузить страницу.
      </p>
      <div className="flex gap-2">
        <Button onClick={reset} variant="default">
          Повторить
        </Button>
        <Button onClick={() => window.location.reload()} variant="outline">
          Перезагрузить
        </Button>
      </div>
    </div>
  );
}
