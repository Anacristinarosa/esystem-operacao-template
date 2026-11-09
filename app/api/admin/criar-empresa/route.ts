import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { requerFounder } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  await requerFounder();

  const { email, nome, empresa_nome, password } = await req.json();

  if (!email || typeof email !== "string") {
    return NextResponse.json({ erro: "Email obrigatório." }, { status: 400 });
  }
  if (!nome || typeof nome !== "string") {
    return NextResponse.json({ erro: "Nome de contacto obrigatório." }, { status: 400 });
  }
  if (!empresa_nome || typeof empresa_nome !== "string") {
    return NextResponse.json({ erro: "Nome da empresa obrigatório." }, { status: 400 });
  }

  const passwordFinal =
    (typeof password === "string" && password.trim().length >= 6
      ? password.trim()
      : process.env.PASSWORD_INICIAL) ?? randomBytes(9).toString("base64url");

  const admin = createAdminClient();

  const { data, error } = await admin.auth.admin.createUser({
    email: email.trim().toLowerCase(),
    password: passwordFinal,
    email_confirm: true,
    user_metadata: { nome: nome.trim() },
  });

  if (error) {
    return NextResponse.json({ erro: error.message }, { status: 400 });
  }

  const userId = data.user?.id;
  if (userId) {
    // Upsert para garantir role e empresa_nome, mesmo se o trigger já criou perfil.
    await admin
      .from("perfis")
      .upsert(
        {
          id: userId,
          nome: nome.trim(),
          role: "empresa",
          empresa_nome: empresa_nome.trim(),
        },
        { onConflict: "id" },
      );
  }

  return NextResponse.json({ ok: true, id: userId, password: passwordFinal });
}
