'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function DevLoginPage() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isNewAccount, setIsNewAccount] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    if (!email || !password) return;

    setLoading(true);
    setMessage(null);

    try {
      if (isNewAccount) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) {
          console.error(error);
          setMessage("Erro ao criar conta. Verifique o e-mail e tente novamente.");
        } else {
          setMessage("Conta criada. Agora você pode entrar com e-mail e senha.");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          console.error(error);
          setMessage("E-mail ou senha inválidos.");
        } else {
          router.replace("/app");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6 rounded-xl bg-white p-6 shadow-sm">
      <h1 className="text-xl font-semibold text-[color:var(--km-blue)]">
        Dev login (interno)
      </h1>
      <p className="text-xs text-red-600">
        Esta tela é só para você testar durante o desenvolvimento. Quando for
        lançar para motoristas, remova a rota `/dev-login`.
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
        <div className="space-y-1">
          <label
            htmlFor="password"
            className="text-xs font-medium text-zinc-700"
          >
            Senha
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none ring-0 focus:border-zinc-900"
            placeholder="Mínimo 6 caracteres"
          />
        </div>

        <label className="flex items-center gap-2 text-xs text-zinc-600">
          <input
            type="checkbox"
            checked={isNewAccount}
            onChange={(e) => setIsNewAccount(e.target.checked)}
            className="h-3 w-3 rounded border-zinc-300"
          />
          Criar nova conta com essa senha
        </label>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center rounded-md bg-[color:var(--km-green)] px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-60"
        >
          {loading
            ? isNewAccount
              ? "Criando conta..."
              : "Entrando..."
            : isNewAccount
              ? "Criar conta"
              : "Entrar"}
        </button>
      </form>

      {message && <p className="text-xs text-zinc-500">{message}</p>}
    </div>
  );
}

