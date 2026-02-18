'use client';

import { useEffect, useState } from "react";

export default function AdminPlanosPage() {
  const [inputSecret, setInputSecret] = useState("");
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState<"free" | "pro">("pro");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("km_admin_secret");
    if (stored) setInputSecret(stored);
  }, []);

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
    <div className="mx-auto max-w-lg space-y-6 rounded-xl bg-white p-6 shadow-sm">
      <h1 className="text-xl font-semibold text-[color:var(--km-blue)]">
        Admin – Ajuste de plano
      </h1>
      <p className="text-xs text-red-600">
        Tela interna para você ativar o Plano Pro de quem pagou via PIX. Não
        compartilhe este link.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3 text-sm">
        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-700">
            Segredo de admin
          </label>
          <input
            type="password"
            value={inputSecret}
            onChange={(e) => setInputSecret(e.target.value)}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            placeholder="Segredo definido no .env.local"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-700">
            E-mail do usuário
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            placeholder="email que o motorista usa para logar"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-700">
            Plano desejado
          </label>
          <select
            value={plan}
            onChange={(e) => setPlan(e.target.value as "free" | "pro")}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          >
            <option value="free">Free (até 10 fretes)</option>
            <option value="pro">Pro (ilimitado)</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 flex w-full items-center justify-center rounded-md bg-[color:var(--km-green)] px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-60"
        >
          {loading ? "Atualizando..." : "Salvar plano do usuário"}
        </button>
      </form>

      {message && <p className="text-xs text-zinc-600">{message}</p>}
    </div>
  );
}

