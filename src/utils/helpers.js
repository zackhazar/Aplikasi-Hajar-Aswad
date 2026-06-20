/* ============================================================
   FORMAT & UTILITY HELPERS
   ============================================================ */

export const rupiah = (n) =>
  "Rp " + Math.round(Number(n) || 0).toLocaleString("id-ID");

export const rupiahShort = (n) => {
  n = Number(n) || 0;
  const a = Math.abs(n);
  if (a >= 1e9) return (n / 1e9).toFixed(1).replace(".0", "") + " M";
  if (a >= 1e6) return (n / 1e6).toFixed(1).replace(".0", "") + " jt";
  if (a >= 1e3) return (n / 1e3).toFixed(0) + " rb";
  return String(n);
};

export const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export const fmtDateInput = (d) => {
  const x = new Date(d);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(x.getDate()).padStart(2, "0")}`;
};

export const monthKey = (iso) => {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

/**
 * Generate a unique ID using crypto.randomUUID when available,
 * with a fallback for environments without it.
 */
export const uid = (prefix) => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return prefix + crypto.randomUUID().replace(/-/g, "").slice(0, 12);
  }
  // Fallback: use crypto.getRandomValues for better randomness
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const arr = new Uint8Array(8);
    crypto.getRandomValues(arr);
    return (
      prefix +
      Array.from(arr, (b) => b.toString(36).padStart(2, "0"))
        .join("")
        .slice(0, 12)
    );
  }
  // Last resort fallback
  return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
};

export const gregDate = () =>
  new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export const hijriDate = () => {
  try {
    let s = new Intl.DateTimeFormat("id-ID-u-ca-islamic-umalqura", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date());
    s = s.replace(/\s*(AH|H)\s*$/i, "").trim();
    return s + " H";
  } catch (e) {
    return "";
  }
};

export const confirmAct = (m) => {
  try {
    return window.confirm(m) !== false;
  } catch (e) {
    return true;
  }
};

export const notify = (m) => {
  try {
    window.alert(m);
  } catch (e) {
    /* ignore */
  }
};

/* ---------- refund helpers ---------- */
export const isRefundTx = (t) => !!t?.refundOfTxId;

export const refundKind = (t, origin) => {
  if (!isRefundTx(t) || !origin) return null;
  if (t.type === "expense" && origin.type === "income") return "out";
  if (t.type === "income" && origin.type === "expense") return "in";
  return null;
};

export const refundText = (kind) =>
  kind === "out" ? "Refund Keluar" : kind === "in" ? "Refund Masuk" : "Refund";

export const txLabel = (t, ctById = {}, catById = {}, accById = {}) => {
  if (!t) return "";
  const date = t.date ? fmtDate(t.date) : "";
  const name =
    t.description ||
    catById[t.categoryId]?.name ||
    ctById[t.contactId]?.name ||
    accById[t.accountId]?.name ||
    t.reference ||
    t.id;
  return `${date} - ${name} - ${rupiah(t.amount)}`;
};

export const reportEffect = (t, txById = {}) => {
  const origin = t.refundOfTxId ? txById[t.refundOfTxId] : null;
  const kind = refundKind(t, origin);
  if (kind === "out") {
    return {
      kind,
      revDelta: -Number(t.amount || 0),
      expDelta: 0,
      revCatId: origin.categoryId || t.categoryId,
      expCatId: null,
      origin,
    };
  }
  if (kind === "in") {
    return {
      kind,
      revDelta: 0,
      expDelta: -Number(t.amount || 0),
      revCatId: null,
      expCatId: origin.categoryId || t.categoryId,
      origin,
    };
  }
  if (t.type === "income") {
    return {
      kind: null,
      revDelta: Number(t.amount || 0),
      expDelta: 0,
      revCatId: t.categoryId,
      expCatId: null,
      origin: null,
    };
  }
  if (t.type === "expense") {
    return {
      kind: null,
      revDelta: 0,
      expDelta: Number(t.amount || 0),
      revCatId: null,
      expCatId: t.categoryId,
      origin: null,
    };
  }
  return { kind: null, revDelta: 0, expDelta: 0, origin: null };
};

export const textLower = (...parts) =>
  parts.filter(Boolean).join(" ").toLowerCase();

export const txText = (t, cat) =>
  textLower(cat?.name, t?.description, t?.reference, t?.method);

export const isEquityCat = (cat) =>
  !!cat?.equity ||
  /setoran modal|modal disetor|tambahan modal/.test(cat?.name || "");

export const isCarryoverExpense = (t, cat) =>
  !!cat?.carryover ||
  (t?.type === "expense" &&
    /pelunasan kewajiban|kewajiban 2025|hutang 2025|utang 2025|pajak 2025/.test(
      txText(t, cat)
    ));

export const isFinancialIncome = (t, cat, origin) => {
  const source = origin || t;
  const txt = txText(source, cat);
  return (
    !!cat?.financialIncome ||
    (source?.type === "income" &&
      /bagi hasil|bunga bank|deposito|jasa giro|bonus bank|imbal hasil/.test(
        txt
      ))
  );
};

export const isBankTaxOrFinanceCost = (t, cat, origin) => {
  const source = origin || t;
  const txt = txText(source, cat);
  return (
    !!cat?.finalTax ||
    !!cat?.financeCost ||
    /pajak dari bank|pajak final|pph final|pajak bunga|pajak deposito|biaya bank|admin bank|biaya admin|fee/.test(
      txt
    )
  );
};

export const isDirectCost = (t, cat, origin) => {
  const source = origin || t;
  const txt = txText(source, cat);
  return (
    !!cat?.directCost ||
    /hotel|akomodasi|tiket|pesawat|visa|paspor|transport|bus|mutowif|muthowif|vaksin|meningitis|polio|raudhah|siskopatuh|manasik|perlengkapan|kereta cepat|handling|ground|paket|supplier|vendor/.test(
      txt
    )
  );
};

export const isOperatingExpense = (t, cat, origin) => {
  const source = origin || t;
  const txt = txText(source, cat);
  return (
    !!cat?.operatingExpense ||
    /gaji|upah|salary|payroll|karyawan|staff|pegawai|honor|honorarium|thr|bonus karyawan|marketing|iklan|brosur|sewa kantor|operasional|atk|listrik|internet|pulsa|makan|parkir|bbm|admin kantor/.test(
      txt
    )
  );
};

export const isPayrollExpense = (t, cat, origin) => {
  const source = origin || t;
  return /gaji|upah|salary|payroll|honor|honorarium|thr|bonus karyawan|tunjangan/i.test(
    txText(source, cat)
  );
};

export const addAmount = (map, key, amount) => {
  const name = key || "Lainnya";
  map[name] = (map[name] || 0) + amount;
};

/* ---------- date helpers ---------- */
export const daysUntil = (iso) => {
  if (!iso) return null;
  const d = new Date(iso);
  d.setHours(0, 0, 0, 0);
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return Math.round((d - t) / 864e5);
};

export const countdownLabel = (iso) => {
  const n = daysUntil(iso);
  if (n === null) return "\u2014";
  if (n > 1) return "H-" + n;
  if (n === 1) return "Besok";
  if (n === 0) return "Hari ini";
  return "Lewat " + Math.abs(n) + " hari";
};
