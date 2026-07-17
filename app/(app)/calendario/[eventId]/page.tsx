"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChecklistItemRow } from "@/components/ChecklistItemRow";
import { IconArrowLeft, IconCheckCircle, IconClock, IconLink } from "@/components/Icons";
import {
  addChecklistItem,
  atualizarDadosContrato,
  desmarcarDanificado,
  getEstoque,
  getEvento,
  marcarDanificado,
  removeChecklistItem,
  toggleChecklistItem,
  updateChecklistItem,
} from "@/lib/storage";
import { colecoes } from "@/lib/mock-data";
import { EstoqueItem, Evento } from "@/lib/types";
import { formatCurrency, formatDateLong } from "@/lib/format";

export default function EventoDetalhePage() {
  const params = useParams<{ eventId: string }>();
  const router = useRouter();
  const [evento, setEvento] = useState<Evento | null | undefined>(undefined);
  const [estoqueItens, setEstoqueItens] = useState<EstoqueItem[]>([]);
  const [copiado, setCopiado] = useState(false);
  const [formContratoAberto, setFormContratoAberto] = useState(false);
  const [formNovoItemAberto, setFormNovoItemAberto] = useState(false);
  const [novoItemNome, setNovoItemNome] = useState("");
  const [novoItemQuantidade, setNovoItemQuantidade] = useState("1");

  const [quantidadeCabanas, setQuantidadeCabanas] = useState("");
  const [valorContrato, setValorContrato] = useState("");
  const [formaPagamento, setFormaPagamento] = useState("");
  const [itensAlugados, setItensAlugados] = useState("");
  const [itensAdicionais, setItensAdicionais] = useState("");

  useEffect(() => {
    const e = getEvento(params.eventId) ?? null;
    setEvento(e);
    setEstoqueItens(getEstoque());
    if (e) {
      setQuantidadeCabanas(e.quantidadeCabanas ? String(e.quantidadeCabanas) : "");
      setValorContrato(e.valorContrato ? String(e.valorContrato) : "");
      setFormaPagamento(e.formaPagamento ?? "");
      setItensAlugados(e.itensAlugados ?? "");
      setItensAdicionais(e.itensAdicionais ?? "");
    }
  }, [params.eventId]);

  function copiarLinkContrato() {
    const url = `${window.location.origin}/contrato/${params.eventId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    });
  }

  function salvarDadosContrato() {
    const atualizado = atualizarDadosContrato(params.eventId, {
      quantidadeCabanas: quantidadeCabanas ? Number(quantidadeCabanas) : undefined,
      valorContrato: valorContrato ? Number(valorContrato) : undefined,
      formaPagamento: formaPagamento.trim() || undefined,
      itensAlugados: itensAlugados.trim() || undefined,
      itensAdicionais: itensAdicionais.trim() || undefined,
    });
    if (atualizado) setEvento(atualizado);
    setFormContratoAberto(false);
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

  function handleToggleStatus(itemId: string) {
    const atualizado = toggleChecklistItem(params.eventId, itemId);
    if (atualizado) setEvento(atualizado);
  }

  function handleMarcarDanificado(
    itemId: string,
    dados: { observacao: string; estoqueItemId?: string; quantidadeDanificada?: number }
  ) {
    const atualizado = marcarDanificado(params.eventId, itemId, dados);
    if (atualizado) setEvento(atualizado);
    setEstoqueItens(getEstoque());
  }

  function handleDesmarcarDanificado(itemId: string) {
    const atualizado = desmarcarDanificado(params.eventId, itemId);
    if (atualizado) setEvento(atualizado);
    setEstoqueItens(getEstoque());
  }

  function handleEditarItem(itemId: string, dados: { nome: string; quantidade: number }) {
    const atualizado = updateChecklistItem(params.eventId, itemId, dados);
    if (atualizado) setEvento(atualizado);
  }

  function handleExcluirItem(itemId: string) {
    const atualizado = removeChecklistItem(params.eventId, itemId);
    if (atualizado) setEvento(atualizado);
  }

  function handleAdicionarItem() {
    if (!novoItemNome.trim() || Number(novoItemQuantidade) <= 0) return;
    const atualizado = addChecklistItem(params.eventId, {
      id: crypto.randomUUID(),
      nome: novoItemNome.trim(),
      quantidade: Number(novoItemQuantidade),
      status: "pendente",
    });
    if (atualizado) setEvento(atualizado);
    setNovoItemNome("");
    setNovoItemQuantidade("1");
    setFormNovoItemAberto(false);
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

        <div className="mt-3 rounded-2xl border border-border bg-surface p-4">
          {!formContratoAberto ? (
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 text-sm">
                {evento.valorContrato ? (
                  <>
                    <p className="font-semibold text-foreground">{formatCurrency(evento.valorContrato)}</p>
                    <p className="truncate text-xs text-muted">
                      {evento.formaPagamento}
                      {evento.quantidadeCabanas ? ` · ${evento.quantidadeCabanas} cabana(s)` : ""}
                    </p>
                  </>
                ) : (
                  <p className="text-xs text-muted">Dados do contrato ainda não preenchidos</p>
                )}
              </div>
              <button
                onClick={() => setFormContratoAberto(true)}
                className="shrink-0 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground"
              >
                {evento.valorContrato ? "Editar" : "Preencher"}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <LabeledInput
                  label="Qtd. cabanas"
                  value={quantidadeCabanas}
                  onChange={setQuantidadeCabanas}
                  type="number"
                />
                <LabeledInput
                  label="Valor (R$)"
                  value={valorContrato}
                  onChange={setValorContrato}
                  type="number"
                />
              </div>
              <LabeledInput
                label="Forma de pagamento"
                value={formaPagamento}
                onChange={setFormaPagamento}
                placeholder="Ex.: 50% Pix na assinatura + 50% na montagem"
              />
              <LabeledTextArea label="Itens alugados" value={itensAlugados} onChange={setItensAlugados} />
              <LabeledTextArea
                label="Itens de compra / serviços adicionais"
                value={itensAdicionais}
                onChange={setItensAdicionais}
              />
              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => setFormContratoAberto(false)}
                  className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-foreground"
                >
                  Cancelar
                </button>
                <button
                  onClick={salvarDadosContrato}
                  className="flex-1 rounded-xl bg-pink-dark px-4 py-2.5 text-sm font-semibold text-white"
                >
                  Salvar
                </button>
              </div>
            </div>
          )}
        </div>
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
            <ChecklistItemRow
              key={item.id}
              item={item}
              estoqueItens={estoqueItens}
              onToggleStatus={handleToggleStatus}
              onMarcarDanificado={handleMarcarDanificado}
              onDesmarcarDanificado={handleDesmarcarDanificado}
              onEditar={handleEditarItem}
              onExcluir={handleExcluirItem}
            />
          ))}
        </div>
        <p className="mt-3 text-center text-xs text-muted">Toque num item pra alternar o status</p>

        <div className="mt-3">
          {!formNovoItemAberto ? (
            <button
              onClick={() => setFormNovoItemAberto(true)}
              className="w-full rounded-xl border border-dashed border-border px-4 py-2.5 text-sm font-semibold text-muted"
            >
              + Adicionar item
            </button>
          ) : (
            <div className="space-y-2 rounded-xl border border-border bg-surface p-3">
              <div className="grid grid-cols-3 gap-2">
                <input
                  value={novoItemNome}
                  onChange={(e) => setNovoItemNome(e.target.value)}
                  placeholder="Nome do item"
                  className="col-span-2 rounded-lg border border-border bg-cream px-3 py-2 text-sm outline-none focus:border-pink-dark"
                />
                <input
                  type="number"
                  min={1}
                  value={novoItemQuantidade}
                  onChange={(e) => setNovoItemQuantidade(e.target.value)}
                  className="rounded-lg border border-border bg-cream px-3 py-2 text-sm outline-none focus:border-pink-dark"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setFormNovoItemAberto(false)}
                  className="flex-1 rounded-lg border border-border py-1.5 text-xs font-semibold text-foreground"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAdicionarItem}
                  disabled={!novoItemNome.trim()}
                  className="flex-1 rounded-lg bg-pink-dark py-1.5 text-xs font-semibold text-white disabled:opacity-40"
                >
                  Salvar
                </button>
              </div>
            </div>
          )}
        </div>
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

function LabeledTextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-muted">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        className="w-full rounded-xl border border-border bg-cream px-3.5 py-2.5 text-sm outline-none focus:border-pink-dark"
      />
    </label>
  );
}
