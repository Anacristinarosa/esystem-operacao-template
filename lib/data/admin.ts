import { createClient } from "@/lib/supabase/server";

export interface EmpresaCliente {
  id: string;
  email: string;
  nome: string | null;
  empresa_nome: string | null;
  criada_em: string;
  ultima_entrada: string | null;
  num_ocorrencias: number;
  ocorrencias_abertas: number;
  riscos_activos: number;
  acoes_pendentes: number;
}

export async function getEmpresas(): Promise<EmpresaCliente[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("empresas_view").select("*");
  if (error) return [];
  return data ?? [];
}

export async function getEmpresa(id: string): Promise<EmpresaCliente | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("empresas_view")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data;
}
