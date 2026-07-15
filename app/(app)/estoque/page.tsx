"use client";

import { useEffect, useMemo, useState } from "react";
import {
  addEstoqueItem,
  deleteEstoqueItem,
  desmarcarDanificado,
  getEstoque,
  getEventos,
  updateEstoqueItem,
} from "@/lib/storage";
import { Evento, EstoqueItem } from "@/lib/types";
import { IconAlertTriangle, IconTrash } from "@/components/Icons";
import { formatDate } from "@/lib/format";

export default function EstoquePage() {
  const [itens, setItens] = useState<EstoqueItem[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [busca, setBusca] = useState("");
  const [abertas, setAbertas] = useState<Set<string>>(new Set());
  const [formAberto, setFormAberto] = useState(false);

  const [novaCategoria, setNovaCategoria] = useState("");
  const [novoNome, setNovoNome] = useState("");
  const [novaQuantidade, setNovaQuantidade] = useState("1");

  useEffect(() => {
    setItens(getEstoque());
    setEventos(getEventos());
  }, []);

  const itensDanificados = useMemo(
    () =>
      eventos.flatMap((evento) =>
        evento.checklist
          .filter((item) => item.danificado)
          .map((item) => ({ evento, item }))
      ),
    [eventos]
  );

  function resolverDano(eventoId: string, itemId: string) {
    desmarcarDanificado(eventoId, itemId);
    setEventos(getEventos());
  }

  const categorias = useMemo(
    () => [...new Set(itens.map((i) => i.categoria))].sort((a, b) => a.localeCompare(b)),
    [itens]
  );

  const buscaNormalizada = busca.trim().toLowerCase();

  const porCategoria = useMemo(() => {
    const map = new Map<string, EstoqueItem[]>();
    for (const cat of categorias) {
      const doGrupo = itens
        .filter((i) => i.categoria === cat)
        .filter((i) => !buscaNormalizada || i.nome.toLowerCase().includes(buscaNormalizada))
        .sort((a, b) => a.nome.localeCompare(b.nome));
      if (doGrupo.length > 0) map.set(cat, doGrupo);
    }
    return map;
  }, [categorias, itens, buscaNormalizada]);

  function toggleCategoria(cat: string) {
    setAbertas((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }

  function alterarQuantidade(id: string, delta: number) {
    const atual = itens.find((i) => i.id === id);
    if (!atual) return;
    const nova = Math.max(0, atual.quantidade + delta);
    updateEstoqueItem(id, nova);
    setItens(getEstoque());
  }

  function excluirItem(id: string, nome: string) {
    if (!window.confirm(`Excluir "${nome}" do estoque?`)) return;
    deleteEstoqueItem(id);
    setItens(getEstoque());
  }

  function podeSalvar() {
    return novaCategoria.trim() && novoNome.trim() && Number(novaQuantidade) >= 0;
  }

  function salvarNovoItem() {
    if (!podeSalvar()) return;
    addEstoqueItem({
      id: `est-custom-${Date.now()}`,
      categoria: novaCategoria.trim(),
      nome: novoNome.trim(),
      quantidade: Number(novaQuantidade),
    });
    setItens(getEstoque());
    setAbertas((prev) => new Set(prev).add(novaCategoria.trim()));
    setNovaCategoria("");
    setNovoNome("");
    setNovaQuantidade("1");
    setFormAberto(false);
  }

  const totalItens = itens.length;
  const totalUnidades = itens.reduce((acc, i) => acc + i.quantidade, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Estoque</h1>
        <p className="text-sm text-muted">
          {totalItens} itens cadastrados · {totalUnidades} unidades no total
        </p>
      </div>

      {itensDanificados.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
            Itens danificados
          </h2>
          <div className="space-y-2">
            {itensDanificados.map(({ evento, item }) => (
              <div
                key={`${evento.id}-${item.id}`}
                className="flex items-start gap-2 rounded-xl border border-pink-dark/30 bg-pink/15 px-4 py-3"
              >
                <IconAlertTriangle className="h-4 w-4 shrink-0 translate-y-0.5 text-pink-dark" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{item.nome}</p>
                  <p className="text-xs text-muted">
                    {evento.aniversariante} · {formatDate(evento.data)}
                  </p>
                  <p className="mt-0.5 text-xs text-pink-dark">{item.observacaoDano}</p>
                </div>
                <button
                  onClick={() => resolverDano(evento.id, item.id)}
                  className="shrink-0 rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-semibold text-foreground"
                >
                  Resolver
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      <input
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        placeholder="Buscar item (ex.: cabana rosa)"
        className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-pink-dark"
      />

      {!formAberto ? (
        <button
          onClick={() => setFormAberto(true)}
          className="w-full rounded-xl bg-pink-dark px-4 py-3 text-sm font-semibold text-white"
        >
          + Novo item
        </button>
      ) : (
        <div className="space-y-3 rounded-2xl border border-border bg-surface p-4">
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-muted">Categoria</span>
            <input
              list="categorias-estoque"
              value={novaCategoria}
              onChange={(e) => setNovaCategoria(e.target.value)}
              placeholder="Ex.: Cabanas"
              className="w-full rounded-xl border border-border bg-cream px-3.5 py-2.5 text-sm outline-none focus:border-pink-dark"
            />
            <datalist id="categorias-estoque">
              {categorias.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </label>

          <label className="block text-sm">
            <span className="mb-1 block font-medium text-muted">Item</span>
            <input
              value={novoNome}
              onChange={(e) => setNovoNome(e.target.value)}
              placeholder="Ex.: Cabana Rosa Claro"
              className="w-full rounded-xl border border-border bg-cream px-3.5 py-2.5 text-sm outline-none focus:border-pink-dark"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block font-medium text-muted">Quantidade</span>
            <input
              type="number"
              min={0}
              value={novaQuantidade}
              onChange={(e) => setNovaQuantidade(e.target.value)}
              className="w-full rounded-xl border border-border bg-cream px-3.5 py-2.5 text-sm outline-none focus:border-pink-dark"
            />
          </label>

          <div className="flex gap-3 pt-1">
            <button
              onClick={() => setFormAberto(false)}
              className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-foreground"
            >
              Cancelar
            </button>
            <button
              onClick={salvarNovoItem}
              disabled={!podeSalvar()}
              className="flex-1 rounded-xl bg-pink-dark px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
            >
              Salvar
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {[...porCategoria.entries()].map(([categoria, itensDoGrupo]) => {
          const aberta = abertas.has(categoria) || buscaNormalizada.length > 0;
          const totalCategoria = itensDoGrupo.reduce((acc, i) => acc + i.quantidade, 0);
          return (
            <div key={categoria} className="overflow-hidden rounded-2xl border border-border bg-surface">
              <button
                onClick={() => toggleCategoria(categoria)}
                className="flex w-full items-center justify-between px-4 py-3 text-left"
              >
                <span className="text-sm font-semibold">{categoria}</span>
                <span className="flex items-center gap-2 text-xs text-muted">
                  {itensDoGrupo.length} itens · {totalCategoria} un.
                  <span className={`transition-transform ${aberta ? "rotate-180" : ""}`}>▾</span>
                </span>
              </button>
              {aberta && (
                <div className="space-y-1.5 border-t border-border p-3 pt-2">
                  {itensDoGrupo.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-2 rounded-xl bg-cream px-3 py-2"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm">{item.nome}</p>
                        {item.nota && <p className="text-xs text-muted">{item.nota}</p>}
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5">
                        <button
                          onClick={() => alterarQuantidade(item.id, -1)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface text-sm font-semibold text-pink-dark"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-sm font-semibold">{item.quantidade}</span>
                        <button
                          onClick={() => alterarQuantidade(item.id, 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface text-sm font-semibold text-mint-dark"
                        >
                          +
                        </button>
                        <button
                          onClick={() => excluirItem(item.id, item.nome)}
                          className="ml-1 flex h-7 w-7 items-center justify-center rounded-lg text-muted"
                          aria-label={`Excluir ${item.nome}`}
                        >
                          <IconTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {porCategoria.size === 0 && (
          <p className="text-center text-sm text-muted">Nenhum item encontrado.</p>
        )}
      </div>
    </div>
  );
}
