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

function item(id: string, nome: string, quantidade: number, status: ChecklistItem["status"]): ChecklistItem {
  return { id, nome, quantidade, status };
}

const checklistArthur: ChecklistItem[] = [
  item("a1", "Colchonetes", 10, "retornado"),
  item("a2", "Lençóis brancos", 12, "retornado"),
  item("a3", "Cabana amarela", 2, "retornado"),
  item("a4", "Cabana azul royal", 2, "retornado"),
  item("a5", "Cabana verde", 1, "retornado"),
  item("a6", "Travesseiros amarelo", 4, "retornado"),
  item("a7", "Travesseiros azul royal", 4, "retornado"),
  item("a8", "Travesseiros verde", 2, "retornado"),
  item("a9", "Cobertores amarelo", 4, "enviado"),
  item("a10", "Cobertores azul royal", 4, "enviado"),
  item("a11", "Cobertores verde", 2, "retornado"),
  item("a12", "Almofadas futebol", 6, "enviado"),
  item("a13", "Tapete verde escuro", 1, "retornado"),
  item("a14", "Tapetes bola de futebol", 5, "retornado"),
  item("a15", "Tapete campo de futebol", 1, "retornado"),
  item("a16", "Globo de luz", 1, "retornado"),
  item("a17", "Pisca bola grande amarela", 7, "retornado"),
];

const checklistHelena: ChecklistItem[] = [
  item("h1", "Colchonetes", 6, "pendente"),
  item("h2", "Lençóis brancos", 8, "pendente"),
  item("h3", "Cabana lilás", 2, "pendente"),
  item("h4", "Cabana rosa", 1, "pendente"),
  item("h5", "Travesseiros lilás", 3, "pendente"),
  item("h6", "Travesseiros rosa", 3, "pendente"),
  item("h7", "Cobertores lilás", 3, "pendente"),
  item("h8", "Cobertores rosa", 3, "pendente"),
  item("h9", "Almofadas nuvem", 6, "pendente"),
  item("h10", "Tapete nuvem", 1, "pendente"),
  item("h11", "Guirlanda de estrelas", 1, "pendente"),
  item("h12", "Globo de luz", 1, "pendente"),
];

const checklistMariaClara: ChecklistItem[] = [
  item("m1", "Colchonetes", 8, "pendente"),
  item("m2", "Lençóis brancos", 10, "pendente"),
  item("m3", "Cabana azul", 2, "pendente"),
  item("m4", "Cabana verde água", 2, "pendente"),
  item("m5", "Travesseiros azul", 4, "pendente"),
  item("m6", "Cobertores verde água", 4, "pendente"),
  item("m7", "Almofadas concha", 5, "pendente"),
  item("m8", "Tapete ondas", 1, "pendente"),
  item("m9", "Guirlanda de conchinhas", 1, "pendente"),
];

export const eventos: Evento[] = [
  {
    id: "evt-arthur",
    aniversariante: "Arthur",
    contatoNome: "Fabiana",
    contatoTelefone: "11 4008-9698",
    endereco: "Av. João Nery de Carvalho, 31 - Vila Rosária",
    data: "2026-07-04",
    horario: "20:00",
    tema: "Futebol / Copa do Mundo",
    caminho: "personalizada",
    responsavelMontagem: "Camila",
    observacoes: "5 cabanas — plaquinhas personalizadas feitas pela Tai.",
    checklist: checklistArthur,
  },
  {
    id: "evt-helena",
    aniversariante: "Helena",
    idade: 7,
    contatoNome: "Renata",
    contatoTelefone: "11 99887-2211",
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
  },
  {
    id: "evt-maria-clara",
    aniversariante: "Maria Clara",
    idade: 5,
    contatoNome: "Bianca",
    contatoTelefone: "11 98123-4455",
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

export const lancamentos: LancamentoFinanceiro[] = [
  { id: "f1", descricao: "Sinal 50% - Festa Arthur", categoria: "Reserva (sinal)", tipo: "receita", valor: 450, data: "2026-06-20", eventoId: "evt-arthur" },
  { id: "f2", descricao: "Saldo final - Festa Arthur", categoria: "Saldo final", tipo: "receita", valor: 450, data: "2026-07-04", eventoId: "evt-arthur" },
  { id: "f3", descricao: "Sinal 50% - Festa Helena", categoria: "Reserva (sinal)", tipo: "receita", valor: 520, data: "2026-06-28", eventoId: "evt-helena" },
  { id: "f4", descricao: "Kit café da manhã - Festa Helena", categoria: "Opcionais", tipo: "receita", valor: 136, data: "2026-06-30", eventoId: "evt-helena" },
  { id: "f5", descricao: "Sinal 50% - Festa Maria Clara", categoria: "Reserva (sinal)", tipo: "receita", valor: 480, data: "2026-07-05", eventoId: "evt-maria-clara" },
  { id: "f6", descricao: "Lavanderia enxoval", categoria: "Enxoval / Lavanderia", tipo: "despesa", valor: 120, data: "2026-07-05" },
  { id: "f7", descricao: "Compra de almofadas tema Fundo do Mar", categoria: "Compra de itens", tipo: "despesa", valor: 210, data: "2026-07-02" },
  { id: "f8", descricao: "Combustível - montagem/desmontagem", categoria: "Transporte / Frete", tipo: "despesa", valor: 90, data: "2026-07-04" },
  { id: "f9", descricao: "Impulsionamento Instagram", categoria: "Marketing", tipo: "despesa", valor: 60, data: "2026-07-01" },
  { id: "f10", descricao: "Reposição de pisca-pisca queimado", categoria: "Manutenção", tipo: "despesa", valor: 45, data: "2026-06-29" },
  { id: "f11", descricao: "Spa da Helena", categoria: "Spa", tipo: "despesa", valor: 90, data: "2026-07-11", eventoId: "evt-helena", fornecedorId: "forn-spa" },
  { id: "f12", descricao: "Fotos da festa da Maria Clara", categoria: "Fotografia", tipo: "despesa", valor: 150, data: "2026-07-18", eventoId: "evt-maria-clara", fornecedorId: "forn-foto" },
];
