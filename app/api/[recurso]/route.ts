import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

const RECURSOS_VALIDOS = ["eventos", "financeiro", "fornecedores", "estoque"] as const;
type Recurso = (typeof RECURSOS_VALIDOS)[number];

function validarRecurso(recurso: string): recurso is Recurso {
  return (RECURSOS_VALIDOS as readonly string[]).includes(recurso);
}

export async function GET(_req: NextRequest, ctx: RouteContext<"/api/[recurso]">) {
  const { recurso } = await ctx.params;
  if (!validarRecurso(recurso)) {
    return NextResponse.json({ erro: "Recurso inválido: " + recurso }, { status: 400 });
  }
  const { data, error } = await supabaseAdmin().from(recurso).select("*");
  if (error) return NextResponse.json({ erro: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest, ctx: RouteContext<"/api/[recurso]">) {
  const { recurso } = await ctx.params;
  if (!validarRecurso(recurso)) {
    return NextResponse.json({ erro: "Recurso inválido: " + recurso }, { status: 400 });
  }
  const corpo = await req.json();
  const { error } = await supabaseAdmin().from(recurso).insert(corpo);
  if (error) return NextResponse.json({ erro: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
