import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-6">
      <section className="rounded-xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-[color:var(--km-blue)]">
          KM de Lucro
        </h1>
        <p className="mt-2 text-base text-zinc-700">
          Descubra quanto você <span className="font-semibold text-[color:var(--km-green)]">realmente lucra</span> em cada frete. Sem planilha complicada, sem conta na cabeça. Só números claros para você tomar decisões melhores.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/app"
            className="inline-flex items-center justify-center rounded-full bg-[color:var(--km-green)] px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600 shadow-sm"
          >
            Começar grátis agora →
          </Link>
          <Link
            href="/planos"
            className="inline-flex items-center justify-center rounded-full border-2 border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:border-[color:var(--km-blue)] hover:text-[color:var(--km-blue)]"
          >
            Ver planos
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-gradient-to-br from-white to-zinc-50 p-5 shadow-sm border border-zinc-100">
          <h2 className="text-sm font-bold text-zinc-900 mb-2">
            ⚡ Resultado na hora
          </h2>
          <p className="text-xs text-zinc-700 leading-relaxed">
            Cadastre o frete e veja <span className="font-semibold">lucro e margem instantaneamente</span>. Compare meses e descubra quais rotas realmente valem a pena.
          </p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-white to-emerald-50/30 p-5 shadow-sm border border-emerald-100">
          <h2 className="text-sm font-bold text-[color:var(--km-green)] mb-2">
            🎁 10 fretes grátis
          </h2>
          <p className="text-xs text-zinc-700 leading-relaxed">
            Teste sem compromisso. <span className="font-semibold">Sem cartão, sem enrolação</span>. Use até 10 fretes e veja se faz sentido para você.
          </p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-white to-blue-50/30 p-5 shadow-sm border border-blue-100">
          <h2 className="text-sm font-bold text-[color:var(--km-blue)] mb-2">
            💰 R$ 19,90/mês
          </h2>
          <p className="text-xs text-zinc-700 leading-relaxed">
            Se valer a pena, o Pro libera <span className="font-semibold">fretes ilimitados</span> e histórico completo. Menos que um café por dia.
          </p>
        </div>
      </section>
    </div>
  );
}

