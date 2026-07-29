import { atualizar, buscarPorId, excluir, inserir, listar } from "./api-client";
import { ChecklistItem, EstoqueItem, Evento, Fornecedor, LancamentoFinanceiro, Role } from "./types";

const ROLE_KEY = "lnc_role";

function isBrowser() {
  return typeof window !== "undefined";
}

// ---------------------------------------------------------------------------
// Eventos
// ---------------------------------------------------------------------------

export async function getEventos(): Promise<Evento[]> {
  return listar<Evento>("eventos");
}

export async function getEvento(id: string): Promise<Evento | undefined> {
  return buscarPorId<Evento>("eventos", id);
}

export async function addEvento(evento: Evento): Promise<void> {
  await inserir("eventos", evento as unknown as Record<string, unknown>);
}

export async function aceitarContrato(
  eventoId: string,
  dados: { nome: string; cpf: string; rg: string }
): Promise<void> {
  await atualizar("eventos", eventoId, {
    contatoNome: dados.nome,
    contratoAceito: true,
    contratoAceitoEm: new Date().toISOString(),
    cpfContratante: dados.cpf,
    rgContratante: dados.rg,
  });
}

export interface DadosContrato {
  quantidadeCabanas?: number;
  valorContrato?: number;
  formaPagamento?: string;
  itensAlugados?: string;
  itensAdicionais?: string;
}

export async function atualizarDadosContrato(eventoId: string, dados: DadosContrato): Promise<void> {
  await atualizar("eventos", eventoId, dados as unknown as Record<string, unknown>);
}

export interface DadosGerais {
  aniversariante?: string;
  idade?: number;
  contatoNome?: string;
  contatoTelefone?: string;
  contatoEmail?: string;
  endereco?: string;
  corFavorita?: string;
  corNaoGosta?: string;
  naoPodeFaltar?: string;
  data?: string;
  horario?: string;
}

export async function atualizarDadosGerais(eventoId: string, dados: DadosGerais): Promise<void> {
  await atualizar("eventos", eventoId, dados as unknown as Record<string, unknown>);
}

export interface DadosDanificado {
  observacao: string;
  estoqueItemId?: string;
  quantidadeDanificada?: number;
}

export async function marcarDanificado(
  eventoId: string,
  itemId: string,
  dados: DadosDanificado
): Promise<Evento | undefined> {
  const evento = await getEvento(eventoId);
  if (!evento) return undefined;
  const checklist = evento.checklist.map((item) =>
    item.id === itemId
      ? {
          ...item,
          danificado: true,
          observacaoDano: dados.observacao,
          estoqueItemId: dados.estoqueItemId,
          quantidadeDanificada: dados.quantidadeDanificada,
        }
      : item
  );
  await atualizar("eventos", eventoId, { checklist });

  if (dados.estoqueItemId && dados.quantidadeDanificada) {
    const itens = await getEstoque();
    const alvo = itens.find((i) => i.id === dados.estoqueItemId);
    if (alvo) {
      await atualizar("estoque", alvo.id, {
        quantidade: Math.max(0, alvo.quantidade - dados.quantidadeDanificada),
      });
    }
  }

  return { ...evento, checklist };
}

export async function desmarcarDanificado(eventoId: string, itemId: string): Promise<Evento | undefined> {
  const evento = await getEvento(eventoId);
  if (!evento) return undefined;
  const itemAtual = evento.checklist.find((i) => i.id === itemId);

  if (itemAtual?.estoqueItemId && itemAtual.quantidadeDanificada) {
    const itens = await getEstoque();
    const alvo = itens.find((i) => i.id === itemAtual.estoqueItemId);
    if (alvo) {
      await atualizar("estoque", alvo.id, {
        quantidade: alvo.quantidade + itemAtual.quantidadeDanificada,
      });
    }
  }

  const checklist = evento.checklist.map((item) =>
    item.id === itemId
      ? {
          ...item,
          danificado: false,
          observacaoDano: undefined,
          estoqueItemId: undefined,
          quantidadeDanificada: undefined,
        }
      : item
  );
  await atualizar("eventos", eventoId, { checklist });
  return { ...evento, checklist };
}

export async function addChecklistItem(eventoId: string, item: ChecklistItem): Promise<Evento | undefined> {
  const evento = await getEvento(eventoId);
  if (!evento) return undefined;
  const checklist = [...evento.checklist, item];
  await atualizar("eventos", eventoId, { checklist });
  return { ...evento, checklist };
}

export async function updateChecklistItem(
  eventoId: string,
  itemId: string,
  dados: Partial<Pick<ChecklistItem, "nome" | "quantidade" | "descricao">>
): Promise<Evento | undefined> {
  const evento = await getEvento(eventoId);
  if (!evento) return undefined;
  const checklist = evento.checklist.map((item) => (item.id === itemId ? { ...item, ...dados } : item));
  await atualizar("eventos", eventoId, { checklist });
  return { ...evento, checklist };
}

export async function removeChecklistItem(eventoId: string, itemId: string): Promise<Evento | undefined> {
  const evento = await getEvento(eventoId);
  if (!evento) return undefined;
  const checklist = evento.checklist.filter((item) => item.id !== itemId);
  await atualizar("eventos", eventoId, { checklist });
  return { ...evento, checklist };
}

export async function atualizarChecklist(eventoId: string, checklist: ChecklistItem[]): Promise<void> {
  await atualizar("eventos", eventoId, { checklist });
}

export async function deleteEvento(id: string): Promise<void> {
  await excluir("eventos", id);
}

// ---------------------------------------------------------------------------
// Financeiro
// ---------------------------------------------------------------------------

export async function getLancamentos(): Promise<LancamentoFinanceiro[]> {
  return listar<LancamentoFinanceiro>("financeiro");
}

export async function addLancamento(lancamento: LancamentoFinanceiro): Promise<void> {
  await inserir("financeiro", lancamento as unknown as Record<string, unknown>);
}

// ---------------------------------------------------------------------------
// Fornecedores
// ---------------------------------------------------------------------------

export async function getFornecedores(): Promise<Fornecedor[]> {
  return listar<Fornecedor>("fornecedores");
}

export async function addFornecedor(fornecedor: Fornecedor): Promise<void> {
  await inserir("fornecedores", fornecedor as unknown as Record<string, unknown>);
}

// ---------------------------------------------------------------------------
// Estoque
// ---------------------------------------------------------------------------

export async function getEstoque(): Promise<EstoqueItem[]> {
  return listar<EstoqueItem>("estoque");
}

export async function addEstoqueItem(item: EstoqueItem): Promise<void> {
  await inserir("estoque", item as unknown as Record<string, unknown>);
}

export async function updateEstoqueItem(id: string, quantidade: number): Promise<void> {
  await atualizar("estoque", id, { quantidade });
}

export async function deleteEstoqueItem(id: string): Promise<void> {
  await excluir("estoque", id);
}

// ---------------------------------------------------------------------------
// Sessão (local ao navegador, não é dado compartilhado)
// ---------------------------------------------------------------------------

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
