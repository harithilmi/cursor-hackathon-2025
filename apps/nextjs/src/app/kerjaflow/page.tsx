"use client";

import { useRouter } from "next/navigation";
import { LoginView } from "./_components/login-view";
import { StatusFooter } from "./_components/status-footer";

export default function KerjaFlowLoginPage() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/kerjaflow/dump");
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
