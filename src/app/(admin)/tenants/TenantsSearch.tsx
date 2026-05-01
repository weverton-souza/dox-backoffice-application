"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Props {
  initial: string;
}

export default function TenantsSearch({ initial }: Props) {
  const router = useRouter();
  const [value, setValue] = useState(initial);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (value === initial) return;
    const handle = setTimeout(() => {
      const params = new URLSearchParams();
      if (value.trim()) params.set("search", value.trim());
      const query = params.toString();
      startTransition(() => {
        router.replace(`/tenants${query ? `?${query}` : ""}`);
      });
    }, 400);
    return () => clearTimeout(handle);
  }, [value, initial, router]);

  return (
    <div className="relative w-72">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Buscar por nome..."
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="pl-9"
      />
    </div>
  );
}
