import "server-only";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cliente: SupabaseClient<any, any, any> | undefined;

export function supabaseAdmin() {
  if (!cliente) {
    const url = process.env.SUPABASE_URL;
    const chave = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !chave) {
      throw new Error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY não configuradas.");
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cliente = createClient<any, any, any>(url, chave, {
      auth: { persistSession: false },
    });
  }
  return cliente;
}
