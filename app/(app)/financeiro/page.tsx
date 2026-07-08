"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "@/lib/role-context";
import { getLancamentos } from "@/lib/storage";
import { formatCurrency, formatDate } from "@/lib/format";
import { StatCard } from "@/components/StatCard";

export default function FinanceiroPage() {
  const { role, ready } = useRole();
  const router = useRouter();

  useEffect(() => {
    if (ready && role && role !== "admin") {
      router.replace("/dashboard");
    }
  }, [ready, role, router]);

  if (!ready || role !== "admin") {
    return <p className="text-sm text-muted">Carregando...</p>;
  }

  const lancamentos = [...getLancamentos()].sort((a, b) => b.data.localeCompare(a.data));
  const totalReceitas = lancamentos.filter((l) => l.tipo === "receita").reduce((acc, l) => acc + l.valor, 0);
  const totalDespesas = lancamentos.filter((l) => l.tipo === "despesa").reduce((acc, l) => acc + l.valor, 0);
  const saldo = totalReceitas - totalDespesas;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Financeiro</h1>
        <p className="text-sm text-muted">Controle de caixa da empresa.</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <StatCard icon="💰" label="Saldo de caixa" value={formatCurrency(saldo)} accent="mint" />
        <StatCard icon="📈" label="Receitas" value={formatCurrency(totalReceitas)} accent="pink" />
        <StatCard icon="📉" label="Despesas" value={formatCurrency(totalDespesas)} accent="lilac" />
      </div>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
          Lançamentos
        </h2>
        <div className="space-y-2">
          {lancamentos.map((l) => (
            <div
              key={l.id}
              className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{l.descricao}</p>
                <p className="text-xs text-muted">
                  {l.categoria} · {formatDate(l.data)}
                </p>
              </div>
              <span
                className={`shrink-0 text-sm font-semibold ${
                  l.tipo === "receita" ? "text-mint-dark" : "text-pink-dark"
                }`}
              >
                {l.tipo === "receita" ? "+" : "-"} {formatCurrency(l.valor)}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
