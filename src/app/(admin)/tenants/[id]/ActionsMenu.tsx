"use client";

import { useState } from "react";
import { ChevronDown, Gift, CalendarPlus, Lock, LockOpen } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import GrantModuleDialog from "./GrantModuleDialog";
import ExtendTrialDialog from "./ExtendTrialDialog";
import PriceLockDialog from "./PriceLockDialog";

interface Props {
  tenantId: string;
  allLocked: boolean;
  hasModules: boolean;
}

type DialogId = "grant" | "extend" | "lock" | null;

export default function ActionsMenu({ tenantId, allLocked, hasModules }: Props) {
  const [open, setOpen] = useState<DialogId>(null);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className={buttonVariants({ variant: "outline" })}>
          Ações
          <ChevronDown className="ml-1 h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={() => setOpen("grant")} className="cursor-pointer">
            <Gift className="mr-2 h-4 w-4" />
            Conceder módulo grátis
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen("extend")} className="cursor-pointer">
            <CalendarPlus className="mr-2 h-4 w-4" />
            Estender trial
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setOpen("lock")}
            disabled={!hasModules}
            className="cursor-pointer"
          >
            {allLocked ? (
              <>
                <LockOpen className="mr-2 h-4 w-4" />
                Desbloquear preço
              </>
            ) : (
              <>
                <Lock className="mr-2 h-4 w-4" />
                Marcar como Founding Member
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <GrantModuleDialog
        tenantId={tenantId}
        open={open === "grant"}
        onClose={() => setOpen(null)}
      />
      <ExtendTrialDialog
        tenantId={tenantId}
        open={open === "extend"}
        onClose={() => setOpen(null)}
      />
      <PriceLockDialog
        tenantId={tenantId}
        unlockMode={allLocked}
        open={open === "lock"}
        onClose={() => setOpen(null)}
      />
    </>
  );
}
