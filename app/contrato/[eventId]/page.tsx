"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { aceitarContrato, getEvento } from "@/lib/storage";
import { Evento } from "@/lib/types";
import { formatCurrency, formatDateLong } from "@/lib/format";
import { IconArrowLeft, IconCheckCircle, IconClock } from "@/components/Icons";
import logo from "@/public/logo.png";

export default function ContratoPage() {
  const params = useParams<{ eventId: string }>();
  const router = useRouter();
  const [evento, setEvento] = useState<Evento | null | undefined>(undefined);
  const [aceite, setAceite] = useState(false);
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [rg, setRg] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    getEvento(params.eventId)
      .then((e) => {
        setEvento(e ?? null);
        if (e) {
          setNome(e.contatoNome ?? "");
          setCpf(e.cpfContratante ?? "");
          setRg(e.rgContratante ?? "");
        }
      })
      .catch(() => setErro(true));
  }, [params.eventId]);

  async function handleConfirmar() {
    if (!nome.trim() || !cpf.trim() || !rg.trim()) return;
    setEnviando(true);
    try {
      const dados = { nome: nome.trim(), cpf: cpf.trim(), rg: rg.trim() };
      await aceitarContrato(params.eventId, dados);
      setEvento((atual) =>
        atual
          ? {
              ...atual,
              contatoNome: dados.nome,
              cpfContratante: dados.cpf,
              rgContratante: dados.rg,
              contratoAceito: true,
              contratoAceitoEm: new Date().toISOString(),
            }
          : atual
      );
    } catch {
      setErro(true);
    } finally {
      setEnviando(false);
    }
  }

  if (evento === undefined) {
    return <p className="p-6 text-sm text-muted">Carregando...</p>;
  }

  if (erro && evento === null) {
    return (
      <p className="p-6 text-sm text-pink-dark">
        Não consegui falar com a planilha agora. Confira sua internet e tente de novo.
      </p>
    );
  }

  if (evento === null) {
    return <p className="p-6 text-sm text-muted">Contrato não encontrado.</p>;
  }

  const termosCompletos = Boolean(evento.valorContrato && evento.formaPagamento);

  return (
    <div className="flex flex-1 flex-col px-6 py-8">
      <div className="mx-auto w-full max-w-sm">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-1 text-sm font-medium text-muted"
        >
          <IconArrowLeft className="h-4 w-4" /> Voltar
        </button>

        <div className="mb-6 mt-4 flex flex-col items-center text-center">
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

            <div className="mt-4 space-y-3 rounded-2xl border border-border bg-surface p-4">
              <p className="text-center text-xs font-semibold uppercase tracking-wide text-muted">
                Assinatura da contratante
              </p>
              <label className="block text-sm">
                <span className="mb-1 block font-medium text-muted">Nome completo</span>
                <input
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full rounded-xl border border-border bg-cream px-3.5 py-2.5 text-sm outline-none focus:border-pink-dark"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-medium text-muted">RG</span>
                <input
                  value={rg}
                  onChange={(e) => setRg(e.target.value)}
                  placeholder="00.000.000-0"
                  className="w-full rounded-xl border border-border bg-cream px-3.5 py-2.5 text-sm outline-none focus:border-pink-dark"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-medium text-muted">CPF</span>
                <input
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  placeholder="000.000.000-00"
                  className="w-full rounded-xl border border-border bg-cream px-3.5 py-2.5 text-sm outline-none focus:border-pink-dark"
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

            {erro && (
              <p className="mt-3 text-xs font-medium text-pink-dark">
                Não consegui confirmar agora. Confira sua internet e tente de novo.
              </p>
            )}

            <button
              onClick={handleConfirmar}
              disabled={!aceite || !nome.trim() || !cpf.trim() || !rg.trim() || enviando}
              className="mt-4 w-full rounded-2xl bg-pink-dark px-5 py-3 text-sm font-semibold text-white disabled:opacity-40"
            >
              {enviando ? "Enviando..." : "Confirmar aceite"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
