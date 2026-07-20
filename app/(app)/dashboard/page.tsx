"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/StatCard";
import { EventCard } from "@/components/EventCard";
import { getEventos, getLancamentos } from "@/lib/storage";
import { Evento, LancamentoFinanceiro } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/format";
import { useRole } from "@/lib/role-context";
import { IconCalendar, IconWallet } from "@/components/Icons";

const HOJE = new Date().toISOString().slice(0, 10);

export default function DashboardPage() {
  const { role } = useRole();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [lancamentos, setLancamentos] = useState<LancamentoFinanceiro[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    Promise.all([getEventos(), getLancamentos()])
      .then(([eventosData, lancamentosData]) => {
        setEventos(eventosData);
        setLancamentos(lancamentosData);
      })
      .catch(() => setErro(true))
      .finally(() => setCarregando(false));
  }, []);

  const saldo = lancamentos.reduce(
    (acc, l) => acc + (l.tipo === "receita" ? l.valor : -l.valor),
    0
  );

  const proximosEventos = [...eventos]
    .filter((e) => e.data >= HOJE)
    .sort((a, b) => a.data.localeCompare(b.data))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Olá!</h1>
        <p className="text-sm text-muted">Aqui está o resumo de hoje.</p>
      </div>

      {erro && (
        <p className="rounded-xl border border-pink-dark/30 bg-pink/20 px-4 py-3 text-sm text-pink-dark">
          Não consegui carregar os dados da planilha agora. Confira sua internet e tente de novo.
        </p>
      )}

      {carregando ? (
        <p className="text-sm text-muted">Carregando...</p>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
