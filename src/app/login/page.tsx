'use client';

import { useState, useSyncExternalStore } from "react";
import { BrandMark } from "@/components/BrandMark";
import { supabase } from "@/lib/supabaseClient";

const bullets = [
  "Acesso por magic link, sem senha para decorar.",
  "Lucro e margem calculados na hora.",
  "Teste gratuito com até 10 fretes.",
];

function subscribeToLocation() {
  return () => {};
}

function getLoginErrorFromUrl() {
  if (typeof window === "undefined") {
    return null;
  }

  return new URLSearchParams(window.location.search).get("error");
}

export default function LoginPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dismissedError, setDismissedError] = useState(false);
  const errorMessage = useSyncExternalStore(
    subscribeToLocation,
    getLoginErrorFromUrl,
    () => null,
  );
  const visibleErrorMessage = dismissedError ? null : errorMessage;
  const feedback = message ?? visibleErrorMessage;
  const isErrorFeedback = !message && Boolean(visibleErrorMessage);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").trim();

    if (!email) return;

    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.delete("error");
    window.history.replaceState(window.history.state, "", currentUrl.toString());

    setLoading(true);
    setDismissedError(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error(error);
      setMessage(error.message || "Não foi possível enviar o link. Tente novamente.");
    } else {
      setMessage(
        "Link enviado. Confira sua caixa de entrada e o spam para continuar.",
      );
    }

    setLoading(false);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.04fr_0.96fr]">
      <section className="km-panel-strong rounded-[30px] p-6 md:p-8">
        <BrandMark />
        <div className="mt-8 space-y-4">
          <span className="km-chip">Acesso rápido</span>
          <h1 className="text-4xl font-bold tracking-[-0.04em] text-[color:var(--km-blue-strong)]">
            Entre sem senha e vá direto para os números.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-[color:var(--foreground-muted)]">
            O login por e-mail foi escolhido para reduzir atrito na rotina. O
            objetivo do produto é ser leve e rápido, inclusive na entrada.
          </p>
        </div>

        <div className="mt-8 grid gap-3">
          {bullets.map((item) => (
            <div
              key={item}
              className="rounded-[22px] border border-[rgba(16,37,48,0.08)] bg-white/82 p-4 text-sm text-[color:var(--foreground-muted)]"
            >
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="km-panel rounded-[30px] p-6 md:p-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--km-green)]">
            Magic link
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-[color:var(--km-blue-strong)]">
            Receba o acesso no seu e-mail.
          </h2>
          <p className="mt-3 text-sm leading-7 text-[color:var(--foreground-muted)]">
            Basta clicar no link recebido para entrar na aplicação. Simples do
            jeito que precisa ser.
          </p>
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

          <button
            type="submit"
            disabled={loading}
            className="km-button-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Enviando..." : "Enviar link de acesso"}
          </button>
        </form>

        {feedback && (
          <div
            className={`mt-4 rounded-[22px] px-4 py-3 text-sm ${
              isErrorFeedback
                ? "border border-red-200 bg-red-50 text-red-700"
                : "border border-[rgba(16,37,48,0.08)] bg-white/84 text-[color:var(--foreground-muted)]"
            }`}
          >
            {feedback}
          </div>
        )}

        <p className="mt-6 text-xs leading-6 text-[color:var(--foreground-muted)]">
          Ao continuar, você concorda em receber os e-mails necessários para
          usar a ferramenta. Você pode sair quando quiser.
        </p>
      </section>
    </div>
  );
}
