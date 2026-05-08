"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AdminError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[admin] erro na rota:", error);
  }, [error]);

  return (
    <main className="flex flex-1 items-center justify-center p-6 md:p-8">
      <Card className="w-full max-w-lg shadow-card">
        <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger/15 text-danger">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Não foi possível carregar
            </h2>
            <p className="text-sm text-muted-foreground">
              {error.message || "Erro inesperado ao buscar dados do backoffice."}
            </p>
            {error.digest ? (
              <p className="text-xs text-muted-foreground">ref: {error.digest}</p>
            ) : null}
          </div>
          <Button onClick={() => reset()} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Tentar de novo
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
