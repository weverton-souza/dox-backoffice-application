import { fetchAdminMe } from "@/lib/api/auth";
import UserMenu from "./UserMenu";

export default async function TopBar() {
  const me = await fetchAdminMe();

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-6">
      <div className="md:hidden text-base font-semibold text-foreground">DOX Admin</div>
      <div className="hidden md:block" />
      {me && <UserMenu name={me.name} email={me.email} role={me.role} />}
    </header>
  );
}
