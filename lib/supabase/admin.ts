import { createClient } from "@supabase/supabase-js";

// Client com service_role — só usar em rotas de servidor.
// Nunca importar num componente cliente.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
