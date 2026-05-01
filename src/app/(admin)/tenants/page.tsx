import { fetchAdminMe } from "@/lib/api/auth";
import LogoutButton from "./LogoutButton";

export default async function TenantsPage() {
  const me = await fetchAdminMe();

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4">
      <div className="w-full max-w-md space-y-3 rounded-2xl bg-card p-6 shadow-card">
        <h1 className="text-xl font-semibold text-foreground">Tenants</h1>
        <p className="text-sm text-muted-foreground">Tela em construção. Vem no PR 6.</p>
        {me && (
          <div className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
            <div>Logado como <span className="font-medium text-foreground">{me.name}</span></div>
            <div className="text-xs">{me.email} · {me.role}</div>
          </div>
        )}
        <LogoutButton />
      </div>
    </main>
  );
}
