"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "@/lib/role-context";
import { addLancamento, getLancamentos } from "@/lib/storage";
import { formatCurrency, formatDate } from "@/lib/format";
import { StatCard } from "@/components/StatCard";
import { LancamentoFinanceiro, TipoLancamento } from "@/lib/types";

const CATEGORIAS_SUGERIDAS = [
  "Reserva (sinal)",
  "Saldo final",
  "Opcionais",
  "Compra de itens",
  "Enxoval / Lavanderia",
  "Transporte / Frete",
  "Marketing",
  "Manutenção",
];

const HOJE = new Date().toISOString().slice(0, 10);

export default function FinanceiroPage() {
  const { role, ready } = useRole();
  const router = useRouter();
  const [lancamentos, setLancamentos] = useState<LancamentoFinanceiro[]>([]);
  const [formAberto, setFormAberto] = useState(false);

  const [tipo, setTipo] = useState<TipoLancamento>("receita");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState(HOJE);

  useEffect(() => {
    if (ready && role && role !== "admin") {
      router.replace("/dashboard");
    }
  }, [ready, role, router]);

  useEffect(() => {
    setLancamentos(getLancamentos());
  }, []);

  const ordenados = useMemo(
    () => [...lancamentos].sort((a, b) => b.data.localeCompare(a.data)),
    [lancamentos]
  );
  const totalReceitas = ordenados.filter((l) => l.tipo === "receita").reduce((acc, l) => acc + l.valor, 0);
  const totalDespesas = ordenados.filter((l) => l.tipo === "despesa").reduce((acc, l) => acc + l.valor, 0);
  const saldo = totalReceitas - totalDespesas;

  if (!ready || role !== "admin") {
    return <p className="text-sm text-muted">Carregando...</p>;
  }

  function podeSalvar() {
    return descricao.trim() && categoria.trim() && data && Number(valor) > 0;
  }

  function handleSalvar() {
    if (!podeSalvar()) return;
    const novo: LancamentoFinanceiro = {
      id: `lanc-${Date.now()}`,
      descricao: descricao.trim(),
      categoria: categoria.trim(),
      tipo,
      valor: Number(valor),
      data,
    };
    addLancamento(novo);
    setLancamentos(getLancamentos());
    setDescricao("");
    setCategoria("");
    setValor("");
    setData(HOJE);
    setTipo("receita");
    setFormAberto(false);
  }

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

      {!formAberto ? (
        <button
          onClick={() => setFormAberto(true)}
          className="w-full rounded-xl bg-pink-dark px-4 py-3 text-sm font-semibold text-white"
        >
          + Novo lançamento
        </button>
      ) : (
        <div className="space-y-3 rounded-2xl border border-border bg-surface p-4">
          <div className="flex gap-2">
            <button
              onClick={() => setTipo("receita")}
              className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold ${
                tipo === "receita" ? "bg-mint/60 text-mint-dark" : "bg-zinc-100 text-muted"
              }`}
            >
              Receita
            </button>
            <button
              onClick={() => setTipo("despesa")}
              className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold ${
                tipo === "despesa" ? "bg-pink/60 text-pink-dark" : "bg-zinc-100 text-muted"
              }`}
            >
              Despesa
            </button>
          </div>

          <LabeledInput label="Descrição" value={descricao} onChange={setDescricao} placeholder="Ex.: Sinal 50% - Festa Beatriz" />

          <label className="block text-sm">
            <span className="mb-1 block font-medium text-muted">Categoria</span>
            <input
              list="categorias-sugeridas"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full rounded-xl border border-border bg-cream px-3.5 py-2.5 text-sm outline-none focus:border-pink-dark"
            />
            <datalist id="categorias-sugeridas">
              {CATEGORIAS_SUGERIDAS.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <LabeledInput label="Valor (R$)" value={valor} onChange={setValor} type="number" />
            <LabeledInput label="Data" value={data} onChange={setData} type="date" />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              onClick={() => setFormAberto(false)}
              className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-foreground"
            >
              Cancelar
            </button>
            <button
              onClick={handleSalvar}
              disabled={!podeSalvar()}
              className="flex-1 rounded-xl bg-pink-dark px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
            >
              Salvar
            </button>
          </div>
        </div>
      )}

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
          Lançamentos
        </h2>
        <div className="space-y-2">
          {ordenados.map((l) => (
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

function LabeledInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-muted">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-border bg-cream px-3.5 py-2.5 text-sm outline-none focus:border-pink-dark"
      />
    </label>
  );
}
