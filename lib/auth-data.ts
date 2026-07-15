import { Role } from "./types";

interface Usuario {
  email: string;
  senha: string;
  role: Role;
}

// Credenciais fixas no próprio app — funcionam para controlar acesso, mas não
// são seguras de verdade (ficam visíveis em quem inspecionar o código).
// Isso muda quando o backend (Supabase) entrar em produção.
export const usuarios: Usuario[] = [
  { email: "admin@lanacabaninha.com.br", senha: "Cabaninha@2026", role: "admin" },
  { email: "equipe@lanacabaninha.com.br", senha: "Equipe@2026", role: "colaborador" },
];

export function validarLogin(email: string, senha: string): Role | null {
  const usuario = usuarios.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.senha === senha
  );
  return usuario ? usuario.role : null;
}
