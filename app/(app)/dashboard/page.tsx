"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/StatCard";
import { EventCard } from "@/components/EventCard";
import { getEventos, getLancamentos } from "@/lib/storage";
import { Evento, LancamentoFinanceiro } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/format";
import { useRole } from "@/lib/role-context";
import { IconAlertTriangle, IconCalendar, IconWallet } from "@/components/Icons";

const HOJE = new Date().toISOString().slice(0, 10);

export default function DashboardPage() {
  const { role } = useRole();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [lancamentos, setLancamentos] = useState<LancamentoFinanceiro[]>([]);

  useEffect(() => {
    setEventos(getEventos());
    setLancamentos(getLancamentos());
  }, []);

  const saldo = lancamentos.reduce(
    (acc, l) => acc + (l.tipo === "receita" ? l.valor : -l.valor),
    0
  );

  const proximosEventos = [...eventos]
    .filter((e) => e.data >= HOJE)
    .sort((a, b) => a.data.localeCompare(b.data))
    .slice(0, 5);

  const totalDanificados = eventos.reduce(
    (acc, e) => acc + e.checklist.filter((i) => i.danificado).length,
    0
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Olá!</h1>
        <p className="text-sm text-muted">Aqui está o resumo de hoje.</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {role === "admin" && (
          <StatCard
            icon={<IconWallet className="h-5 w-5" />}
            label="Saldo financeiro"
            value={formatCurrency(saldo)}
            accent="mint"
          />
        )}
        <StatCard
          icon={<IconCalendar className="h-5 w-5" />}
          label="Próximo evento"
          value={proximosEventos[0] ? proximosEventos[0].aniversariante : "Nenhum agendado"}
          hint={proximosEventos[0] ? formatDate(proximosEventos[0].data) : undefined}
          accent="pink"
        />
        <StatCard
          icon={<IconAlertTriangle className="h-5 w-5" />}
          label="Itens danificados"
          value={String(totalDanificados)}
          hint={totalDanificados > 0 ? "Precisam de atenção" : "Tudo em dia"}
          accent="lilac"
        />
      </div>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
          Próximas 5 festas
        </h2>
        {proximosEventos.length === 0 ? (
          <p className="text-sm text-muted">Nenhum evento futuro cadastrado.</p>
        ) : (
          <div className="space-y-3">
            {proximosEventos.map((evento) => (
              <EventCard key={evento.id} evento={evento} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
