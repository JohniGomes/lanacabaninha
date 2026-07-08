"use client";

import { useRouter } from "next/navigation";
import { useRole } from "@/lib/role-context";
import { Role } from "@/lib/types";

export default function LoginPage() {
  const { login } = useRole();
  const router = useRouter();

  function handleLogin(role: Role) {
    login(role);
    router.push("/dashboard");
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
      <div className="mb-10 flex flex-col items-center text-center">
        <span className="text-5xl">⛺️</span>
        <h1 className="mt-2 font-display text-5xl text-pink-dark">Lá Na Cabaninha</h1>
        <p className="mt-2 text-sm text-muted">
          Organização de festas, financeiro e atendimento em um só lugar
        </p>
      </div>

      <div className="w-full max-w-xs space-y-3">
        <button
          onClick={() => handleLogin("admin")}
          className="w-full rounded-2xl bg-pink-dark px-5 py-4 text-left text-white shadow-sm transition-transform active:scale-[0.98]"
        >
          <span className="block text-base font-semibold">Entrar como Admin</span>
          <span className="block text-xs text-white/80">
            Visão completa: eventos, checklist e financeiro
          </span>
        </button>

        <button
          onClick={() => handleLogin("colaborador")}
          className="w-full rounded-2xl bg-lilac-dark px-5 py-4 text-left text-white shadow-sm transition-transform active:scale-[0.98]"
        >
          <span className="block text-base font-semibold">Entrar como Colaborador</span>
          <span className="block text-xs text-white/80">
            Eventos e checklist, sem acesso ao financeiro
          </span>
        </button>
      </div>

      <p className="mt-8 max-w-xs text-center text-xs text-muted">
        Protótipo de demonstração — login simulado, sem senha.
      </p>
    </div>
  );
}
