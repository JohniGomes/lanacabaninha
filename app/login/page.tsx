"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRole } from "@/lib/role-context";
import logo from "@/public/logo.jpeg";

export default function LoginPage() {
  const { login } = useRole();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ok = login(email, senha);
    if (ok) {
      router.push("/dashboard");
    } else {
      setErro(true);
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
      <div className="mb-6 flex flex-col items-center text-center">
        <Image src={logo} alt="Lá Na Cabaninha" width={220} height={196} priority />
        <p className="mt-1 text-sm text-muted">
          Organização de festas, financeiro e atendimento em um só lugar
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-3">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-muted">E-mail</span>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErro(false);
            }}
            className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-pink-dark"
            autoComplete="username"
            required
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-muted">Senha</span>
          <input
            type="password"
            value={senha}
            onChange={(e) => {
              setSenha(e.target.value);
              setErro(false);
            }}
            className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-pink-dark"
            autoComplete="current-password"
            required
          />
        </label>

        {erro && (
          <p className="text-xs font-medium text-pink-dark">E-mail ou senha incorretos.</p>
        )}

        <button
          type="submit"
          className="w-full rounded-2xl bg-pink-dark px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition-transform active:scale-[0.98]"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
