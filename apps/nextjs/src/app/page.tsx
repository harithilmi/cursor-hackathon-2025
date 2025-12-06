"use client";

import { useRouter } from "next/navigation";
import { LoginView } from "./kerjaflow/_components/login-view";
import { StatusFooter } from "./kerjaflow/_components/status-footer";

export default function HomePage() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/dump");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-8">
      <main className="px-6">
        <LoginView onLogin={handleLogin} />
      </main>
      <StatusFooter />
    </div>
  );
}
