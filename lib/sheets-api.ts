const API_URL = process.env.NEXT_PUBLIC_SHEETS_API_URL;

export type NomeAba = "Eventos" | "Financeiro" | "Fornecedores" | "Estoque";

function urlBase(): string {
  if (!API_URL) {
    throw new Error(
      "NEXT_PUBLIC_SHEETS_API_URL não configurada. Defina essa variável de ambiente com a URL do Apps Script publicado."
    );
  }
  return API_URL;
}

export async function listar<T>(sheet: NomeAba): Promise<T[]> {
  const res = await fetch(`${urlBase()}?sheet=${encodeURIComponent(sheet)}`, {
    cache: "no-store",
  });
  const json = await res.json();
  if (json && json.erro) throw new Error(json.erro);
  return json as T[];
}

interface Mutacao {
  action: "insert" | "update" | "delete";
  sheet: NomeAba;
  id?: string;
  data?: Record<string, unknown>;
}

export async function mutar(payload: Mutacao): Promise<void> {
  const res = await fetch(urlBase(), {
    method: "POST",
    // text/plain evita o preflight de CORS que o Apps Script não responde
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (json && json.erro) throw new Error(json.erro);
}

export async function login(email: string, senha: string): Promise<{ ok: boolean; role?: string }> {
  const res = await fetch(urlBase(), {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action: "login", data: { email, senha } }),
  });
  const json = await res.json();
  if (json && json.erro) throw new Error(json.erro);
  return json;
}
