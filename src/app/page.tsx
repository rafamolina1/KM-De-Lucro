import Image from "next/image";
import Link from "next/link";

const highlights = [
  {
    title: "Margem em segundos",
    description:
      "Cadastre valor, diesel, pedágio e custos extras. O KM de Lucro devolve o que realmente sobrou na viagem.",
  },
  {
    title: "Visão mensal sem planilha",
    description:
      "Organize os fretes por mês, compare resultado com o período anterior e perceba rápido quando o caixa começou a apertar.",
  },
  {
    title: "Relatório pronto quando precisar",
    description:
      "Exportação em CSV e PDF para prestação de contas, histórico pessoal ou apoio na contabilidade.",
  },
];

const workflow = [
  {
    step: "01",
    title: "Lance o frete",
    description:
      "Data, origem, destino, KM, valor e os custos que afetaram a viagem.",
  },
  {
    step: "02",
    title: "Veja lucro e margem",
    description:
      "O cálculo acontece na hora. Você sabe se o frete foi saudável ou só movimentou o caminhão.",
  },
  {
    step: "03",
    title: "Compare e decida melhor",
    description:
      "O painel mensal mostra a evolução do resultado e ajuda a enxergar rotas e padrões mais rentáveis.",
  },
];

const pillars = [
  {
    eyebrow: "Clareza",
    title: "Feito para a rotina da estrada, não para quem vive no Excel.",
    description:
      "A navegação é curta, o formulário é direto e os números importantes aparecem primeiro.",
  },
  {
    eyebrow: "Confiança",
    title: "Cada frete vira dado útil para decidir melhor o próximo.",
    description:
      "Custos separados, margem percentual e histórico organizado deixam menos espaço para achismo.",
  },
  {
    eyebrow: "Crescimento",
    title: "Começa grátis e sobe de nível só se fizer sentido.",
    description:
      "Você testa até 10 fretes sem cartão e só parte para o Pro quando o produto provar valor de verdade.",
  },
];

