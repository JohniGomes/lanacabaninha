"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRole } from "@/lib/role-context";
import { BottomNav } from "@/components/BottomNav";
import logo from "@/public/logo.png";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { role, ready } = useRole();
  const router = useRouter();

  useEffect(() => {
    if (ready && !role) {
      router.replace("/login");
    }
  }, [ready, role, router]);

  if (!ready || !role) {
    return (
      <div className="flex flex-1 items-center justify-center text-muted">
        Carregando...
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-surface/95 px-4 py-2 backdrop-blur">
        <Image src={logo} alt="Lá Na Cabaninha" height={44} width={49} className="h-11 w-auto" priority />
        <span className="rounded-full bg-lilac/40 px-3 py-1 text-xs font-semibold text-lilac-dark">
          {role === "admin" ? "Admin" : "Colaborador"}
        </span>
      </header>
      <main className="flex-1 px-4 pb-24 pt-4 mx-auto w-full max-w-md">{children}</main>
      <BottomNav />
    </div>
  );
}
