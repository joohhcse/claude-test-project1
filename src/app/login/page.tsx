import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <main className="flex h-full items-center justify-center bg-muted">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 sm:p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-primary">Mall Admin</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            관리자 계정으로 로그인하세요
          </p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
