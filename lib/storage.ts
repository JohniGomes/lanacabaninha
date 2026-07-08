import { eventos as eventosMock, lancamentos as lancamentosMock } from "./mock-data";
import { Evento, LancamentoFinanceiro, Role, StatusItem } from "./types";

const EVENTOS_KEY = "lnc_eventos";
const LANCAMENTOS_KEY = "lnc_lancamentos";
const ROLE_KEY = "lnc_role";

function isBrowser() {
  return typeof window !== "undefined";
}

export function getEventos(): Evento[] {
  if (!isBrowser()) return eventosMock;
  const raw = window.localStorage.getItem(EVENTOS_KEY);
  if (!raw) {
    window.localStorage.setItem(EVENTOS_KEY, JSON.stringify(eventosMock));
    return eventosMock;
  }
  try {
    return JSON.parse(raw) as Evento[];
  } catch {
    return eventosMock;
  }
}

export function saveEventos(eventos: Evento[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(EVENTOS_KEY, JSON.stringify(eventos));
}

export function getEvento(id: string): Evento | undefined {
  return getEventos().find((e) => e.id === id);
}

export function addEvento(evento: Evento) {
  const eventos = getEventos();
  saveEventos([...eventos, evento]);
}

const STATUS_CYCLE: StatusItem[] = ["pendente", "enviado", "retornado"];

export function nextStatus(status: StatusItem): StatusItem {
  const idx = STATUS_CYCLE.indexOf(status);
  return STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
}

export function toggleChecklistItem(eventoId: string, itemId: string) {
  const eventos = getEventos();
  const updated = eventos.map((evento) => {
    if (evento.id !== eventoId) return evento;
    return {
      ...evento,
      checklist: evento.checklist.map((item) =>
        item.id === itemId ? { ...item, status: nextStatus(item.status) } : item
      ),
    };
  });
  saveEventos(updated);
  return updated.find((e) => e.id === eventoId);
}

export function getLancamentos(): LancamentoFinanceiro[] {
  if (!isBrowser()) return lancamentosMock;
  const raw = window.localStorage.getItem(LANCAMENTOS_KEY);
  if (!raw) {
    window.localStorage.setItem(LANCAMENTOS_KEY, JSON.stringify(lancamentosMock));
    return lancamentosMock;
  }
  try {
    return JSON.parse(raw) as LancamentoFinanceiro[];
  } catch {
    return lancamentosMock;
  }
}

export function saveLancamentos(lancamentos: LancamentoFinanceiro[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(LANCAMENTOS_KEY, JSON.stringify(lancamentos));
}

export function addLancamento(lancamento: LancamentoFinanceiro) {
  const lancamentos = getLancamentos();
  saveLancamentos([lancamento, ...lancamentos]);
}

export function getRole(): Role | null {
  if (!isBrowser()) return null;
  const raw = window.localStorage.getItem(ROLE_KEY);
  return raw === "admin" || raw === "colaborador" ? raw : null;
}

export function setRole(role: Role) {
  if (!isBrowser()) return;
  window.localStorage.setItem(ROLE_KEY, role);
}

export function clearRole() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(ROLE_KEY);
}
