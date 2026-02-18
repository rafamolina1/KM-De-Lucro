import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type Body = {
  secret?: string;
  email?: string;
  plan?: "free" | "pro";
};

export async function POST(request: Request) {
  const adminSecret = process.env.ADMIN_SECRET;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!adminSecret || !supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      { error: "Admin não configurado no servidor." },
      { status: 500 },
    );
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const secret = String(body.secret || "");
  const email = String(body.email || "").trim().toLowerCase();
  const plan = body.plan;

  if (secret !== adminSecret) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  if (!email || (plan !== "free" && plan !== "pro")) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  let foundUserId: string | null = null;
  let page = 1;

  while (!foundUserId && page <= 10) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage: 1000,
    });

    if (error) {
      return NextResponse.json(
        { error: "Erro ao listar usuários." },
        { status: 500 },
      );
    }

    const match = data.users.find(
      (u) => (u.email || "").toLowerCase() === email,
    );
    if (match) {
      foundUserId = match.id;
      break;
    }

    if (data.users.length < 1000) break;
    page += 1;
  }

  if (!foundUserId) {
    return NextResponse.json(
      { error: "Usuário não encontrado." },
      { status: 404 },
    );
  }

  const { error: upsertError } = await supabase
    .from("profiles")
    .upsert({ id: foundUserId, plan }, { onConflict: "id" });

  if (upsertError) {
    return NextResponse.json(
      { error: "Erro ao atualizar plano." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}

