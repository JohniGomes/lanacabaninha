"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Role } from "./types";
import { clearRole, getRole, setRole as persistRole } from "./storage";
import { login as loginNaPlanilha } from "./sheets-api";

interface RoleContextValue {
  role: Role | null;
  ready: boolean;
  login: (email: string, senha: string) => Promise<boolean>;
  logout: () => void;
}

const RoleContext = createContext<RoleContextValue | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setRoleState(getRole());
    setReady(true);
  }, []);

  async function login(email: string, senha: string) {
    const resposta = await loginNaPlanilha(email, senha);
    if (!resposta.ok || (resposta.role !== "admin" && resposta.role !== "colaborador")) {
      return false;
    }
    const role = resposta.role as Role;
    persistRole(role);
    setRoleState(role);
    return true;
  }

  function logout() {
    clearRole();
    setRoleState(null);
  }

  return (
    <RoleContext.Provider value={{ role, ready, login, logout }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole deve ser usado dentro de RoleProvider");
  return ctx;
}
