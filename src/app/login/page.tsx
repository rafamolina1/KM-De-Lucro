'use client';

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").trim();

    if (!email) return;

    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error(error);
      setMessage("Não foi possível enviar o link. Tente novamente.");
    } else {
      setMessage(
        "Enviamos um link para o seu e-mail. Confira sua caixa de entrada.",
      );
    }

    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-md space-y-6 rounded-xl bg-white p-6 shadow-sm">
      <h1 className="text-xl font-semibold text-[color:var(--km-blue)]">
        Entrar no KM de Lucro
      </h1>
      <p className="text-sm text-zinc-600">
        Use seu e-mail para receber um link de acesso. Sem senha para lembrar.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1">
          <label
            htmlFor="email"
            className="text-xs font-medium text-zinc-700"
          >
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none ring-0 focus:border-zinc-900"
            placeholder="voce@exemplo.com"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center rounded-md bg-[color:var(--km-green)] px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-60"
        >
          {loading ? "Enviando..." : "Enviar link de acesso"}
        </button>
      </form>

      {message && <p className="text-xs text-zinc-500">{message}</p>}

      <p className="text-xs text-zinc-500">
        Ao continuar, você concorda em receber e-mails relacionados ao uso da
        ferramenta. Você pode sair quando quiser.
      </p>
    </div>
  );
}


