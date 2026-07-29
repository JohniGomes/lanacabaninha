"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Evento } from "@/lib/types";
import { colecoes } from "@/lib/mock-data";
import { formatDate } from "@/lib/format";
import { IconPencil, IconTrash } from "./Icons";

export function EventCard({
  evento,
  onExcluir,
}: {
  evento: Evento;
  onExcluir: (id: string) => void;
}) {
  const router = useRouter();
  const colecao = evento.colecaoId ? colecoes.find((c) => c.id === evento.colecaoId) : undefined;

  function editar(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/calendario/${evento.id}`);
  }

  function excluir(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm(`Excluir a festa de ${evento.aniversariante}? Essa ação não pode ser desfeita.`)) return;
    onExcluir(evento.id);
  }

  return (
    <Link
      href={`/calendario/${evento.id}`}
      className="relative block rounded-2xl border border-border bg-surface p-4 shadow-sm transition-transform active:scale-[0.98]"
    >
      <div className="absolute right-3 top-3 flex items-center gap-1">
        <button
          onClick={editar}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-muted"
          aria-label={`Editar ${evento.aniversariante}`}
        >
          <IconPencil className="h-4 w-4" />
        </button>
        <button
          onClick={excluir}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-muted"
          aria-label={`Excluir ${evento.aniversariante}`}
        >
          <IconTrash className="h-4 w-4" />
        </button>
      </div>
      <div className="min-w-0 pr-16">
        <p className="text-xs font-medium uppercase tracking-wide text-pink-dark">
          {formatDate(evento.data)} · {evento.horario}
        </p>
        <p className="truncate text-base font-semibold text-foreground">
          {evento.aniversariante}
          {evento.idade ? ` · ${evento.idade} anos` : ""}
        </p>
        <p className="truncate text-sm text-muted">
          {colecao ? colecao.nome : evento.tema}
        </p>
        <p className="truncate text-xs text-muted">{evento.endereco}</p>
      </div>
    </Link>
  );
}
