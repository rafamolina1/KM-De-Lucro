'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BrandMark } from "@/components/BrandMark";
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
          setMessage("Erro ao criar conta. Verifique os dados e tente de novo.");
        } else {
          setMessage("Conta criada. Agora você pode entrar normalmente.");
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
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <section className="km-panel-strong rounded-[30px] p-6 md:p-8">
        <BrandMark />
        <div className="mt-8 space-y-4">
          <span className="inline-flex rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-red-700">
            Uso interno
          </span>
          <h1 className="text-4xl font-bold tracking-[-0.04em] text-[color:var(--km-blue-strong)]">
            Área de login para desenvolvimento.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-[color:var(--foreground-muted)]">
            Esta rota facilita seus testes com e-mail e senha no ambiente de
            desenvolvimento. Antes de publicar, o ideal é remover a tela
            `/dev-login`.
          </p>
        </div>
      </section>

      <section className="km-panel rounded-[30px] p-6 md:p-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--km-green)]">
            Fluxo técnico
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-[color:var(--km-blue-strong)]">
            Entre ou crie uma conta de teste.
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-semibold text-[color:var(--km-blue-strong)]"
            >
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="km-input"
              placeholder="voce@exemplo.com"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-semibold text-[color:var(--km-blue-strong)]"
            >
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              className="km-input"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <label className="flex items-center gap-3 rounded-[20px] border border-[rgba(16,37,48,0.08)] bg-white/82 px-4 py-3 text-sm text-[color:var(--foreground-muted)]">
            <input
              type="checkbox"
              checked={isNewAccount}
              onChange={(event) => setIsNewAccount(event.target.checked)}
              className="h-4 w-4 rounded border-[rgba(16,37,48,0.2)]"
            />
            Criar nova conta com esse e-mail e senha
          </label>

          <button
            type="submit"
            disabled={loading}
            className="km-button-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
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

        {message && (
          <div className="mt-4 rounded-[22px] border border-[rgba(16,37,48,0.08)] bg-white/84 px-4 py-3 text-sm text-[color:var(--foreground-muted)]">
            {message}
          </div>
        )}
      </section>
    </div>
  );
}
