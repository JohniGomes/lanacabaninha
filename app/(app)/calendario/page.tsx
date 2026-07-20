"use client";

import { useEffect, useState } from "react";
import { EventCard } from "@/components/EventCard";
import { IconLink } from "@/components/Icons";
import { addEvento, getEventos } from "@/lib/storage";
import { colecoes } from "@/lib/mock-data";
import { checklistInicial } from "@/lib/checklist-template";
import { CaminhoFesta, Evento } from "@/lib/types";

const INITIAL_FORM = {
  aniversariante: "",
  idade: "",
  contatoNome: "",
  contatoTelefone: "",
  contatoEmail: "",
  endereco: "",
  data: "",
  horario: "",
  caminho: "personalizada" as CaminhoFesta,
  tema: "",
  colecaoId: "",
  corFavorita: "",
  corNaoGosta: "",
  naoPodeFaltar: "",
};

export default function CalendarioPage() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [copiado, setCopiado] = useState(false);
  const [formAberto, setFormAberto] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    getEventos()
      .then(setEventos)
      .catch(() => setErro(true))
      .finally(() => setCarregando(false));
  }, []);

  const ordenados = [...eventos].sort((a, b) => a.data.localeCompare(b.data));

  function update<K extends keyof typeof INITIAL_FORM>(key: K, value: (typeof INITIAL_FORM)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function copiarLink() {
    const url = `${window.location.origin}/formulario`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    });
  }

  function podeSalvar() {
    return form.aniversariante.trim() && form.endereco.trim() && form.data && form.horario;
  }

  async function salvarEvento() {
    if (!podeSalvar()) return;
    const evento: Evento = {
      id: `evt-${Date.now()}`,
      aniversariante: form.aniversariante.trim(),
      idade: form.idade ? Number(form.idade) : undefined,
      contatoNome: form.contatoNome.trim() || form.aniversariante.trim(),
      contatoTelefone: form.contatoTelefone.trim() || undefined,
      contatoEmail: form.contatoEmail.trim() || undefined,
      endereco: form.endereco.trim(),
      data: form.data,
      horario: form.horario,
      tema: form.caminho === "assinada"
        ? colecoes.find((c) => c.id === form.colecaoId)?.nome ?? ""
        : form.tema.trim(),
      caminho: form.caminho,
      colecaoId: form.caminho === "assinada" ? form.colecaoId || undefined : undefined,
      corFavorita: form.corFavorita.trim() || undefined,
      corNaoGosta: form.corNaoGosta.trim() || undefined,
      naoPodeFaltar: form.naoPodeFaltar.trim() || undefined,
      checklist: checklistInicial(),
    };
    setSalvando(true);
    try {
      await addEvento(evento);
      setEventos(await getEventos());
      setForm(INITIAL_FORM);
      setFormAberto(false);
    } catch {
      setErro(true);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Calendário de eventos</h1>
        <p className="text-sm text-muted">Festas cadastradas, da mais próxima em diante.</p>
      </div>

      {erro && (
        <p className="rounded-xl border border-pink-dark/30 bg-pink/20 px-4 py-3 text-sm text-pink-dark">
          Não consegui falar com a planilha agora. Confira sua internet e tente de novo.
        </p>
      )}

      <button
        onClick={copiarLink}
        className="w-full rounded-xl border border-dashed border-pink-dark/50 bg-pink/20 px-4 py-3 text-left text-sm text-pink-dark"
      >
        <span className="flex items-center gap-1.5 font-semibold">
          <IconLink className="h-4 w-4" /> {copiado ? "Link copiado!" : "Copiar link do formulário público"}
        </span>
        <span className="block text-xs text-pink-dark/80">
          Envie pra cliente preencher direto pelo celular
        </span>
      </button>

      {!formAberto ? (
        <button
          onClick={() => setFormAberto(true)}
          className="w-full rounded-xl bg-pink-dark px-4 py-3 text-sm font-semibold text-white"
        >
          + Novo evento
        </button>
      ) : (
        <div className="space-y-3 rounded-2xl border border-border bg-surface p-4">
          <Field label="Nome da aniversariante" value={form.aniversariante} onChange={(v) => update("aniversariante", v)} />
          <Field label="Idade" value={form.idade} onChange={(v) => update("idade", v)} type="number" />
          <Field label="Nome de quem está organizando" value={form.contatoNome} onChange={(v) => update("contatoNome", v)} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="WhatsApp" value={form.contatoTelefone} onChange={(v) => update("contatoTelefone", v)} />
            <Field label="E-mail" value={form.contatoEmail} onChange={(v) => update("contatoEmail", v)} type="email" />
          </div>
          <Field label="Endereço da festa" value={form.endereco} onChange={(v) => update("endereco", v)} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Data" value={form.data} onChange={(v) => update("data", v)} type="date" />
            <Field label="Horário" value={form.horario} onChange={(v) => update("horario", v)} type="time" />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => update("caminho", "personalizada")}
              className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold ${
                form.caminho === "personalizada" ? "bg-pink/60 text-pink-dark" : "bg-zinc-100 text-muted"
              }`}
            >
              Personalizada
            </button>
            <button
              onClick={() => update("caminho", "assinada")}
              className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold ${
                form.caminho === "assinada" ? "bg-lilac/60 text-lilac-dark" : "bg-zinc-100 text-muted"
              }`}
            >
              Experiência Assinada
            </button>
          </div>

          {form.caminho === "personalizada" ? (
            <Field label="Tema" value={form.tema} onChange={(v) => update("tema", v)} placeholder="Ex.: Futebol, Unicórnios..." />
          ) : (
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-muted">Coleção</span>
              <select
                value={form.colecaoId}
                onChange={(e) => update("colecaoId", e.target.value)}
                className="w-full rounded-xl border border-border bg-cream px-3.5 py-2.5 text-sm outline-none focus:border-pink-dark"
              >
                <option value="">Selecione...</option>
                {colecoes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </label>
          )}

          <Field label="Cores favoritas" value={form.corFavorita} onChange={(v) => update("corFavorita", v)} />
          <Field label="Cor que não gosta" value={form.corNaoGosta} onChange={(v) => update("corNaoGosta", v)} />
          <Field label="O que não pode faltar" value={form.naoPodeFaltar} onChange={(v) => update("naoPodeFaltar", v)} />

          <div className="flex gap-3 pt-1">
            <button
              onClick={() => {
                setFormAberto(false);
                setForm(INITIAL_FORM);
              }}
              className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-foreground"
            >
              Cancelar
            </button>
            <button
              onClick={salvarEvento}
              disabled={!podeSalvar() || salvando}
              className="flex-1 rounded-xl bg-pink-dark px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
            >
              {salvando ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>
      )}

      {carregando ? (
        <p className="text-sm text-muted">Carregando...</p>
      ) : (
        <div className="space-y-3">
          {ordenados.map((evento) => (
            <EventCard key={evento.id} evento={evento} />
          ))}
        </div>
      )}
    </div>
  );
}

function Field({
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
