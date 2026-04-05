'use client';

import { useState } from "react";
import { BrandMark } from "@/components/BrandMark";

export default function AdminPlanosPage() {
  const [inputSecret, setInputSecret] = useState("");
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState<"free" | "pro">("pro");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) return;

    setLoading(true);
    setMessage(null);

    sessionStorage.setItem("km_admin_secret", inputSecret);

    const response = await fetch("/api/admin/planos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: inputSecret,
        email,
        plan,
      }),
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;
      setMessage(data?.error || "Não foi possível atualizar o plano.");
      setLoading(false);
      return;
    }

    setMessage(`Plano do usuário atualizado para ${plan.toUpperCase()}.`);
    setLoading(false);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <section className="km-panel-strong rounded-[30px] p-6 md:p-8">
        <BrandMark />
        <div className="mt-8 space-y-4">
          <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
            Operação interna
          </span>
          <h1 className="text-4xl font-bold tracking-[-0.04em] text-[color:var(--km-blue-strong)]">
            Ajuste manual de plano para clientes do PIX.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-[color:var(--foreground-muted)]">
            Esta tela existe para o fluxo operacional atual: receber o
            comprovante, localizar o usuário e ativar o plano adequado.
          </p>
        </div>
      </section>

      <section className="km-panel rounded-[30px] p-6 md:p-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--km-green)]">
            Admin
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-[color:var(--km-blue-strong)]">
            Atualizar plano do usuário.
          </h2>
          <p className="mt-3 text-sm leading-7 text-[color:var(--foreground-muted)]">
            Use o segredo de admin, informe o e-mail do cliente e selecione o
            plano desejado.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[color:var(--km-blue-strong)]">
              Segredo de admin
            </label>
            <input
              type="password"
              value={inputSecret}
              onChange={(event) => setInputSecret(event.target.value)}
              className="km-input"
              placeholder="Digite o segredo"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[color:var(--km-blue-strong)]">
              E-mail do usuário
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="km-input"
              placeholder="email usado pelo motorista"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[color:var(--km-blue-strong)]">
              Plano desejado
            </label>
            <select
              value={plan}
              onChange={(event) =>
                setPlan(event.target.value as "free" | "pro")
              }
              className="km-input"
            >
              <option value="free">Free (até 10 fretes)</option>
              <option value="pro">Pro (ilimitado)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="km-button-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Atualizando..." : "Salvar plano do usuário"}
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
