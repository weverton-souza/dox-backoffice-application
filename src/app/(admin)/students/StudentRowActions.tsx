"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AdminStudentVerification } from "@/lib/api/students";
import ApproveStudentDialog from "./ApproveStudentDialog";
import RejectStudentDialog from "./RejectStudentDialog";

interface Props {
  verification: AdminStudentVerification;
}

export default function StudentRowActions({ verification }: Props) {
  const [open, setOpen] = useState<"approve" | "reject" | null>(null);

  if (verification.status !== "PENDING") {
    return verification.status === "REJECTED" && verification.rejectionReason ? (
      <span
        className="text-xs text-muted-foreground"
        title={verification.rejectionReason}
      >
        Ver motivo
      </span>
    ) : null;
  }

  return (
    <>
      <div className="flex items-center justify-end gap-1">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Aprovar"
          onClick={() => setOpen("approve")}
        >
          <Check className="h-4 w-4 text-success" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Rejeitar"
          onClick={() => setOpen("reject")}
        >
          <X className="h-4 w-4 text-danger" />
        </Button>
      </div>
      <ApproveStudentDialog
        verificationId={verification.id}
        open={open === "approve"}
        onClose={() => setOpen(null)}
      />
      <RejectStudentDialog
        verificationId={verification.id}
        open={open === "reject"}
        onClose={() => setOpen(null)}
      />
    </>
  );
}
