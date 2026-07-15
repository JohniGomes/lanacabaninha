"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Role } from "./types";
import { clearRole, getRole, setRole as persistRole } from "./storage";
import { validarLogin } from "./auth-data";

interface RoleContextValue {
  role: Role | null;
  ready: boolean;
  login: (email: string, senha: string) => boolean;
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

  function login(email: string, senha: string) {
    const role = validarLogin(email, senha);
    if (!role) return false;
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
