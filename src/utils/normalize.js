import { normalizeNeededServices, emptyServices } from "./serviceHelpers";

/**
 * Normalize data loaded from cloud — ensure all expected arrays exist
 * and apply classification flags to categories.
 */
export function normalize(d) {
  if (!d) return d;
  d.accounts = d.accounts || [];
  d.categories = d.categories || [];
  d.contacts = d.contacts || [];
  d.products = d.products || [];
  d.tx = d.tx || [];
  d.receivables = d.receivables || [];
  d.payables = d.payables || [];
  d.groups = (d.groups || []).map((g) => ({
    ...g,
    needed: normalizeNeededServices(g.needed),
    services: { ...emptyServices(), ...(g.services || {}) },
  }));
  d.jamaah = d.jamaah || [];
  d.assets = d.assets || [];
  d.goldPrice = d.goldPrice || { perGram: 2799000, updatedAt: null };
  d.openingBalance = d.openingBalance || null;
  d.tx = (d.tx || []).map((t) => ({
    ...t,
    groupId: t.groupId || null,
    refundOfTxId: t.refundOfTxId || null,
  }));

  // Classify categories
  (d.categories || []).forEach((c) => {
    if (
      c.kind === "income" &&
      !("equity" in c) &&
      (c.id === "ci-mod" || /setoran modal|modal disetor/i.test(c.name || ""))
    )
      c.equity = true;
    if (
      c.kind === "income" &&
      !("financialIncome" in c) &&
      /bagi hasil|bunga bank|deposito|jasa giro|bonus bank|imbal hasil/i.test(
        c.name || ""
      )
    )
      c.financialIncome = true;
    if (
      c.kind === "income" &&
      !c.equity &&
      !c.financialIncome &&
      !("operatingRevenue" in c)
    )
      c.operatingRevenue = true;
    if (
      c.kind === "expense" &&
      !("finalTax" in c) &&
      /pajak dari bank|pajak final|pph final|pajak bunga|pajak deposito/i.test(
        c.name || ""
      )
    )
      c.finalTax = true;
    if (
      c.kind === "expense" &&
      !("financeCost" in c) &&
      /biaya bank|admin bank|biaya admin|fee|pajak dari bank|pajak final|pph final|pajak bunga|pajak deposito/i.test(
        c.name || ""
      )
    )
      c.financeCost = true;
    if (
      c.kind === "expense" &&
      !c.finalTax &&
      !c.financeCost &&
      /gaji|upah|salary|payroll|karyawan|staff|pegawai|honor|honorarium|thr|bonus karyawan|tunjangan/i.test(
        c.name || ""
      )
    ) {
      c.directCost = false;
      c.operatingExpense = true;
    }
    if (
      c.kind === "expense" &&
      !c.finalTax &&
      !c.financeCost &&
      !("directCost" in c) &&
      /hotel|akomodasi|tiket|pesawat|visa|paspor|transport|bus|mutowif|muthowif|vaksin|meningitis|polio|raudhah|siskopatuh|manasik|perlengkapan|kereta cepat|handling|ground|paket|supplier|vendor/i.test(
        c.name || ""
      )
    )
      c.directCost = true;
    if (
      c.kind === "expense" &&
      !c.finalTax &&
      !c.financeCost &&
      !c.directCost &&
      !("operatingExpense" in c)
    )
      c.operatingExpense = true;
    if (
      c.kind === "expense" &&
      !("carryover" in c) &&
      /pelunasan kewajiban|kewajiban 2025|hutang 2025|utang 2025|pajak 2025/i.test(
        c.name || ""
      )
    )
      c.carryover = true;
  });
  return d;
}
