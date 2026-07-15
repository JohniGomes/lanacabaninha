export type Role = "admin" | "colaborador";

export type StatusItem = "pendente" | "enviado" | "retornado";

export interface ChecklistItem {
  id: string;
  nome: string;
  quantidade: number;
  status: StatusItem;
}

export type CaminhoFesta = "personalizada" | "assinada";

export interface Evento {
  id: string;
  aniversariante: string;
  idade?: number;
  contatoNome: string;
  contatoTelefone?: string;
  endereco: string;
  data: string;
  horario: string;
  tema: string;
  caminho: CaminhoFesta;
  colecaoId?: string;
  corFavorita?: string;
  corNaoGosta?: string;
  naoPodeFaltar?: string;
  responsavelMontagem?: string;
  horarioRecreacao?: string;
  horarioSpa?: string;
  observacoes?: string;
  checklist: ChecklistItem[];
  contratoAceito?: boolean;
  contratoAceitoEm?: string;
}

export type TipoLancamento = "receita" | "despesa";

export interface LancamentoFinanceiro {
  id: string;
  descricao: string;
  categoria: string;
  tipo: TipoLancamento;
  valor: number;
  data: string;
  eventoId?: string;
  fornecedorId?: string;
}

export interface Colecao {
  id: string;
  nome: string;
  descricao: string;
}

export interface Fornecedor {
  id: string;
  nome: string;
  categoria: string;
  contato?: string;
}

export interface EstoqueItem {
  id: string;
  categoria: string;
  nome: string;
  quantidade: number;
  nota?: string;
}
