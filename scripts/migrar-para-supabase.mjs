// Script único: copia os dados reais da planilha Google (via Apps Script, leitura) pro Supabase.
// Rodar uma vez: node scripts/migrar-para-supabase.mjs

import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const env = {};
readFileSync(".env.local", "utf-8")
  .split(/\r?\n/)
  .forEach((linha) => {
    const m = linha.match(/^([A-Z_]+)=(.*)$/);
    if (m) env[m[1]] = m[2];
  });

const APPS_SCRIPT_URL = env.NEXT_PUBLIC_SHEETS_API_URL;
const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

function toBool(v) {
  return v === true || String(v).trim().toLowerCase() === "true";
}

async function buscarDaPlanilha(aba) {
  const res = await fetch(`${APPS_SCRIPT_URL}?sheet=${aba}`);
  const json = await res.json();
  if (json && json.erro) throw new Error(`Erro ao ler ${aba}: ${json.erro}`);
  return json;
}

function limparEvento(e) {
  return {
    ...e,
    contratoAceito: toBool(e.contratoAceito),
    checklist: Array.isArray(e.checklist) ? e.checklist : [],
  };
}

async function migrarTabela(nome, linhas) {
  if (linhas.length === 0) {
    console.log(`${nome}: nada pra migrar`);
    return;
  }
  const { error } = await supabase.from(nome).insert(linhas);
  if (error) throw new Error(`Erro ao inserir em ${nome}: ${error.message}`);
  console.log(`${nome}: ${linhas.length} linha(s) migrada(s)`);
}

async function main() {
  console.log("Lendo dados da planilha...");
  const [eventos, financeiro, fornecedores, estoque] = await Promise.all([
    buscarDaPlanilha("Eventos"),
    buscarDaPlanilha("Financeiro"),
    buscarDaPlanilha("Fornecedores"),
    buscarDaPlanilha("Estoque"),
  ]);

  console.log(
    `Encontrados: ${eventos.length} eventos, ${financeiro.length} lançamentos, ` +
      `${fornecedores.length} fornecedores, ${estoque.length} itens de estoque.`
  );

  await migrarTabela("eventos", eventos.map(limparEvento));
  await migrarTabela("financeiro", financeiro);
  await migrarTabela("fornecedores", fornecedores);
  await migrarTabela("estoque", estoque);

  await migrarTabela("usuarios", [
    { email: "admin@lanacabaninha.com.br", senha: "Cabaninha@2026", role: "admin" },
    { email: "equipe@lanacabaninha.com.br", senha: "Equipe@2026", role: "colaborador" },
  ]);

  console.log("\nConferindo contagens no Supabase...");
  for (const [nome, esperado] of [
    ["eventos", eventos.length],
    ["financeiro", financeiro.length],
    ["fornecedores", fornecedores.length],
    ["estoque", estoque.length],
    ["usuarios", 2],
  ]) {
    const { count, error } = await supabase.from(nome).select("*", { count: "exact", head: true });
    if (error) throw new Error(`Erro ao contar ${nome}: ${error.message}`);
    const status = count === esperado ? "OK" : "DIVERGENTE";
    console.log(`${nome}: esperado ${esperado}, no banco ${count} — ${status}`);
  }

  console.log("\nMigração concluída.");
}

main().catch((err) => {
  console.error("Falhou:", err);
  process.exit(1);
});
