import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function getUtilizador() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getPerfil() {
  const user = await getUtilizador();
  if (!user) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("perfis")
    .select("id, nome, role")
    .eq("id", user.id)
    .single();
  return data ? { ...data, email: user.email } : null;
}

export async function requerUtilizador() {
  const user = await getUtilizador();
  if (!user) redirect("/login");
  return user;
}

export async function requerFounder() {
  const perfil = await getPerfil();
  if (!perfil) redirect("/login");
  if (perfil.role !== "founder") redirect("/dashboard");
  return perfil;
}

export async function requerCliente() {
  const perfil = await getPerfil();
  if (!perfil) redirect("/login");
  return perfil;
}
