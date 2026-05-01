export interface ModuleDef {
  id: string;
  displayName: string;
}

export const MODULES: readonly ModuleDef[] = [
  { id: "reports", displayName: "Relatórios" },
  { id: "customers", displayName: "Pacientes" },
  { id: "forms", displayName: "Formulários" },
  { id: "calendar", displayName: "Calendário" },
  { id: "ai_light", displayName: "DOX IA" },
  { id: "ai_pro", displayName: "DOX IA Pro" },
  { id: "tracking", displayName: "Acompanhamento" },
  { id: "payments", displayName: "DOX Pagamentos" },
  { id: "financial", displayName: "DOX Financeiro" },
  { id: "files_ocr", displayName: "Arquivos+OCR" },
] as const;

export function moduleDisplayName(id: string): string {
  return MODULES.find((m) => m.id === id)?.displayName ?? id;
}
