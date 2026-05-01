"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  async function handleLogout() {
    setSubmitting(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      setSubmitting(false);
      router.push("/login");
      router.refresh();
    }
  }

  return (
    <Button variant="outline" className="w-full" onClick={handleLogout} disabled={submitting}>
      {submitting ? "Saindo..." : "Sair"}
    </Button>
  );
}
