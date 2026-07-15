"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { aceitarContrato, getEvento } from "@/lib/storage";
import { Evento } from "@/lib/types";
import { formatCurrency, formatDateLong } from "@/lib/format";
import { IconCheckCircle, IconClock } from "@/components/Icons";
import logo from "@/public/logo.jpeg";

export default function ContratoPage() {
  const params = useParams<{ eventId: string }>();
  const [evento, setEvento] = useState<Evento | null | undefined>(undefined);
  const [aceite, setAceite] = useState(false);
  const [cpf, setCpf] = useState("");
  const [rg, setRg] = useState("");

  useEffect(() => {
    const e = getEvento(params.eventId) ?? null;
    setEvento(e);
    if (e) {
      setCpf(e.cpfContratante ?? "");
      setRg(e.rgContratante ?? "");
    }
  }, [params.eventId]);

  function handleConfirmar() {
    if (!cpf.trim() || !rg.trim()) return;
    const atualizado = aceitarContrato(params.eventId, { cpf: cpf.trim(), rg: rg.trim() });
    if (atualizado) setEvento(atualizado);
  }

  if (evento === undefined) {
    return <p className="p-6 text-sm text-muted">Carregando...</p>;
  }

  if (evento === null) {
    return <p className="p-6 text-sm text-muted">Contrato não encontrado.</p>;
  }

  const termosCompletos = Boolean(evento.valorContrato && evento.formaPagamento);

  return (
    <div className="flex flex-1 flex-col px-6 py-8">
      <div className="mx-auto w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <Image src={logo} alt="Lá Na Cabaninha" width={140} height={124} priority />
          <p className="mt-1 text-sm text-muted">Contrato de prestação de serviços — festa da(o) {evento.aniversariante}</p>
        </div>

        {evento.contratoAceito ? (
          <div className="rounded-2xl border border-mint-dark/40 bg-mint/20 p-4 text-center">
            <IconCheckCircle className="mx-auto h-8 w-8 text-mint-dark" />
            <p className="mt-2 text-sm font-semibold text-foreground">Contrato já aceito</p>
            <p className="mt-1 text-xs text-muted">
              Confirmado em{" "}
              {evento.contratoAceitoEm
                ? new Date(evento.contratoAceitoEm).toLocaleString("pt-BR")
                : "—"}
            </p>
            <p className="mt-3 text-xs text-muted">
              Nossa equipe já foi avisada e entra em contato pelo WhatsApp em breve.
            </p>
          </div>
        ) : !termosCompletos ? (
          <div className="rounded-2xl border border-border bg-surface p-4 text-center">
            <IconClock className="mx-auto h-8 w-8 text-muted" />
            <p className="mt-2 text-sm font-semibold text-foreground">
              Aguardando confirmação de valores
            </p>
            <p className="mt-1 text-xs text-muted">
              Nossa equipe está finalizando os detalhes da sua festa. Assim que o valor e a forma
              de pagamento forem confirmados, o contrato completo aparece aqui neste mesmo link.
            </p>
          </div>
        ) : (
          <>
            <div className="rounded-2xl border border-border bg-surface p-4 text-sm">
              <h2 className="mb-3 text-center font-semibold uppercase tracking-wide">
                Contrato de Prestação de Serviços
              </h2>

              <div className="space-y-3 text-xs leading-relaxed text-muted">
                <p>
                  <strong className="text-foreground">Contratada:</strong> Lá Na Cabaninha – CNPJ
                  49.659.400/0001-00
                </p>

                <div>
                  <p className="font-semibold text-foreground">Contratante</p>
                  <p>Nome: {evento.contatoNome}</p>
                  <p>Telefone: {evento.contatoTelefone || "—"}</p>
                  <p>E-mail: {evento.contatoEmail || "—"}</p>
                  <p>Endereço: {evento.endereco}</p>
                </div>

                <div>
                  <p className="font-semibold text-foreground">Dados do evento</p>
                  <p>Data: {formatDateLong(evento.data)}</p>
                  <p>Endereço: {evento.endereco}</p>
                  {evento.quantidadeCabanas && <p>Quantidade de cabanas: {evento.quantidadeCabanas}</p>}
                  <p>Valor do contrato: {formatCurrency(evento.valorContrato!)}</p>
                  <p>Forma de pagamento: {evento.formaPagamento}</p>
                </div>

                {evento.itensAlugados && (
                  <div>
                    <p className="font-semibold text-foreground">Itens alugados</p>
                    <p className="whitespace-pre-line">{evento.itensAlugados}</p>
                  </div>
                )}

                {evento.itensAdicionais && (
                  <div>
                    <p className="font-semibold text-foreground">Itens de compra / serviços adicionais</p>
                    <p className="whitespace-pre-line">{evento.itensAdicionais}</p>
                  </div>
                )}

                <p>
                  <strong className="text-foreground">Objeto:</strong> locação, montagem,
                  desmontagem e retirada dos materiais descritos acima.
                </p>
                <p>
                  <strong className="text-foreground">Pagamento:</strong> 50% na assinatura para
                  reserva da data e 50% restantes até o dia da montagem da festa.
                </p>
                <p>
                  <strong className="text-foreground">Cancelamento:</strong> cancelamentos por
                  iniciativa da contratante terão retenção de 30% do valor do contrato.
                </p>
                <p>
                  <strong className="text-foreground">Montagem:</strong> a contratante deverá
                  disponibilizar espaço adequado, retirar móveis quando necessário, disponibilizar
                  vaga de garagem, vaga de visitante ou área de carga e descarga próxima ao
                  elevador de serviço ou ao local da montagem para facilitar o transporte dos
                  materiais.
                </p>
                <p>
                  <strong className="text-foreground">Prazo da locação:</strong> a locação terá
                  duração de até 24 horas contadas a partir da montagem, podendo ser estendida
                  mediante acordo entre as partes e disponibilidade da contratada.
                </p>
                <p>
                  <strong className="text-foreground">Oficinas e recreação:</strong> será
                  disponibilizado 1 profissional para até 12 crianças. Acima dessa quantidade
                  poderá ser necessária a contratação de profissionais adicionais, mediante
                  alinhamento prévio.
                </p>
                <p>
                  <strong className="text-foreground">Conservação dos materiais:</strong> itens
                  perdidos, quebrados, rasgados, manchados ou danificados serão cobrados conforme
                  o custo de reparo ou reposição de cada item. Proibida a utilização de slime,
                  chiclete, marshmallow ou quaisquer materiais que possam grudar ou manchar os
                  materiais.
                </p>
                <p>
                  <strong className="text-foreground">Foro:</strong> fica eleito o foro da Comarca
                  de São Paulo/SP.
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <label className="block text-sm">
                <span className="mb-1 block font-medium text-muted">CPF</span>
                <input
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  placeholder="000.000.000-00"
                  className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-pink-dark"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-medium text-muted">RG</span>
                <input
                  value={rg}
                  onChange={(e) => setRg(e.target.value)}
                  placeholder="00.000.000-0"
                  className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-pink-dark"
                />
              </label>
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
              disabled={!aceite || !cpf.trim() || !rg.trim()}
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
