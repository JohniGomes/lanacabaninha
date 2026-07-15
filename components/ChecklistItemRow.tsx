"use client";

import { useState } from "react";
import { ChecklistItem } from "@/lib/types";
import { IconAlertTriangle } from "./Icons";

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

export function ChecklistItemRow({
  item,
  onToggleStatus,
  onMarcarDanificado,
  onDesmarcarDanificado,
}: {
  item: ChecklistItem;
  onToggleStatus: (itemId: string) => void;
  onMarcarDanificado: (itemId: string, observacao: string) => void;
  onDesmarcarDanificado: (itemId: string) => void;
}) {
  const [formAberto, setFormAberto] = useState(false);
  const [observacao, setObservacao] = useState("");

  function salvar() {
    if (!observacao.trim()) return;
    onMarcarDanificado(item.id, observacao.trim());
    setFormAberto(false);
    setObservacao("");
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <button
        onClick={() => onToggleStatus(item.id)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-transform active:scale-[0.98]"
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

      {item.danificado ? (
        <div className="flex items-start gap-2 border-t border-border bg-pink/15 px-4 py-2.5">
          <IconAlertTriangle className="h-4 w-4 shrink-0 translate-y-0.5 text-pink-dark" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-pink-dark">Danificado</p>
            <p className="text-xs text-muted">{item.observacaoDano}</p>
          </div>
          <button
            onClick={() => onDesmarcarDanificado(item.id)}
            className="shrink-0 text-xs font-semibold text-muted underline"
          >
            Remover
          </button>
        </div>
      ) : formAberto ? (
        <div className="space-y-2 border-t border-border px-4 py-3">
          <textarea
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
            placeholder="O que aconteceu com o item?"
            rows={2}
            className="w-full rounded-lg border border-border bg-cream px-3 py-2 text-xs outline-none focus:border-pink-dark"
          />
          <div className="flex gap-2">
            <button
              onClick={() => setFormAberto(false)}
              className="flex-1 rounded-lg border border-border py-1.5 text-xs font-semibold text-foreground"
            >
              Cancelar
            </button>
            <button
              onClick={salvar}
              disabled={!observacao.trim()}
              className="flex-1 rounded-lg bg-pink-dark py-1.5 text-xs font-semibold text-white disabled:opacity-40"
            >
              Salvar
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setFormAberto(true)}
          className="w-full border-t border-border px-4 py-2 text-left text-xs text-muted"
        >
          Marcar como danificado
        </button>
      )}
    </div>
  );
}
