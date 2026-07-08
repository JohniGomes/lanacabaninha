"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "@/lib/role-context";

export default function Home() {
  const { role, ready } = useRole();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    router.replace(role ? "/dashboard" : "/login");
  }, [ready, role, router]);

  return (
    <div className="flex flex-1 items-center justify-center text-muted">
      Carregando...
    </div>
  );
}
