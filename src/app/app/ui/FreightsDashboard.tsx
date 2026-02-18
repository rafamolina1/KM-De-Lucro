"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { supabase } from "@/lib/supabaseClient";
import { Freight } from "@/lib/types";

type MonthOption = {
  id: string;
  label: string;
};

function getLastMonths(count: number): MonthOption[] {
  const result: MonthOption[] = [];
  const now = new Date();

  for (let i = 0; i < count; i += 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    result.push({
      id: `${year}-${month}`,
      label: `${month}/${year}`,
    });
  }

  return result;
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
  const rows = freights.map((f) => [
    new Date(f.date).toLocaleDateString("pt-BR"),
    f.origin,
    f.destination,
    f.km.toString().replace(".", ","),
    f.value.toFixed(2).replace(".", ","),
    (f.diesel + f.tolls + f.other_costs).toFixed(2).replace(".", ","),
    f.profit.toFixed(2).replace(".", ","),
    (f.margin * 100).toFixed(1).replace(".", ",") + "%",
  ]);

  const csvContent =
    "\uFEFF" + [headers, ...rows].map((e) => e.join(";")).join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `relatorio_fretes_${new Date()
    .toISOString()
    .slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function exportToPDF(freights: Freight[], monthLabel: string) {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text(`Relatório de Fretes - ${monthLabel}`, 14, 20);

  const totalProfit = freights.reduce((acc, f) => acc + f.profit, 0);

  doc.setFontSize(10);
  doc.text(
    `Gerado em: ${new Date().toLocaleDateString("pt-BR")} | Total de Fretes: ${freights.length
    } | Lucro Total: R$ ${totalProfit.toFixed(2)}`,
    14,
    28,
  );

  const tableColumn = [
    "Data",
    "Origem",
    "Destino",
    "KM",
    "Valor",
    "Custos",
    "Lucro",
    "Mg%",
  ];

  const tableRows = freights.map((f) => [
    new Date(f.date).toLocaleDateString("pt-BR"),
    f.origin,
    f.destination,
    f.km.toString(),
    f.value.toFixed(2),
    (f.diesel + f.tolls + f.other_costs).toFixed(2),
    f.profit.toFixed(2),
    (f.margin * 100).toFixed(1) + "%",
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 35,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [0, 128, 0] },
  });

  doc.save(`relatorio_fretes_${new Date().toISOString().slice(0, 10)}.pdf`);
}

export default function FreightsDashboard() {
  const [freights, setFreights] = useState<Freight[]>([]);
  const [loading, setLoading] = useState(true);
  const [previousMonthProfit, setPreviousMonthProfit] = useState<number | null>(
    null,
  );
  const [plan, setPlan] = useState<"free" | "pro">("free");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [date, setDate] = useState(() =>
    new Date().toISOString().slice(0, 10),
  );
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [km, setKm] = useState("");
  const [value, setValue] = useState("");
  const [diesel, setDiesel] = useState("");
  const [tolls, setTolls] = useState("");
  const [otherCosts, setOtherCosts] = useState("");

  const monthOptions = useMemo(() => getLastMonths(12), []);
  const [selectedMonth, setSelectedMonth] = useState<string>(
    monthOptions[0]?.id ?? "",
  );

  const [editingId, setEditingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este frete?")) return;

    const { error } = await supabase.from("freights").delete().eq("id", id);

    if (error) {
      console.error(error);
      alert("Erro ao excluir frete.");
    } else {
      setFreights((prev) => prev.filter((f) => f.id !== id));
    }
  };

  const handleEdit = (freight: Freight) => {
    setEditingId(freight.id);

    let d = freight.date;
    if (d && d.includes('T')) {
      d = d.split('T')[0];
    }
    setDate(d);

    setOrigin(freight.origin);
    setDestination(freight.destination);
    setKm(freight.km.toString());
    setValue(freight.value.toString());
    setDiesel(freight.diesel > 0 ? freight.diesel.toString() : "");
    setTolls(freight.tolls > 0 ? freight.tolls.toString() : "");
    setOtherCosts(freight.other_costs > 0 ? freight.other_costs.toString() : "");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setDate(new Date().toISOString().slice(0, 10));
    setOrigin("");
    setDestination("");
    setKm("");
    setValue("");
    setDiesel("");
    setTolls("");
    setOtherCosts("");
    setFormError(null);
  };

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .upsert({ id: user.id }, { onConflict: "id" })
        .select()
        .single();

      if (profileData?.plan === "pro") {
        setPlan("pro");
      }

      const [yearStr, monthStr] = selectedMonth.split("-");
      const year = Number(yearStr);
      const month = Number(monthStr);

      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 1);
      const prevStart = new Date(year, month - 2, 1);
      const prevEnd = new Date(year, month - 1, 1);

      const startStr = start.toISOString().slice(0, 10);
      const endStr = end.toISOString().slice(0, 10);
      const prevStartStr = prevStart.toISOString().slice(0, 10);
      const prevEndStr = prevEnd.toISOString().slice(0, 10);

      const { data, error } = await supabase
        .from("freights")
        .select("*")
        .eq("user_id", user.id)
        .gte("date", startStr)
        .lt("date", endStr)
        .order("date", { ascending: false })
        .limit(200);

      if (error) {
        console.error(error);
      } else {
        setFreights((data ?? []) as Freight[]);
      }

      const { data: prevData, error: prevError } = await supabase
        .from("freights")
        .select("profit")
        .eq("user_id", user.id)
        .gte("date", prevStartStr)
        .lt("date", prevEndStr);

      if (prevError) {
        console.error(prevError);
        setPreviousMonthProfit(null);
      } else if (prevData && prevData.length > 0) {
        const prevProfit = prevData.reduce(
          (acc, f) => acc + (f as { profit: number }).profit,
          0,
        );
        setPreviousMonthProfit(prevProfit);
      } else {
        setPreviousMonthProfit(null);
      }
      setLoading(false);
    };

    void load();
  }, [selectedMonth]);

  const totalRevenue = freights.reduce((acc, f) => acc + f.value, 0);
  const totalCosts = freights.reduce(
    (acc, f) => acc + f.diesel + f.tolls + f.other_costs,
    0,
  );
  const totalProfit = freights.reduce((acc, f) => acc + f.profit, 0);
  const averageMargin =
    freights.length > 0 ? totalProfit / totalRevenue || 0 : 0;

  const profitDiff =
    previousMonthProfit !== null ? totalProfit - previousMonthProfit : null;
  const profitDiffPercent =
    previousMonthProfit !== null && previousMonthProfit !== 0
      ? (profitDiff! / Math.abs(previousMonthProfit)) * 100
      : null;

  if (loading) {
    return <p className="text-sm text-zinc-600">Carregando fretes...</p>;
  }

  return (
    <div className="space-y-4">
      <section className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-white p-4 shadow-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Resumo mensal
          </p>
          <p className="text-sm text-zinc-700">
            {monthOptions.find((m) => m.id === selectedMonth)?.label ??
              "Mês atual"}
          </p>
          <span className="mt-1 inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-700">
            Plano{" "}
            <span className="ml-1 rounded-full bg-[color:var(--km-green)] px-1.5 py-0.5 text-[10px] font-semibold uppercase text-white">
              {plan === "free" ? "Gratuito" : "Pro"}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-zinc-600">Selecionar mês:</span>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="rounded-md border border-zinc-300 px-2 py-1 text-xs"
          >
            {monthOptions.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="rounded-lg bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-[color:var(--km-blue)]">
          Novo frete
        </h2>
        {plan === "free" && freights.length >= 10 && !editingId && (
          <div className="mb-3 space-y-2 rounded-lg border-2 border-[color:var(--km-green)] bg-gradient-to-r from-emerald-50 to-white px-4 py-3 text-xs shadow-sm">
            <p className="font-bold text-zinc-900">
              🎉 Você já testou 10 fretes! E aí, está te ajudando?
            </p>
            <p className="text-zinc-700">
              Com o <strong>Plano Pro (R$ 19,90/mês)</strong>, você pode lançar <strong>fretes ilimitados</strong> e ter histórico completo para comparar meses e descobrir quais rotas realmente valem mais a pena.
            </p>
            <Link
              href="/planos"
              className="mt-2 inline-flex items-center gap-1 rounded-md bg-[color:var(--km-green)] px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-600 shadow-sm"
            >
              Ativar Pro agora →
            </Link>
          </div>
        )}
        <form
          className="grid gap-3 md:grid-cols-4"
          onSubmit={async (event) => {
            event.preventDefault();
            setFormError(null);

            if (!editingId && plan === "free" && freights.length >= 10) {
              setFormError(
                "Limite de 10 fretes no plano gratuito atingido. Acesse a página de planos para ativar o Pro e continuar lançando fretes ilimitados.",
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

            const kmNumber = Number(km.replace(",", "."));
            const valueNumber = Number(value.replace(",", "."));
            const dieselNumber = Number(diesel.replace(",", ".")) || 0;
            const tollsNumber = Number(tolls.replace(",", ".")) || 0;
            const otherNumber = Number(otherCosts.replace(",", ".")) || 0;

            if (!date || !origin || !destination || !kmNumber || !valueNumber) {
              setFormError("Preencha data, origem, destino, KM e valor.");
              return;
            }

            const totalCost = dieselNumber + tollsNumber + otherNumber;
            const profit = valueNumber - totalCost;
            const margin = valueNumber > 0 ? profit / valueNumber : 0;

            setSaving(true);
            if (editingId) {
              const { error, data } = await supabase
                .from("freights")
                .update({
                  date,
                  origin,
                  destination,
                  km: kmNumber,
                  value: valueNumber,
                  diesel: dieselNumber,
                  tolls: tollsNumber,
                  other_costs: otherNumber,
                  profit,
                  margin,
                })
                .eq("id", editingId)
                .select()
                .single();

              setSaving(false);

              if (error) {
                console.error(error);
                setFormError("Erro ao atualizar o frete.");
              } else if (data) {
                setFreights((prev) =>
                  prev.map((f) => (f.id === editingId ? (data as Freight) : f)),
                );
                handleCancelEdit();
              }
              return;
            }

            const { error, data } = await supabase
              .from("freights")
              .insert({
                user_id: user.id,
                date,
                origin,
                destination,
                km: kmNumber,
                value: valueNumber,
                diesel: dieselNumber,
                tolls: tollsNumber,
                other_costs: otherNumber,
                profit,
                margin,
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
              setFreights((prev) => [data as Freight, ...prev]);
            }

            handleCancelEdit();

            setOtherCosts("");
            setFormError(null);
          }}
        >
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-700">Data {editingId && <span className="text-[color:var(--km-green)]">(Editando)</span>}</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-md border border-zinc-300 px-2 py-1 text-xs"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-700">Origem</label>
            <input
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full rounded-md border border-zinc-300 px-2 py-1 text-xs"
              placeholder="Cidade/UF"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-700">Destino</label>
            <input
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full rounded-md border border-zinc-300 px-2 py-1 text-xs"
              placeholder="Cidade/UF"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-700">KM</label>
            <input
              value={km}
              onChange={(e) => setKm(e.target.value)}
              className="w-full rounded-md border border-zinc-300 px-2 py-1 text-xs"
              placeholder="ex: 600"
              inputMode="decimal"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-700">
              Valor do frete (R$)
            </label>
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full rounded-md border border-zinc-300 px-2 py-1 text-xs"
              placeholder="ex: 2.500,00"
              inputMode="decimal"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-700">
              Diesel (R$)
            </label>
            <input
              value={diesel}
              onChange={(e) => setDiesel(e.target.value)}
              className="w-full rounded-md border border-zinc-300 px-2 py-1 text-xs"
              placeholder="opcional"
              inputMode="decimal"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-700">
              Pedágio (R$)
            </label>
            <input
              value={tolls}
              onChange={(e) => setTolls(e.target.value)}
              className="w-full rounded-md border border-zinc-300 px-2 py-1 text-xs"
              placeholder="opcional"
              inputMode="decimal"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-700">
              Outros custos (R$)
            </label>
            <input
              value={otherCosts}
              onChange={(e) => setOtherCosts(e.target.value)}
              className="w-full rounded-md border border-zinc-300 px-2 py-1 text-xs"
              placeholder="opcional"
              inputMode="decimal"
            />
          </div>
          <div className="flex items-end gap-2">
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="w-1/3 rounded-md border border-zinc-300 px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              disabled={
                saving || (!editingId && plan === "free" && freights.length >= 10)
              }
              className="flex-1 rounded-md bg-[color:var(--km-green)] px-3 py-2 text-xs font-medium text-white hover:bg-emerald-600 disabled:opacity-60"
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
          <p className="mt-2 text-xs text-red-600">{formError}</p>
        )}
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <p className="text-xs text-zinc-500">Fretes no mês</p>
          <p className="mt-1 text-xl font-semibold">{freights.length}</p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <p className="text-xs text-zinc-500">Faturamento</p>
          <p className="mt-1 text-xl font-semibold">
            R$ {totalRevenue.toFixed(2)}
          </p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <p className="text-xs text-zinc-500">Custos</p>
          <p className="mt-1 text-xl font-semibold">
            R$ {totalCosts.toFixed(2)}
          </p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <p className="text-xs text-zinc-500">Lucro</p>
          <p className="mt-1 text-xl font-semibold">
            R$ {totalProfit.toFixed(2)}
          </p>
          <p className="text-xs text-emerald-700">
            Margem média: {(averageMargin * 100).toFixed(1)}%
          </p>
          {profitDiff !== null && (
            <p
              className={`mt-1 text-[10px] font-medium ${profitDiff >= 0 ? "text-emerald-700" : "text-red-600"
                }`}
            >
              {profitDiff >= 0 ? "↑" : "↓"} {Math.abs(profitDiff).toFixed(2)} em
              relação ao mês anterior
              {profitDiffPercent !== null &&
                ` (${profitDiffPercent >= 0 ? "+" : "-"}${Math.abs(
                  profitDiffPercent,
                ).toFixed(1)}%)`}
            </p>
          )}
        </div>
      </section>

      <section className="rounded-lg bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-800">
            Últimos fretes
          </h2>
          <div className="flex gap-3">
            <button
              onClick={() => {
                if (plan !== "pro") {
                  alert(
                    "Relatórios são exclusivos do Plano Pro. Assine para liberar!",
                  );
                  return;
                }
                exportToCSV(freights);
              }}
              className="text-xs font-medium text-[color:var(--km-green)] hover:underline"
            >
              Baixar CSV
            </button>
            <button
              onClick={() => {
                if (plan !== "pro") {
                  alert(
                    "Relatórios são exclusivos do Plano Pro. Assine para liberar!",
                  );
                  return;
                }
                const currentLabel =
                  monthOptions.find((m) => m.id === selectedMonth)?.label ??
                  "Mês atual";
                exportToPDF(freights, currentLabel);
              }}
              className="text-xs font-medium text-zinc-600 hover:underline"
            >
              Baixar PDF
            </button>
          </div>
        </div>
        {freights.length === 0 ? (
          <div className="space-y-3 rounded-lg bg-gradient-to-br from-zinc-50 to-white p-5 border border-zinc-200">
            <p className="text-sm font-semibold text-zinc-800">
              🚀 Comece agora mesmo!
            </p>
            <div className="space-y-2 text-xs text-zinc-600">
              <p className="flex items-start gap-2">
                <span className="text-[color:var(--km-green)] font-bold">1.</span>
                <span>Cadastre seu primeiro frete no formulário acima</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-[color:var(--km-green)] font-bold">2.</span>
                <span>Veja <strong>lucro e margem</strong> calculados na hora</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-[color:var(--km-green)] font-bold">3.</span>
                <span>Compare meses e descubra quais rotas <strong>realmente valem a pena</strong></span>
              </p>
            </div>
            <p className="text-[11px] text-zinc-500 mt-3 pt-3 border-t border-zinc-200">
              Você tem <strong>10 fretes grátis</strong> para testar. Sem compromisso, sem cartão.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-xs">
              <thead className="border-b bg-zinc-50 text-zinc-600">
                <tr>
                  <th className="px-2 py-2">Data</th>
                  <th className="px-2 py-2">Origem</th>
                  <th className="px-2 py-2">Destino</th>
                  <th className="px-2 py-2 text-right">KM</th>
                  <th className="px-2 py-2 text-right">Faturamento</th>
                  <th className="px-2 py-2 text-right">Custos</th>
                  <th className="px-2 py-2 text-right">Lucro</th>
                  <th className="px-2 py-2 text-right">Margem</th>
                  <th className="px-2 py-2 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {freights.map((f) => {
                  const totalCost = f.diesel + f.tolls + f.other_costs;
                  return (
                    <tr key={f.id} className="border-b last:border-0">
                      <td className="px-2 py-1">
                        {new Date(f.date).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-2 py-1">{f.origin}</td>
                      <td className="px-2 py-1">{f.destination}</td>
                      <td className="px-2 py-1 text-right">{f.km}</td>
                      <td className="px-2 py-1 text-right">
                        R$ {f.value.toFixed(2)}
                      </td>
                      <td className="px-2 py-1 text-right">
                        R$ {totalCost.toFixed(2)}
                      </td>
                      <td className="px-2 py-1 text-right">
                        R$ {f.profit.toFixed(2)}
                      </td>
                      <td className="px-2 py-1 text-right">
                        {(f.margin * 100).toFixed(1)}%
                      </td>
                      <td className="px-2 py-1 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(f)}
                            className="text-zinc-500 hover:text-blue-600"
                            title="Editar"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDelete(f.id)}
                            className="text-zinc-500 hover:text-red-600"
                            title="Excluir"
                          >
                            🗑️
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
