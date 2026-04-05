"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import type { Freight } from "@/lib/types";
import {
  formatCurrency,
  formatDateLabel,
  formatNumber,
  formatPercent,
  getTodayLocalDate,
} from "@/lib/formatters";

type MonthOption = {
  id: string;
  label: string;
};

type ExportKind = "csv" | "pdf";

type MetricCardProps = {
  label: string;
  value: string;
  meta?: string;
  tone?: "default" | "positive" | "warning";
};

const monthNames = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

function MetricCard({
  label,
  value,
  meta,
  tone = "default",
}: MetricCardProps) {
  const toneClass =
    tone === "positive"
      ? "border-[rgba(47,155,77,0.18)] bg-[linear-gradient(135deg,rgba(47,155,77,0.12),rgba(255,255,255,0.86))]"
      : tone === "warning"
        ? "border-[rgba(242,183,5,0.24)] bg-[linear-gradient(135deg,rgba(242,183,5,0.12),rgba(255,255,255,0.86))]"
        : "border-[rgba(16,37,48,0.08)] bg-white/84";

  return (
    <article className={`rounded-[24px] border p-5 ${toneClass}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--foreground-muted)]">
        {label}
      </p>
      <p className="mt-3 text-2xl font-bold tracking-[-0.03em] text-[color:var(--km-blue-strong)]">
        {value}
      </p>
      {meta && (
        <p className="mt-2 text-sm leading-6 text-[color:var(--foreground-muted)]">
          {meta}
        </p>
      )}
    </article>
  );
}

function getLastMonths(count: number): MonthOption[] {
  const result: MonthOption[] = [];
  const now = new Date();

  for (let i = 0; i < count; i += 1) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();

    result.push({
      id: `${year}-${String(month + 1).padStart(2, "0")}`,
      label: `${monthNames[month]} ${year}`,
    });
  }

  return result;
}

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function parseNumericInput(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return 0;
  }

  if (trimmed.includes(",")) {
    return Number(trimmed.replace(/\./g, "").replace(",", "."));
  }

  return Number(trimmed);
}

function numberToInput(value: number) {
  return Number.isInteger(value)
    ? value.toString()
    : value.toString().replace(".", ",");
}

function sortFreights(freights: Freight[]) {
  return [...freights].sort((left, right) => right.date.localeCompare(left.date));
}

function isFreightInSelectedMonth(date: string, monthId: string) {
  return date.slice(0, 7) === monthId;
}

function exportToCSV(freights: Freight[]) {
  const headers = [
    "Data",
    "Origem",
    "Destino",
    "KM",
    "Valor",
    "Custos",
    "Lucro",
    "Margem",
  ];

  const rows = freights.map((freight) => [
    formatDateLabel(freight.date),
    freight.origin,
    freight.destination,
    formatNumber(freight.km),
    freight.value.toFixed(2).replace(".", ","),
    (freight.diesel + freight.tolls + freight.other_costs)
      .toFixed(2)
      .replace(".", ","),
    freight.profit.toFixed(2).replace(".", ","),
    `${(freight.margin * 100).toFixed(1).replace(".", ",")}%`,
  ]);

  const csvContent =
    "\uFEFF" + [headers, ...rows].map((row) => row.join(";")).join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `relatorio_fretes_${getTodayLocalDate()}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

async function exportToPDF(freights: Freight[], monthLabel: string) {
  const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);

  const doc = new jsPDF();
  const totalProfit = freights.reduce((accumulator, freight) => {
    return accumulator + freight.profit;
  }, 0);

  doc.setFontSize(16);
  doc.text(`Relatório de Fretes - ${monthLabel}`, 14, 20);

  doc.setFontSize(10);
  doc.text(
    `Gerado em ${formatDateLabel(
      getTodayLocalDate(),
    )} | ${freights.length} fretes | Lucro ${formatCurrency(totalProfit)}`,
    14,
    28,
  );

  const tableRows = freights.map((freight) => [
    formatDateLabel(freight.date),
    freight.origin,
    freight.destination,
    formatNumber(freight.km),
    formatCurrency(freight.value),
    formatCurrency(freight.diesel + freight.tolls + freight.other_costs),
    formatCurrency(freight.profit),
    formatPercent(freight.margin),
  ]);

  autoTable(doc, {
    head: [["Data", "Origem", "Destino", "KM", "Valor", "Custos", "Lucro", "Mg%"]],
    body: tableRows,
    startY: 35,
    styles: {
      fontSize: 8,
      cellPadding: 2.6,
      textColor: [16, 37, 48],
    },
    headStyles: {
      fillColor: [18, 63, 103],
      textColor: [255, 255, 255],
    },
    alternateRowStyles: {
      fillColor: [245, 247, 244],
    },
  });

  doc.save(`relatorio_fretes_${getTodayLocalDate()}.pdf`);
}

export default function FreightsDashboard() {
  const [freights, setFreights] = useState<Freight[]>([]);
  const [loading, setLoading] = useState(true);
  const [previousMonthProfit, setPreviousMonthProfit] = useState<number | null>(
    null,
  );
  const [plan, setPlan] = useState<"free" | "pro">("free");
  const [totalFreightCount, setTotalFreightCount] = useState(0);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState<ExportKind | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const [date, setDate] = useState(() => getTodayLocalDate());
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [km, setKm] = useState("");
  const [value, setValue] = useState("");
  const [diesel, setDiesel] = useState("");
  const [tolls, setTolls] = useState("");
  const [otherCosts, setOtherCosts] = useState("");

  const monthOptions = useMemo(() => getLastMonths(12), []);
  const [selectedMonth, setSelectedMonth] = useState<string>(
    monthOptions[0]?.id ?? getTodayLocalDate().slice(0, 7),
  );
  const [editingId, setEditingId] = useState<string | null>(null);

  const selectedMonthLabel =
    monthOptions.find((option) => option.id === selectedMonth)?.label ??
    "Mês atual";

  const usageLimitReached = plan === "free" && totalFreightCount >= 10;

  const summary = useMemo(() => {
    let totalRevenue = 0;
    let totalCosts = 0;
    let totalProfit = 0;
    let totalKm = 0;
    let bestFreight: Freight | null = null;

    for (const freight of freights) {
      const totalCost = freight.diesel + freight.tolls + freight.other_costs;

      totalRevenue += freight.value;
      totalCosts += totalCost;
      totalProfit += freight.profit;
      totalKm += freight.km;

      if (!bestFreight || freight.profit > bestFreight.profit) {
        bestFreight = freight;
      }
    }

    return {
      totalRevenue,
      totalCosts,
      totalProfit,
      totalKm,
      averageMargin: totalRevenue > 0 ? totalProfit / totalRevenue : 0,
      averageTicket: freights.length > 0 ? totalRevenue / freights.length : 0,
      profitPerKm: totalKm > 0 ? totalProfit / totalKm : 0,
      bestFreight,
    };
  }, [freights]);

  const profitDiff =
    previousMonthProfit !== null
      ? summary.totalProfit - previousMonthProfit
      : null;

  const profitDiffPercent =
    previousMonthProfit !== null && previousMonthProfit !== 0 && profitDiff !== null
      ? profitDiff / Math.abs(previousMonthProfit)
      : null;

  const resetForm = () => {
    setEditingId(null);
    setDate(getTodayLocalDate());
    setOrigin("");
    setDestination("");
    setKm("");
    setValue("");
    setDiesel("");
    setTolls("");
    setOtherCosts("");
    setFormError(null);
  };

  const handleEdit = (freight: Freight) => {
    setEditingId(freight.id);
    setDate(freight.date.split("T")[0]);
    setOrigin(freight.origin);
    setDestination(freight.destination);
    setKm(numberToInput(freight.km));
    setValue(numberToInput(freight.value));
    setDiesel(freight.diesel > 0 ? numberToInput(freight.diesel) : "");
    setTolls(freight.tolls > 0 ? numberToInput(freight.tolls) : "");
    setOtherCosts(
      freight.other_costs > 0 ? numberToInput(freight.other_costs) : "",
    );

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este frete?")) {
      return;
    }

    const { error } = await supabase.from("freights").delete().eq("id", id);

    if (error) {
      console.error(error);
      alert("Erro ao excluir frete.");
      return;
    }

    setFreights((previous) => previous.filter((freight) => freight.id !== id));
    setTotalFreightCount((previous) => Math.max(0, previous - 1));

    if (editingId === id) {
      resetForm();
    }
  };

  const handleExportCSV = async () => {
    if (plan !== "pro" || freights.length === 0) {
      return;
    }

    setExporting("csv");

    try {
      exportToCSV(freights);
    } finally {
      setExporting(null);
    }
  };

  const handleExportPDF = async () => {
    if (plan !== "pro" || freights.length === 0) {
      return;
    }

    setExporting("pdf");

    try {
      await exportToPDF(freights, selectedMonthLabel);
    } catch (error) {
      console.error(error);
      alert("Não foi possível gerar o PDF agora.");
    } finally {
      setExporting(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    if (!editingId && usageLimitReached) {
      setFormError(
        "Limite de 10 fretes no plano gratuito atingido. Ative o Pro para continuar lançando fretes ilimitados.",
      );
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setFormError("Sessão expirada. Entre novamente.");
      return;
    }

    const kmNumber = parseNumericInput(km);
    const valueNumber = parseNumericInput(value);
    const dieselNumber = parseNumericInput(diesel);
    const tollsNumber = parseNumericInput(tolls);
    const otherNumber = parseNumericInput(otherCosts);

    if (
      !date ||
      !origin.trim() ||
      !destination.trim() ||
      !Number.isFinite(kmNumber) ||
      kmNumber <= 0 ||
      !Number.isFinite(valueNumber) ||
      valueNumber <= 0
    ) {
      setFormError("Preencha data, origem, destino, KM e valor corretamente.");
      return;
    }

    const totalCost = dieselNumber + tollsNumber + otherNumber;
    const profit = valueNumber - totalCost;
    const margin = valueNumber > 0 ? profit / valueNumber : 0;

    const payload = {
      date,
      origin: origin.trim(),
      destination: destination.trim(),
      km: kmNumber,
      value: valueNumber,
      diesel: dieselNumber,
      tolls: tollsNumber,
      other_costs: otherNumber,
      profit,
      margin,
    };

    setSaving(true);

    if (editingId) {
      const { error, data } = await supabase
        .from("freights")
        .update(payload)
        .eq("id", editingId)
        .select()
        .single();

      setSaving(false);

      if (error) {
        console.error(error);
        setFormError("Erro ao atualizar o frete.");
        return;
      }

      if (data) {
        const updatedFreight = data as Freight;

        setFreights((previous) => {
          const withoutEdited = previous.filter(
            (freight) => freight.id !== updatedFreight.id,
          );

          if (!isFreightInSelectedMonth(updatedFreight.date, selectedMonth)) {
            return withoutEdited;
          }

          return sortFreights([...withoutEdited, updatedFreight]);
        });
      }

      resetForm();
      return;
    }

    const { error, data } = await supabase
      .from("freights")
      .insert({
        user_id: user.id,
        ...payload,
      })
      .select()
      .single();

    setSaving(false);

    if (error) {
      console.error(error);
      setFormError("Não foi possível salvar o frete. Tente novamente.");
      return;
    }

    if (data) {
      const newFreight = data as Freight;

      setTotalFreightCount((previous) => previous + 1);

      if (isFreightInSelectedMonth(newFreight.date, selectedMonth)) {
        setFreights((previous) => sortFreights([newFreight, ...previous]));
      }
    }

    resetForm();
  };

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        if (!ignore) {
          setLoading(false);
        }
        return;
      }

      const [year, month] = selectedMonth.split("-").map(Number);
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 1);
      const previousStart = new Date(year, month - 2, 1);
      const previousEnd = new Date(year, month - 1, 1);

      const [
        profileResult,
        currentResult,
        previousResult,
        countResult,
      ] = await Promise.all([
        supabase
          .from("profiles")
          .upsert({ id: user.id }, { onConflict: "id" })
          .select("plan")
          .single(),
        supabase
          .from("freights")
          .select("*")
          .eq("user_id", user.id)
          .gte("date", toDateKey(start))
          .lt("date", toDateKey(end))
          .order("date", { ascending: false })
          .limit(200),
        supabase
          .from("freights")
          .select("profit")
          .eq("user_id", user.id)
          .gte("date", toDateKey(previousStart))
          .lt("date", toDateKey(previousEnd)),
        supabase
          .from("freights")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id),
      ]);

      if (ignore) {
        return;
      }

      if (profileResult.error) {
        console.error(profileResult.error);
      }

      setPlan(profileResult.data?.plan === "pro" ? "pro" : "free");

      if (currentResult.error) {
        console.error(currentResult.error);
        setFreights([]);
      } else {
        setFreights(sortFreights((currentResult.data ?? []) as Freight[]));
      }

      if (previousResult.error) {
        console.error(previousResult.error);
        setPreviousMonthProfit(null);
      } else if (previousResult.data && previousResult.data.length > 0) {
        const previousProfit = previousResult.data.reduce((accumulator, row) => {
          return accumulator + (row as { profit: number }).profit;
        }, 0);

        setPreviousMonthProfit(previousProfit);
      } else {
        setPreviousMonthProfit(null);
      }

      if (countResult.error) {
        console.error(countResult.error);
        setTotalFreightCount(0);
      } else {
        setTotalFreightCount(countResult.count ?? 0);
      }

      setLoading(false);
    };

    void load();

    return () => {
      ignore = true;
    };
  }, [selectedMonth]);

  if (loading) {
    return (
      <div className="km-panel-strong rounded-[30px] px-6 py-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--km-green)]">
          Dashboard
        </p>
        <p className="mt-3 text-lg font-semibold text-[color:var(--km-blue-strong)]">
          Carregando fretes...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="km-panel-strong relative overflow-hidden rounded-[30px] p-6 md:p-8">
          <div className="absolute -left-12 top-8 h-44 w-44 rounded-full bg-[color:var(--km-yellow)]/14 blur-3xl" />
          <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-[color:var(--km-green)]/12 blur-3xl" />

          <div className="relative space-y-5">
            <span className="km-chip">Resumo mensal</span>
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--foreground-muted)]">
                {selectedMonthLabel}
              </p>
              <h1 className="text-4xl font-bold tracking-[-0.05em] text-[color:var(--km-blue-strong)] md:text-5xl">
                {formatCurrency(summary.totalProfit)}
              </h1>
              <p className="max-w-2xl text-base leading-7 text-[color:var(--foreground-muted)]">
                Lucro líquido acumulado no mês. Faturamento em{" "}
                <strong>{formatCurrency(summary.totalRevenue)}</strong>, custos em{" "}
                <strong>{formatCurrency(summary.totalCosts)}</strong> e margem
                média de <strong>{formatPercent(summary.averageMargin)}</strong>.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <span className="km-chip">
                Plano atual: {plan === "pro" ? "Pro" : "Gratuito"}
              </span>
              <span className="km-chip">
                Uso gratuito:{" "}
                {plan === "pro" ? "Ilimitado" : `${totalFreightCount}/10 fretes`}
              </span>
            </div>

            {profitDiff !== null && (
              <div
                className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                  profitDiff >= 0
                    ? "bg-[rgba(47,155,77,0.14)] text-[color:var(--km-green-strong)]"
                    : "bg-red-50 text-red-700"
                }`}
              >
                <span>{profitDiff >= 0 ? "Subiu" : "Caiu"}</span>
                <span>{formatCurrency(Math.abs(profitDiff))}</span>
                {profitDiffPercent !== null && (
                  <span>
                    ({profitDiffPercent >= 0 ? "+" : "-"}
                    {formatPercent(Math.abs(profitDiffPercent))})
                  </span>
                )}
              </div>
            )}
          </div>
        </article>

        <article className="km-panel rounded-[30px] p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--km-green)]">
                Controle do período
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-[-0.04em] text-[color:var(--km-blue-strong)]">
                Escolha o mês e acompanhe sua evolução.
              </h2>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[color:var(--km-blue-strong)]">
                Mês exibido
              </label>
              <select
                value={selectedMonth}
                onChange={(event) => setSelectedMonth(event.target.value)}
                className="km-input"
              >
                {monthOptions.map((month) => (
                  <option key={month.id} value={month.id}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-[22px] border border-[rgba(16,37,48,0.08)] bg-white/84 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--foreground-muted)]">
                  Ticket médio
                </p>
                <p className="mt-2 text-xl font-bold text-[color:var(--km-blue-strong)]">
                  {formatCurrency(summary.averageTicket)}
                </p>
              </div>
              <div className="rounded-[22px] border border-[rgba(16,37,48,0.08)] bg-white/84 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--foreground-muted)]">
                  Lucro por KM
                </p>
                <p className="mt-2 text-xl font-bold text-[color:var(--km-blue-strong)]">
                  {formatCurrency(summary.profitPerKm)}
                </p>
              </div>
            </div>

            {usageLimitReached && !editingId && (
              <div className="rounded-[24px] border border-[rgba(47,155,77,0.18)] bg-[linear-gradient(135deg,rgba(47,155,77,0.12),rgba(255,255,255,0.82))] p-5">
                <p className="text-sm font-semibold text-[color:var(--km-blue-strong)]">
                  Seu limite gratuito foi atingido.
                </p>
                <p className="mt-2 text-sm leading-7 text-[color:var(--foreground-muted)]">
                  Para continuar cadastrando e liberar exportação de relatórios,
                  ative o plano Pro.
                </p>
                <Link href="/planos" className="km-button-primary mt-4">
                  Ver planos
                </Link>
              </div>
            )}
          </div>
        </article>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Fretes no mês"
          value={formatNumber(freights.length)}
          meta="Quantidade cadastrada no período selecionado."
        />
        <MetricCard
          label="Faturamento"
          value={formatCurrency(summary.totalRevenue)}
          meta="Somatório bruto das viagens do mês."
        />
        <MetricCard
          label="Custos"
          value={formatCurrency(summary.totalCosts)}
          meta="Diesel, pedágio e outros custos."
          tone="warning"
        />
        <MetricCard
          label="Lucro"
          value={formatCurrency(summary.totalProfit)}
          meta={`Margem média ${formatPercent(summary.averageMargin)}.`}
          tone="positive"
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.12fr_0.88fr]">
        <article className="km-panel rounded-[30px] p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--km-green)]">
                Lançamento manual
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-[color:var(--km-blue-strong)]">
                {editingId ? "Edite o frete selecionado." : "Cadastre um novo frete."}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[color:var(--foreground-muted)]">
                Preencha os campos principais da viagem. O lucro e a margem são
                calculados automaticamente no salvamento.
              </p>
            </div>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="km-button-secondary"
              >
                Cancelar edição
              </button>
            )}
          </div>

          <form
            className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4"
            onSubmit={(event) => void handleSubmit(event)}
          >
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[color:var(--km-blue-strong)]">
                Data
              </label>
              <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="km-input"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[color:var(--km-blue-strong)]">
                Origem
              </label>
              <input
                value={origin}
                onChange={(event) => setOrigin(event.target.value)}
                className="km-input"
                placeholder="Cidade/UF"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[color:var(--km-blue-strong)]">
                Destino
              </label>
              <input
                value={destination}
                onChange={(event) => setDestination(event.target.value)}
                className="km-input"
                placeholder="Cidade/UF"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[color:var(--km-blue-strong)]">
                KM rodado
              </label>
              <input
                value={km}
                onChange={(event) => setKm(event.target.value)}
                className="km-input"
                placeholder="Ex.: 600"
                inputMode="decimal"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[color:var(--km-blue-strong)]">
                Valor do frete (R$)
              </label>
              <input
                value={value}
                onChange={(event) => setValue(event.target.value)}
                className="km-input"
                placeholder="Ex.: 2500,00"
                inputMode="decimal"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[color:var(--km-blue-strong)]">
                Diesel (R$)
              </label>
              <input
                value={diesel}
                onChange={(event) => setDiesel(event.target.value)}
                className="km-input"
                placeholder="Opcional"
                inputMode="decimal"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[color:var(--km-blue-strong)]">
                Pedágio (R$)
              </label>
              <input
                value={tolls}
                onChange={(event) => setTolls(event.target.value)}
                className="km-input"
                placeholder="Opcional"
                inputMode="decimal"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[color:var(--km-blue-strong)]">
                Outros custos (R$)
              </label>
              <input
                value={otherCosts}
                onChange={(event) => setOtherCosts(event.target.value)}
                className="km-input"
                placeholder="Opcional"
                inputMode="decimal"
              />
            </div>

            <div className="md:col-span-2 xl:col-span-4">
              <button
                type="submit"
                disabled={saving || (!editingId && usageLimitReached)}
                className="km-button-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Salvando..."
                  : editingId
                    ? "Atualizar frete"
                    : "Salvar frete"}
              </button>
            </div>
          </form>

          {formError && (
            <div className="mt-4 rounded-[22px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {formError}
            </div>
          )}
        </article>

        <aside className="space-y-4">
          <article className="km-panel rounded-[30px] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--km-green)]">
              Insight rápido
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-[-0.04em] text-[color:var(--km-blue-strong)]">
              Melhor rota do mês
            </h2>

            {summary.bestFreight ? (
              <div className="mt-5 rounded-[24px] border border-[rgba(16,37,48,0.08)] bg-white/84 p-5">
                <p className="text-sm font-semibold text-[color:var(--km-blue-strong)]">
                  {summary.bestFreight.origin} → {summary.bestFreight.destination}
                </p>
                <p className="mt-3 text-2xl font-bold text-[color:var(--km-green)]">
                  {formatCurrency(summary.bestFreight.profit)}
                </p>
                <p className="mt-2 text-sm leading-7 text-[color:var(--foreground-muted)]">
                  Margem de {formatPercent(summary.bestFreight.margin)} em{" "}
                  {formatNumber(summary.bestFreight.km)} km.
                </p>
              </div>
            ) : (
              <p className="mt-5 text-sm leading-7 text-[color:var(--foreground-muted)]">
                Cadastre seu primeiro frete para começar a enxergar quais rotas
                estão gerando mais resultado.
              </p>
            )}
          </article>

          <article className="km-panel rounded-[30px] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--km-green)]">
              Uso inteligente
            </p>
            <div className="mt-5 space-y-4">
              <div className="rounded-[22px] border border-[rgba(16,37,48,0.08)] bg-white/84 p-4">
                <p className="text-sm font-semibold text-[color:var(--km-blue-strong)]">
                  Lance o frete no mesmo dia
                </p>
                <p className="mt-2 text-sm leading-7 text-[color:var(--foreground-muted)]">
                  Quanto menor o atraso para registrar, mais confiável fica o
                  histórico.
                </p>
              </div>
              <div className="rounded-[22px] border border-[rgba(16,37,48,0.08)] bg-white/84 p-4">
                <p className="text-sm font-semibold text-[color:var(--km-blue-strong)]">
                  Compare meses
                </p>
                <p className="mt-2 text-sm leading-7 text-[color:var(--foreground-muted)]">
                  O objetivo não é só registrar viagem, mas perceber tendência
                  de melhora ou piora do caixa.
                </p>
              </div>
              <div className="rounded-[22px] border border-[rgba(16,37,48,0.08)] bg-white/84 p-4">
                <p className="text-sm font-semibold text-[color:var(--km-blue-strong)]">
                  Relatórios no Pro
                </p>
                <p className="mt-2 text-sm leading-7 text-[color:var(--foreground-muted)]">
                  CSV e PDF ficam liberados quando você precisa levar os dados
                  para fora da plataforma.
                </p>
              </div>
            </div>
          </article>
        </aside>
      </section>

      <section className="km-panel rounded-[30px] p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--km-green)]">
              Histórico
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-[color:var(--km-blue-strong)]">
              Fretes de {selectedMonthLabel}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {plan === "pro" ? (
              <>
                <button
                  type="button"
                  onClick={() => void handleExportCSV()}
                  disabled={freights.length === 0 || exporting !== null}
                  className="km-button-secondary disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {exporting === "csv" ? "Gerando CSV..." : "Baixar CSV"}
                </button>
                <button
                  type="button"
                  onClick={() => void handleExportPDF()}
                  disabled={freights.length === 0 || exporting !== null}
                  className="km-button-primary disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {exporting === "pdf" ? "Gerando PDF..." : "Baixar PDF"}
                </button>
              </>
            ) : (
              <Link href="/planos" className="km-button-secondary">
                Desbloquear relatórios
              </Link>
            )}
          </div>
        </div>

        {freights.length === 0 ? (
          <div className="mt-6 rounded-[24px] border border-[rgba(16,37,48,0.08)] bg-[linear-gradient(135deg,rgba(255,255,255,0.88),rgba(238,244,239,0.76))] p-6">
            <p className="text-lg font-semibold text-[color:var(--km-blue-strong)]">
              Nenhum frete cadastrado neste período.
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[color:var(--foreground-muted)]">
              Use o formulário acima para lançar sua primeira viagem. O sistema
              calcula lucro e margem automaticamente para você começar a montar
              um histórico confiável.
            </p>
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto rounded-[24px] border border-[rgba(16,37,48,0.08)] bg-white/86">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-[color:var(--km-blue-strong)] text-white">
                <tr>
                  <th className="px-4 py-4 font-semibold">Data</th>
                  <th className="px-4 py-4 font-semibold">Origem</th>
                  <th className="px-4 py-4 font-semibold">Destino</th>
                  <th className="px-4 py-4 text-right font-semibold">KM</th>
                  <th className="px-4 py-4 text-right font-semibold">Valor</th>
                  <th className="px-4 py-4 text-right font-semibold">Custos</th>
                  <th className="px-4 py-4 text-right font-semibold">Lucro</th>
                  <th className="px-4 py-4 text-right font-semibold">Margem</th>
                  <th className="px-4 py-4 text-right font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {freights.map((freight, index) => {
                  const totalCost =
                    freight.diesel + freight.tolls + freight.other_costs;

                  return (
                    <tr
                      key={freight.id}
                      className={
                        index % 2 === 0
                          ? "border-t border-[rgba(16,37,48,0.08)]"
                          : "border-t border-[rgba(16,37,48,0.08)] bg-[color:var(--background)]/52"
                      }
                    >
                      <td className="px-4 py-3">{formatDateLabel(freight.date)}</td>
                      <td className="px-4 py-3">{freight.origin}</td>
                      <td className="px-4 py-3">{freight.destination}</td>
                      <td className="px-4 py-3 text-right">
                        {formatNumber(freight.km)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {formatCurrency(freight.value)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {formatCurrency(totalCost)}
                      </td>
                      <td
                        className={`px-4 py-3 text-right font-semibold ${
                          freight.profit >= 0
                            ? "text-[color:var(--km-green-strong)]"
                            : "text-red-700"
                        }`}
                      >
                        {formatCurrency(freight.profit)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {formatPercent(freight.margin)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(freight)}
                            className="rounded-full border border-[rgba(16,37,48,0.12)] px-3 py-1 text-xs font-semibold text-[color:var(--km-blue)] hover:bg-white"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleDelete(freight.id)}
                            className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-50"
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
