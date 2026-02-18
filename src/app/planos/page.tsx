import Link from "next/link";

export default function PlanosPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-[color:var(--km-blue)]">
          Escolha seu plano
        </h1>
        <p className="mt-2 text-base text-zinc-700">
          Comece <span className="font-semibold text-[color:var(--km-green)]">100% grátis</span> e só pague se realmente te ajudar a ganhar mais. Sem pegadinha, sem compromisso.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col justify-between rounded-xl border-2 border-zinc-200 bg-gradient-to-br from-zinc-50 to-white p-6 shadow-sm">
          <div className="space-y-3">
            <div>
              <h2 className="text-base font-bold text-zinc-900">
                Plano Gratuito
              </h2>
              <p className="text-3xl font-bold text-[color:var(--km-blue)] mt-1">
                R$ 0
                <span className="text-sm font-normal text-zinc-500">
                  {" "}
                  / para sempre
                </span>
              </p>
            </div>
            <ul className="mt-3 space-y-2 text-xs text-zinc-700">
              <li className="flex items-start gap-2">
                <span className="text-[color:var(--km-green)] font-bold">✓</span>
                <span>Até <strong>10 fretes</strong> para testar</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[color:var(--km-green)] font-bold">✓</span>
                <span><strong>Lucro e margem</strong> calculados na hora</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[color:var(--km-green)] font-bold">✓</span>
                <span><strong>Resumo mensal</strong> completo</span>
              </li>
            </ul>
          </div>
          <p className="mt-4 text-xs text-zinc-600 font-medium">
            Perfeito para você descobrir se vale a pena antes de pagar qualquer coisa.
          </p>
        </div>

        <div className="flex flex-col justify-between rounded-xl border-2 border-[color:var(--km-green)] bg-gradient-to-br from-white to-emerald-50/30 p-6 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-[color:var(--km-green)] text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">
            RECOMENDADO
          </div>
          <div className="space-y-3 mt-2">
            <div>
              <h2 className="text-base font-bold text-[color:var(--km-green)]">
                Plano Pro
              </h2>
              <p className="text-3xl font-bold text-[color:var(--km-blue)] mt-1">
                R$ 19,90
                <span className="text-sm font-normal text-zinc-500">
                  {" "}
                  / mês
                </span>
              </p>
              <p className="text-[10px] text-zinc-500 mt-0.5">
                Menos que um café por dia ☕
              </p>
            </div>
            <ul className="mt-3 space-y-2 text-xs text-zinc-700">
              <li className="flex items-start gap-2">
                <span className="text-[color:var(--km-green)] font-bold">✓</span>
                <span><strong>Fretes ilimitados</strong> - lance quantos quiser</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[color:var(--km-green)] font-bold">✓</span>
                <span><strong>Histórico completo</strong> para comparar meses</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[color:var(--km-green)] font-bold">✓</span>
                <span><strong>Prioridade</strong> em novas funcionalidades</span>
              </li>
            </ul>
          </div>
          <div className="mt-4 space-y-3 text-xs text-zinc-700 bg-white/50 rounded-lg p-3 border border-zinc-200">
            <p className="font-bold text-zinc-900">
              💳 Como pagar (PIX simples):
            </p>
            <div className="rounded-md border-2 border-dashed border-[color:var(--km-green)] bg-emerald-50/50 px-3 py-2.5">
              <p className="text-[10px] font-bold text-zinc-800 uppercase tracking-wide mb-1">
                Chave PIX
              </p>
              <p className="text-xs font-mono font-semibold text-zinc-900 break-all">
                SEU_EMAIL_OU_CHAVE_AQUI@exemplo.com
              </p>
            </div>
            <div className="space-y-1.5 text-[11px]">
              <p className="flex items-start gap-2">
                <span className="text-[color:var(--km-green)]">→</span>
                <span>Envie <strong>R$ 19,90</strong> via PIX para a chave acima</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-[color:var(--km-green)]">→</span>
                <span>Mande o <strong>comprovante</strong> pelo WhatsApp</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-[color:var(--km-green)]">→</span>
                <span>Seu plano será ativado em <strong>até 24h</strong></span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-xl bg-gradient-to-br from-zinc-50 to-white p-5 text-xs text-zinc-700 shadow-sm border border-zinc-200">
        <p className="font-bold text-zinc-900 mb-3">
          ⚡ Dúvidas sobre o Pro?
        </p>
        <div className="space-y-2 text-[11px]">
          <p>
            <strong>Comece grátis:</strong> Use até 10 fretes sem pagar nada. Se você sentir que está te ajudando a entender melhor seus números e tomar decisões mais inteligentes sobre rotas e valores, aí sim vale considerar o Pro.
          </p>
          <p className="mt-3 pt-3 border-t border-zinc-200">
            <strong>Sem pressão:</strong> O plano gratuito não expira. Você pode usar para sempre se quiser. O Pro é só para quem realmente precisa de mais fretes e histórico completo.
          </p>
        </div>
      </section>

      <div className="flex justify-end">
        <Link
          href="/app"
          className="inline-flex items-center justify-center rounded-full bg-[color:var(--km-green)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600 shadow-sm"
        >
          ← Voltar para a calculadora
        </Link>
      </div>
    </div>
  );
}

