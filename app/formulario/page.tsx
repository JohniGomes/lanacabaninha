"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { colecoes } from "@/lib/mock-data";
import { addEvento } from "@/lib/storage";
import { CaminhoFesta, ChecklistItem, Evento } from "@/lib/types";
import logo from "@/public/logo.jpeg";

interface FormState {
  caminho: CaminhoFesta | null;
  colecaoId?: string;
  tema: string;
  aniversariante: string;
  idade: string;
  contatoNome: string;
  contatoTelefone: string;
  endereco: string;
  data: string;
  horario: string;
  corFavorita: string;
  corNaoGosta: string;
  naoPodeFaltar: string;
  aceitaPrivacidade: boolean;
}

const INITIAL_STATE: FormState = {
  caminho: null,
  colecaoId: undefined,
  tema: "",
  aniversariante: "",
  idade: "",
  contatoNome: "",
  contatoTelefone: "",
  endereco: "",
  data: "",
  horario: "",
  corFavorita: "",
  corNaoGosta: "",
  naoPodeFaltar: "",
  aceitaPrivacidade: false,
};

function checklistInicial(): ChecklistItem[] {
  return [
    { id: crypto.randomUUID(), nome: "Colchonetes", quantidade: 1, status: "pendente" },
    { id: crypto.randomUUID(), nome: "Lençóis brancos", quantidade: 1, status: "pendente" },
    { id: crypto.randomUUID(), nome: "Cabanas", quantidade: 1, status: "pendente" },
    { id: crypto.randomUUID(), nome: "Travesseiros e cobertores", quantidade: 1, status: "pendente" },
    { id: crypto.randomUUID(), nome: "Decoração temática", quantidade: 1, status: "pendente" },
  ];
}

const TOTAL_STEPS = 4;

