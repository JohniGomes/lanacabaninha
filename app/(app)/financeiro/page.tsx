"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "@/lib/role-context";
import {
  addFornecedor,
  addLancamento,
  getFornecedores,
  getLancamentos,
} from "@/lib/storage";
import { formatCurrency, formatDate } from "@/lib/format";
import { StatCard } from "@/components/StatCard";
import { IconTrendingDown, IconTrendingUp, IconWallet } from "@/components/Icons";
import { Fornecedor, LancamentoFinanceiro, TipoLancamento } from "@/lib/types";

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

const CATEGORIAS_FORNECEDOR = [
  "Spa",
  "Criadoras / Decoração",
  "Fornecedora de Pijamas",
  "Fotografia",
  "Outro",
];

const HOJE = new Date().toISOString().slice(0, 10);

type Aba = "lancamentos" | "fornecedores" | "resumo";

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export default function FinanceiroPage() {
  const { role, ready } = useRole();
  const router = useRouter();
  const [aba, setAba] = useState<Aba>("lancamentos");
  const [lancamentos, setLancamentos] = useState<LancamentoFinanceiro[]>([]);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [formAberto, setFormAberto] = useState(false);

  const [tipo, setTipo] = useState<TipoLancamento>("receita");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState(HOJE);

  const [fornecedorFormAberto, setFornecedorFormAberto] = useState(false);
  const [novoFornecedorNome, setNovoFornecedorNome] = useState("");
  const [novoFornecedorCategoria, setNovoFornecedorCategoria] = useState("");

  const [pagamentoFornecedorId, setPagamentoFornecedorId] = useState<string | null>(null);
  const [pagamentoValor, setPagamentoValor] = useState("");
  const [pagamentoData, setPagamentoData] = useState(HOJE);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    if (ready && role && role !== "admin") {
      router.replace("/dashboard");
    }
  }, [ready, role, router]);

  useEffect(() => {
    Promise.all([getLancamentos(), getFornecedores()])
      .then(([l, f]) => {
        setLancamentos(l);
        setFornecedores(f);
      })
      .catch(() => setErro(true))
      .finally(() => setCarregando(false));
  }, []);

  const ordenados = useMemo(
    () => [...lancamentos].sort((a, b) => b.data.localeCompare(a.data)),
    [lancamentos]
  );
  const totalReceitas = ordenados.filter((l) => l.tipo === "receita").reduce((acc, l) => acc + l.valor, 0);
  const totalDespesas = ordenados.filter((l) => l.tipo === "despesa").reduce((acc, l) => acc + l.valor, 0);
  const saldo = totalReceitas - totalDespesas;

  const resumoMensal = useMemo(() => {
    const grupos = new Map<string, { receitas: number; despesas: number }>();
    for (const l of lancamentos) {
      const chave = l.data.slice(0, 7);
      const atual = grupos.get(chave) ?? { receitas: 0, despesas: 0 };
      if (l.tipo === "receita") atual.receitas += l.valor;
      else atual.despesas += l.valor;
      grupos.set(chave, atual);
    }
    return [...grupos.entries()]
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([chave, valores]) => {
        const [ano, mes] = chave.split("-");
        return {
          chave,
          label: `${MESES[Number(mes) - 1]} de ${ano}`,
          receitas: valores.receitas,
          despesas: valores.despesas,
          lucro: valores.receitas - valores.despesas,
        };
      });
  }, [lancamentos]);

  if (!ready || role !== "admin" || carregando) {
    return <p className="text-sm text-muted">Carregando...</p>;
  }

  if (erro) {
    return (
      <p className="rounded-xl border border-pink-dark/30 bg-pink/20 px-4 py-3 text-sm text-pink-dark">
        Não consegui falar com a planilha agora. Confira sua internet e tente de novo.
      </p>
    );
  }

  function podeSalvar() {
    return descricao.trim() && categoria.trim() && data && Number(valor) > 0;
  }

  async function handleSalvar() {
    if (!podeSalvar()) return;
    const novo: LancamentoFinanceiro = {
      id: `lanc-${Date.now()}`,
      descricao: descricao.trim(),
      categoria: categoria.trim(),
      tipo,
      valor: Number(valor),
      data,
    };
    try {
      await addLancamento(novo);
      setLancamentos(await getLancamentos());
      setDescricao("");
      setCategoria("");
      setValor("");
      setData(HOJE);
      setTipo("receita");
      setFormAberto(false);
    } catch {
      setErro(true);
    }
  }

  function podeSalvarFornecedor() {
    return novoFornecedorNome.trim() && novoFornecedorCategoria.trim();
  }

  async function salvarFornecedor() {
    if (!podeSalvarFornecedor()) return;
    try {
      await addFornecedor({
        id: `forn-${Date.now()}`,
        nome: novoFornecedorNome.trim(),
        categoria: novoFornecedorCategoria.trim(),
      });
      setFornecedores(await getFornecedores());
      setNovoFornecedorNome("");
      setNovoFornecedorCategoria("");
      setFornecedorFormAberto(false);
    } catch {
      setErro(true);
    }
  }

  async function registrarPagamento(fornecedor: Fornecedor) {
    if (!pagamentoValor || Number(pagamentoValor) <= 0) return;
    try {
      await addLancamento({
        id: `lanc-${Date.now()}`,
        descricao: `Pagamento - ${fornecedor.nome}`,
        categoria: fornecedor.categoria,
        tipo: "despesa",
        valor: Number(pagamentoValor),
        data: pagamentoData,
        fornecedorId: fornecedor.id,
      });
      setLancamentos(await getLancamentos());
      setPagamentoFornecedorId(null);
      setPagamentoValor("");
      setPagamentoData(HOJE);
    } catch {
      setErro(true);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Financeiro</h1>
        <p className="text-sm text-muted">Controle de caixa da empresa.</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <StatCard icon={<IconWallet className="h-5 w-5" />} label="Saldo de caixa" value={formatCurrency(saldo)} accent="mint" />
        <StatCard icon={<IconTrendingUp className="h-5 w-5" />} label="Receitas" value={formatCurrency(totalReceitas)} accent="pink" />
        <StatCard icon={<IconTrendingDown className="h-5 w-5" />} label="Despesas" value={formatCurrency(totalDespesas)} accent="lilac" />
      </div>

      <div className="flex gap-2 overflow-x-auto">
        <AbaButton label="Lançamentos" ativo={aba === "lancamentos"} onClick={() => setAba("lancamentos")} />
        <AbaButton label="Fornecedores" ativo={aba === "fornecedores"} onClick={() => setAba("fornecedores")} />
        <AbaButton label="Resumo mensal" ativo={aba === "resumo"} onClick={() => setAba("resumo")} />
      </div>

      {aba === "lancamentos" && (
        <>
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
              {ordenados.map((l) => {
                const fornecedor = l.fornecedorId ? fornecedores.find((f) => f.id === l.fornecedorId) : undefined;
                return (
                  <div
                    key={l.id}
                    className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{l.descricao}</p>
                      <p className="text-xs text-muted">
                        {l.categoria} · {formatDate(l.data)}
                        {fornecedor && ` · ${fornecedor.nome}`}
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
                );
              })}
            </div>
          </section>
        </>
      )}

      {aba === "fornecedores" && (
        <>
          {!fornecedorFormAberto ? (
            <button
              onClick={() => setFornecedorFormAberto(true)}
              className="w-full rounded-xl bg-pink-dark px-4 py-3 text-sm font-semibold text-white"
            >
              + Fornecedor
            </button>
          ) : (
            <div className="space-y-3 rounded-2xl border border-border bg-surface p-4">
              <LabeledInput label="Nome" value={novoFornecedorNome} onChange={setNovoFornecedorNome} placeholder="Ex.: Spa Kids Glow" />
              <label className="block text-sm">
                <span className="mb-1 block font-medium text-muted">Categoria</span>
                <input
                  list="categorias-fornecedor"
                  value={novoFornecedorCategoria}
                  onChange={(e) => setNovoFornecedorCategoria(e.target.value)}
                  className="w-full rounded-xl border border-border bg-cream px-3.5 py-2.5 text-sm outline-none focus:border-pink-dark"
                />
                <datalist id="categorias-fornecedor">
                  {CATEGORIAS_FORNECEDOR.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </label>
              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => setFornecedorFormAberto(false)}
                  className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-foreground"
                >
                  Cancelar
                </button>
                <button
                  onClick={salvarFornecedor}
                  disabled={!podeSalvarFornecedor()}
                  className="flex-1 rounded-xl bg-pink-dark px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
                >
                  Salvar
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {fornecedores.map((f) => {
              const totalPago = lancamentos
                .filter((l) => l.fornecedorId === f.id)
                .reduce((acc, l) => acc + l.valor, 0);
              const pagamentoAberto = pagamentoFornecedorId === f.id;
              return (
                <div key={f.id} className="rounded-2xl border border-border bg-surface p-4">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">{f.nome}</p>
                      <p className="text-xs text-muted">{f.categoria}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-pink-dark">{formatCurrency(totalPago)}</p>
                      <p className="text-xs text-muted">total pago</p>
                    </div>
                  </div>

                  {!pagamentoAberto ? (
                    <button
                      onClick={() => setPagamentoFornecedorId(f.id)}
                      className="mt-3 w-full rounded-lg border border-border py-2 text-xs font-semibold text-foreground"
                    >
                      + Registrar pagamento
                    </button>
                  ) : (
                    <div className="mt-3 space-y-2 border-t border-border pt-3">
                      <div className="grid grid-cols-2 gap-2">
                        <LabeledInput label="Valor (R$)" value={pagamentoValor} onChange={setPagamentoValor} type="number" />
                        <LabeledInput label="Data" value={pagamentoData} onChange={setPagamentoData} type="date" />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setPagamentoFornecedorId(null)}
                          className="flex-1 rounded-lg border border-border py-2 text-xs font-semibold text-foreground"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={() => registrarPagamento(f)}
                          disabled={!pagamentoValor || Number(pagamentoValor) <= 0}
                          className="flex-1 rounded-lg bg-pink-dark py-2 text-xs font-semibold text-white disabled:opacity-40"
                        >
                          Confirmar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            {fornecedores.length === 0 && (
              <p className="text-center text-sm text-muted">Nenhum fornecedor cadastrado ainda.</p>
            )}
          </div>
        </>
      )}

      {aba === "resumo" && (
        <div className="space-y-2">
          {resumoMensal.map((m) => (
            <div key={m.chave} className="rounded-2xl border border-border bg-surface p-4">
              <p className="text-sm font-semibold capitalize">{m.label}</p>
              <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-xs text-muted">Receitas</p>
                  <p className="text-sm font-semibold text-mint-dark">{formatCurrency(m.receitas)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted">Despesas</p>
                  <p className="text-sm font-semibold text-pink-dark">{formatCurrency(m.despesas)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted">Lucro</p>
                  <p className={`text-sm font-semibold ${m.lucro >= 0 ? "text-mint-dark" : "text-pink-dark"}`}>
                    {formatCurrency(m.lucro)}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {resumoMensal.length === 0 && (
            <p className="text-center text-sm text-muted">Nenhum lançamento registrado ainda.</p>
          )}
        </div>
      )}
    </div>
  );
}

function AbaButton({ label, ativo, onClick }: { label: string; ativo: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
        ativo ? "bg-pink-dark text-white" : "bg-surface text-muted border border-border"
      }`}
    >
      {label}
    </button>
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
