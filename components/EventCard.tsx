import Link from "next/link";
import { Evento } from "@/lib/types";
import { colecoes } from "@/lib/mock-data";
import { formatDate } from "@/lib/format";

export function EventCard({ evento }: { evento: Evento }) {
  const colecao = evento.colecaoId ? colecoes.find((c) => c.id === evento.colecaoId) : undefined;

  return (
    <Link
      href={`/calendario/${evento.id}`}
      className="block rounded-2xl border border-border bg-surface p-4 shadow-sm transition-transform active:scale-[0.98]"
    >
      <div className="min-w-0">
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
