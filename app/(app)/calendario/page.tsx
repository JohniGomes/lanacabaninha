"use client";

import { useEffect, useState } from "react";
import { EventCard } from "@/components/EventCard";
import { IconLink } from "@/components/Icons";
import { getEventos } from "@/lib/storage";
import { Evento } from "@/lib/types";

export default function CalendarioPage() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    setEventos(getEventos());
  }, []);

  const ordenados = [...eventos].sort((a, b) => a.data.localeCompare(b.data));

  function copiarLink() {
    const url = `${window.location.origin}/formulario`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Calendário de eventos</h1>
        <p className="text-sm text-muted">Festas cadastradas, da mais próxima em diante.</p>
      </div>

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

      <div className="space-y-3">
        {ordenados.map((evento) => (
          <EventCard key={evento.id} evento={evento} />
        ))}
      </div>
    </div>
  );
}
