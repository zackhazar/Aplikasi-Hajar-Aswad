import { SERVICES, OWN } from "./constants";
import { daysUntil } from "./helpers";

export const emptyServices = () =>
  Object.fromEntries(
    SERVICES.map((s) => [
      s.id,
      { status: "Belum", due: null, pic: "", note: "", link: "" },
    ])
  );

export const serviceIds = () => SERVICES.map((s) => s.id);

export const normalizeNeededServices = (needed) => {
  const valid = new Set(serviceIds());
  if (!Array.isArray(needed)) return serviceIds();
  const ids = needed.filter((id) => valid.has(id));
  if (ids.includes("vaksin") && !ids.includes("vaksin_polio"))
    ids.push("vaksin_polio");
  return Array.from(new Set(ids));
};

export const neededIds = (g) => normalizeNeededServices(g?.needed);

export const groupProgress = (g) => {
  const ids = neededIds(g);
  const items = ids
    .map((id) => g.services && g.services[id])
    .filter((x) => x && x.status !== "N/A");
  const done = items.filter((x) => x.status === "Selesai").length;
  return {
    done,
    total: items.length,
    pct: items.length ? Math.round((done / items.length) * 100) : 0,
  };
};

export const serviceAlert = (g, sid) => {
  if (!neededIds(g).includes(sid)) return null;
  const sv = g.services && g.services[sid];
  if (!sv || sv.status === "Selesai" || sv.status === "N/A") return null;
  const def = SERVICES.find((s) => s.id === sid);
  const dueN = daysUntil(sv.due);
  if (dueN !== null && dueN < 0) return "overdue";
  const depN = daysUntil(g.departDate);
  if (depN !== null && depN >= 0 && def && depN <= def.lead) return "soon";
  return null;
};

export const groupAlerts = (g) =>
  neededIds(g).filter((id) => serviceAlert(g, id)).length;

export const groupFinance = (g, data) => {
  const tx = (data?.tx || []).filter((t) => t.groupId === g.id);
  const income = tx
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + (Number(t.amount) || 0), 0);
  const expense = tx
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + (Number(t.amount) || 0), 0);
  return { income, expense, profit: income - expense, count: tx.length };
};

export const pickFirst = (items, test) =>
  (items || []).find(test)?.id || "";

export const defaultGroupAccount = (data) =>
  pickFirst(data?.accounts, (a) => a.ownership === "COMPANY") ||
  data?.accounts?.[0]?.id ||
  "";

export const defaultIncomeCategory = (data) =>
  pickFirst(
    data?.categories,
    (c) =>
      c.kind === "income" &&
      /pelunasan|penjualan|paket|pendapatan/i.test(c.name || "")
  ) || pickFirst(data?.categories, (c) => c.kind === "income");

export const defaultExpenseCategory = (data) =>
  pickFirst(
    data?.categories,
    (c) =>
      c.kind === "expense" &&
      !/biaya bank|admin|fee/i.test(c.name || "") &&
      /hotel|akomodasi|visa|tiket|operasional|pembelian|handling/i.test(
        c.name || ""
      )
  ) || pickFirst(data?.categories, (c) => c.kind === "expense");

export const defaultAdminCategory = (data) =>
  pickFirst(
    data?.categories,
    (c) => c.kind === "expense" && /biaya bank|admin|fee/i.test(c.name || "")
  ) || defaultExpenseCategory(data);
