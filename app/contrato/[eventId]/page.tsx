"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { aceitarContrato, getEvento } from "@/lib/storage";
import { Evento } from "@/lib/types";
import { formatDateLong } from "@/lib/format";
import logo from "@/public/logo.jpeg";

export default function ContratoPage() {
  const params = useParams<{ eventId: string }>();
  const [evento, setEvento] = useState<Evento | null | undefined>(undefined);
  const [aceite, setAceite] = useState(false);

  useEffect(() => {
    setEvento(getEvento(params.eventId) ?? null);
  }, [params.eventId]);

  function handleConfirmar() {
    const atualizado = aceitarContrato(params.eventId);
    if (atualizado) setEvento(atualizado);
  }

  if (evento === undefined) {
    return <p className="p-6 text-sm text-muted">Carregando...</p>;
  }

  if (evento === null) {
    return <p className="p-6 text-sm text-muted">Contrato não encontrado.</p>;
  }

  return (
    <div className="flex flex-1 flex-col px-6 py-8">
      <div className="mx-auto w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <Image src={logo} alt="Lá Na Cabaninha" width={140} height={124} priority />
          <p className="mt-1 text-sm text-muted">Contrato de locação — festa da(o) {evento.aniversariante}</p>
        </div>

        {evento.contratoAceito ? (
          <div className="rounded-2xl border border-mint-dark/40 bg-mint/20 p-4 text-center">
            <span className="text-3xl">✅</span>
            <p className="mt-2 text-sm font-semibold text-foreground">Contrato já aceito</p>
            <p className="mt-1 text-xs text-muted">
              Confirmado em{" "}
              {evento.contratoAceitoEm
                ? new Date(evento.contratoAceitoEm).toLocaleString("pt-BR")
                : "—"}
            </p>
            <p className="mt-3 text-xs text-muted">
              Nossa equipe já foi avisada e entra em contato pelo WhatsApp em breve. ✨
            </p>
          </div>
        ) : (
          <>
            <div className="rounded-2xl border border-border bg-surface p-4 text-sm">
              <p className="mb-2 rounded-lg bg-pink/30 px-3 py-2 text-xs font-semibold text-pink-dark">
                ⚠️ Texto de exemplo — será substituído pelo contrato oficial enviado pela Lá Na
                Cabaninha.
              </p>
              <h2 className="mb-2 font-semibold">Contrato de Locação de Enxoval e Decoração</h2>
              <div className="space-y-2 text-xs leading-relaxed text-muted">
                <p>
                  <strong className="text-foreground">Evento:</strong> festa da(o) {evento.aniversariante}
                  {evento.idade ? `, ${evento.idade} anos` : ""}, em {formatDateLong(evento.data)}, no
                  endereço {evento.endereco}.
                </p>
                <p>
                  <strong className="text-foreground">1. Objeto:</strong> locação de cabanas,
                  colchonetes, enxoval e itens decorativos descritos na proposta combinada entre
                  as partes.
                </p>
                <p>
                  <strong className="text-foreground">2. Pagamento:</strong> 50% do valor total
                  na reserva da data e o saldo restante no dia do evento, via Pix, salvo acordo
                  diferente combinado diretamente com a Lá Na Cabaninha.
                </p>
                <p>
                  <strong className="text-foreground">3. Montagem e retirada:</strong> a equipe é
                  responsável pela montagem e desmontagem dos itens, em horários previamente
                  combinados.
                </p>
                <p>
                  <strong className="text-foreground">4. Danos e avarias:</strong> o contratante
                  se responsabiliza por danos, manchas ou perdas nos itens locados durante o
                  período do evento.
                </p>
                <p>
                  <strong className="text-foreground">5. Cancelamento:</strong> condições de
                  cancelamento e reembolso conforme política vigente, informada no ato da reserva.
                </p>
              </div>
            </div>

            <label className="mt-4 flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                checked={aceite}
                onChange={(e) => setAceite(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-pink-dark"
              />
              <span className="text-muted">Li e aceito o contrato acima.</span>
            </label>

            <button
              onClick={handleConfirmar}
              disabled={!aceite}
              className="mt-4 w-full rounded-2xl bg-pink-dark px-5 py-3 text-sm font-semibold text-white disabled:opacity-40"
            >
              Confirmar aceite
            </button>
          </>
        )}
      </div>
    </div>
  );
}
