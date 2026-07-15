"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChecklistItemRow } from "@/components/ChecklistItemRow";
import { IconArrowLeft, IconCheckCircle, IconClock, IconLink } from "@/components/Icons";
import { getEvento, toggleChecklistItem } from "@/lib/storage";
import { colecoes } from "@/lib/mock-data";
import { Evento } from "@/lib/types";
import { formatDateLong } from "@/lib/format";

export default function EventoDetalhePage() {
  const params = useParams<{ eventId: string }>();
  const router = useRouter();
  const [evento, setEvento] = useState<Evento | null | undefined>(undefined);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    setEvento(getEvento(params.eventId) ?? null);
  }, [params.eventId]);

  function copiarLinkContrato() {
    const url = `${window.location.origin}/contrato/${params.eventId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    });
  }

  if (evento === undefined) {
    return <p className="text-sm text-muted">Carregando...</p>;
  }

  if (evento === null) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted">Evento não encontrado.</p>
        <Link href="/calendario" className="text-sm font-semibold text-pink-dark">
          Voltar ao calendário
        </Link>
      </div>
    );
  }

  const colecao = evento.colecaoId ? colecoes.find((c) => c.id === evento.colecaoId) : undefined;
  const retornados = evento.checklist.filter((i) => i.status === "retornado").length;

  function handleToggle(itemId: string) {
    const atualizado = toggleChecklistItem(params.eventId, itemId);
    if (atualizado) setEvento(atualizado);
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.push("/calendario")}
        className="flex items-center gap-1 text-sm font-medium text-muted"
      >
        <IconArrowLeft className="h-4 w-4" /> Voltar
      </button>

      <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-wide text-pink-dark">
          {formatDateLong(evento.data)} · {evento.horario}
        </p>
        <h1 className="mt-1 text-xl font-semibold">
          {evento.aniversariante}
          {evento.idade ? ` · ${evento.idade} anos` : ""}
        </h1>
        <p className="text-sm text-muted">
          {colecao ? `Experiência Assinada — ${colecao.nome}` : `${evento.tema} (Personalizada)`}
        </p>

        <dl className="mt-4 space-y-1.5 text-sm">
          <Row label="Contato" value={`${evento.contatoNome}${evento.contatoTelefone ? " · " + evento.contatoTelefone : ""}`} />
          <Row label="Endereço" value={evento.endereco} />
          {evento.responsavelMontagem && <Row label="Montagem" value={evento.responsavelMontagem} />}
          {evento.horarioRecreacao && <Row label="Recreação" value={evento.horarioRecreacao} />}
          {evento.horarioSpa && <Row label="Spa" value={evento.horarioSpa} />}
          {evento.corFavorita && <Row label="Cores favoritas" value={evento.corFavorita} />}
          {evento.corNaoGosta && <Row label="Evitar" value={evento.corNaoGosta} />}
          {evento.naoPodeFaltar && <Row label="Não pode faltar" value={evento.naoPodeFaltar} />}
          {evento.observacoes && <Row label="Obs." value={evento.observacoes} />}
        </dl>
      </div>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Contrato</h2>
        {evento.contratoAceito ? (
          <div className="flex items-center gap-2 rounded-xl border border-mint-dark/40 bg-mint/20 px-4 py-3 text-sm">
            <IconCheckCircle className="h-5 w-5 shrink-0 text-mint-dark" />
            <div>
              <span className="font-semibold text-foreground">Aceito</span>
              <span className="block text-xs text-muted">
                {evento.contratoAceitoEm ? new Date(evento.contratoAceitoEm).toLocaleString("pt-BR") : ""}
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-3 text-sm">
              <IconClock className="h-5 w-5 shrink-0 text-muted" />
              <span className="font-semibold text-foreground">Aguardando aceite</span>
            </div>
            <button
              onClick={copiarLinkContrato}
              className="w-full rounded-xl border border-dashed border-pink-dark/50 bg-pink/20 px-4 py-2.5 text-left text-xs text-pink-dark"
            >
              <span className="flex items-center gap-1.5 font-semibold">
                <IconLink className="h-4 w-4" /> {copiado ? "Link copiado!" : "Copiar link do contrato"}
              </span>
            </button>
          </div>
        )}
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Checklist</h2>
          <span className="rounded-full bg-mint/40 px-2.5 py-0.5 text-xs font-semibold text-mint-dark">
            {retornados}/{evento.checklist.length} retornados
          </span>
        </div>
        <div className="space-y-2">
          {evento.checklist.map((item) => (
            <ChecklistItemRow key={item.id} item={item} onToggle={handleToggle} />
          ))}
        </div>
        <p className="mt-3 text-center text-xs text-muted">Toque num item pra alternar o status</p>
      </section>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="w-28 shrink-0 text-muted">{label}</dt>
      <dd className="text-foreground">{value}</dd>
    </div>
  );
}
