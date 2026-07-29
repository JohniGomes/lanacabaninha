import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  const { email, senha } = await req.json();
  if (!email || !senha) {
    return NextResponse.json({ ok: false });
  }

  const { data, error } = await supabaseAdmin()
    .from("usuarios")
    .select("senha, role")
    .ilike("email", String(email).trim())
    .maybeSingle();

  if (error) return NextResponse.json({ erro: error.message }, { status: 500 });
  if (!data || data.senha !== senha) {
    return NextResponse.json({ ok: false });
  }

  return NextResponse.json({ ok: true, role: data.role });
}
