import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { findTerm } from "@/lib/glossary";

interface TermHintProps {
  termId: string;
  className?: string;
}

export default function TermHint({ termId, className }: TermHintProps) {
  const term = findTerm(termId);
  if (!term) return null;

  return (
    <Tooltip>
      <TooltipTrigger
        aria-label={`O que é ${term.label}?`}
        className={
          "ml-1 inline-flex items-center text-muted-foreground hover:text-foreground" +
          (className ? ` ${className}` : "")
        }
      >
        <HelpCircle className="h-3.5 w-3.5" />
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs text-xs leading-relaxed">
        <span className="block">
          <strong className="block text-[11px] uppercase tracking-wide opacity-80">
            {term.label}
          </strong>
          {term.description}
        </span>
      </TooltipContent>
    </Tooltip>
  );
}