export default function FormularioPublicoPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(INITIAL_STATE);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function podeAvancar() {
    if (step === 0) return form.caminho !== null;
    if (step === 1) return form.caminho === "assinada" ? !!form.colecaoId : form.tema.trim().length > 0;
    if (step === 2) return form.aniversariante.trim() && form.endereco.trim() && form.data && form.horario;
    if (step === 3) return form.aceitaPrivacidade;
    return true;
  }

  function handleSubmit() {
    const evento: Evento = {
      id: `evt-${Date.now()}`,
      aniversariante: form.aniversariante.trim(),
      idade: form.idade ? Number(form.idade) : undefined,
      contatoNome: form.contatoNome.trim() || form.aniversariante.trim(),
      contatoTelefone: form.contatoTelefone.trim() || undefined,
      endereco: form.endereco.trim(),
      data: form.data,
      horario: form.horario,
      tema: form.caminho === "assinada"
        ? colecoes.find((c) => c.id === form.colecaoId)?.nome ?? ""
        : form.tema.trim(),
      caminho: form.caminho ?? "personalizada",
      colecaoId: form.caminho === "assinada" ? form.colecaoId : undefined,
      corFavorita: form.corFavorita.trim() || undefined,
      corNaoGosta: form.corNaoGosta.trim() || undefined,
      naoPodeFaltar: form.naoPodeFaltar.trim() || undefined,
      checklist: checklistInicial(),
    };
    addEvento(evento);
    router.push(`/contrato/${evento.id}`);
  }

  return (
    <div className="flex flex-1 flex-col px-6 py-8">
      <div className="mx-auto w-full max-w-sm flex-1">
        <div className="mb-4 flex flex-col items-center text-center">
          <Image src={logo} alt="Lá Na Cabaninha" width={160} height={142} priority />
          <p className="mt-1 text-sm text-muted">Formulário de atendimento — conta pra gente sobre a festa!</p>
        </div>

        <StepDots step={step} total={TOTAL_STEPS} />

        <div className="mt-6 space-y-5">
          {step === 0 && (
            <div className="space-y-3">
              <p className="text-sm font-semibold">1. Como você quer criar a festa?</p>
              <OptionCard
                selected={form.caminho === "personalizada"}
                onClick={() => update("caminho", "personalizada")}
                title="Festa Personalizada"
                subtitle="Você escolhe o tema e as cores do zero"
              />
              <OptionCard
                selected={form.caminho === "assinada"}
                onClick={() => update("caminho", "assinada")}
                title="Experiência Assinada"
                subtitle="Escolha uma das nossas coleções prontas · 5% de desconto"
              />
            </div>
          )}

          {step === 1 && form.caminho === "assinada" && (
            <div className="space-y-3">
              <p className="text-sm font-semibold">2. Qual coleção combina mais?</p>
              <div className="grid grid-cols-1 gap-2.5">
                {colecoes.map((c) => (
                  <OptionCard
                    key={c.id}
                    selected={form.colecaoId === c.id}
                    onClick={() => update("colecaoId", c.id)}
                    title={c.nome}
                    subtitle={c.descricao}
                  />
                ))}
              </div>
            </div>
          )}

          {step === 1 && form.caminho === "personalizada" && (
            <div className="space-y-3">
              <p className="text-sm font-semibold">2. Qual é o tema da festa?</p>
              <Field
                label="Tema"
                value={form.tema}
                onChange={(v) => update("tema", v)}
                placeholder="Ex.: Futebol, Unicórnios, Copa do Mundo..."
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <p className="text-sm font-semibold">3. Dados da festa</p>
              <Field label="Nome da aniversariante" value={form.aniversariante} onChange={(v) => update("aniversariante", v)} />
              <Field label="Idade" value={form.idade} onChange={(v) => update("idade", v)} type="number" />
              <Field label="Nome de quem está organizando" value={form.contatoNome} onChange={(v) => update("contatoNome", v)} />
              <Field label="WhatsApp" value={form.contatoTelefone} onChange={(v) => update("contatoTelefone", v)} placeholder="(11) 90000-0000" />
              <Field label="Endereço da festa" value={form.endereco} onChange={(v) => update("endereco", v)} />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Data" value={form.data} onChange={(v) => update("data", v)} type="date" />
                <Field label="Horário" value={form.horario} onChange={(v) => update("horario", v)} type="time" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <p className="text-sm font-semibold">4. Últimos detalhes</p>
              <Field label="Cores favoritas da aniversariante" value={form.corFavorita} onChange={(v) => update("corFavorita", v)} />
              <Field label="Alguma cor que ela não gosta?" value={form.corNaoGosta} onChange={(v) => update("corNaoGosta", v)} />
              <TextArea
                label="O que não pode faltar nessa festa?"
                value={form.naoPodeFaltar}
                onChange={(v) => update("naoPodeFaltar", v)}
              />

              <div className="rounded-xl border border-border bg-cream p-3 text-xs text-muted">
                <p className="font-semibold text-foreground">Aviso de privacidade</p>
                <p className="mt-1">
                  Usamos os dados desse formulário (nome e idade da aniversariante, endereço,
                  contato e preferências da festa) só para organizar e realizar o seu evento na
                  Lá Na Cabaninha. Não vendemos nem compartilhamos essas informações com
                  terceiros. Dúvidas sobre seus dados? Fale com a gente pelo WhatsApp.
                </p>
              </div>

              <label className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.aceitaPrivacidade}
                  onChange={(e) => update("aceitaPrivacidade", e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-pink-dark"
                />
                <span className="text-muted">
                  Li e concordo com o uso dos meus dados conforme o aviso de privacidade acima.
                </span>
              </label>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto mt-8 flex w-full max-w-sm gap-3">
        {step > 0 && (
          <button
            onClick={() => setStep((s) => s - 1)}
            className="flex-1 rounded-2xl border border-border bg-surface px-5 py-3 text-sm font-semibold text-foreground"
          >
            Voltar
          </button>
        )}
        <button
          disabled={!podeAvancar()}
          onClick={() => (step === TOTAL_STEPS - 1 ? handleSubmit() : setStep((s) => s + 1))}
          className="flex-1 rounded-2xl bg-pink-dark px-5 py-3 text-sm font-semibold text-white disabled:opacity-40"
        >
          {step === TOTAL_STEPS - 1 ? "Enviar" : "Continuar"}
        </button>
      </div>
    </div>
  );
}

function StepDots({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`h-1.5 rounded-full transition-all ${
            i === step ? "w-6 bg-pink-dark" : "w-1.5 bg-border"
          }`}
        />
      ))}
    </div>
  );
}

function OptionCard({
  selected,
  onClick,
  title,
  subtitle,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  subtitle: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-2xl border px-4 py-3 text-left transition-colors ${
        selected ? "border-pink-dark bg-pink/30" : "border-border bg-surface"
      }`}
    >
      <span className="block text-sm font-semibold">{title}</span>
      <span className="block text-xs text-muted">{subtitle}</span>
    </button>
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
        className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-pink-dark"
      />
    </label>
  );
}

function TextArea({
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
        rows={3}
        className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-pink-dark"
      />
    </label>
  );
}
