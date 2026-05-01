import type { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { Toaster } from "@/components/ui/sonner";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-1">
      <Sidebar />
      <div className="flex min-h-full flex-1 flex-col">
        <TopBar />
        <div className="flex flex-1 flex-col bg-background">{children}</div>
        <Toaster />
      </div>
    </div>
  );
}
