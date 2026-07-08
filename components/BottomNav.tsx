"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRole } from "@/lib/role-context";
import { Role } from "@/lib/types";

interface NavItem {
  href: string;
  label: string;
  icon: string;
  roles: Role[];
}

const ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Início", icon: "🏠", roles: ["admin", "colaborador"] },
  { href: "/calendario", label: "Eventos", icon: "📅", roles: ["admin", "colaborador"] },
  { href: "/financeiro", label: "Financeiro", icon: "💰", roles: ["admin"] },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { role, logout } = useRole();

  const items = ITEMS.filter((item) => (role ? item.roles.includes(role) : false));

  return (
    <nav className="fixed bottom-0 inset-x-0 z-20 border-t border-border bg-surface/95 backdrop-blur px-2 pb-[env(safe-area-inset-bottom)]">
      <ul className="mx-auto flex max-w-md items-stretch justify-around">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={`flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium transition-colors ${
                  active ? "text-pink-dark" : "text-muted"
                }`}
              >
                <span className="text-xl leading-none">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          );
        })}
        <li className="flex-1">
          <button
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="flex w-full flex-col items-center gap-0.5 py-2.5 text-xs font-medium text-muted"
          >
            <span className="text-xl leading-none">🚪</span>
            Sair
          </button>
        </li>
      </ul>
    </nav>
  );
}
