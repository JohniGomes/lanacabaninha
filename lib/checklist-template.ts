import { ChecklistItem } from "./types";

export function checklistInicial(): ChecklistItem[] {
  return [
    { id: crypto.randomUUID(), nome: "Cabanas", quantidade: 1 },
    { id: crypto.randomUUID(), nome: "Colchonetes", quantidade: 1 },
    { id: crypto.randomUUID(), nome: "Lençóis", quantidade: 1 },
    { id: crypto.randomUUID(), nome: "Travesseiros e cobertores", quantidade: 1 },
    { id: crypto.randomUUID(), nome: "Decoração", descricao: "" },
  ];
}
