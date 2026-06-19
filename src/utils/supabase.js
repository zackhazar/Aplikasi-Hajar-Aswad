import { createClient } from "@supabase/supabase-js";

/* ---------- KONFIGURASI SUPABASE ----------
   URL = domain saja, TANPA "/rest/v1/".
   Gunakan anon/publishable key (BUKAN service_role).
   Aktifkan Row Level Security (RLS) di tabel "settings".
   Credential diambil dari environment variable. */
const env = typeof process !== "undefined" ? process.env || {} : {};

const SUPABASE_URL = env.REACT_APP_SUPABASE_URL || "";
const SUPABASE_KEY = env.REACT_APP_SUPABASE_ANON_KEY || "";
export const CLOUD_ID = String(
  env.REACT_APP_CLOUD_ID || "finance_storage"
).trim();

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error(
    "⚠️ SUPABASE_URL atau SUPABASE_ANON_KEY tidak ditemukan di environment variables. " +
      "Pastikan file .env sudah dikonfigurasi dengan benar."
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

/* ---------- STORAGE (Supabase) ---------- */
export async function loadData() {
  try {
    const { data, error } = await supabase
      .from("settings")
      .select("content")
      .eq("id", CLOUD_ID);
    if (error) throw error;
    const rows = Array.isArray(data) ? data : data ? [data] : [];
    const row = rows.find(
      (r) => r.content && Object.keys(r.content).length > 0
    );
    if (row && row.content && Object.keys(row.content).length > 0) {
      return row.content;
    }

    const { data: fallbackData, error: fallbackError } = await supabase
      .from("settings")
      .select("id, content");
    if (fallbackError) throw fallbackError;
    const fallbackRows = Array.isArray(fallbackData)
      ? fallbackData
      : fallbackData
        ? [fallbackData]
        : [];
    const fallbackRow = fallbackRows.find(
      (r) =>
        String(r.id || "").trim() === CLOUD_ID &&
        r.content &&
        Object.keys(r.content).length > 0
    );
    if (fallbackRow) return fallbackRow.content;

    return null;
  } catch (e) {
    console.error("Gagal memuat dari cloud:", e);
    return null;
  }
}

export async function saveData(d) {
  if (!d) return false;
  try {
    const payload = {
      ...d,
      meta: {
        ...(d.meta || {}),
        app: "hajar-aswad-finance",
        savedAt: new Date().toISOString(),
      },
    };
    const { data: updated, error } = await supabase
      .from("settings")
      .update({ content: payload })
      .eq("id", CLOUD_ID)
      .select("id");
    if (error) throw error;
    if (!updated || updated.length === 0) {
      const { error: insertError } = await supabase
        .from("settings")
        .insert({ id: CLOUD_ID, content: payload });
      if (insertError) throw insertError;
    }
    return true;
  } catch (e) {
    console.error("Gagal menyimpan ke cloud:", e);
    return false;
  }
}