export default function Home() {
  return (
    <div className="space-y-8 md:space-y-10">
      <section className="relative overflow-hidden rounded-[32px] border border-white/60 bg-[linear-gradient(135deg,rgba(255,255,255,0.94),rgba(242,246,240,0.88))] px-6 py-8 shadow-[0_34px_90px_-48px_rgba(16,37,48,0.38)] md:px-10 md:py-10">
        <div className="absolute -left-10 top-8 h-40 w-40 rounded-full bg-[color:var(--km-yellow)]/16 blur-3xl" />
        <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-[color:var(--km-green)]/14 blur-3xl" />

        <div className="relative grid gap-8 xl:grid-cols-[1.05fr_0.95fr] xl:items-center">
          <div className="space-y-6">
            <span className="km-chip">
              Produto SaaS para motoristas autônomos
            </span>

            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-[-0.04em] text-[color:var(--km-blue-strong)] md:text-6xl">
                Descubra se o frete deu lucro ou só trabalho.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-[color:var(--foreground-muted)] md:text-lg">
                O KM de Lucro transforma valor do frete, diesel, pedágio e
                custos extras em um painel simples de rentabilidade. Menos
                planilha, menos conta de cabeça, mais decisão com base em dado.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/login" className="km-button-primary">
                Testar grátis
              </Link>
              <Link href="/planos" className="km-button-secondary">
                Ver planos
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="km-panel rounded-[24px] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--foreground-muted)]">
                  Teste inicial
                </p>
                <p className="mt-2 text-2xl font-bold text-[color:var(--km-blue)]">
                  10 fretes
                </p>
                <p className="mt-1 text-sm text-[color:var(--foreground-muted)]">
                  sem cartão e sem pressão para pagar.
                </p>
              </div>
              <div className="km-panel rounded-[24px] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--foreground-muted)]">
                  Plano Pro
                </p>
                <p className="mt-2 text-2xl font-bold text-[color:var(--km-blue)]">
                  R$ 19,90
                </p>
                <p className="mt-1 text-sm text-[color:var(--foreground-muted)]">
                  por mês para liberar histórico e relatórios.
                </p>
              </div>
              <div className="km-panel rounded-[24px] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--foreground-muted)]">
                  Acesso
                </p>
                <p className="mt-2 text-2xl font-bold text-[color:var(--km-blue)]">
                  Magic Link
                </p>
                <p className="mt-1 text-sm text-[color:var(--foreground-muted)]">
                  sem senha complexa para o motorista lembrar.
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-4 top-8 hidden rounded-[24px] border border-white/70 bg-white/86 px-4 py-3 shadow-[0_24px_60px_-34px_rgba(16,37,48,0.42)] md:block">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--foreground-muted)]">
                Lucro mensal
              </p>
              <p className="mt-1 text-2xl font-bold text-[color:var(--km-green)]">
                R$ 4.280,00
              </p>
              <p className="text-xs text-[color:var(--foreground-muted)]">
                +18,4% vs. mês anterior
              </p>
            </div>

            <div className="absolute -bottom-5 right-6 hidden rounded-[24px] border border-[rgba(47,155,77,0.16)] bg-[linear-gradient(135deg,rgba(47,155,77,0.95),rgba(24,112,56,0.95))] px-4 py-3 text-white shadow-[0_30px_70px_-40px_rgba(31,122,57,0.9)] md:block">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">
                Margem média
              </p>
              <p className="mt-1 text-2xl font-bold">23,7%</p>
              <p className="text-xs text-white/80">
                leitura rápida para tomada de decisão
              </p>
            </div>

            <div className="km-panel-strong relative overflow-hidden rounded-[30px] p-3">
              <div className="rounded-[24px] border border-[rgba(16,37,48,0.08)] bg-[linear-gradient(180deg,#e9f0e8,#ffffff)] p-3">
                <Image
                  src="/screenshots/dashboard.png"
                  alt="Dashboard do KM de Lucro com resumo financeiro e lista de fretes"
                  width={1853}
                  height={877}
                  priority
                  sizes="(min-width: 1280px) 42vw, (min-width: 768px) 48vw, 100vw"
                  className="rounded-[18px] border border-[rgba(16,37,48,0.08)] shadow-[0_24px_60px_-36px_rgba(16,37,48,0.52)]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {highlights.map((item) => (
          <article key={item.title} className="km-panel rounded-[28px] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--km-green)]">
              Destaque
            </p>
            <h2 className="mt-4 text-xl font-semibold tracking-[-0.03em] text-[color:var(--km-blue-strong)]">
              {item.title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-[color:var(--foreground-muted)]">
              {item.description}
            </p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.92fr_1.08fr]">
        <article className="km-panel-strong rounded-[30px] p-6 md:p-8">
          <span className="km-chip">Problema que o produto resolve</span>
          <h2 className="mt-5 max-w-xl text-3xl font-bold leading-tight tracking-[-0.04em] text-[color:var(--km-blue-strong)]">
            Motorista autônomo precisa de clareza financeira, não de mais uma
            planilha para alimentar.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[color:var(--foreground-muted)]">
            O projeto nasceu para traduzir o resultado de cada viagem em um
            número objetivo. A proposta não é virar ERP. É resolver rápido o
            que mais dói: saber se a rota valeu a pena.
          </p>

          <div className="mt-8 grid gap-4">
            {pillars.map((item) => (
              <div
                key={item.title}
                className="rounded-[24px] border border-[rgba(16,37,48,0.09)] bg-white/80 p-5"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--km-green)]">
                  {item.eyebrow}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-[color:var(--km-blue-strong)]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-[color:var(--foreground-muted)]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </article>

        <article className="km-panel rounded-[30px] p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--km-green)]">
                Fluxo do produto
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-[color:var(--km-blue-strong)]">
                Três passos para sair do achismo.
              </h2>
            </div>
            <Link href="/app" className="km-button-secondary">
              Abrir dashboard
            </Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {workflow.map((item) => (
              <div
                key={item.step}
                className="rounded-[24px] border border-[rgba(16,37,48,0.08)] bg-white/88 p-5"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--km-blue)] text-sm font-bold text-white">
                  {item.step}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-[color:var(--km-blue-strong)]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-[color:var(--foreground-muted)]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.02fr_0.98fr]">
        <article className="km-panel-strong rounded-[30px] p-6 md:p-8">
          <span className="km-chip">O que entra no controle</span>
          <h2 className="mt-5 max-w-xl text-3xl font-bold tracking-[-0.04em] text-[color:var(--km-blue-strong)]">
            Cada frete vira um registro objetivo, sem planilha paralela.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[color:var(--foreground-muted)]">
            Você informa só o que realmente pesa na viagem. O sistema organiza
            por período e devolve leitura financeira sem depender de conta de
            cabeça.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[24px] border border-[rgba(16,37,48,0.08)] bg-white/86 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--km-green)]">
                Viagem
              </p>
              <p className="mt-3 text-lg font-semibold text-[color:var(--km-blue-strong)]">
                Data, origem, destino e KM rodado
              </p>
              <p className="mt-2 text-sm leading-7 text-[color:var(--foreground-muted)]">
                O básico para entender rota, volume e frequência de operação.
              </p>
            </div>

            <div className="rounded-[24px] border border-[rgba(16,37,48,0.08)] bg-white/86 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--km-green)]">
                Receita
              </p>
              <p className="mt-3 text-lg font-semibold text-[color:var(--km-blue-strong)]">
                Valor fechado do frete
              </p>
              <p className="mt-2 text-sm leading-7 text-[color:var(--foreground-muted)]">
                Base para comparar ticket, faturamento e retorno por viagem.
              </p>
            </div>

            <div className="rounded-[24px] border border-[rgba(16,37,48,0.08)] bg-white/86 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--km-green)]">
                Custos
              </p>
              <p className="mt-3 text-lg font-semibold text-[color:var(--km-blue-strong)]">
                Diesel, pedágio e extras
              </p>
              <p className="mt-2 text-sm leading-7 text-[color:var(--foreground-muted)]">
                Tudo o que derruba margem entra no cálculo de forma separada.
              </p>
            </div>

            <div className="rounded-[24px] border border-[rgba(16,37,48,0.08)] bg-white/86 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--km-green)]">
                Resultado
              </p>
              <p className="mt-3 text-lg font-semibold text-[color:var(--km-blue-strong)]">
                Lucro líquido, margem e lucro por KM
              </p>
              <p className="mt-2 text-sm leading-7 text-[color:var(--foreground-muted)]">
                O número final sai pronto para decidir se a rota compensa.
              </p>
            </div>
          </div>
        </article>

        <article className="km-panel rounded-[30px] p-6 md:p-8">
          <span className="km-chip">O que sai da tela</span>
          <h2 className="mt-5 text-3xl font-bold tracking-[-0.04em] text-[color:var(--km-blue-strong)]">
            Informação prática para escolher melhor o próximo frete.
          </h2>
          <p className="mt-4 text-base leading-7 text-[color:var(--foreground-muted)]">
            O foco não é encher de recurso. É mostrar o que ajuda a negociar
            melhor, cortar rota ruim e acompanhar a evolução do mês.
          </p>

          <div className="mt-8 grid gap-4">
            <div className="rounded-[24px] border border-[rgba(16,37,48,0.08)] bg-white/88 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--foreground-muted)]">
                Acompanhamento mensal
              </p>
              <p className="mt-3 text-lg font-semibold text-[color:var(--km-blue-strong)]">
                Faturamento, custos e lucro no mesmo período
              </p>
              <p className="mt-2 text-sm leading-7 text-[color:var(--foreground-muted)]">
                Você enxerga rápido se o mês evoluiu ou só movimentou mais.
              </p>
            </div>

            <div className="rounded-[24px] border border-[rgba(16,37,48,0.08)] bg-white/88 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--foreground-muted)]">
                Comparação de rotas
              </p>
              <p className="mt-3 text-lg font-semibold text-[color:var(--km-blue-strong)]">
                Identifique padrões mais rentáveis
              </p>
              <p className="mt-2 text-sm leading-7 text-[color:var(--foreground-muted)]">
                O histórico ajuda a perceber onde sobra margem e onde o frete só
                ocupa agenda.
              </p>
            </div>

            <div className="rounded-[24px] border border-[rgba(16,37,48,0.08)] bg-white/88 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--foreground-muted)]">
                Exportação
              </p>
              <p className="mt-3 text-lg font-semibold text-[color:var(--km-blue-strong)]">
                CSV e PDF quando precisar prestar conta
              </p>
              <p className="mt-2 text-sm leading-7 text-[color:var(--foreground-muted)]">
                Leve os dados para fora da plataforma sem retrabalho manual.
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-[24px] border border-[rgba(47,155,77,0.16)] bg-[linear-gradient(135deg,rgba(47,155,77,0.12),rgba(255,255,255,0.68))] p-5">
            <p className="text-sm font-semibold text-[color:var(--km-blue-strong)]">
              Comece com seus próximos 10 fretes
            </p>
            <p className="mt-2 text-sm leading-7 text-[color:var(--foreground-muted)]">
              Entre com magic link, cadastre viagens reais e veja se a leitura
              mensal já melhora sua tomada de decisão.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/login" className="km-button-primary">
                Entrar para testar
              </Link>
              <Link href="/planos" className="km-button-secondary">
                Comparar planos
              </Link>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
