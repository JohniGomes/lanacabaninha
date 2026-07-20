import { eventos as eventosMock, fornecedores as fornecedoresMock, lancamentos as lancamentosMock } from "./mock-data";
import { estoqueInicial } from "./estoque-data";
import { ChecklistItem, EstoqueItem, Evento, Fornecedor, LancamentoFinanceiro, Role } from "./types";

const EVENTOS_KEY = "lnc_eventos";
const LANCAMENTOS_KEY = "lnc_lancamentos";
const LANCAMENTOS_RESET_FLAG = "lnc_lancamentos_reset_ficticios_v1";
const FORNECEDORES_KEY = "lnc_fornecedores";
const ESTOQUE_KEY = "lnc_estoque";
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

export function aceitarContrato(eventoId: string, dados: { nome: string; cpf: string; rg: string }) {
  const eventos = getEventos();
  const updated = eventos.map((evento) =>
    evento.id === eventoId
      ? {
          ...evento,
          contatoNome: dados.nome,
          contratoAceito: true,
          contratoAceitoEm: new Date().toISOString(),
          cpfContratante: dados.cpf,
          rgContratante: dados.rg,
        }
      : evento
  );
  saveEventos(updated);
  return updated.find((e) => e.id === eventoId);
}

export interface DadosContrato {
  quantidadeCabanas?: number;
  valorContrato?: number;
  formaPagamento?: string;
  itensAlugados?: string;
  itensAdicionais?: string;
}

export function atualizarDadosContrato(eventoId: string, dados: DadosContrato) {
  const eventos = getEventos();
  const updated = eventos.map((evento) =>
    evento.id === eventoId ? { ...evento, ...dados } : evento
  );
  saveEventos(updated);
  return updated.find((e) => e.id === eventoId);
}

export interface DadosDanificado {
  observacao: string;
  estoqueItemId?: string;
  quantidadeDanificada?: number;
}

export function marcarDanificado(eventoId: string, itemId: string, dados: DadosDanificado) {
  const eventos = getEventos();
  const updated = eventos.map((evento) => {
    if (evento.id !== eventoId) return evento;
    return {
      ...evento,
      checklist: evento.checklist.map((item) =>
        item.id === itemId
          ? {
              ...item,
              danificado: true,
              observacaoDano: dados.observacao,
              estoqueItemId: dados.estoqueItemId,
              quantidadeDanificada: dados.quantidadeDanificada,
            }
          : item
      ),
    };
  });
  saveEventos(updated);

  if (dados.estoqueItemId && dados.quantidadeDanificada) {
    const itens = getEstoque();
    const alvo = itens.find((i) => i.id === dados.estoqueItemId);
    if (alvo) {
      saveEstoque(
        itens.map((i) =>
          i.id === dados.estoqueItemId
            ? { ...i, quantidade: Math.max(0, i.quantidade - dados.quantidadeDanificada!) }
            : i
        )
      );
    }
  }

  return updated.find((e) => e.id === eventoId);
}

export function desmarcarDanificado(eventoId: string, itemId: string) {
  const eventos = getEventos();
  const eventoAtual = eventos.find((e) => e.id === eventoId);
  const itemAtual = eventoAtual?.checklist.find((i) => i.id === itemId);

  if (itemAtual?.estoqueItemId && itemAtual.quantidadeDanificada) {
    const itens = getEstoque();
    saveEstoque(
      itens.map((i) =>
        i.id === itemAtual.estoqueItemId
          ? { ...i, quantidade: i.quantidade + itemAtual.quantidadeDanificada! }
          : i
      )
    );
  }

  const updated = eventos.map((evento) => {
    if (evento.id !== eventoId) return evento;
    return {
      ...evento,
      checklist: evento.checklist.map((item) =>
        item.id === itemId
          ? {
              ...item,
              danificado: false,
              observacaoDano: undefined,
              estoqueItemId: undefined,
              quantidadeDanificada: undefined,
            }
          : item
      ),
    };
  });
  saveEventos(updated);
  return updated.find((e) => e.id === eventoId);
}

export function addChecklistItem(eventoId: string, item: ChecklistItem) {
  const eventos = getEventos();
  const updated = eventos.map((evento) =>
    evento.id === eventoId ? { ...evento, checklist: [...evento.checklist, item] } : evento
  );
  saveEventos(updated);
  return updated.find((e) => e.id === eventoId);
}

export function updateChecklistItem(
  eventoId: string,
  itemId: string,
  dados: Partial<Pick<ChecklistItem, "nome" | "quantidade" | "descricao">>
) {
  const eventos = getEventos();
  const updated = eventos.map((evento) => {
    if (evento.id !== eventoId) return evento;
    return {
      ...evento,
      checklist: evento.checklist.map((item) =>
        item.id === itemId ? { ...item, ...dados } : item
      ),
    };
  });
  saveEventos(updated);
  return updated.find((e) => e.id === eventoId);
}

export function removeChecklistItem(eventoId: string, itemId: string) {
  const eventos = getEventos();
  const updated = eventos.map((evento) =>
    evento.id === eventoId
      ? { ...evento, checklist: evento.checklist.filter((item) => item.id !== itemId) }
      : evento
  );
  saveEventos(updated);
  return updated.find((e) => e.id === eventoId);
}

export function getLancamentos(): LancamentoFinanceiro[] {
  if (!isBrowser()) return lancamentosMock;
  if (!window.localStorage.getItem(LANCAMENTOS_RESET_FLAG)) {
    window.localStorage.removeItem(LANCAMENTOS_KEY);
    window.localStorage.setItem(LANCAMENTOS_RESET_FLAG, "1");
  }
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

export function getFornecedores(): Fornecedor[] {
  if (!isBrowser()) return fornecedoresMock;
  const raw = window.localStorage.getItem(FORNECEDORES_KEY);
  if (!raw) {
    window.localStorage.setItem(FORNECEDORES_KEY, JSON.stringify(fornecedoresMock));
    return fornecedoresMock;
  }
  try {
    return JSON.parse(raw) as Fornecedor[];
  } catch {
    return fornecedoresMock;
  }
}

export function saveFornecedores(fornecedores: Fornecedor[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(FORNECEDORES_KEY, JSON.stringify(fornecedores));
}

export function addFornecedor(fornecedor: Fornecedor) {
  const fornecedores = getFornecedores();
  saveFornecedores([...fornecedores, fornecedor]);
}

export function getEstoque(): EstoqueItem[] {
  if (!isBrowser()) return estoqueInicial;
  const raw = window.localStorage.getItem(ESTOQUE_KEY);
  if (!raw) {
    window.localStorage.setItem(ESTOQUE_KEY, JSON.stringify(estoqueInicial));
    return estoqueInicial;
  }
  try {
    return JSON.parse(raw) as EstoqueItem[];
  } catch {
    return estoqueInicial;
  }
}

export function saveEstoque(itens: EstoqueItem[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(ESTOQUE_KEY, JSON.stringify(itens));
}

export function addEstoqueItem(item: EstoqueItem) {
  const itens = getEstoque();
  saveEstoque([...itens, item]);
}

export function updateEstoqueItem(id: string, quantidade: number) {
  const itens = getEstoque();
  const updated = itens.map((item) => (item.id === id ? { ...item, quantidade } : item));
  saveEstoque(updated);
  return updated;
}

export function deleteEstoqueItem(id: string) {
  const itens = getEstoque();
  saveEstoque(itens.filter((item) => item.id !== id));
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
