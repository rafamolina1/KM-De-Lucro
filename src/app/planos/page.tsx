import Link from "next/link";

const comparison = [
  {
    label: "Limite de uso",
    free: "Até 10 fretes para validar",
    pro: "Fretes ilimitados",
  },
  {
    label: "Resumo mensal",
    free: "Disponível",
    pro: "Disponível",
  },
  {
    label: "Histórico completo",
    free: "Não",
    pro: "Sim",
  },
  {
    label: "Exportação CSV/PDF",
    free: "Não",
    pro: "Sim",
  },
  {
    label: "Evolução do produto",
    free: "Atualizações gerais",
    pro: "Prioridade em melhorias",
  },
];

const paymentSteps = [
  "Envie R$ 19,90 via PIX para a chave abaixo.",
  "Mande o comprovante pelo WhatsApp informado.",
  "A ativação do plano acontece em até 24 horas.",
];

const faq = [
  {
    question: "Preciso cadastrar cartão para testar?",
    answer:
      "Não. O plano gratuito libera até 10 fretes sem cartão e sem prazo de expiração.",
  },
  {
    question: "O plano gratuito some depois de alguns dias?",
    answer:
      "Não. Você pode continuar usando o modo gratuito pelo tempo que quiser dentro do limite proposto.",
  },
  {
    question: "Quando faz sentido assinar o Pro?",
    answer:
      "Quando o histórico completo e os relatórios começarem a te ajudar de verdade a comparar meses e organizar o controle do negócio.",
  },
];

