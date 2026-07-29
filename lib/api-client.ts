export type Recurso = "eventos" | "financeiro" | "fornecedores" | "estoque";

async function tratarResposta(res: Response) {
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json?.erro) {
    throw new Error(json?.erro || `Erro na requisição (${res.status})`);
  }
  return json;
}

export async function listar<T>(recurso: Recurso): Promise<T[]> {
  const res = await fetch(`/api/${recurso}`, { cache: "no-store" });
  return (await tratarResposta(res)) as T[];
}

export async function buscarPorId<T>(recurso: Recurso, id: string): Promise<T | undefined> {
  const res = await fetch(`/api/${recurso}/${encodeURIComponent(id)}`, { cache: "no-store" });
  if (res.status === 404) return undefined;
  return (await tratarResposta(res)) as T;
}

export async function inserir(recurso: Recurso, data: Record<string, unknown>): Promise<void> {
  const res = await fetch(`/api/${recurso}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  await tratarResposta(res);
}

export async function atualizar(recurso: Recurso, id: string, data: Record<string, unknown>): Promise<void> {
  const res = await fetch(`/api/${recurso}/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  await tratarResposta(res);
}

export async function excluir(recurso: Recurso, id: string): Promise<void> {
  const res = await fetch(`/api/${recurso}/${encodeURIComponent(id)}`, { method: "DELETE" });
  await tratarResposta(res);
}

export async function login(email: string, senha: string): Promise<{ ok: boolean; role?: string }> {
  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });
  return (await tratarResposta(res)) as { ok: boolean; role?: string };
}
