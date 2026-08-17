"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { addEvento } from "@/lib/storage";
import { checklistInicial } from "@/lib/checklist-template";
import { arredondarHorario } from "@/lib/format";
import { Evento } from "@/lib/types";
import logo from "@/public/logo.png";

interface FormState {
  aniversariante: string;
  idade: string;
  contatoNome: string;
  contatoTelefone: string;
  endereco: string;
  data: string;
  horario: string;
}

const INITIAL_STATE: FormState = {
  aniversariante: "",
  idade: "",
  contatoNome: "",
  contatoTelefone: "",
  endereco: "",
  data: "",
  horario: "",
};

export default function FormularioPublicoPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [enviando, setEnviando] = useState(false);
  const [salvandoRascunho, setSalvandoRascunho] = useState(false);
  const [erro, setErro] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function podeSalvarRascunho() {
    return !!form.aniversariante.trim();
  }

  function podeEnviar() {
    return form.aniversariante.trim() && form.endereco.trim() && form.data && form.horario;
  }

  function montarEvento(): Evento {
    return {
      id: `evt-${Date.now()}`,
      aniversariante: form.aniversariante.trim(),
      idade: form.idade ? Number(form.idade) : undefined,
      contatoNome: form.contatoNome.trim() || form.aniversariante.trim(),
      contatoTelefone: form.contatoTelefone.trim() || undefined,
      endereco: form.endereco.trim(),
      data: form.data,
      horario: form.horario,
      tema: "",
      caminho: "personalizada",
      checklist: checklistInicial(),
    };
  }

  async function handleSubmit() {
    setEnviando(true);
    setErro(false);
    try {
      const evento = montarEvento();
      await addEvento(evento);
      router.push(`/contrato/${evento.id}`);
    } catch {
      setErro(true);
      setEnviando(false);
    }
  }

  async function handleSalvarRascunho() {
    setSalvandoRascunho(true);
    setErro(false);
    try {
      const evento = montarEvento();
      await addEvento(evento);
      router.push(`/contrato/${evento.id}`);
    } catch {
      setErro(true);
      setSalvandoRascunho(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col px-6 py-8">
      <div className="mx-auto w-full max-w-sm flex-1">
        <div className="mb-4 flex flex-col items-center text-center">
          <Image src={logo} alt="Lá Na Cabaninha" width={160} height={142} priority />
          <p className="mt-1 text-sm text-muted">Formulário de atendimento — conta pra gente sobre a festa!</p>
        </div>

        <div className="mt-6 space-y-3">
          <p className="text-sm font-semibold">Dados da festa</p>
          <Field label="Nome da aniversariante" value={form.aniversariante} onChange={(v) => update("aniversariante", v)} />
          <Field label="Idade" value={form.idade} onChange={(v) => update("idade", v)} type="number" />
          <Field label="Nome do pai/mãe/responsável" value={form.contatoNome} onChange={(v) => update("contatoNome", v)} />
          <Field label="WhatsApp" value={form.contatoTelefone} onChange={(v) => update("contatoTelefone", v)} placeholder="(11) 90000-0000" />
          <Field label="Endereço da festa" value={form.endereco} onChange={(v) => update("endereco", v)} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Data" value={form.data} onChange={(v) => update("data", v)} type="date" />
            <Field label="Horário" value={form.horario} onChange={(v) => update("horario", arredondarHorario(v))} type="time" />
          </div>
        </div>
      </div>

      {erro && (
        <p className="mx-auto mt-4 w-full max-w-sm text-center text-xs font-medium text-pink-dark">
          Não consegui enviar agora. Confira sua internet e tente de novo.
        </p>
      )}

      <div className="mx-auto mt-4 flex w-full max-w-sm gap-3">
        <button
          onClick={handleSalvarRascunho}
          disabled={!podeSalvarRascunho() || enviando || salvandoRascunho}
          className="flex-1 rounded-2xl border border-border bg-surface px-5 py-3 text-sm font-semibold text-foreground disabled:opacity-40"
        >
          {salvandoRascunho ? "Salvando..." : "Salvar rascunho"}
        </button>
        <button
          onClick={handleSubmit}
          disabled={!podeEnviar() || enviando || salvandoRascunho}
          className="flex-1 rounded-2xl bg-pink-dark px-5 py-3 text-sm font-semibold text-white disabled:opacity-40"
        >
          {enviando ? "Enviando..." : "Enviar"}
        </button>
      </div>
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
        step={type === "time" ? 1800 : undefined}
        className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-pink-dark"
      />
    </label>
  );
}