export default function PlanosPage() {
  return (
    <div className="space-y-6 md:space-y-8">
      <section className="relative overflow-hidden rounded-[32px] border border-white/60 bg-[linear-gradient(135deg,rgba(255,255,255,0.94),rgba(238,244,239,0.88))] px-6 py-8 shadow-[0_34px_90px_-48px_rgba(16,37,48,0.38)] md:px-10">
        <div className="absolute -left-10 top-4 h-40 w-40 rounded-full bg-[color:var(--km-yellow)]/14 blur-3xl" />
        <div className="absolute right-0 top-0 h-52 w-52 rounded-full bg-[color:var(--km-green)]/14 blur-3xl" />

        <div className="relative max-w-3xl space-y-5">
          <span className="km-chip">Planos simples, sem pegadinha</span>
          <h1 className="text-4xl font-bold tracking-[-0.04em] text-[color:var(--km-blue-strong)] md:text-5xl">
            Comece grátis. Assine só quando o produto provar valor.
          </h1>
          <p className="text-base leading-7 text-[color:var(--foreground-muted)] md:text-lg">
            O KM de Lucro foi pensado para reduzir atrito: você testa sem
            cartão, entende se a ferramenta te ajuda e só depois decide se quer
            liberar histórico completo e relatórios.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/login" className="km-button-primary">
              Entrar para testar
            </Link>
            <Link href="/app" className="km-button-secondary">
              Abrir dashboard
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.86fr_1.14fr]">
        <article className="km-panel rounded-[30px] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--km-green)]">
            Plano Gratuito
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-[color:var(--km-blue-strong)]">
            R$ 0
          </h2>
          <p className="mt-2 text-sm text-[color:var(--foreground-muted)]">
            Ideal para validar a proposta sem compromisso.
          </p>

          <div className="mt-6 space-y-3">
            <div className="rounded-[22px] border border-[rgba(16,37,48,0.08)] bg-white/84 p-4">
              <p className="text-sm font-semibold text-[color:var(--km-blue-strong)]">
                Até 10 fretes para testar
              </p>
              <p className="mt-2 text-sm leading-7 text-[color:var(--foreground-muted)]">
                Espaço suficiente para sentir a proposta do produto em uso real.
              </p>
            </div>
            <div className="rounded-[22px] border border-[rgba(16,37,48,0.08)] bg-white/84 p-4">
              <p className="text-sm font-semibold text-[color:var(--km-blue-strong)]">
                Lucro e margem calculados na hora
              </p>
              <p className="mt-2 text-sm leading-7 text-[color:var(--foreground-muted)]">
                Sem planilha intermediária e sem precisar fazer conta de cabeça.
              </p>
            </div>
            <div className="rounded-[22px] border border-[rgba(16,37,48,0.08)] bg-white/84 p-4">
              <p className="text-sm font-semibold text-[color:var(--km-blue-strong)]">
                Resumo mensal disponível
              </p>
              <p className="mt-2 text-sm leading-7 text-[color:var(--foreground-muted)]">
                Você já consegue entender faturamento, custos e lucro do mês.
              </p>
            </div>
          </div>
        </article>

        <article className="km-panel-strong relative overflow-hidden rounded-[30px] p-6 md:p-8">
          <div className="absolute right-6 top-6 rounded-full bg-[color:var(--km-green)] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white">
            Mais completo
          </div>

          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--km-green)]">
              Plano Pro
            </p>
            <h2 className="mt-3 text-4xl font-bold tracking-[-0.04em] text-[color:var(--km-blue-strong)]">
              R$ 19,90
              <span className="ml-2 text-base font-medium text-[color:var(--foreground-muted)]">
                por mês
              </span>
            </h2>
            <p className="mt-3 max-w-xl text-base leading-7 text-[color:var(--foreground-muted)]">
              Para quem quer transformar o KM de Lucro em ferramenta de rotina,
              com histórico completo, relatórios e mais liberdade de uso.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-[24px] border border-[rgba(47,155,77,0.18)] bg-[linear-gradient(135deg,rgba(47,155,77,0.12),rgba(255,255,255,0.7))] p-5">
              <p className="text-sm font-semibold text-[color:var(--km-blue-strong)]">
                O que libera
              </p>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-[color:var(--foreground-muted)]">
                <li>Fretes ilimitados para usar sem medo de travar o fluxo.</li>
                <li>Histórico completo para comparar meses e entender evolução.</li>
                <li>Exportação em CSV e PDF para controle externo.</li>
              </ul>
            </div>

            <div className="rounded-[24px] border border-[rgba(16,37,48,0.08)] bg-white/86 p-5">
              <p className="text-sm font-semibold text-[color:var(--km-blue-strong)]">
                Ativação manual via PIX
              </p>
              <div className="mt-4 rounded-[20px] border border-dashed border-[rgba(47,155,77,0.32)] bg-[color:var(--km-cloud)] px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--foreground-muted)]">
                  Chave PIX
                </p>
                <p className="mt-2 break-all font-mono text-sm font-semibold text-[color:var(--km-blue-strong)]">
                  RAFAELOLIVEIRAMOLINA@GMAIL.COM
                </p>
                <p className="mt-3 text-sm text-[color:var(--foreground-muted)]">
                  WhatsApp: (73) 99845-3262
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-[24px] border border-[rgba(16,37,48,0.08)] bg-white/84 p-5">
            <p className="text-sm font-semibold text-[color:var(--km-blue-strong)]">
              Como funciona o pagamento
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {paymentSteps.map((step, index) => (
                <div
                  key={step}
                  className="rounded-[20px] border border-[rgba(16,37,48,0.08)] bg-[color:var(--background)]/60 p-4"
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--km-blue)] text-xs font-bold text-white">
                    0{index + 1}
                  </span>
                  <p className="mt-3 text-sm leading-7 text-[color:var(--foreground-muted)]">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </article>
      </section>

      <section className="km-panel rounded-[30px] overflow-hidden">
        <div className="grid gap-0 md:grid-cols-[0.85fr_1.15fr]">
          <div className="border-b border-[rgba(16,37,48,0.08)] bg-[linear-gradient(180deg,rgba(18,63,103,0.96),rgba(13,47,77,0.96))] px-6 py-8 text-white md:border-b-0 md:border-r">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
              Comparativo rápido
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em]">
              O que muda de um plano para o outro.
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/78">
              O gratuito serve para validar a proposta. O Pro entra quando você
              quer continuidade, histórico e relatórios.
            </p>
          </div>

          <div className="divide-y divide-[rgba(16,37,48,0.08)] bg-white/86">
            {comparison.map((item) => (
              <div
                key={item.label}
                className="grid gap-4 px-6 py-5 md:grid-cols-[0.7fr_0.65fr_0.65fr] md:items-center"
              >
                <p className="text-sm font-semibold text-[color:var(--km-blue-strong)]">
                  {item.label}
                </p>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--foreground-muted)]">
                    Gratuito
                  </p>
                  <p className="mt-1 text-sm leading-7 text-[color:var(--foreground-muted)]">
                    {item.free}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--km-green)]">
                    Pro
                  </p>
                  <p className="mt-1 text-sm leading-7 text-[color:var(--foreground-muted)]">
                    {item.pro}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.94fr_1.06fr]">
        <article className="km-panel rounded-[30px] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--km-green)]">
            Dúvidas comuns
          </p>
          <div className="mt-5 space-y-4">
            {faq.map((item) => (
              <div
                key={item.question}
                className="rounded-[22px] border border-[rgba(16,37,48,0.08)] bg-white/84 p-5"
              >
                <h3 className="text-lg font-semibold text-[color:var(--km-blue-strong)]">
                  {item.question}
                </h3>
                <p className="mt-2 text-sm leading-7 text-[color:var(--foreground-muted)]">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </article>

        <article className="km-panel-strong rounded-[30px] p-6 md:p-8">
          <span className="km-chip">Resumo da decisão</span>
          <h2 className="mt-5 text-3xl font-bold tracking-[-0.04em] text-[color:var(--km-blue-strong)]">
            Se você ainda está validando, fique no plano gratuito. Quando o
            produto já fizer parte da rotina, o Pro libera o restante.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[color:var(--foreground-muted)]">
            A estrutura foi pensada para ser honesta com quem usa: primeiro o
            produto precisa ajudar na prática. Depois faz sentido pagar por mais
            capacidade e histórico.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/login" className="km-button-primary">
              Começar com 10 fretes grátis
            </Link>
            <Link href="/app" className="km-button-secondary">
              Voltar para a calculadora
            </Link>
          </div>
        </article>
      </section>
    </div>
  );
}
