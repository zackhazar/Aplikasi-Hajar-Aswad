import {
  Building2,
  User,
  Star,
  BookOpen,
  Stamp,
  Plane,
  Hotel,
  Bus,
  Users,
  Syringe,
  ShieldCheck,
  ClipboardList,
  Package,
} from "lucide-react";

/* ---------- ownership meta ---------- */
export const OWN = {
  COMPANY: {
    label: "Rekening PT",
    short: "PT",
    icon: Building2,
    cls: "own-pt",
    business: true,
  },
  PERSONAL_BUSINESS: {
    label: "Pribadi (untuk Bisnis)",
    short: "Pribadi-Bisnis",
    icon: Star,
    cls: "own-pb",
    business: true,
  },
  PERSONAL: {
    label: "Pribadi Murni",
    short: "Pribadi",
    icon: User,
    cls: "own-pri",
    business: false,
  },
};

export const ACCT_TYPE = { BANK: "Bank", CASH: "Kas", EWALLET: "E-Wallet" };

/* ============================================================
   PELAYANAN — definisi layanan & helper
   ============================================================ */
export const SERVICES = [
  { id: "paspor", label: "Paspor", short: "Paspor", icon: BookOpen, lead: 60 },
  { id: "visa", label: "Visa", short: "Visa", icon: Stamp, lead: 14 },
  { id: "tiket", label: "Tiket Pesawat", short: "Tiket", icon: Plane, lead: 45 },
  { id: "hotel_mekkah", label: "Hotel Mekkah", short: "H.Mekkah", icon: Hotel, lead: 30 },
  { id: "hotel_madinah", label: "Hotel Madinah", short: "H.Madinah", icon: Hotel, lead: 30 },
  { id: "transport", label: "Transport / Bus", short: "Transport", icon: Bus, lead: 14 },
  { id: "mutowif", label: "Mutowif", short: "Mutowif", icon: Users, lead: 14 },
  { id: "vaksin", label: "Vaksin Meningitis", short: "V.Meningitis", icon: Syringe, lead: 21 },
  { id: "vaksin_polio", label: "Vaksin Polio", short: "V.Polio", icon: Syringe, lead: 21 },
  { id: "raudhah", label: "Raudhah", short: "Raudhah", icon: Star, lead: 7 },
  { id: "siskopatuh", label: "Siskopatuh", short: "Siskopatuh", icon: ShieldCheck, lead: 30 },
  { id: "manasik", label: "Manasik", short: "Manasik", icon: ClipboardList, lead: 14 },
  { id: "perlengkapan", label: "Perlengkapan", short: "Perlengkapan", icon: Package, lead: 14 },
  { id: "kereta_cepat", label: "Kereta Cepat", short: "Kereta Cepat", icon: Bus, lead: 14 },
];

export const SVC_STATUS = ["Belum", "Proses", "Selesai", "N/A"];
export const SVC_CLS = {
  Belum: "svc-belum",
  Proses: "svc-proses",
  Selesai: "svc-selesai",
  "N/A": "svc-na",
};
export const PACKAGE_TYPES = ["Umroh", "Haji", "Tour", "Lainnya"];
export const PAY_STATUS = ["Belum", "DP", "Lunas"];

// 9 transaksi 2026 yang sebenarnya kewajiban 2025
export const CARRYOVER_AMOUNTS = [
  4435350, 722350, 3602325, 480327, 1275325, 13469392, 2030200, 5076495, 958830,
];

export const FINANCE_VIEWS = [
  "dashboard",
  "transaksi",
  "rekening",
  "dana",
  "piutang",
  "kontak",
  "laporan",
  "pengaturan",
];
export const OPS_VIEWS = ["keberangkatan", "pelayanan", "jamaah"];

/* ---------- role / hak akses ---------- */
const env = typeof process !== "undefined" ? process.env || {} : {};
const emailList = (value) =>
  String(value || "")
    .split(",")
    .map((x) => x.toLowerCase().trim())
    .filter(Boolean);

const OWNER_EMAILS = new Set(
  emailList(env.REACT_APP_OWNER_EMAILS).concat(["zackbmkg@gmail.com"])
);
const ADMIN_EMAILS = new Set(
  emailList(env.REACT_APP_ADMIN_EMAILS).concat(["admin@gmail.com"])
);

export const roleOf = (email) => {
  const clean = String(email || "").toLowerCase().trim();
  if (OWNER_EMAILS.has(clean)) return "owner";
  if (ADMIN_EMAILS.has(clean)) return "admin";
  return "admin";
};

export const allowedViews = (role) =>
  role === "owner" ? [...FINANCE_VIEWS, ...OPS_VIEWS] : [...OPS_VIEWS];
