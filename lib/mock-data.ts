import { ChecklistItem, Colecao, Evento, Fornecedor, LancamentoFinanceiro } from "./types";

export const colecoes: Colecao[] = [
  { id: "sonhos", nome: "Sonhos", descricao: "Nuvens, estrelas, lua e luzinhas." },
  { id: "jardim-secreto", nome: "Jardim Secreto", descricao: "Flores, borboletas e folhagens." },
  { id: "cherry-dream", nome: "Cherry Dream", descricao: "Cerejas, laços, corações, poás e detalhes retrô." },
  { id: "coquette", nome: "Coquette", descricao: "Laços, rendas, pérolas, corações e fitas delicadas." },
  { id: "boho-soul", nome: "Boho Soul", descricao: "Macramê, capim dos pampas e filtro dos sonhos." },
  { id: "glow-party", nome: "Glow Party", descricao: "Neon, luz negra e muito brilho." },
  { id: "sweet-hearts", nome: "Sweet Hearts", descricao: "Corações, laços e luzinhas." },
  { id: "noite-magica", nome: "Noite Mágica", descricao: "Lua, constelações, estrelas, lanternas e brilhos delicados." },
  { id: "fundo-do-mar", nome: "Fundo do Mar", descricao: "Sereias, estrelas-do-mar, conchas e elementos marinhos." },
];

function item(id: string, nome: string, quantidade: number): ChecklistItem {
  return { id, nome, quantidade };
}

const checklistArthur: ChecklistItem[] = [
  item("a1", "Colchonetes", 10),
  item("a2", "Lençóis brancos", 12),
  item("a3", "Cabana amarela", 2),
  item("a4", "Cabana azul royal", 2),
  item("a5", "Cabana verde", 1),
  item("a6", "Travesseiros amarelo", 4),
  item("a7", "Travesseiros azul royal", 4),
  item("a8", "Travesseiros verde", 2),
  item("a9", "Cobertores amarelo", 4),
  item("a10", "Cobertores azul royal", 4),
  item("a11", "Cobertores verde", 2),
  { ...item("a12", "Almofadas futebol", 6), danificado: true, observacaoDano: "Almofada rasgada durante a festa, precisa trocar o forro." },
  item("a13", "Tapete verde escuro", 1),
  item("a14", "Tapetes bola de futebol", 5),
  item("a15", "Tapete campo de futebol", 1),
  item("a16", "Globo de luz", 1),
  item("a17", "Pisca bola grande amarela", 7),
];

const checklistHelena: ChecklistItem[] = [
  item("h1", "Colchonetes", 6),
  item("h2", "Lençóis brancos", 8),
  item("h3", "Cabana lilás", 2),
  item("h4", "Cabana rosa", 1),
  item("h5", "Travesseiros lilás", 3),
  item("h6", "Travesseiros rosa", 3),
  item("h7", "Cobertores lilás", 3),
  item("h8", "Cobertores rosa", 3),
  item("h9", "Almofadas nuvem", 6),
  item("h10", "Tapete nuvem", 1),
  item("h11", "Guirlanda de estrelas", 1),
  item("h12", "Globo de luz", 1),
];

const checklistMariaClara: ChecklistItem[] = [
  item("m1", "Colchonetes", 8),
  item("m2", "Lençóis brancos", 10),
  item("m3", "Cabana azul", 2),
  item("m4", "Cabana verde água", 2),
  item("m5", "Travesseiros azul", 4),
  item("m6", "Cobertores verde água", 4),
  item("m7", "Almofadas concha", 5),
  item("m8", "Tapete ondas", 1),
  item("m9", "Guirlanda de conchinhas", 1),
];

export const eventos: Evento[] = [
  {
    id: "evt-arthur",
    aniversariante: "Arthur",
    contatoNome: "Fabiana",
    contatoTelefone: "11 4008-9698",
    contatoEmail: "fabiana.arthur@email.com",
    endereco: "Av. João Nery de Carvalho, 31 - Vila Rosária",
    data: "2026-07-04",
    horario: "20:00",
    tema: "Futebol / Copa do Mundo",
    caminho: "personalizada",
    responsavelMontagem: "Camila",
    observacoes: "5 cabanas — plaquinhas personalizadas feitas pela Tai.",
    checklist: checklistArthur,
    quantidadeCabanas: 5,
    valorContrato: 900,
    formaPagamento: "50% Pix na reserva + 50% Pix no dia da montagem",
    itensAlugados: "5 cabanas, 10 colchonetes, enxoval completo, decoração tema futebol",
    contratoAceito: true,
    contratoAceitoEm: "2026-06-20T14:32:00.000Z",
    cpfContratante: "123.456.789-00",
    rgContratante: "45.678.901-2",
  },
  {
    id: "evt-helena",
    aniversariante: "Helena",
    idade: 7,
    contatoNome: "Renata",
    contatoTelefone: "11 99887-2211",
    contatoEmail: "renata.helena@email.com",
    endereco: "Rua das Camélias, 245 - Jardim Aurora",
    data: "2026-07-11",
    horario: "19:00",
    tema: "Sonhos",
    caminho: "assinada",
    colecaoId: "sonhos",
    corFavorita: "Lilás e rosa bebê",
    corNaoGosta: "Amarelo",
    naoPodeFaltar: "Luzinhas de led e muitas almofadas de nuvem",
    horarioRecreacao: "18:00",
    horarioSpa: "18:30",
    checklist: checklistHelena,
    quantidadeCabanas: 3,
    valorContrato: 1040,
    formaPagamento: "50% Pix na reserva + 50% Pix no dia da montagem",
    itensAlugados: "3 cabanas, 6 colchonetes, enxoval completo, decoração coleção Sonhos",
    itensAdicionais: "Kit café da manhã (2 unidades)",
  },
  {
    id: "evt-maria-clara",
    aniversariante: "Maria Clara",
    idade: 5,
    contatoNome: "Bianca",
    contatoTelefone: "11 98123-4455",
    contatoEmail: "bianca.mclara@email.com",
    endereco: "Rua Tucumã, 88 - Vila Prudente",
    data: "2026-07-18",
    horario: "16:00",
    tema: "Fundo do Mar",
    caminho: "assinada",
    colecaoId: "fundo-do-mar",
    corFavorita: "Azul e verde água",
    naoPodeFaltar: "Balões em formato de estrela do mar",
    checklist: checklistMariaClara,
  },
];

export const fornecedores: Fornecedor[] = [
  { id: "forn-spa", nome: "Spa Kids Glow", categoria: "Spa", contato: "11 91234-0001" },
  { id: "forn-criadoras", nome: "Ateliê das Criadoras", categoria: "Criadoras / Decoração", contato: "11 91234-0002" },
  { id: "forn-pijamas", nome: "Sonho de Pijama", categoria: "Fornecedora de Pijamas", contato: "11 91234-0003" },
  { id: "forn-foto", nome: "Bella Fotografias", categoria: "Fotografia", contato: "11 91234-0004" },
];

export const lancamentos: LancamentoFinanceiro[] = [];
