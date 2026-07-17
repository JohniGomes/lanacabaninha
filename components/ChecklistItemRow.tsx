"use client";

import { useState } from "react";
import { ChecklistItem, EstoqueItem } from "@/lib/types";
import { IconAlertTriangle, IconPencil, IconTrash } from "./Icons";

const STATUS_STYLE: Record<ChecklistItem["status"], string> = {
  pendente: "bg-zinc-100 text-zinc-500",
  enviado: "bg-pink/40 text-pink-dark",
  retornado: "bg-mint/40 text-mint-dark",
};

const STATUS_LABEL: Record<ChecklistItem["status"], string> = {
  pendente: "Pendente",
  enviado: "Enviado",
  retornado: "Retornado",
};

function rotuloEstoque(item: EstoqueItem) {
  return `${item.categoria} — ${item.nome}`;
}

export function ChecklistItemRow({
  item,
  estoqueItens,
  onToggleStatus,
  onMarcarDanificado,
  onDesmarcarDanificado,
  onEditar,
  onExcluir,
}: {
  item: ChecklistItem;
  estoqueItens: EstoqueItem[];
  onToggleStatus: (itemId: string) => void;
  onMarcarDanificado: (
    itemId: string,
    dados: { observacao: string; estoqueItemId?: string; quantidadeDanificada?: number }
  ) => void;
  onDesmarcarDanificado: (itemId: string) => void;
  onEditar: (itemId: string, dados: { nome: string; quantidade: number }) => void;
  onExcluir: (itemId: string) => void;
}) {
  const [formDanoAberto, setFormDanoAberto] = useState(false);
  const [observacao, setObservacao] = useState("");
  const [estoqueBusca, setEstoqueBusca] = useState("");
  const [quantidadeDano, setQuantidadeDano] = useState("1");

  const [editando, setEditando] = useState(false);
  const [editNome, setEditNome] = useState(item.nome);
  const [editQuantidade, setEditQuantidade] = useState(String(item.quantidade));

  const estoqueVinculado = item.estoqueItemId
    ? estoqueItens.find((e) => e.id === item.estoqueItemId)
    : undefined;

  function salvarDano() {
    if (!observacao.trim()) return;
    const estoqueItem = estoqueItens.find((e) => rotuloEstoque(e) === estoqueBusca);
    onMarcarDanificado(item.id, {
      observacao: observacao.trim(),
      estoqueItemId: estoqueItem?.id,
      quantidadeDanificada: estoqueItem ? Number(quantidadeDano) || 1 : undefined,
    });
    setFormDanoAberto(false);
    setObservacao("");
    setEstoqueBusca("");
    setQuantidadeDano("1");
  }

  function salvarEdicao() {
    if (!editNome.trim() || Number(editQuantidade) <= 0) return;
    onEditar(item.id, { nome: editNome.trim(), quantidade: Number(editQuantidade) });
    setEditando(false);
  }

  function excluir() {
    if (!window.confirm(`Excluir "${item.nome}" da checklist?`)) return;
    onExcluir(item.id);
  }

  const datalistId = `estoque-${item.id}`;

  if (editando) {
    return (
      <div className="space-y-2 rounded-xl border border-border bg-surface p-3">
        <div className="grid grid-cols-3 gap-2">
          <input
            value={editNome}
            onChange={(e) => setEditNome(e.target.value)}
            className="col-span-2 rounded-lg border border-border bg-cream px-3 py-2 text-sm outline-none focus:border-pink-dark"
          />
          <input
            type="number"
            min={1}
            value={editQuantidade}
            onChange={(e) => setEditQuantidade(e.target.value)}
            className="rounded-lg border border-border bg-cream px-3 py-2 text-sm outline-none focus:border-pink-dark"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setEditando(false)}
            className="flex-1 rounded-lg border border-border py-1.5 text-xs font-semibold text-foreground"
          >
            Cancelar
          </button>
          <button
            onClick={salvarEdicao}
            className="flex-1 rounded-lg bg-pink-dark py-1.5 text-xs font-semibold text-white"
          >
            Salvar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="flex items-center gap-1.5 px-2 py-2">
        <button
          onClick={() => onToggleStatus(item.id)}
          className="flex flex-1 items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-left transition-transform active:scale-[0.98]"
        >
          <span className="text-sm">
            <span className="font-medium">{item.quantidade}x</span> {item.nome}
          </span>
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLE[item.status]}`}
          >
            {STATUS_LABEL[item.status]}
          </span>
        </button>
        <button
          onClick={() => setEditando(true)}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted"
          aria-label={`Editar ${item.nome}`}
        >
          <IconPencil className="h-4 w-4" />
        </button>
        <button
          onClick={excluir}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted"
          aria-label={`Excluir ${item.nome}`}
        >
          <IconTrash className="h-4 w-4" />
        </button>
      </div>

      {item.danificado ? (
        <div className="flex items-start gap-2 border-t border-border bg-pink/15 px-4 py-2.5">
          <IconAlertTriangle className="h-4 w-4 shrink-0 translate-y-0.5 text-pink-dark" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-pink-dark">
              Danificado{item.quantidadeDanificada ? ` (${item.quantidadeDanificada})` : ""}
            </p>
            {estoqueVinculado && (
              <p className="text-xs text-pink-dark/80">Estoque: {rotuloEstoque(estoqueVinculado)}</p>
            )}
            <p className="text-xs text-muted">{item.observacaoDano}</p>
          </div>
          <button
            onClick={() => onDesmarcarDanificado(item.id)}
            className="shrink-0 text-xs font-semibold text-muted underline"
          >
            Remover
          </button>
        </div>
      ) : formDanoAberto ? (
        <div className="space-y-2 border-t border-border px-4 py-3">
          <label className="block text-xs">
            <span className="mb-1 block font-medium text-muted">Item do estoque (opcional)</span>
            <input
              list={datalistId}
              value={estoqueBusca}
              onChange={(e) => setEstoqueBusca(e.target.value)}
              placeholder="Buscar item real do estoque"
              className="w-full rounded-lg border border-border bg-cream px-3 py-2 text-xs outline-none focus:border-pink-dark"
            />
            <datalist id={datalistId}>
              {estoqueItens.map((e) => (
                <option key={e.id} value={rotuloEstoque(e)} />
              ))}
            </datalist>
          </label>
          <label className="block text-xs">
            <span className="mb-1 block font-medium text-muted">Quantidade danificada</span>
            <input
              type="number"
              min={1}
              value={quantidadeDano}
              onChange={(e) => setQuantidadeDano(e.target.value)}
              className="w-full rounded-lg border border-border bg-cream px-3 py-2 text-xs outline-none focus:border-pink-dark"
            />
          </label>
          <textarea
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
            placeholder="O que aconteceu com o item?"
            rows={2}
            className="w-full rounded-lg border border-border bg-cream px-3 py-2 text-xs outline-none focus:border-pink-dark"
          />
          <div className="flex gap-2">
            <button
              onClick={() => setFormDanoAberto(false)}
              className="flex-1 rounded-lg border border-border py-1.5 text-xs font-semibold text-foreground"
            >
              Cancelar
            </button>
            <button
              onClick={salvarDano}
              disabled={!observacao.trim()}
              className="flex-1 rounded-lg bg-pink-dark py-1.5 text-xs font-semibold text-white disabled:opacity-40"
            >
              Salvar
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setFormDanoAberto(true)}
          className="w-full border-t border-border px-4 py-2 text-left text-xs text-muted"
        >
          Marcar como danificado
        </button>
      )}
    </div>
  );
}
