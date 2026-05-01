import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6 rounded-2xl bg-card p-8 shadow-card">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">DOX Backoffice</h1>
          <p className="text-sm text-muted-foreground">Acesso restrito a administradores</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
