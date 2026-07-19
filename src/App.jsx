import React, { useState, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { createClient } from "@supabase/supabase-js";
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  Users,
  FileText,
  Settings,
  Plus,
  X,
  Trash2,
  Pencil,
  ArrowDownLeft,
  ArrowUpRight,
  Repeat,
  Search,
  Building2,
  User,
  Receipt,
  AlertTriangle,
  Send,
  Plane,
  Printer,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  PiggyBank,
  HandCoins,
  Banknote,
  CircleDollarSign,
  Wallet2,
  Star,
  Menu,
  Cloud,
  Check,
  CloudOff,
  LogOut,
  Mail,
  Lock,
  Download,
  RotateCcw,
  Scale,
  Coins,
  CalendarDays,
  MapPin,
  ClipboardList,
  Clock,
  AlertCircle,
  Stamp,
  Syringe,
  Hotel,
  Bus,
  BookOpen,
  Package,
  ShieldCheck,
  BadgeCheck,
} from "lucide-react";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  Area,
  AreaChart,
} from "recharts";
import InvoicePrint from "./components/InvoicePrint";

/* ============================================================
   PT HAJAR ASWAD BAROKAH — Aplikasi Keuangan & Laporan
   Penyimpanan: Supabase (cloud).
   ============================================================ */

/* ---------- KONFIGURASI SUPABASE ----------
   ⚠️ KEAMANAN:
   1) URL = domain saja, TANPA "/rest/v1/".
   2) Gunakan anon/publishable key (BUKAN service_role).
   3) Aktifkan Row Level Security (RLS) di tabel "settings".
   Untuk produksi, sebaiknya pindahkan ke environment variable. */
const env = typeof process !== "undefined" ? process.env || {} : {};
const SUPABASE_URL =
  env.REACT_APP_SUPABASE_URL || "https://chcdsdzgqhveczvdvvgr.supabase.co";
const SUPABASE_KEY =
  env.REACT_APP_SUPABASE_ANON_KEY ||
  "sb_publishable_72dUSzFKGyB-hexrBZztqw_CQwOhvkD";
const CLOUD_ID = String(env.REACT_APP_CLOUD_ID || "finance_storage").trim();
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

/* Logo (ikon emas) — base64 agar langsung tampil tanpa hosting */
const LOGO_GOLD =
  "data:image/webp;base64,UklGRj4pAABXRUJQVlA4WAoAAAAQAAAAiwAAhAAAQUxQSKESAAABsLj9n6G7+ch+M7PHsRuVaaM6Zm0rKMIy7lszru02fWvbjFm3J0Vsmyc5z8zO77p2f7/ZnX1OREC0baVuRLQJmZq5PETU9Acgg0MB1D2oBPJ7FNUAkFAFDiGgxinHl+Ybu2rcrn5VuAgAzhvaAqrAUffCCxSoPCtSwuFPDSoAUQWsCnDK/R0iOfJICmDkVx2hKlSI/9r0xdEAQR6/1uj7d8sSYedXoWNmtoRA5Otr52y8O32/y5cgvdYOzM+3FMBEfXFq9eXRwMduniRA5QFuzW/2dYQCAKhi5YAVPzeCIHOwRyza0TKDZ+TFyjXnbzwegoxrz+2bDotrVSzVf9fnQpBpvTi3mVxXzVKrHAdAkGHtj7uPi2tVLQcswREQZFavRn1aXKtuab0Fb4IgozoQcVCmVaggOpTI1PVO1jgKgkwAXmbxoUz/q3IByO4ogCGIgyHIQlc5/EFkqF0pATreMGHCDZ1iDFle/h/tBd5FQZvtuK5hduODiKQ4/xckx68XQIajg1Alf+HeDp4mlKLuErSng8qw1aHvIVodHRbx/cMgS8RH7sM1jUF6qVd8j/goBJkpFQpu3oFhSD/CEHfcUgBKZHZrBOLsAh+UAdyP4T/FWYkRAJwctTLoOEzU6GTIMGJNRXzGA6SCczFnu2VkXymg8SREbdF5WI04qUlW2YiEFhUa+4BKLdYBmww+B0FWfeXaDWhpKxsaE1reaMN1kFGjAO5Cs/MgIdOev0SzsY6U2fSVDtMQtcMIiA7TaMTpHbP5n0IVLQhxSkp9KRiElXhNFudISXUeMWgsd85wweTJC0LusjaC9FidTIKcgvOwEoeDSiVZ4+3algdSZNGqz3IucGhwz4NtVSRQ2wf2oAmpWiwu7xsHuQzKFMztOTjNLQXvYSWeCyqDVm2+cLf6tCWwSN/yE3ejL9tCFjJ0sjn8IgU8BadEdS5I/1BWem+FQ++ISy4DICYUMgC4dLHTThVjSkEJ7/I5VuJ5iUXIgnLM4Zm+KpQA5/zt9MfcgzW5P9Kv13wg5/Tff871vqlEB6vtouIkfwzgGqzEX4X0VV/9t9zmn3x8gowExPE/uh3nrUbeBb7H/TgyoZ8KUW21zWEfCDwBt1rEW4UW1w2Ku0WaDjVoLdqQN1rZBZQnnYbabqwthPt8U3RvRbEQngF6HeYcqn6+Ucq4Hpm54XPIG2nc08OzCPkXVuLdEDjP1ddZAsUPbc3/UHMX/Kln6vGOwOkxjzuzwa2H+DlcAEMwZzc7TwEMQ233HeTXWsHbjrptlHJ2TREoKVXgwhGBGrWNFY0zpRcJqLcDc3gzBI5z4WIaYPzquY76xcEAyi+3VQAHf+4o/SDwk+dNrLQrSoRwTMPQGOwl/Pig3Boq0/1RK7e4dQa8Nm3aawPqRBfuRvdRnYV2QYEQXg8+Pe5bfbkoEiZbjVtqgRdUOAlDWseDkk43EEPWIDnWDhVOh5EKxrOCp4DyYktWY87OBMlqGxPR2358AC9ZTf76IQTCebfLLEStjdEacXZX583IuB+SP2o7yY8N4HmrbXgMKJ5Fal9eQNm6+CO0G+o6ukAEoN6TFo1FHv/t0/XBCavuBhsiWlxfzdPSZ2Go44SafnspGtzdwA+oOAcNOQ+FwHX3ylWx5I4jtLiqn+tmAEMZ2HOFH1tzCxpcWQwihnxi7LVTfJ/8htVUtcz/oycd9S2ixoRDI353NDigVVuHNmbf9I0MX6AJ8bQYWwBPW63xTgg8dUakcSTpEuCe/XErx+FotP8eAguIRBhrjnRHz5mI1vaFCICAiA9D7Omls0BcSqwcoROK1mqfJ0w9EiYhX1SjRYkeGBIol4nA66M92pCwCjqgtbjV96kfWh3XJYVC0BR5KuYcd40OQ20cN3M4NZpOEbZgSVy0/cjzoWXrYyN0BRXAnXHrGSA9BwjKP0x5Ba9hztFTeLOQI8nhGzwyPETZnfW9NCzhezQaR0MgYUqM4HEIvPgrGd8RFKmXuapBnDK4W7erpyAaV+nFAHZg7FVebBAPDQang4Ta29Fq7O9FEr60Jq7/MJOXrrChwwi/n0nRnfm7wzShXVHGnOifuBj7FUgv6hX3vl11AXpGkC12AOVTG++h/DgI2NKdYdXig4UgA6UiuxY+hJYVgwMYxLGU3dvYp0g4Bq0N8USA/6G2uLsheM3ur0FDdH80SIJ5mjXsOuwHPH4qCf1CdmnsdAbxaILE4LU+rIA6xCVugTgdCnGh8iEJP8Zk8HchCIxDKq1lQaw3FLjwFkNvFuqsrTyUFCF+o5gng1/2FHmQxvdA/omhJ0QJB+2n/B3M3jc6MqibocB1VSMqNzuypf8xkHdQdv9BfpJ9E0f8ctloW/xvXofAMx6T5Lols/dcNLR+5UIroPbCK6EIvuKY5jGQLbUlOhnpJ9mk2D93NO5MVD3RhyTMpuadC5Rvxewf7nEvTih4AEeAPGhPyPymNWVhDkU9G6QPjSFa7nolhp7aknA40+goZu07Ka/xQTdYIUsW4RUAD3FUdzGYo5g1jwDpQUMjCrHfaDQRXeFBAdyGmvSCQ1gviOIX6RZ7mybMLBScj3taieZ7SYcK8U9JzXfwfktMfpuXaH3QRJ9jX42f5LWWIMSv1LhTSVVwDDW+xg9ApZh8fi3gA3qy9lhQpEyhuH/zyLYVnE3otR8wjD5PSk8Sjgwpfz2z9Tgqo8FLRZBIXUPsIXojmxtMYECvo2x4FMj0dAJ53o9/RmQxmuJ6+rPFvU0or/6hPO5pBCJZX9Pti9B0D1L2v0CQLzbZi4QdA0F66ow2or9WokWvoUeocjKS4TeM74iWnn8GkWozZXER/EJPFjsx9msko+h8JdJTB/K8VVsJtUtNElozfpiglr6X98//Q5AmGldGIeRVjmw0ZcUwxkbRJTW1I7StAtHrI4Ar6BiInUHxdU3EdP2R9e3T4ljDQ7ByWB5pkPD6QKzQhLp60Gg2djSjyhTzMUQuUbqtjvOhH58b/i1AxFZqxsau0R7UlWqJ+vfJHvQkpa21I3kirmglJYNngUpDN9pT4Fw0lFYVU6y1t1J60oNOZqGSCHRB9hTiCWlIwYV4aDy1SqQt/nQBdUCDiCSdzIz5m1P3NCTh+CkSunP6RwBkwLCkUMffrSB0swddmfiVr7jlT0xnwqC65B8Gv2ZQOyE1+pUedBOhim1oI3okNUlowx40VAQu+6DPcBXAObyHj2EPGsIe1AZkano4IovbVhF61yfGRs5AA4OkymXNUu9tC25oDNkgImMTku7sE2PfJbQqDucGZ6VMbVNl7SL4D0NC90CQFug9hEJcEAiROGNIn2jPQoMhlk8mw+GKwtRFwdGMvRYoOwE1obdB+a0naryPAb2G8UeDSl0LV5DnTX4dTdw9m/PBO1UMd2ftEo5ledF8KVLilPNZkDqO8T8SnswYUveF5nEHN/j6eDQsSqVnb0/I2oX8M0ZqMc7p0gl0SCVajEd7KZJnDH6pSkTjBpBZPw5JiZBn7USIEczWdzHbD0431QrEYNTcj10zBktmDD5ryzrWWv/uiDG97JNoO7J2xrY2Fj2mWhIms9jdhsGcxWYMXmn2y7THd2uyE23sRWnniK6s3fKsXcA8KqVuK9KMPqKttjyt4jMGy2cM6VvGmXs8F1KRi/tMtFnWjjxrd0ZnjW+lyxDeRM1HkKQZg49cjfeiJTlenKN7he80WbuEQystCaJhpwSsNASHIV2IOgxk4ozBayXfxFp7H2KFseWldGxy1k7KDBuzBsuLkkK4UIXlSCDFi9ZpZgw+Iw81N5yCoWfYAZmYtQcwkE2Q4/xWJIw7L3NEgxjE0c4Zg0/gDGnuBvV3o42N2QKkR/naPZIJUbbSssFwYtLe4gQ2BNpVfA1qPpsxeAl1WM5atLi7Hu/sGocID+uJfixhac+yjz6YQ1qelNFNdlc8SSvmsC8D2J7liP29hBpCO0rkTWzSZ/AHH+tB/Z1onTN3BW+xYnBKqwhHEEQit5yMhtW3+ZrlA5Tf1QB8PO8HaoOxECia/1msaO7VxT6ia7mLC6jJZckMzFlado9tHGM7YMxuNh/L4cwSydZyF9G13I+9gkOzCrQsP403a+jwMxx87NcLDRKgQlELVf8araEFt33+xBOfb0X2NIvf1KDaV6IbWz7t5cPDcDrwrC6JwCp42Wo2AfVga22l7FNMTxLEGLoFzndFHCBy4yTI5AmDl0g/E95OAsU2a0inayeUB/uWJdKsK3PtiRz/Q6wVIrjWxro2yx3QytYSzdm3PXgl2lkiNH09QEDpGsq+CMqDPY9Z+QYIHHqBgXQL3LnyvnYQAcTO1yONxed78ApeoPyaUhBOE9od9YVIb8Fq64ln2/W1nXtoZAtcW0y5WS5l7XV0D21D9fS8EPV30CH7CR4Z2lk6QNwKPnqbxPYW33OF+Bhlz7mI2kSHTtwsj0zwLjlr+7KPneFWOqzZ4xk2CXPJ2r5dHXlhejqVz7ZGJ+25qlHr6ceGUSppz3U0n8GdBir9uWxVbDJjHVlVAFdRh/IZOYUoXMjHm3FOrcfS1b/m7Vmz3r6mvuuZBNg4Pg4tKkyh2RSefBUEDrWstiHZyiiVHnAHokZ6+XFzcPZ0jsB9V0Czj1nw1zjQQ7GydLkN3Y7gWhVH47emq+Y4ypZhIundBSGS3l0QQzc76hzlM4yMpJ6Mtzv9W9Tbakn33FRbCo9xfDuTyyDO7gbJzpe0We6AuKMFyPTn2ptIB7db6zq9JxqY2elRr4ecWIHatQVeDxJe1nBvloeud10qTvR6yiPsPNYtrBB1t4SxasLKNqA8Svc1zlfUVvVL+w7QVY7N8tDg2u5eOm1dGcZOEG6JzgmAbmanKR4UAWr6vvvdqG+PTmhEQBz9LaJ2xNwPmvpJMYWdbwaV2JWW2TAufu85K4ALFyAaxxb4xOrOICcVVBu/z/nO2MKLwKcGMJjmHHZplNkkincxzRnD7c18XiASsZj7nWIuiMQMJLkKIgX9l6gg6bMxJ5ptZ1t9F6dQlIJvWbz7LvlNRU/zf9gCgPaewxIc57tjku6mcOjvmJjfgkqjoBYVRM86+T19z24R4s4JLUUEp+X4nRiGznc7fDTpnGhaU9GCmz9VE2u0+wU4/3BhEPX8b7+drxFN8jsvXlbtrI3lbdL5oJzFMtiV9QWTwCuMpnlXN0UA9vlS/ZUsD5sllUj74t5uvnSRFhkkDC+bMEz3DvPmYRICb9TyR9pBze70o4Hiy/Yan4cgg3e7m76a7t3u1/mA7fel57h8/b1Gg0kc3B1QkMU776f9wZ2Tt/rzdPDXXiTQ7Vw6rze4hCr6hRpN4zWkeDcqun2X67cABnffWQRKZFAHI1sb+qXIC6WEAzdiSDthXyjI5H3zwz9CDHV0hIifHBH3lQxqH9r1Q9x4IPh28m5koEQb2t68+Aa5i8vpR/klAIHIovayTLBK/18dBNALNcWIV2Uik4w66+kT33ln4ukBSJmJzq5CWjX2ysCjAxjqKMNBiar1WyOhYJijDo1rBuV2Vgzel5Vk8Xs3WWlrIhpW74hrJuVuVjRm+NPXjOQpfdtR78lKHhFf8nn5r9n8cjYzaY74hc/78XaXNJk04LOwbb2z+VY2X+u1jc/UcBixcnal937kyzrPVY9uVoG71Z9FLkll74wdLoAe6xyG/O9UyO8jCehT/nW42/oeEGQO++B5DtT4fMOoUV5bNXgOHRqddwgEeUBe/CKi4es51ykQebpQAtS1fH3IIL5YnBdtSoABO1Fbhv2XCyC6yPjfMaDn/8x0aTXuHAhs7MteAGg5lcM3iNPOjX0mUwlk7APnxNC5Iqe1AiXy5+viZvZrJpKSzLuqWtwXZVZ3ImGrXTk3Rsx/IXWLyGvfkwJaf4G8UYi4bOKRbEXDezSKcbUZvwwx5K3wy9YgZN7DwGX/0Qsqj5k65FCqb5VuBiikovY65IYpOtYbv1rQC6rAMCYllN68PrqgFtaIuG/GXV2qu36arNjh+pFytc53TNuHbqzrbylL+JlufuPSmA2IhvYe+qS1X91zTovSNCBLWpx9z5driCuxnmIQN45tkN0Alk3W2PD2ZQ4FW8Mcd/Xstx8YcflZPTu1a9ep51mXj7j/rVmrNHUGYx3mW3ZHQ5ZpVqGLav1mEKlCZH8ymPKIAIWIDogz+1fjV1XrAjo8tpwpm88Ntdbx/DA6QkNAhBadJlvxeEfI6iovsbvsrJeWE10TaZMPh2bIaflLZ5dlP0ZkHsBLuo+ZvoNPxUwYWstkt2FoWCvcMWNsj9LE4aEqfp10wwYn3/reX9vSfmwvf/+2UxqQjs++X7VvMCU37tZv7Gs//rVqa4W2VldsXfXXj6+P79+9iaAhOB93AABWUDggdhYAAJBSAJ0BKowAhQA+PRiJQyIhoRkadoAgA8S2BDgAwaIZWp43/Y/yn/Kr5Wa3/ZPwv+WXxy7cekfNs8q/Z/+J/fPyo+fP+R9SP6i9gD9Q/2C9cX1FeYD9jv2A92D/O/8b/ae6f+r/7T2AP55/ff/b7TH/Z9gj/Bf9r2A/5b/c//l7M//I/aP4Fv6v/tP28+An+e/3T/6+wB6AH/G///sAfv/3H38z/Cf9APk54J/ofyG/aP2J8z/v33B/aboDtZP4Prm/qe+XgBexd4N1//Z+gF7DfU/+R/dfIz/zPRD7JewB/NP61/t/WT/d+C19s/0nsAfyz+o/6n/Cflh8k//d90ftW/Q/85/7vcG/lH9L/33+K/Jb5wvZf6D/6vOfuYyJlumjBHa+Lk2xZkduPWEucdhS3tfUuSNu/n/BMDc+KzdEDthQOg508KW0Vo453YpPDxkZF7E0sUfCes+wFQAj7JJ1EB6XmBRnZmTOiV3hfgfEv2vV/t+0C+Vc+/q3RxBPfJyK1EwRiNGInAGGcLiGBdJsh+ZWx7qIZGLBLNvMP9POakLR3rHyZXv/kmHkAxBVbhOgPjEYl5z3E/XPa30JzpjtJteBYFg4UP7D+Xf/YLdEDw0EveZ1XKhKf+FzFA4qLiHR8nWBaFPf1V5c72YZfEgH4J9WXupy+/29IptOmSKbOc7/cdTV0/zmGJADyp3PFq+uOGEBS1CSwtSBysiEl2G02xqpqzH3FGOEn/qzNlZ2v8/iZdaUzCyi/93GUfsxmO5sOcx63rlHNBpu+jJI6JfDs3j8scmhwv7m8rx3FwoHLFYW0e0+YC8Bb9oOf7Llb+r6uBez8yzxwcnQZ9rr+YJWmslKqmtj7th54/Xn/BTZ/jEinEpqCme1GGR9wAD+9pHX7rB6jOXX4zv8Ov2GUSWXajaf6g8VGM63TVsxd3UsLAfgyUSD7KmfL5hiLtzlFGaamf5YE5kBB7kCSV0oE6uLkT5izHjhBg+lCnAL0Xp6fQBNKRblzb2Dj0UZhoycGSNwoO5fcfx2hbJZcm17fnlh2W5scPY2LsNc2kSx11WcgAs+6vIsDtq2A7SAFHCMUxMThHMEffIeGCn1rgTC41WTu2RXN6hVv4jsVVMsdZiGEh9G0rwM5+4eh5yLv8W8/jdimByn2RwP/K6fYwbEvZUJZouK6PREHFqoaGJcKrsUeu9I2jhjtCTFbphWka/SZ+hV+2QXgq0QUqTDBNNI0KdZ5GkZJ4PeWbKRnPZZpcPNFrIP61SjNhL0h3bKEBC79bSeeNjSPXqWZ4vfZNVJMLxA2qRotusWthZlO0XnyR//yHjS5DHl4+mukzSYgbbnVd+cIrdcedPwLx70ZiAUZF2WM+CrGKlAg3fBITvU94Mq5/on/AQSVqHyJw5PHGzdqaJMDlTl2tp5ZVIaj9WUgB57AGHrQCHn1/rztfMewau6wPOmkl1XvImW3dDzL2pc1Fjb4+T11C82PGZltUF6wPhR71UxPOzoWXt2D3XpT7yuqYSfmp0ZzHba9KNJUWudX6SmBe2sHNPJ343tR4x3RYqi1vtG5KLFP5IoA1DFDWr45c14KmqvJByaypQlGBrO/QeU/UHOfdqRjwbRZy6itKHP/KhVNEyTHfDCQVnhLLJjOjh4myOWyWGPD61xlKPPm/7QBAxeIP5j+RIqdswdKUER/M447f915S5WFtr0ebBdZ7F952k9jPhAzzz4IrSl+ubcUBqeuLjOXI2/Bf483SgV19T+K3ELP/mr1Cfx6n/K5fOjujaVEVyMpwSMUxzbJLH4wrT+JikBm0uSg1ISmu19uHc2PFxFzqKUfva2ynMiLuT/mXGOjjsmpWrqV0l5iSWvyJe85x1xHWaCjBiCVQNED6TABwjhfLWQnE0PndfMUhBUWBNTyYT54NWGZm2MzAUrnBQ1fgkZbpcKzstD3zcHLGEtdPcAQFXSQhCKk714ifdnzHzzYNwe7Yka3rs0FLQMaEe0eKYxgGIylHlvdZLskVQNmuCnS7gQqnJJLRE/irRcFWW7Vv2VMyTxddyD5jSLkOUKtZB5pO7I3beY+JHRybVDyG9wEqPh9aO4X0UiPE93Y/0aauOEuOotYsRq122TDrvlwmwagUxUG9nrcuOhYN8MkFDTcotlFJYiylXYYDEDZA6PRs9A17elzf3+5TD80/ICJkQ5mc6AmBXql2vo42gcR4AWh+4qNZXUFGMzIu3Exw72gf2W+vWOKumieCs0p1HbRL6jHrmMfZpdIIL5DVDE1gXMko5hB1o17cjP4oZ/NwuLLc/p+ms/K4eDLxk+lIWxa+GruC/C85G4oHaXbHYfOwvBd8Swis+V8pRyJXYrGlzcP/Yw7Tw10JlkRZNhGarFxF86Y5rkDchFSMFB7lcq3eYI02/5pOfCfRaS6+IcWnr8bvR1GCqolu25qNiMFx48TCbT6Hi05hr2OrdHJof+38luUFwzos0FuVfE2UuBpM8Tj7ZPIgvmczyamHClyljUG/KXKVctjabHRzZ7XABtqK1dFYiTlX9ActMudVa6TQ/KeXXscfvPnObtZDyKKOc87WDfmMCzeKCErt9JELVGvVtHpBZmaE5ubcv2VlghVqPEGVlGmbOqvYTx3JCVzzODeaJ9FJzBc24AgTnDSn2yjnKRflj3OAkPQH+OC1hIPAjRK9DeTL5Drtfg0NcUjUlb3UNox5haUA0qCvNDiW0Sj9chK4gTrB3pgcnwSlSqxeZRJC1PW/za2PhvVO2P6N2tVTzIo2ayFKAQPq+z2Mvn5Zr6gHl2re+9SXM+7ELmCfdC+cjESlw2V1E42JAc9dYJK+baC4GZXvk3QxozimuE1Z1dN8/9yvDPCkYa/Vjgvg9gjDa/9EzcTj/sGtD/UeR7oIcIOiZQMUv+2fKl24y5kguyLubDQnQ/GyOfBDwRDeC5pFlM/Mel2W37Q7mN9L41wvDcn0w26XkWAF4ndpsXDRHbo9KDxPhveRk20rWwiOKi5ouDiwrjoGW2btOM5h6JZYYIO4NxxzpRvI42ZAdC+n2WIb9doFVVnVehuDP0PRQjprbtAjHvX8kz2xIUSgjnVzfWFdFsOj6D+UxVVRxRsYVAHGqTiFuiAqSEW6OAgfyEnaP+DRJen+Gh8XqXswmImkbU9gET4KNoWTb5D7TVrMBfSfO5k5WTzPPdvs8Z9QDOG/U71CBYiAtMbyrGeLkzqDD3ARekybl5GgWPwcweuEbcxV6ccIs09tPQqby2jQn4+lhtWTgALjHhanWzpyfmOrhfiNIFOsEaoV6vRxwyX/PnU1akY6GZeVx3a+RP58LBdawgwDumS3UDOBv3gJQ9r/gCf+O2w16lp/GE5uLhzOQHdhT20QE9BNhs50W6Iw+LNQc7TIT+quEHmt0sZPIvlLLaAvUZiWDzsEssr7Y1tmNrJCQath3fvAwx3DJ+RzvUkloNU2v5/6KL4zLNihE+akKj2l/9YWmVOf6A5Zcc5f8xfSQb1VCp552+wjzID27j89ty6Qf8iskpUoEWQFY6Rp9pdGtTgC/3geJJCbh1+eX56Eqt7gf/BWXJrUB4Pafr9kZyz2/l/eNF95Khb9EdZJPhtDUAYXQMmRg2TgQzcHjxBBSOwouKn6xIn2UFZJ59nQeOO7pYFsRnBfZwTYWAcPDmqQrIp0+2Un5+4GBF/fHIDdNvNMH6fZl73dP4Zmv5zO/Mnk8oyE/LmNeXvTyrpiIH9HiILHSuZWkwiDZgBc6BjnYfvgx2nsv30LamPtbR1MxfrQeNID9mbzZzXb/uDzibAT5jxpdCtM8HgxbxYY6BHpq1OqAEvCrdtsQ2/lva4c3aZmA4aMAACRpC61ODaR40ivUiH+ATEpBrYZay8Rt0k+C//yWX3bA+spdTfl784qNBbRk7MaZn6Cpw9L3+dRsKm42EeafCUKmzfezbp2CAjpk6ih1KOp2W6ZyfuvzUySNm/q0L1k1GlMnapvrTv/Ik3tsLK4R3yJfe3L4VF8+dyNqw+qsHRhfznANg6xfG9fn2dY8doiW9nyjYJaVuWDsA09YyF/1Y1Z5scTzAR7GJ8Ws0n2XjSL/FzvV+0d7pLNc0Qc60L0lbqAYDAkUW4TRLU+XKcOt0Grv6FFo6kNudjXUPr1ayFfOgsAv9rTUpYhwbYA+MXgx0lL9/aIwSzsolHN+dslihRtanqL/FZBz39/JjHue9N3ggtTCvUTl8mDPFFAKcKJKDsw0OXu9DInbb5KMt7X5o+fVCwI4xOSrg1fVy7jHo0mhqLyY9o7qPtfKiADzvtvTmvGvU7TTTqhxmEKa+ZZB8NiJRu0dIDQuMzHWQ6O9TPwZj/A7NnHK+VLYx1NySfTLZ8zAg1T5Z82D0ANVW6cH4tLH+HFolfqt2ZRziFYM9KuBwUyuIEkBaJUVN6nSxcG39sLUkETEHanNT4UwbS3mIOLy8mi1AXfB+hOHcllezmswZR/tgnLIzqGzZ70Tb5a4Y/0zJ0WTs/Yhqskooysp6i8oA6IbhOD6WkRMfqTzvIn8OFsI91KBclJ5heonW6nGDiejSkPHGhE33u1WUc7kYEn8C3TlePHTK7828pbLo4QoJyyCo7FNMg6xIWl2z9d9j5AIPkAjaeEUyzQCdjJ5ia5+iGmGJyJIVPCOx8JvXTm5HE/4C5FBQshTbaN2+Ck4wef0Crb4zUAeOhTaT57V2uhOJFnHYU6ouDVL5oSFF2gWssEObTM3TiKkd8RqfgZ3998rL2qqiMFgsWLg2KMhM0HNGzi5FcrS9/qq021S53AQkl/HvOoQ+J9hvtLXEACGSJPt7T1xHLuLIBdkNuIXJ+v1Ymvt7vPJIS7O1DT3waiFbb9t1bgTvfw/LU1zX0CrJ2CGGNFdmgRb7I7y7VgxwRQsWGYw/4unlAJBpkW8P8bEjWUxGj/5yj4RO/wH9wM0PHjNybGD4J3SsP16Y18W4i1SICqL/v0ojWd0RlD+/fgx1DAXxaAdkbTbsfEq+F9rgD8mMAXgayoZ8Si5/0+Phi6qpf89grq7Yi66V0sPQunz2hNUgJYgHuBFdnCBn/1nh9uTzsafoUzBs4KCj+Wpf1uzUF3dcYopfT7o7x2eQlKcZc2GnTx847ZSDi4F7p9ACqoMxb5ultLXM8P69ITGktCnCDL7iJjNGceh/rVBzXQmT7W0Pzmfu1S+gNIICEtgMvVCiB2gUVOR+ldmOPqLrs+Tm5HFl4b6GBbN1j6DrSRlvjIvaC8tzMIWX5kUp4cSb9IzL/i8CLtk7IGW5VezAkdmbyDmMxF5q7vDVxG9YlOfa1BWC+bBmwxTOit9iguK4dEWCNYTiNJM4AcRVXYuac4BhfmV9RW5rQnKWtHrNNiNpQPKh3vgY8GVy8t8wT/DSrIV5SEP5uDqMkXF9YvMs9QMYYhroH6sRw9sO5ZqV2Y4xODTDezG3H+dY3aq0LtbPcD0dEQtbXLZWR4ngpP6/3y0xEpfiGKSOTG7vdcK7rYwlPahgQC+ul3NKbZ2hynNsEYrKzLYKBY/dELvyVq1kmJYC9L2qMBU/NTlWg//hM/iObscY1VrXTJtig0EPRcv7hBwhXZGTx6lZYQECMJlNiVeILKUPdSK5flPcyJUm5ySsOQcr/obRcIjyQ+om0hoZsz4016pSGtsCFaX509XpNExvN6L5SwCRMyScwTArfBedUqHyvpcEId8vnvisfOjA4ViSNElUj5aRBtHxRWJw7pMyMOUxWa77hCw54yB1FfxTtZLqtjaw+TSyxqgPhiLnJlzGqLHIYlczVJ9FS3qH39Ta//tcjk8IwBNTUNKPixbM1mSLE6DrCEF2dYKSVPaAGQRVZfCQb3rikfRQEuDccnGafwB3i8xu/iSnf524frFlj9knroqrUhH3iWLz7nF2wyE2vGHIaJlY04zQAGjkYWmghIz2lMKioJq6yNrwCqeVtKvfWMKCvEoIFlQjGVOcEujxYyG/TWV3smLD9A7koVUivlWrG6zWn/VvaahNV8zKd2YvZBr3JBp6qw47CoHLq5l4DrR8uRDy/Ru7GvbkEPma98A1t7YHyIQwcdsh3FxbhSGd0DxmrcpqSoRrnUmVnFlHHExXL39OAF4LIwhwU1BSAW4sKCc2dGFUzaFfsvV+mIEq1+Sn3L8fmDBO3fbMGJIT3S4iKb9Lrk+s28iyo1a6UsuBGGfYtvOgEAYJMhe+q6vTHB79f+F6KLtk4SMmwGYonqMgwq7SxfyUynP1z9nuYqwYo/i3fdYBHaOieKG21QEVpeUyCrgc8u/HKPbI4yIPEmD3T15kzQE6rd/nyC6frwW+9bRtGM2g2HJ0VZCSCm25HoiTX2QtaGi8pOJuGxSkpHv8DYbwwqNBZqLDRbL7lQUC2XCPdjJQN7OqEmzanOSUvOFc6gR21X3+Af5blou2Y4lFB1VmrEMKqoB++G5PH4mrdJmwe4QMnxh5f4b82yHx2dAls/wa1NyRegD2Ns0IXLNBPknYvz8EH7ciMbrxQk55nQ3+WB+mV/qIWO2snlW8e9BF0dc/TW6Mwf0FctK2oPMgAWtdPsAal0n7qFybia4t3sCpL86SloBKQujxtXkQIQs0uxLdhMKMwShn8zknJ0ZsPLoAz8FcvLbwwSJplEpDfBfjhousAMrMQOgntQdFwtyi9mhBioWcHy0wcxU//98WEqjPgTGWRKB4Tj+5pWIkD/2mpI3OZRSa0ndzwGwujed9/0z2PdUfnYhp0SimZzCVFcHW+7c5crm9iZzjkhH3MFqfKwCXhDhSNTCKqHPnLjFG5NY83fhsuflYrfAtrQ/u9CvOvdwbGuFfptgWc6fYtNKIh7Y0RVLxU/Op+mWgPaDPS4g/3BHGi1UKSKyNXFURfqrgIW0uAtiCjqWlgMHH9yMGCW9Kog62lHdIFR73Z3RRBlXyvGxTOhklWaHr0bVGag4G/fIGOSgE4AdSR4ncEy56Wa+mMYu3Yx6pB/yIDJDa2vQ/8X/h+9MImw4gI3N4DZ+XbSGoEXjXVkIf+1GsHTTKtOdegNDJSyaBwm/W/7QRhiER2eSi8fm4FfPkN/mcL+sxI6kMu60VE0xrAq5ouD2U0jPBrnX3VjGNQNkcPY0fTiy9q91+mLQ+kcDGM5Tplv+Isc3YgAov6mCKL0UdAt2lWXl2ra5mzZ8oHQ/TuYc1EfeQ0exDtmL0fl0Lnsk2rRJS+37hapY1sqM+HBZ2Yctw2FnfQ/r+4IS4a8JnJLOLPK0TlE6TsS8Qq2x47Htwpqfzu89yMcZIYvAb4vp6YSa4h7JcqEOahowEdgRjIiERmxpJ2Qo6krzMSX80Ioa4BaJ6HA40KCQXRrzhWARf/21pAAAAGf4QA//WNSQmKvLv/bgNqX4QOBVKu/1ZKP92A/wvhpDevHmeM1Mcf+Rv+1kpseNcWxWrEbxngVavZCmOonQk0ycGB3n7f5sYJ/pfbQ94t9KmioZtlD/AV6/EVP5O8qRbEcgbD/Ph5xo3O0saPmKXO+u9Lpft33sUlNh9k49adVTvHLrXiy6Cc7zaeEXTqh6gqxAJ+ivOMTj3u5OIs9F70OM2h+MHxZvbj9IlWUVx+KqxrGjlY+QfMtC7Dkn5wcLlIW326HjwWifwk9SE9d9UbVFo5HAHsEi8Et2DcxGf7R3/r6rQ/yV87Z90xK5kcl/oWdwt5JwIqgAAAAAA";

/* ---------- format helpers ---------- */
const rupiah = (n) =>
  "Rp " + Math.round(Number(n) || 0).toLocaleString("id-ID");
const rupiahShort = (n) => {
  n = Number(n) || 0;
  const a = Math.abs(n);
  if (a >= 1e9) return (n / 1e9).toFixed(1).replace(".0", "") + " M";
  if (a >= 1e6) return (n / 1e6).toFixed(1).replace(".0", "") + " jt";
  if (a >= 1e3) return (n / 1e3).toFixed(0) + " rb";
  return String(n);
};
const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
const fmtDateInput = (d) => {
  const x = new Date(d);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(x.getDate()).padStart(2, "0")}`;
};
const monthKey = (iso) => {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};
const uid = (p) => p + Math.random().toString(36).slice(2, 9);
const gregDate = () =>
  new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
const hijriDate = () => {
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
const confirmAct = (m) => {
  try {
    return window.confirm(m) !== false;
  } catch (e) {
    return true;
  }
};
const notify = (m) => {
  try {
    window.alert(m);
  } catch (e) {
    /* ignore */
  }
};

/* ---------- refund helpers ----------
   Refund tetap mengubah kas sesuai tipe transaksi, tetapi laporan laba rugi
   memperlakukannya sebagai pengurang transaksi asal. */
const isRefundTx = (t) => !!t?.refundOfTxId;
const refundKind = (t, origin) => {
  if (!isRefundTx(t) || !origin) return null;
  if (t.type === "expense" && origin.type === "income") return "out";
  if (t.type === "income" && origin.type === "expense") return "in";
  return null;
};
const refundText = (kind) =>
  kind === "out" ? "Refund Keluar" : kind === "in" ? "Refund Masuk" : "Refund";
const txLabel = (t, ctById = {}, catById = {}, accById = {}) => {
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
const reportEffect = (t, txById = {}) => {
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

const textLower = (...parts) => parts.filter(Boolean).join(" ").toLowerCase();
const txText = (t, cat) =>
  textLower(cat?.name, t?.description, t?.reference, t?.method);
const isEquityCat = (cat) =>
  !!cat?.equity ||
  /setoran modal|modal disetor|tambahan modal/.test(cat?.name || "");
const isCarryoverExpense = (t, cat) =>
  !!cat?.carryover ||
  (t?.type === "expense" &&
    /pelunasan kewajiban|kewajiban 2025|hutang 2025|utang 2025|pajak 2025/.test(
      txText(t, cat)
    ));
const isFinancialIncome = (t, cat, origin) => {
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
const isBankTaxOrFinanceCost = (t, cat, origin) => {
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
const isDirectCost = (t, cat, origin) => {
  const source = origin || t;
  const txt = txText(source, cat);
  return (
    !!cat?.directCost ||
    /hotel|akomodasi|tiket|pesawat|visa|paspor|transport|bus|mutowif|muthowif|vaksin|meningitis|polio|raudhah|siskopatuh|manasik|perlengkapan|kereta cepat|handling|ground|paket|supplier|vendor/.test(
      txt
    )
  );
};
const isOperatingExpense = (t, cat, origin) => {
  const source = origin || t;
  const txt = txText(source, cat);
  return (
    !!cat?.operatingExpense ||
    /gaji|upah|salary|payroll|karyawan|staff|pegawai|honor|honorarium|thr|bonus karyawan|marketing|iklan|brosur|sewa kantor|operasional|atk|listrik|internet|pulsa|makan|parkir|bbm|admin kantor/.test(
      txt
    )
  );
};
const isPayrollExpense = (t, cat, origin) => {
  const source = origin || t;
  return /gaji|upah|salary|payroll|honor|honorarium|thr|bonus karyawan|tunjangan/i.test(
    txText(source, cat)
  );
};
const addAmount = (map, key, amount) => {
  const name = key || "Lainnya";
  map[name] = (map[name] || 0) + amount;
};

/* ---------- ownership meta ---------- */
const OWN = {
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
const ACCT_TYPE = { BANK: "Bank", CASH: "Kas", EWALLET: "E-Wallet" };

/* ============================================================
   PELAYANAN — definisi layanan & helper
   ============================================================ */
const SERVICES = [
  { id: "paspor", label: "Paspor", short: "Paspor", icon: BookOpen, lead: 60 },
  { id: "visa", label: "Visa", short: "Visa", icon: Stamp, lead: 14 },
  {
    id: "tiket",
    label: "Tiket Pesawat",
    short: "Tiket",
    icon: Plane,
    lead: 45,
  },
  {
    id: "hotel_mekkah",
    label: "Hotel Mekkah",
    short: "H.Mekkah",
    icon: Hotel,
    lead: 30,
  },
  {
    id: "hotel_madinah",
    label: "Hotel Madinah",
    short: "H.Madinah",
    icon: Hotel,
    lead: 30,
  },
  {
    id: "transport",
    label: "Transport / Bus",
    short: "Transport",
    icon: Bus,
    lead: 14,
  },
  { id: "mutowif", label: "Mutowif", short: "Mutowif", icon: Users, lead: 14 },
  {
    id: "vaksin",
    label: "Vaksin Meningitis",
    short: "V.Meningitis",
    icon: Syringe,
    lead: 21,
  },
  {
    id: "vaksin_polio",
    label: "Vaksin Polio",
    short: "V.Polio",
    icon: Syringe,
    lead: 21,
  },
  { id: "raudhah", label: "Raudhah", short: "Raudhah", icon: Star, lead: 7 },
  {
    id: "siskopatuh",
    label: "Siskopatuh",
    short: "Siskopatuh",
    icon: ShieldCheck,
    lead: 30,
  },
  {
    id: "manasik",
    label: "Manasik",
    short: "Manasik",
    icon: ClipboardList,
    lead: 14,
  },
  {
    id: "perlengkapan",
    label: "Perlengkapan",
    short: "Perlengkapan",
    icon: Package,
    lead: 14,
  },
  {
    id: "kereta_cepat",
    label: "Kereta Cepat",
    short: "Kereta Cepat",
    icon: Bus,
    lead: 14,
  },
];
const SVC_STATUS = ["Belum", "Proses", "Selesai", "N/A"];
const SVC_CLS = {
  Belum: "svc-belum",
  Proses: "svc-proses",
  Selesai: "svc-selesai",
  "N/A": "svc-na",
};
const PACKAGE_TYPES = ["Umroh", "Haji", "Tour", "Lainnya"];
// 9 transaksi 2026 yang sebenarnya kewajiban 2025 (6 hutang PT FLIP + 3 PPh Final): total Rp32.050.594
const CARRYOVER_AMOUNTS = [
  4435350, 722350, 3602325, 480327, 1275325, 13469392, 2030200, 5076495, 958830,
];
const PAY_STATUS = ["Belum", "DP", "Lunas"];

const daysUntil = (iso) => {
  if (!iso) return null;
  const d = new Date(iso);
  d.setHours(0, 0, 0, 0);
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return Math.round((d - t) / 864e5);
};
const countdownLabel = (iso) => {
  const n = daysUntil(iso);
  if (n === null) return "—";
  if (n > 1) return "H-" + n;
  if (n === 1) return "Besok";
  if (n === 0) return "Hari ini";
  return "Lewat " + Math.abs(n) + " hari";
};
const emptyServices = () =>
  Object.fromEntries(
    SERVICES.map((s) => [
      s.id,
      { status: "Belum", due: null, pic: "", note: "", link: "" },
    ])
  );
const serviceIds = () => SERVICES.map((s) => s.id);
const normalizeNeededServices = (needed) => {
  const valid = new Set(serviceIds());
  if (!Array.isArray(needed)) return serviceIds();
  const ids = needed.filter((id) => valid.has(id));
  if (ids.includes("vaksin") && !ids.includes("vaksin_polio"))
    ids.push("vaksin_polio");
  return Array.from(new Set(ids));
};
const neededIds = (g) => normalizeNeededServices(g?.needed);
const groupProgress = (g) => {
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
const serviceAlert = (g, sid) => {
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
const groupAlerts = (g) =>
  neededIds(g).filter((id) => serviceAlert(g, id)).length;
const groupFinance = (g, data) => {
  const tx = (data?.tx || []).filter((t) => t.groupId === g.id);
  const income = tx
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + (Number(t.amount) || 0), 0);
  const expense = tx
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + (Number(t.amount) || 0), 0);
  return {
    income,
    expense,
    profit: income - expense,
    count: tx.length,
  };
};
const groupTx = (g, data) =>
  [...(data?.tx || []).filter((t) => t.groupId === g.id)].sort(
    (a, b) => new Date(b.date || 0) - new Date(a.date || 0)
  );
const pickFirst = (items, test) => (items || []).find(test)?.id || "";
const defaultGroupAccount = (data) =>
  pickFirst(data?.accounts, (a) => a.ownership === "COMPANY") ||
  data?.accounts?.[0]?.id ||
  "";
const defaultIncomeCategory = (data) =>
  pickFirst(
    data?.categories,
    (c) =>
      c.kind === "income" &&
      /pelunasan|penjualan|paket|pendapatan/i.test(c.name || "")
  ) || pickFirst(data?.categories, (c) => c.kind === "income");
const defaultExpenseCategory = (data) =>
  pickFirst(
    data?.categories,
    (c) =>
      c.kind === "expense" &&
      !/biaya bank|admin|fee/i.test(c.name || "") &&
      /hotel|akomodasi|visa|tiket|operasional|pembelian|handling/i.test(
        c.name || ""
      )
  ) || pickFirst(data?.categories, (c) => c.kind === "expense");
const defaultAdminCategory = (data) =>
  pickFirst(
    data?.categories,
    (c) => c.kind === "expense" && /biaya bank|admin|fee/i.test(c.name || "")
  ) || defaultExpenseCategory(data);

function normalize(d) {
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

/* ============================================================
   SEED DATA
   ============================================================ */
function seed() {
  const accounts = [
    {
      id: "acc-bca",
      name: "BCA — PT HAB",
      type: "BANK",
      ownership: "COMPANY",
      number: "0123456789",
      bank: "BCA",
      initial: 185_000_000,
      color: "#11704f",
    },
    {
      id: "acc-mdr",
      name: "Mandiri — PT HAB",
      type: "BANK",
      ownership: "COMPANY",
      number: "1440099887",
      bank: "Mandiri",
      initial: 92_000_000,
      color: "#1f9d6b",
    },
    {
      id: "acc-kas",
      name: "Kas Kantor",
      type: "CASH",
      ownership: "COMPANY",
      number: "",
      bank: "",
      initial: 12_500_000,
      color: "#3b5b9a",
    },
    {
      id: "acc-pri",
      name: "BCA Pribadi Owner",
      type: "BANK",
      ownership: "PERSONAL_BUSINESS",
      number: "7788991122",
      bank: "BCA",
      initial: 30_000_000,
      color: "#c79a3e",
    },
    {
      id: "acc-dmp",
      name: "Dompet Pribadi",
      type: "EWALLET",
      ownership: "PERSONAL",
      number: "0812xxxx",
      bank: "GoPay",
      initial: 4_000_000,
      color: "#8a8578",
    },
  ];
  const categories = [
    { id: "ci-dp", name: "DP Paket", kind: "income", operatingRevenue: true },
    {
      id: "ci-pel",
      name: "Pelunasan Paket",
      kind: "income",
      operatingRevenue: true,
    },
    {
      id: "ci-tkt",
      name: "Penjualan Tiket",
      kind: "income",
      operatingRevenue: true,
    },
    { id: "ci-kom", name: "Komisi", kind: "income", operatingRevenue: true },
    {
      id: "ci-bank",
      name: "Pendapatan Keuangan",
      kind: "income",
      financialIncome: true,
    },
    { id: "ci-mod", name: "Setoran Modal", kind: "income", equity: true },
    {
      id: "ce-htl",
      name: "Hotel & Akomodasi",
      kind: "expense",
      directCost: true,
    },
    { id: "ce-psw", name: "Tiket Pesawat", kind: "expense", directCost: true },
    {
      id: "ce-trs",
      name: "Transport & Bus",
      kind: "expense",
      directCost: true,
    },
    {
      id: "ce-visa",
      name: "Visa & Dokumen",
      kind: "expense",
      directCost: true,
    },
    {
      id: "ce-vaksin",
      name: "Vaksin Jamaah",
      kind: "expense",
      directCost: true,
    },
    {
      id: "ce-manasik",
      name: "Manasik & Perlengkapan",
      kind: "expense",
      directCost: true,
    },
    {
      id: "ce-kereta",
      name: "Kereta Cepat",
      kind: "expense",
      directCost: true,
    },
    { id: "ce-mutowif", name: "Mutowif", kind: "expense", directCost: true },
    {
      id: "ce-gaj",
      name: "Gaji Karyawan",
      kind: "expense",
      operatingExpense: true,
    },
    {
      id: "ce-mkt",
      name: "Marketing",
      kind: "expense",
      operatingExpense: true,
    },
    {
      id: "ce-swk",
      name: "Sewa Kantor",
      kind: "expense",
      operatingExpense: true,
    },
    {
      id: "ce-ops",
      name: "Operasional",
      kind: "expense",
      operatingExpense: true,
    },
    { id: "ce-bank", name: "Biaya Bank", kind: "expense", financeCost: true },
    {
      id: "ce-taxbank",
      name: "PPh Final Bank",
      kind: "expense",
      finalTax: true,
      financeCost: true,
    },
  ];
  const contacts = [
    {
      id: "ct-1",
      name: "H. Soleh & Keluarga",
      role: "CUSTOMER",
      phone: "0812-1111-2222",
    },
    {
      id: "ct-2",
      name: "Ibu Nurhayati",
      role: "CUSTOMER",
      phone: "0813-3333-4444",
    },
    {
      id: "ct-3",
      name: "Bp. Hendra (Rombongan)",
      role: "CUSTOMER",
      phone: "0856-5555-6666",
    },
    {
      id: "ct-v1",
      name: "Saudia Airlines (Agen)",
      role: "VENDOR",
      phone: "021-555-0001",
    },
    {
      id: "ct-v2",
      name: "Hotel Royal Makkah",
      role: "VENDOR",
      phone: "+966-12-000",
    },
    {
      id: "ct-v3",
      name: "PO Bus Pariwisata",
      role: "VENDOR",
      phone: "0821-7777-8888",
    },
  ];
  const products = [
    {
      id: "pk-1",
      name: "Umroh Reguler 9 Hari",
      type: "Umroh",
      price: 28_500_000,
      cost: 22_000_000,
    },
    {
      id: "pk-2",
      name: "Umroh Plus Turki 12 Hari",
      type: "Umroh",
      price: 39_900_000,
      cost: 31_000_000,
    },
    {
      id: "pk-3",
      name: "Haji Plus",
      type: "Haji",
      price: 165_000_000,
      cost: 140_000_000,
    },
    {
      id: "pk-4",
      name: "Tour Bali 4D3N",
      type: "Tour",
      price: 4_750_000,
      cost: 3_400_000,
    },
  ];

  const now = new Date();
  const tx = [];
  let n = 1;
  const accOwn = Object.fromEntries(accounts.map((a) => [a.id, a.ownership]));
  const add = (mAgo, day, type, amount, accountId, o = {}) => {
    const d = new Date(
      now.getFullYear(),
      now.getMonth() - mAgo,
      day,
      9 + (n % 8),
      0,
      0
    );
    tx.push({
      id: "tx" + n++,
      type,
      date: d.toISOString(),
      amount,
      accountId,
      ownership: o.ownership || accOwn[accountId],
      categoryId: o.categoryId || null,
      contactId: o.contactId || null,
      productId: o.productId || null,
      toAccountId: o.toAccountId || null,
      fee: o.fee || 0,
      method: o.method || "Transfer",
      reference: o.reference || "",
      description: o.description || "",
      receivableId: o.receivableId || null,
      payableId: o.payableId || null,
    });
  };

  add(5, 4, "income", 28_500_124, "acc-bca", {
    categoryId: "ci-pel",
    contactId: "ct-1",
    productId: "pk-1",
    description: "Pelunasan Umroh Reguler",
    reference: "WS-HAJAR-00012",
  });
  add(5, 9, "expense", 22_000_000, "acc-bca", {
    categoryId: "ce-htl",
    contactId: "ct-v2",
    description: "DP Hotel Makkah grup Syawal",
  });
  add(5, 18, "income", 4_750_000, "acc-mdr", {
    categoryId: "ci-pel",
    contactId: "ct-2",
    productId: "pk-4",
    description: "Tour Bali keluarga",
  });
  add(5, 25, "expense", 8_500_000, "acc-bca", {
    categoryId: "ce-gaj",
    description: "Gaji karyawan",
  });
  add(4, 3, "income", 14_250_000, "acc-bca", {
    categoryId: "ci-dp",
    contactId: "ct-3",
    productId: "pk-2",
    description: "DP 50% Umroh Plus Turki",
  });
  add(4, 7, "income", 12_000_000, "acc-pri", {
    categoryId: "ci-dp",
    contactId: "ct-1",
    description: "DP masuk ke rek pribadi owner (dana bisnis)",
  });
  add(4, 12, "expense", 31_000_000, "acc-mdr", {
    categoryId: "ce-psw",
    contactId: "ct-v1",
    description: "Tiket pesawat grup",
  });
  add(4, 20, "expense", 6_000_000, "acc-bca", {
    categoryId: "ce-mkt",
    description: "Iklan Meta & cetak brosur",
  });
  add(4, 28, "expense", 8_500_000, "acc-bca", {
    categoryId: "ce-gaj",
    description: "Gaji karyawan",
  });
  add(3, 2, "income", 39_900_222, "acc-bca", {
    categoryId: "ci-pel",
    contactId: "ct-3",
    productId: "pk-2",
    description: "Pelunasan Umroh Plus Turki",
    reference: "WS-HAJAR-00021",
  });
  add(3, 6, "income", 8_900_000, "acc-pri", {
    categoryId: "ci-pel",
    contactId: "ct-2",
    description: "Pelunasan masuk rek pribadi (dana bisnis)",
  });
  add(3, 10, "transfer", 15_000_000, "acc-pri", {
    toAccountId: "acc-bca",
    description: "Pindah dana bisnis dari rek pribadi ke PT",
  });
  add(3, 15, "expense", 5_000_000, "acc-kas", {
    categoryId: "ce-trs",
    contactId: "ct-v3",
    description: "Sewa bus city tour",
  });
  add(3, 22, "expense", 8_500_000, "acc-bca", {
    categoryId: "ce-gaj",
    description: "Gaji karyawan",
  });
  add(3, 27, "expense", 4_200_000, "acc-bca", {
    categoryId: "ce-swk",
    description: "Sewa kantor",
  });
  add(2, 5, "income", 28_500_341, "acc-bca", {
    categoryId: "ci-pel",
    contactId: "ct-1",
    productId: "pk-1",
    description: "Pelunasan Umroh Reguler",
    reference: "WS-HAJAR-00034",
  });
  add(2, 9, "income", 3_200_000, "acc-mdr", {
    categoryId: "ci-tkt",
    description: "Penjualan tiket domestik",
  });
  add(2, 14, "expense", 2_300_000, "acc-bca", {
    categoryId: "ce-ops",
    description: "ATK & operasional kantor",
  });
  add(2, 19, "income", 5_500_000, "acc-pri", {
    categoryId: "ci-dp",
    contactId: "ct-3",
    description: "DP masuk rek pribadi (dana bisnis)",
  });
  add(2, 25, "expense", 8_500_000, "acc-bca", {
    categoryId: "ce-gaj",
    description: "Gaji karyawan",
  });
  add(2, 26, "expense", 185_000, "acc-bca", {
    categoryId: "ce-bank",
    description: "Biaya admin & transfer",
  });
  add(1, 4, "income", 14_250_000, "acc-bca", {
    categoryId: "ci-dp",
    contactId: "ct-2",
    productId: "pk-2",
    description: "DP Umroh Plus Turki",
  });
  add(1, 8, "expense", 22_000_000, "acc-mdr", {
    categoryId: "ce-htl",
    contactId: "ct-v2",
    description: "Pelunasan hotel grup",
  });
  add(1, 13, "income", 4_750_000, "acc-bca", {
    categoryId: "ci-pel",
    contactId: "ct-1",
    productId: "pk-4",
    description: "Tour Bali",
  });
  add(1, 21, "expense", 8_500_000, "acc-bca", {
    categoryId: "ce-gaj",
    description: "Gaji karyawan",
  });
  add(1, 27, "expense", 4_200_000, "acc-bca", {
    categoryId: "ce-swk",
    description: "Sewa kantor",
  });
  add(0, 2, "income", 28_500_512, "acc-bca", {
    categoryId: "ci-pel",
    contactId: "ct-3",
    productId: "pk-1",
    description: "Pelunasan Umroh Reguler",
    reference: "WS-HAJAR-00041",
  });
  add(0, 5, "income", 7_400_000, "acc-pri", {
    categoryId: "ci-dp",
    contactId: "ct-1",
    description: "DP masuk rek pribadi (dana bisnis)",
  });
  add(0, 6, "expense", 1_750_000, "acc-bca", {
    categoryId: "ce-mkt",
    description: "Iklan & promosi",
  });
  add(0, 8, "income", 2_900_000, "acc-mdr", {
    categoryId: "ci-tkt",
    description: "Penjualan tiket",
  });

  const receivables = [
    {
      id: "rc-1",
      contactId: "ct-3",
      productId: "pk-2",
      total: 39_900_000,
      paid: 14_250_000,
      dueDate: new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 5
      ).toISOString(),
      description: "DP 50% — sisa pelunasan Umroh Plus Turki",
      createdAt: now.toISOString(),
    },
    {
      id: "rc-2",
      contactId: "ct-2",
      productId: "pk-2",
      total: 39_900_000,
      paid: 14_250_000,
      dueDate: new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 3
      ).toISOString(),
      description: "Cicilan ke-2 Umroh Plus Turki",
      createdAt: now.toISOString(),
    },
  ];
  const payables = [
    {
      id: "py-1",
      contactId: "ct-v1",
      total: 62_000_000,
      paid: 31_000_000,
      dueDate: new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 9
      ).toISOString(),
      description: "Sisa tiket pesawat grup Syawal",
      createdAt: now.toISOString(),
    },
  ];

  // ── data operasional contoh (rombongan + jamaah) ──
  const dISO = (addDays) => {
    const d = new Date(now);
    d.setDate(d.getDate() + addDays);
    return d.toISOString();
  };
  const svc = (status, dueAdd, pic, note) => ({
    status,
    due: dueAdd != null ? dISO(dueAdd) : null,
    pic: pic || "",
    note: note || "",
    link: "",
  });
  const groups = [
    {
      id: "grp-yura",
      name: "Yura Eropa",
      packageType: "Umroh",
      departDate: dISO(9),
      returnDate: dISO(16),
      pax: 5,
      muthawif: "Ust. Fauzan",
      driveLink:
        "https://drive.google.com/drive/folders/115uoDl9IrO03EjKJZgw35Cw99SwHI3iN",
      notes: "Umroh Plus Turki",
      services: {
        ...emptyServices(),
        paspor: svc("Selesai"),
        visa: svc("Selesai"),
        tiket: svc("Selesai"),
        hotel_mekkah: svc("Selesai"),
        hotel_madinah: svc("Proses", 4, "Admin", "Tunggu konfirmasi Emaar"),
        transport: svc("Proses", 5),
        mutowif: svc("Selesai"),
        vaksin: svc("Belum", 3, "Admin"),
        raudhah: svc("Proses", 2, "Admin", "Slot Raudhah"),
        siskopatuh: svc("Selesai"),
        manasik: svc("Belum", 4),
        perlengkapan: svc("Proses", 5),
      },
    },
    {
      id: "grp-hendri",
      name: "Hendri Tamara",
      packageType: "Umroh",
      departDate: dISO(11),
      returnDate: dISO(17),
      pax: 2,
      muthawif: "Ust. Salim",
      driveLink: "",
      notes: "",
      services: {
        ...emptyServices(),
        paspor: svc("Selesai"),
        visa: svc("Proses", -1, "Admin", "Tunggu terbit"),
        tiket: svc("Selesai"),
        hotel_mekkah: svc("Proses", 3),
        vaksin: svc("Belum", -2, "Admin"),
        siskopatuh: svc("Proses", 4),
      },
    },
    {
      id: "grp-niken",
      name: "Niken Rombongan",
      packageType: "Umroh",
      departDate: dISO(40),
      returnDate: dISO(49),
      pax: 2,
      muthawif: "",
      driveLink: "",
      notes: "Pasih panjang",
      services: {
        ...emptyServices(),
        paspor: svc("Selesai"),
        visa: svc("Proses", 25),
        vaksin: svc("Belum", 28),
      },
    },
  ];
  const jamaah = [
    {
      id: "jm-1",
      name: "H. Soleh Maulana",
      gender: "L",
      nik: "3273010101800001",
      passportNo: "C1234567",
      passportExpiry: dISO(420),
      birthDate: "1980-01-01",
      birthPlace: "Bandung",
      phone: "0812-1111-2222",
      address: "Jl. Merdeka, Bandung",
      groupId: "grp-yura",
      paymentStatus: "Lunas",
      notes: "",
    },
    {
      id: "jm-2",
      name: "Hj. Aminah Soleh",
      gender: "P",
      nik: "3273010101850002",
      passportNo: "C7654321",
      passportExpiry: dISO(120),
      birthDate: "1985-05-05",
      birthPlace: "Bandung",
      phone: "0813-3333-4444",
      address: "Jl. Merdeka, Bandung",
      groupId: "grp-yura",
      paymentStatus: "Lunas",
      notes: "Paspor < 6 bulan",
    },
    {
      id: "jm-3",
      name: "Hendri Tamara",
      gender: "L",
      nik: "3273010101900003",
      passportNo: "C1112223",
      passportExpiry: dISO(25),
      birthDate: "1990-09-09",
      birthPlace: "Jakarta",
      phone: "0856-5555-6666",
      address: "Jakarta Selatan",
      groupId: "grp-hendri",
      paymentStatus: "DP",
      notes: "Paspor hampir kedaluwarsa!",
    },
  ];

  return {
    company: {
      name: "PT Hajar Aswad Barokah",
      field: "Travel Umroh, Haji & Tour",
      owner: "Owner",
    },
    accounts,
    categories,
    contacts,
    products,
    tx,
    receivables,
    payables,
    groups,
    jamaah,
  };
}

/* ============================================================
   STORAGE (Supabase) — diperbaiki
   ============================================================ */
async function loadData() {
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
async function saveData(d) {
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

/* ============================================================
   SMALL UI PRIMITIVES
   ============================================================ */
function Modal({ title, sub, onClose, children, wide }) {
  return (
    <div className="overlay" onMouseDown={onClose}>
      <div
        className={"modal" + (wide ? " modal-wide" : "")}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modal-head">
          <div>
            <h3>{title}</h3>
            {sub && <p className="muted sm">{sub}</p>}
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
function Field({ label, children, hint }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {children}
      {hint && <span className="field-hint">{hint}</span>}
    </label>
  );
}
function CurrencyInput({ value, onChange, placeholder }) {
  const [str, setStr] = useState(
    value ? Number(value).toLocaleString("id-ID") : ""
  );
  useEffect(() => {
    setStr(value ? Number(value).toLocaleString("id-ID") : "");
  }, [value]);
  return (
    <div className="cur-wrap">
      <span className="cur-prefix">Rp</span>
      <input
        className="input cur-input mono"
        inputMode="numeric"
        placeholder={placeholder || "0"}
        value={str}
        onChange={(e) => {
          const raw = e.target.value.replace(/[^\d]/g, "");
          setStr(raw ? Number(raw).toLocaleString("id-ID") : "");
          onChange(raw ? Number(raw) : 0);
        }}
      />
    </div>
  );
}
function Badge({ ownership }) {
  const o = OWN[ownership];
  if (!o) return null;
  const I = o.icon;
  return (
    <span className={"badge " + o.cls}>
      <I size={11} />
      {o.short}
    </span>
  );
}
function TypePill({ type, refund }) {
  const m = {
    income: ["pill-in", "Masuk", ArrowDownLeft],
    expense: ["pill-out", "Keluar", ArrowUpRight],
    transfer: ["pill-tr", "Transfer", Repeat],
  };
  const [cls, lbl, I] = m[type];
  return (
    <span className="pill-stack">
      <span className={"pill " + cls}>
        <I size={11} />
        {lbl}
      </span>
      {refund && <span className="pill pill-refund">Refund</span>}
    </span>
  );
}
function SyncBadge({ status }) {
  const map = {
    saving: ["sync-saving", "Menyimpan…", Cloud],
    saved: ["sync-saved", "Tersimpan", Check],
    error: ["sync-error", "Gagal simpan", CloudOff],
  };
  const [cls, lbl, I] = map[status] || map.saved;
  return (
    <span className={"sync " + cls}>
      <I size={13} />
      {lbl}
    </span>
  );
}

/* ============================================================
   MAIN APP
   ============================================================ */
/* ============================================================
   AUTH GATE — login Supabase
   ============================================================ */
export default function App() {
  const [session, setSession] = useState(undefined); // undefined = belum dicek

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) =>
      setSession(s)
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  if (session === undefined) {
    return (
      <div className="app loading-screen">
        <style>{CSS}</style>
        <img className="load-logo" src={LOGO_GOLD} alt="" />
        <div className="spinner" />
        <p className="muted">Memeriksa sesi…</p>
      </div>
    );
  }
  if (!session) return <Login />;
  return <FinanceApp session={session} />;
}

function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setErr("");
    if (!email.trim() || !pass) {
      setErr("Email dan password wajib diisi.");
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: pass,
      });
      if (error) {
        setErr(
          error.message === "Invalid login credentials"
            ? "Email atau password salah."
            : error.message
        );
      }
    } catch (error) {
      setErr(error?.message || "Login gagal. Periksa koneksi internet.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login-wrap">
      <style>{CSS}</style>
      <form className="login-card" onSubmit={submit}>
        <div className="login-brand">
          <div className="login-logo-badge">
            <img src={LOGO_GOLD} alt="Hajar Aswad Barokah" />
          </div>
          <div className="login-title">Hajar Aswad Barokah</div>
          <div className="muted sm" style={{ textAlign: "center" }}>
            Finance Suite — masuk untuk mengakses keuangan PT
          </div>
        </div>
        <Field label="Email">
          <div className="cur-wrap">
            <span className="cur-prefix">
              <Mail size={14} />
            </span>
            <input
              className="input cur-input"
              type="email"
              value={email}
              autoComplete="username"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="owner@hajaraswad.com"
            />
          </div>
        </Field>
        <Field label="Password">
          <div className="cur-wrap">
            <span className="cur-prefix">
              <Lock size={14} />
            </span>
            <input
              className="input cur-input"
              type="password"
              value={pass}
              autoComplete="current-password"
              onChange={(e) => setPass(e.target.value)}
              placeholder="••••••••"
            />
          </div>
        </Field>
        {err && (
          <div className="login-err">
            <AlertTriangle size={14} /> {err}
          </div>
        )}
        <button
          className="btn btn-primary lg"
          type="submit"
          disabled={busy}
          style={{ justifyContent: "center" }}
        >
          {busy ? "Memproses…" : "Masuk"}
        </button>
        <p
          className="muted xs"
          style={{ textAlign: "center", lineHeight: 1.5 }}
        >
          Akun dibuat oleh admin melalui dashboard Supabase. Tidak ada
          pendaftaran publik.
        </p>
      </form>
    </div>
  );
}

/* ============================================================
   FINANCE APP (hanya tampil setelah login)
   ============================================================ */
/* ============================================================
   ROLE / HAK AKSES (berdasarkan email login)
   ============================================================ */
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
const roleOf = (email) => {
  const clean = String(email || "")
    .toLowerCase()
    .trim();
  if (OWNER_EMAILS.has(clean)) return "owner";
  if (ADMIN_EMAILS.has(clean)) return "admin";
  return "admin";
};
const INITIAL_GOLD = [
  {
    id: "gld-1",
    date: "2025-10-16",
    brand: "UBS",
    gram: 3,
    buyTotal: 7415000,
    buyPerGram: 2471667,
    location: "UBS Bintaro",
  },
  {
    id: "gld-2",
    date: "2025-10-16",
    brand: "UBS",
    gram: 3,
    buyTotal: 7415000,
    buyPerGram: 2471667,
    location: "UBS Bintaro",
  },
  {
    id: "gld-3",
    date: "2025-10-25",
    brand: "Galeri 24",
    gram: 2,
    buyTotal: 4812375,
    buyPerGram: 2406188,
    location: "Galeri 24 Pameran Kelapa Gading",
  },
  {
    id: "gld-4",
    date: "2025-10-25",
    brand: "Galeri 24",
    gram: 2,
    buyTotal: 4812375,
    buyPerGram: 2406188,
    location: "Galeri 24 Pameran Kelapa Gading",
  },
  {
    id: "gld-5",
    date: "2025-10-25",
    brand: "Galeri 24",
    gram: 2,
    buyTotal: 4812375,
    buyPerGram: 2406188,
    location: "Galeri 24 Pameran Kelapa Gading",
  },
  {
    id: "gld-6",
    date: "2025-10-25",
    brand: "Galeri 24",
    gram: 2,
    buyTotal: 4812375,
    buyPerGram: 2406188,
    location: "Galeri 24 Pameran Kelapa Gading",
  },
  {
    id: "gld-7",
    date: "2025-10-25",
    brand: "Galeri 24",
    gram: 2,
    buyTotal: 4812375,
    buyPerGram: 2406188,
    location: "Galeri 24 Pameran Kelapa Gading",
  },
  {
    id: "gld-8",
    date: "2025-10-25",
    brand: "Galeri 24",
    gram: 2,
    buyTotal: 4812375,
    buyPerGram: 2406188,
    location: "Galeri 24 Pameran Kelapa Gading",
  },
  {
    id: "gld-9",
    date: "2025-10-25",
    brand: "Galeri 24",
    gram: 2,
    buyTotal: 4812375,
    buyPerGram: 2406188,
    location: "Galeri 24 Pameran Kelapa Gading",
  },
  {
    id: "gld-10",
    date: "2025-11-24",
    brand: "Galeri 24",
    gram: 25,
    buyTotal: 57976050,
    buyPerGram: 2319042,
    location: "Galeri 24 Ambasador",
  },
  {
    id: "gld-11",
    date: "2025-12-02",
    brand: "Galeri 24",
    gram: 50,
    buyTotal: 119568300,
    buyPerGram: 2391366,
    location: "Galeri 24 Ambasador",
  },
  {
    id: "gld-12",
    date: "2024-11-17",
    brand: "UBS",
    gram: 2,
    buyTotal: 2815000,
    buyPerGram: 1407500,
    location: "UBS Bintaro",
  },
  {
    id: "gld-13",
    date: "2022-09-20",
    brand: "Fine Gold",
    gram: 1,
    buyTotal: 960000,
    buyPerGram: 960000,
    location: "MB Ayu",
  },
  {
    id: "gld-14",
    date: "2025-12-04",
    brand: "UBS",
    gram: 50,
    buyTotal: 114495000,
    buyPerGram: 2289900,
    location: "UBS Bintaro",
  },
  {
    id: "gld-15",
    date: "2026-02-15",
    brand: "UBS",
    gram: 25,
    buyTotal: 69845000,
    buyPerGram: 2793800,
    location: "Pameran JCC",
  },
  {
    id: "gld-16",
    date: "2026-02-12",
    brand: "ANTAM",
    gram: 5,
    buyTotal: 13800000,
    buyPerGram: 2760000,
    location: "Mbak Irda",
  },
  {
    id: "gld-17",
    date: "2026-02-12",
    brand: "ANTAM",
    gram: 2,
    buyTotal: 5690000,
    buyPerGram: 2845000,
    location: "Mbak Irda",
  },
  {
    id: "gld-18",
    date: "2026-02-12",
    brand: "ANTAM",
    gram: 1,
    buyTotal: 2850000,
    buyPerGram: 2850000,
    location: "Mbak Irda",
  },
  {
    id: "gld-19",
    date: "2026-02-22",
    brand: "HRTA",
    gram: 2,
    buyTotal: 5056000,
    buyPerGram: 2528000,
    location: "HRTA Trans Bintaro",
  },
  {
    id: "gld-20",
    date: "2026-02-22",
    brand: "HRTA",
    gram: 2,
    buyTotal: 5056000,
    buyPerGram: 2528000,
    location: "HRTA Trans Bintaro",
  },
];
const FINANCE_VIEWS = [
  "dashboard",
  "transaksi",
  "rekening",
  "dana",
  "piutang",
  "kontak",
  "laporan",
  "pengaturan",
];
const OPS_VIEWS = ["keberangkatan", "pelayanan", "jamaah"];
const allowedViews = (role) =>
  role === "owner" ? [...FINANCE_VIEWS, ...OPS_VIEWS] : [...OPS_VIEWS];

function FinanceApp({ session }) {
  const role = roleOf(session?.user?.email);
  const allowed = allowedViews(role);
  const allowedKey = allowed.join("|");
  const isOwner = role === "owner";
  const [data, setData] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState(isOwner ? "dashboard" : "keberangkatan");
  const [ownFilter, setOwnFilter] = useState("ALL");
  const [sync, setSync] = useState("saved");
  const [undoStack, setUndoStack] = useState([]);
  const [undoOpen, setUndoOpen] = useState(false);
  const cloudReadyRef = useRef(false);
  const skipSave = useRef(true);
  const savingRef = useRef(false);
  const pendingRef = useRef(null);

  // modals
  const [txModal, setTxModal] = useState(null);
  const [dealModal, setDealModal] = useState(null);
  const [importModal, setImportModal] = useState(null);
  const [accModal, setAccModal] = useState(null);
  const [contactModal, setContactModal] = useState(null);
  const [arModal, setArModal] = useState(null);
  const [payModal, setPayModal] = useState(null);
  const [productModal, setProductModal] = useState(null);
  const [assetModal, setAssetModal] = useState(null);
  const [catModal, setCatModal] = useState(null);
  const [groupModal, setGroupModal] = useState(null);
  const [jamaahModal, setJamaahModal] = useState(null);
  const [bulkJamaahModal, setBulkJamaahModal] = useState(null);
  const [invoiceModal, setInvoiceModal] = useState(null);
  const [selGroup, setSelGroup] = useState(null);

  /* ---------- save queue (anti race-condition) ---------- */
  const flushSave = async () => {
    if (savingRef.current || pendingRef.current === null) return;
    savingRef.current = true;
    const d = pendingRef.current;
    pendingRef.current = null;
    setSync("saving");
    const ok = await saveData(d);
    savingRef.current = false;
    setSync(ok ? "saved" : "error");
    if (pendingRef.current !== null) flushSave(); // ada perubahan baru saat menyimpan
  };
  const queueSave = (d) => {
    if (!d) return;
    pendingRef.current = d;
    flushSave();
  };

  /* ---------- load sekali di awal ---------- */
  useEffect(() => {
    (async () => {
      const cloud = await loadData();
      if (cloud) {
        cloudReadyRef.current = true;
        setData(normalize(cloud));
      } else {
        cloudReadyRef.current = false;
        const s = seed();
        setData(s);
        setSync("error");
        console.warn(
          "Data cloud tidak ditemukan/terbaca. Seed hanya ditampilkan lokal dan tidak otomatis disimpan."
        );
      }
      setLoaded(true);
    })();
    // eslint-disable-next-line
  }, []);

  /* ---------- simpan saat data berubah (lewati render pertama) ---------- */
  useEffect(() => {
    if (!loaded) return;
    if (skipSave.current) {
      skipSave.current = false;
      return;
    }
    if (!cloudReadyRef.current) {
      setSync("error");
      console.warn(
        "Save dibatalkan: data cloud belum terbaca, supaya seed tidak menimpa data asli."
      );
      return;
    }
    queueSave(data);
    // eslint-disable-next-line
  }, [data, loaded]);

  const closeMenu = () => {
    try {
      document.body.classList.remove("menu-open");
    } catch (e) {}
  };
  const goView = (v) => {
    if (!allowed.includes(v)) return;
    setView(v);
    setSelGroup(null);
    closeMenu();
  };
  useEffect(() => {
    if (!allowed.includes(view)) setView(allowed[0]);
  }, [view, allowedKey]);

  /* ---------- derived ---------- */
  const accById = useMemo(
    () => Object.fromEntries((data?.accounts || []).map((a) => [a.id, a])),
    [data]
  );
  const catById = useMemo(
    () => Object.fromEntries((data?.categories || []).map((c) => [c.id, c])),
    [data]
  );
  const ctById = useMemo(
    () => Object.fromEntries((data?.contacts || []).map((c) => [c.id, c])),
    [data]
  );

  const balances = useMemo(() => {
    if (!data) return {};
    const b = {};
    data.accounts.forEach((a) => {
      b[a.id] = a.initial;
    });
    data.tx.forEach((t) => {
      if (t.type === "income")
        b[t.accountId] = (b[t.accountId] || 0) + t.amount;
      else if (t.type === "expense")
        b[t.accountId] = (b[t.accountId] || 0) - t.amount;
      else if (t.type === "transfer") {
        b[t.accountId] = (b[t.accountId] || 0) - t.amount - (t.fee || 0);
        if (t.toAccountId)
          b[t.toAccountId] = (b[t.toAccountId] || 0) + t.amount;
      }
    });
    return b;
  }, [data]);

  const filteredTx = useMemo(() => {
    if (!data) return [];
    const originalOrder = new Map((data.tx || []).map((t, i) => [t.id, i]));
    const timeOf = (t) => new Date(t.date || 0).getTime() || 0;
    let list = [...(data.tx || [])].sort((a, b) => {
      const byDate = timeOf(b) - timeOf(a);
      if (byDate !== 0) return byDate;
      return (originalOrder.get(b.id) ?? 0) - (originalOrder.get(a.id) ?? 0);
    });
    if (ownFilter === "PT")
      list = list.filter((t) => t.ownership === "COMPANY");
    else if (ownFilter === "PB")
      list = list.filter((t) => t.ownership === "PERSONAL_BUSINESS");
    else if (ownFilter === "BUSINESS")
      list = list.filter((t) => OWN[t.ownership]?.business);
    else if (ownFilter === "PERSONAL")
      list = list.filter((t) => t.ownership === "PERSONAL");
    return list;
  }, [data, ownFilter]);

  const metrics = useMemo(() => {
    if (!data) return {};
    const thisMonth = monthKey(new Date().toISOString());
    let totalSaldo = 0,
      saldoPT = 0,
      saldoPB = 0,
      saldoPri = 0;
    data.accounts.forEach((a) => {
      const bal = balances[a.id] || 0;
      totalSaldo += bal;
      if (a.ownership === "COMPANY") saldoPT += bal;
      else if (a.ownership === "PERSONAL_BUSINESS") saldoPB += bal;
      else saldoPri += bal;
    });
    const equityCats = new Set(
      (data.categories || []).filter((c) => c.equity).map((c) => c.id)
    );
    const carryCats = new Set(
      (data.categories || []).filter((c) => c.carryover).map((c) => c.id)
    );
    let incomeM = 0,
      expenseM = 0;
    const txById = Object.fromEntries((data.tx || []).map((t) => [t.id, t]));
    data.tx.forEach((t) => {
      if (monthKey(t.date) !== thisMonth) return;
      if (!OWN[t.ownership]?.business) return;
      const eff = reportEffect(t, txById);
      if (eff.revDelta && !equityCats.has(eff.revCatId))
        incomeM += eff.revDelta;
      if (eff.expDelta && !carryCats.has(eff.expCatId))
        expenseM += eff.expDelta;
    });
    const goldGram = (data.assets || []).reduce(
      (s, a) => s + (Number(a.gram) || 0),
      0
    );
    const goldModal = (data.assets || []).reduce(
      (s, a) => s + (Number(a.buyTotal) || 0),
      0
    );
    const goldValue = goldGram * (data.goldPrice?.perGram || 0);
    const piutang = data.receivables.reduce(
      (s, r) => s + Math.max(0, r.total - r.paid),
      0
    );
    const utang = data.payables.reduce(
      (s, p) => s + Math.max(0, p.total - p.paid),
      0
    );

    let danaPribadi = 0;
    const pbAccts = data.accounts
      .filter((a) => a.ownership === "PERSONAL_BUSINESS")
      .map((a) => a.id);
    const danaTx = [];
    data.tx.forEach((t) => {
      const inPB = pbAccts.includes(t.accountId);
      if (t.type === "income" && inPB && t.ownership !== "PERSONAL") {
        danaPribadi += t.amount;
        danaTx.push(t);
      } else if (t.type === "expense" && inPB && t.ownership !== "PERSONAL") {
        danaPribadi -= t.amount;
        danaTx.push(t);
      } else if (
        t.type === "transfer" &&
        pbAccts.includes(t.accountId) &&
        accById[t.toAccountId]?.ownership === "COMPANY"
      ) {
        danaPribadi -= t.amount;
        danaTx.push(t);
      }
    });
    return {
      totalSaldo,
      saldoPT,
      saldoPB,
      saldoPri,
      incomeM,
      expenseM,
      labaM: incomeM - expenseM,
      piutang,
      utang,
      danaPribadi,
      danaTx,
      goldGram,
      goldModal,
      goldValue,
    };
  }, [data, balances, accById]);

  const monthlySeries = useMemo(() => {
    if (!data) return [];
    const map = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
      map[k] = {
        key: k,
        label: d.toLocaleDateString("id-ID", { month: "short" }),
        masuk: 0,
        keluar: 0,
      };
    }
    data.tx.forEach((t) => {
      const k = monthKey(t.date);
      if (!map[k]) return;
      if (!OWN[t.ownership]?.business) return;
      if (isRefundTx(t)) return;
      if (t.type === "income") map[k].masuk += t.amount;
      else if (t.type === "expense") map[k].keluar += t.amount;
    });
    return Object.values(map);
  }, [data]);

  const expensePie = useMemo(() => {
    if (!data) return [];
    const thisMonth = monthKey(new Date().toISOString());
    const m = {};
    data.tx.forEach((t) => {
      if (t.type !== "expense" || monthKey(t.date) !== thisMonth) return;
      if (!OWN[t.ownership]?.business) return;
      if (isRefundTx(t)) return;
      const name = catById[t.categoryId]?.name || "Lainnya";
      m[name] = (m[name] || 0) + t.amount;
    });
    return Object.entries(m)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [data, catById]);

  /* ---------- mutations + undo ---------- */
  const rememberUndo = (label, before) => {
    if (!before) return;
    setUndoStack((stack) =>
      [
        {
          id: uid("undo"),
          label,
          at: new Date().toISOString(),
          data: structuredClone(before),
        },
        ...stack,
      ].slice(0, 20)
    );
  };
  const patch = (fn, label = "Perubahan data") => {
    if (!data) return;
    const before = structuredClone(data);
    const nd = structuredClone(data);
    fn(nd);
    rememberUndo(label, before);
    setData(nd);
  };
  const undoTo = (id) => {
    const entry = undoStack.find((x) => x.id === id) || undoStack[0];
    if (!entry || !data) return;
    if (!confirmAct("Undo: kembalikan data ke sebelum '" + entry.label + "'?"))
      return;
    const current = structuredClone(data);
    setData(structuredClone(entry.data));
    setUndoStack((stack) =>
      [
        {
          id: uid("undo"),
          label: "Batalkan undo",
          at: new Date().toISOString(),
          data: current,
        },
        ...stack.filter((x) => x.id !== entry.id),
      ].slice(0, 20)
    );
    setUndoOpen(false);
    notify("Undo berhasil.");
  };

  const saveTx = (input) =>
    patch(
      (d) => {
        const list = Array.isArray(input) ? input : [input];
        list.forEach((t) => {
          if (t.id) {
            const i = d.tx.findIndex((x) => x.id === t.id);
            if (i >= 0) d.tx[i] = t;
            else d.tx.push(t);
          } else {
            t.id = uid("tx");
            d.tx.push(t);
          }
          if (t.receivableId) {
            const r = d.receivables.find((x) => x.id === t.receivableId);
            if (r) r.paid = Math.min(r.total, (r.paid || 0) + t.amount);
          }
          if (t.payableId) {
            const p = d.payables.find((x) => x.id === t.payableId);
            if (p) p.paid = Math.min(p.total, (p.paid || 0) + t.amount);
          }
        });
      },
      Array.isArray(input)
        ? "Tambah transaksi + biaya admin"
        : input.id
        ? "Edit transaksi"
        : "Tambah transaksi"
    );
  const delTx = (id) =>
    patch((d) => {
      d.tx = d.tx.filter((x) => x.id !== id);
    }, "Hapus transaksi");
  const importTx = (list) =>
    patch((d) => {
      const seen = new Set(d.tx.map((t) => t.importKey).filter(Boolean));
      list.forEach((t) => {
        if (t.importKey && seen.has(t.importKey)) return;
        t.id = uid("tx");
        d.tx.push(t);
        seen.add(t.importKey);
      });
    }, "Import " + list.length + " transaksi");
  const saveDeal = (deal) =>
    patch((d) => {
      const dealId = uid("deal");
      const date = deal.date
        ? new Date(deal.date).toISOString()
        : new Date().toISOString();
      const label = deal.label || "";
      const push = (type, side, fallbackDesc) => {
        const amount = Math.round(Number(side.amount) || 0);
        if (amount <= 0 || !side.accountId) return;
        const acc = d.accounts.find((a) => a.id === side.accountId);
        d.tx.push({
          id: uid("tx"),
          type,
          date,
          amount,
          accountId: side.accountId,
          ownership: acc?.ownership || "COMPANY",
          categoryId: side.categoryId || null,
          contactId: side.contactId || null,
          productId: null,
          toAccountId: null,
          fee: 0,
          method: deal.method || "Transfer",
          reference: "",
          description: side.description || label || fallbackDesc,
          receivableId: null,
          payableId: null,
          refundOfTxId: null,
          groupId: null,
          dealId,
          dealLabel: label,
        });
      };
      push("income", deal.in, "Uang masuk" + (label ? " — " + label : ""));
      push("expense", deal.out, "Uang keluar" + (label ? " — " + label : ""));
      push("expense", deal.admin, "Biaya admin" + (label ? " — " + label : ""));
    }, "Tambah transaksi masuk+keluar");
  const saveAcc = (a) =>
    patch(
      (d) => {
        if (a.id && d.accounts.find((x) => x.id === a.id))
          d.accounts = d.accounts.map((x) => (x.id === a.id ? a : x));
        else {
          a.id = uid("acc");
          d.accounts.push(a);
        }
      },
      a.id ? "Edit rekening" : "Tambah rekening"
    );
  const delAcc = (id) =>
    patch((d) => {
      d.accounts = d.accounts.filter((x) => x.id !== id);
    }, "Hapus rekening");
  const saveContact = (c) =>
    patch(
      (d) => {
        if (c.id && d.contacts.find((x) => x.id === c.id))
          d.contacts = d.contacts.map((x) => (x.id === c.id ? c : x));
        else {
          c.id = uid("ct");
          d.contacts.push(c);
        }
      },
      c.id ? "Edit kontak" : "Tambah kontak"
    );
  const delContact = (id) =>
    patch((d) => {
      d.contacts = d.contacts.filter((x) => x.id !== id);
    }, "Hapus kontak");
  const saveCat = (c) =>
    patch(
      (d) => {
        if (c.id && d.categories.find((x) => x.id === c.id))
          d.categories = d.categories.map((x) =>
            x.id === c.id ? { ...x, ...c } : x
          );
        else {
          c.id = uid("cat");
          d.categories.push(c);
        }
      },
      c.id ? "Edit kategori" : "Tambah kategori"
    );
  const delCat = (id) =>
    patch((d) => {
      d.categories = d.categories.filter((x) => x.id !== id);
    }, "Hapus kategori");
  const saveAR = (r, kind) =>
    patch((d) => {
      const arr = kind === "rc" ? "receivables" : "payables";
      if (r.id && d[arr].find((x) => x.id === r.id))
        d[arr] = d[arr].map((x) => (x.id === r.id ? { ...x, ...r } : x));
      else {
        r.id = uid(kind === "rc" ? "rc" : "py");
        r.paid = r.paid || 0;
        d[arr].push(r);
      }
    });
  const delAR = (id, kind) =>
    patch((d) => {
      const arr = kind === "rc" ? "receivables" : "payables";
      d[arr] = d[arr].filter((x) => x.id !== id);
    });
  // quick add dari dalam form transaksi (id sudah dibuat di pemanggil)
  const quickAddContact = (c) =>
    patch((d) => {
      d.contacts.push(c);
    });
  const quickAddCat = (c) =>
    patch((d) => {
      d.categories.push(c);
    });
  const quickAddAcc = (a) =>
    patch((d) => {
      d.accounts.push(a);
    });
  const quickAddProduct = (p) =>
    patch((d) => {
      d.products.push(p);
    });
  const saveProduct = (p) =>
    patch((d) => {
      if (p.id && d.products.find((x) => x.id === p.id))
        d.products = d.products.map((x) =>
          x.id === p.id ? { ...x, ...p } : x
        );
      else {
        p.id = uid("pk");
        d.products.push(p);
      }
    });
  const delProduct = (id) =>
    patch((d) => {
      d.products = d.products.filter((x) => x.id !== id);
    });
  const saveAsset = (a) =>
    patch((d) => {
      d.assets = d.assets || [];
      if (a.id && d.assets.find((x) => x.id === a.id))
        d.assets = d.assets.map((x) => (x.id === a.id ? { ...x, ...a } : x));
      else {
        a.id = uid("gld");
        d.assets.push(a);
      }
    });
  const delAsset = (id) =>
    patch((d) => {
      d.assets = (d.assets || []).filter((x) => x.id !== id);
    });
  const setGoldPrice = (perGram) =>
    patch((d) => {
      d.goldPrice = {
        perGram: Number(perGram) || 0,
        updatedAt: new Date().toISOString(),
      };
    }, "Ubah harga emas");
  const updateCompany = (changes) =>
    patch((d) => {
      d.company = { ...d.company, ...changes };
    }, "Ubah profil perusahaan");
  const loadInitialGold = () =>
    patch((d) => {
      d.assets = INITIAL_GOLD.map((g) => ({ ...g }));
    });
  const runSetupKoreksi = (ob) => {
    const matches = data.tx.filter(
      (t) =>
        t.type === "expense" && CARRYOVER_AMOUNTS.includes(Math.round(t.amount))
    );
    const total = matches.reduce((s, t) => s + t.amount, 0);
    patch((d) => {
      d.openingBalance = { ...ob, setupAt: new Date().toISOString() };
      let cat = (d.categories || []).find((c) => c.carryover);
      if (!cat) {
        cat = {
          id: "cx-carry25",
          name: "Pelunasan Kewajiban 2025",
          kind: "expense",
          carryover: true,
        };
        d.categories.push(cat);
      }
      d.tx = d.tx.map((t) =>
        t.type === "expense" && CARRYOVER_AMOUNTS.includes(Math.round(t.amount))
          ? { ...t, categoryId: cat.id }
          : t
      );
    });
    notify(
      "Setup koreksi selesai — " +
        matches.length +
        " transaksi ditandai 'Pelunasan Kewajiban 2025' (Rp" +
        Math.round(total).toLocaleString("id-ID") +
        "). Laba Rugi otomatis terkoreksi."
    );
  };
  const saveGroup = (g) =>
    patch(
      (d) => {
        const txDraft = g.__txDraft || {};
        const group = { ...g };
        delete group.__txDraft;

        if (group.id && d.groups.find((x) => x.id === group.id))
          d.groups = d.groups.map((x) => (x.id === group.id ? group : x));
        else {
          group.id = uid("grp");
          group.services = group.services || emptyServices();
          d.groups.push(group);
        }

        const groupId = group.id;
        const groupName = group.name || "Rombongan";
        const txDate = txDraft.date
          ? new Date(txDraft.date).toISOString()
          : new Date().toISOString();
        const accountId = txDraft.accountId || defaultGroupAccount(d);
        const ownership =
          d.accounts.find((a) => a.id === accountId)?.ownership || "COMPANY";
        const addGroupTx = (type, amount, extra = {}) => {
          amount = Math.round(Number(amount) || 0);
          if (amount <= 0 || !accountId) return;
          d.tx.push({
            id: uid("tx"),
            type,
            date: txDate,
            amount,
            accountId,
            ownership,
            categoryId: extra.categoryId || null,
            contactId: extra.contactId || null,
            productId: null,
            toAccountId: null,
            fee: 0,
            method: txDraft.method || "Transfer",
            reference: extra.reference || "",
            description: extra.description || "",
            receivableId: null,
            payableId: null,
            refundOfTxId: null,
            groupId,
          });
        };

        addGroupTx("income", txDraft.incomeAmount, {
          categoryId: txDraft.incomeCategoryId || defaultIncomeCategory(d),
          contactId: txDraft.incomeContactId || null,
          reference: txDraft.incomeReference || "",
          description:
            txDraft.incomeDescription ||
            "Pemasukan " +
              groupName +
              " (" +
              (group.packageType || "Paket") +
              ")",
        });
        addGroupTx("expense", txDraft.expenseAmount, {
          categoryId: txDraft.expenseCategoryId || defaultExpenseCategory(d),
          contactId: txDraft.expenseContactId || null,
          reference: txDraft.expenseReference || "",
          description:
            txDraft.expenseDescription ||
            "Pengeluaran " +
              groupName +
              " (" +
              (group.packageType || "Paket") +
              ")",
        });
        addGroupTx("expense", txDraft.adminAmount, {
          categoryId: txDraft.adminCategoryId || defaultAdminCategory(d),
          contactId: txDraft.expenseContactId || null,
          reference: txDraft.expenseReference || "",
          description:
            txDraft.adminDescription ||
            "Biaya admin " +
              groupName +
              " (" +
              (group.packageType || "Paket") +
              ")",
        });
      },
      g.id ? "Edit rombongan" : "Tambah rombongan"
    );
  const delGroup = (id) =>
    patch((d) => {
      d.groups = d.groups.filter((x) => x.id !== id);
      d.jamaah = d.jamaah.map((j) =>
        j.groupId === id ? { ...j, groupId: "" } : j
      );
    }, "Hapus rombongan");
  const setService = (groupId, sid, po) =>
    patch((d) => {
      const g = d.groups.find((x) => x.id === groupId);
      if (g) {
        g.services = g.services || emptyServices();
        g.services[sid] = {
          ...(g.services[sid] || {
            status: "Belum",
            due: null,
            pic: "",
            note: "",
            link: "",
          }),
          ...po,
        };
      }
    }, "Ubah pelayanan");
  const saveJamaah = (j) =>
    patch(
      (d) => {
        if (j.id && d.jamaah.find((x) => x.id === j.id))
          d.jamaah = d.jamaah.map((x) => (x.id === j.id ? j : x));
        else {
          j.id = uid("jm");
          d.jamaah.push(j);
        }
      },
      j.id ? "Edit jamaah" : "Tambah jamaah"
    );
  const importJamaah = (list) =>
    patch((d) => {
      list.forEach((j) => {
        j.id = uid("jm");
        d.jamaah.push(j);
      });
    }, "Import " + list.length + " jamaah");

  const delJamaah = (id) =>
    patch((d) => {
      d.jamaah = d.jamaah.filter((x) => x.id !== id);
    }, "Hapus jamaah");

  if (!loaded || !data) {
    return (
      <div className="app loading-screen">
        <style>{CSS}</style>
        <img className="load-logo" src={LOGO_GOLD} alt="" />
        <div className="spinner" />
        <p className="muted">Memuat data keuangan dari cloud…</p>
      </div>
    );
  }

  const NAV = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "transaksi", label: "Transaksi", icon: ArrowLeftRight },
    { id: "rekening", label: "Rekening", icon: Wallet },
    { id: "dana", label: "Dana di Rek Pribadi", icon: Star, hot: true },
    { id: "piutang", label: "Piutang & Utang", icon: HandCoins },
    { id: "kontak", label: "Kontak", icon: Users },
    { id: "laporan", label: "Laporan", icon: FileText },
    { id: "keberangkatan", label: "Keberangkatan", icon: Plane, hot: true },
    { id: "pelayanan", label: "Pelayanan", icon: ClipboardList },
    { id: "jamaah", label: "Jamaah", icon: Users },
    { id: "pengaturan", label: "Pengaturan", icon: Settings },
  ];
  const pageTitle = NAV.find((n) => n.id === view)?.label || "";

  return (
    <div className="app">
      <style>{CSS}</style>
      <div className="sidebar-overlay" onClick={closeMenu} />

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="brand">
          <img
            className="brand-logo-side"
            src={LOGO_GOLD}
            alt="Hajar Aswad Barokah"
          />
          <div>
            <div className="brand-name">Hajar Aswad</div>
            <div className="brand-sub">
              {isOwner ? "Finance Suite" : "Operasional Suite"}
            </div>
          </div>
        </div>
        <nav className="nav">
          {NAV.filter((n) => allowed.includes(n.id)).map((n) => {
            const I = n.icon;
            return (
              <button
                key={n.id}
                className={"nav-item" + (view === n.id ? " active" : "")}
                onClick={() => goView(n.id)}
              >
                <I size={17} />
                <span>{n.label}</span>
                {n.hot && <span className="nav-dot" />}
              </button>
            );
          })}
        </nav>
        <div className="side-foot">
          {isOwner && (
            <div className="side-card">
              <div className="muted xs">Total Saldo Keseluruhan</div>
              <div className="side-bal mono">{rupiah(metrics.totalSaldo)}</div>
            </div>
          )}
          <div className={"role-tag " + (isOwner ? "rt-owner" : "rt-admin")}>
            {isOwner ? "Owner · Akses Penuh" : "Admin · Operasional"}
          </div>
          <button
            className="signout-btn"
            onClick={() => supabase.auth.signOut()}
            title={session?.user?.email || "Keluar"}
          >
            <LogOut size={15} />{" "}
            {session?.user?.email ? "Keluar · " + session.user.email : "Keluar"}
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="main">
        <header className="topbar">
          <button
            className="mobile-toggle"
            onClick={() => {
              try {
                document.body.classList.toggle("menu-open");
              } catch (e) {}
            }}
          >
            <Menu size={22} />
          </button>
          <div className="topbar-title">
            <div className="muted sm">
              {data.company.name} · {data.company.field}
            </div>
            <h1>{pageTitle}</h1>
          </div>
          <div className="topbar-actions">
            <div className="undo-wrap">
              <button
                className="btn btn-out undo-main"
                disabled={!undoStack.length}
                onClick={() => setUndoOpen((v) => !v)}
                title={
                  undoStack.length
                    ? "Lihat riwayat undo"
                    : "Belum ada perubahan untuk di-undo"
                }
              >
                <RotateCcw size={15} /> Undo
                {undoStack.length ? (
                  <span className="undo-count">{undoStack.length}</span>
                ) : null}
              </button>
              {undoOpen && (
                <div className="undo-menu">
                  <div className="undo-head">
                    <div>
                      <b>Riwayat Undo</b>
                      <span>Maksimal 20 perubahan terakhir</span>
                    </div>
                    <button
                      className="icon-btn sm"
                      onClick={() => setUndoOpen(false)}
                    >
                      <X size={13} />
                    </button>
                  </div>
                  <button
                    className="undo-primary"
                    onClick={() => undoTo(undoStack[0]?.id)}
                  >
                    <RotateCcw size={14} /> Undo aksi terakhir
                  </button>
                  <div className="undo-list">
                    {undoStack.map((u) => (
                      <button
                        key={u.id}
                        className="undo-item"
                        onClick={() => undoTo(u.id)}
                      >
                        <span>{u.label}</span>
                        <small>
                          {new Date(u.at).toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </small>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <SyncBadge status={sync} />
            <div className="seg" title="Pilih sumber transaksi yang tampil di dashboard dan daftar transaksi">
              {[
                ["ALL", "Semua"],
                ["BUSINESS", "Bisnis"],
                ["PT", "PT"],
                ["PB", "Pribadi-Bisnis"],
                ["PERSONAL", "Pribadi"],
              ].map(([k, l]) => (
                <button
                  key={k}
                  className={ownFilter === k ? "seg-on" : ""}
                  onClick={() => setOwnFilter(k)}
                >
                  {l}
                </button>
              ))}
            </div>
            <button
              className="btn btn-out"
              onClick={() => setDealModal({})}
              title="Catat uang masuk dan uang keluar sekaligus"
            >
              <Repeat size={16} /> Masuk + Keluar
            </button>
            <button
              className="btn btn-primary"
              onClick={() => setTxModal({ type: "income" })}
            >
              <Plus size={16} /> Transaksi
            </button>
          </div>
        </header>

        <div className="content" key={view}>
          {view === "dashboard" && (
            <Dashboard
              {...{
                data,
                metrics,
                monthlySeries,
                expensePie,
                accById,
                ctById,
                filteredTx,
                setView: goView,
                setTxModal,
                setDealModal,
              }}
            />
          )}
          {view === "transaksi" && (
            <Transaksi
              {...{
                filteredTx,
                accById,
                catById,
                ctById,
                setTxModal,
                delTx,
                setImportModal,
                setDealModal,
              }}
            />
          )}
          {view === "rekening" && (
            <Rekening
              {...{
                data,
                balances,
                setAccModal,
                delAcc,
                setGoldPrice,
                setAssetModal,
                delAsset,
                loadInitialGold,
              }}
            />
          )}
          {view === "dana" && (
            <DanaPribadi {...{ data, metrics, accById, ctById, setTxModal }} />
          )}
          {view === "piutang" && (
            <PiutangUtang
              {...{ data, ctById, setArModal, setPayModal, delAR }}
            />
          )}
          {view === "kontak" && (
            <Kontak {...{ data, setContactModal, delContact }} />
          )}
          {view === "laporan" && (
            <Laporan {...{ data, balances, catById, ctById }} />
          )}
          {view === "keberangkatan" && (
            <Keberangkatan
              {...{
                data,
                setGroupModal,
                delGroup,
                selGroup,
                setSelGroup,
                setService,
                setJamaahModal,
                delJamaah,
                setTxModal,
                setInvoiceModal,
              }}
            />
          )}
          {view === "pelayanan" && (
            <Pelayanan
              {...{ data, setSelGroup, setView: goView, setService }}
            />
          )}
          {view === "jamaah" && (
            <JamaahView
              {...{
                data,
                setJamaahModal,
                delJamaah,
                setBulkJamaahModal,
                setInvoiceModal,
              }}
            />
          )}
          {view === "pengaturan" && (
            <Pengaturan
              {...{
                data,
                updateCompany,
                setCatModal,
                delCat,
                setProductModal,
                delProduct,
              }}
            />
          )}
        </div>
      </main>

      {/* MODALS */}
      {txModal && (
        <TxForm
          init={txModal}
          data={data}
          onClose={() => setTxModal(null)}
          onSave={(t) => {
            saveTx(t);
            setTxModal(null);
          }}
          onAddContact={quickAddContact}
          onAddCategory={quickAddCat}
          onAddAccount={quickAddAcc}
          onAddProduct={quickAddProduct}
          onDelete={
            txModal.id
              ? () => {
                  delTx(txModal.id);
                  setTxModal(null);
                }
              : null
          }
        />
      )}
      {dealModal && (
        <DealForm
          init={dealModal}
          data={data}
          onClose={() => setDealModal(null)}
          onSave={(deal) => {
            saveDeal(deal);
            setDealModal(null);
          }}
          onAddContact={quickAddContact}
          onAddCategory={quickAddCat}
        />
      )}
      {accModal && (
        <AccForm
          init={accModal}
          onClose={() => setAccModal(null)}
          onSave={(a) => {
            saveAcc(a);
            setAccModal(null);
          }}
        />
      )}
      {contactModal && (
        <ContactForm
          init={contactModal}
          onClose={() => setContactModal(null)}
          onSave={(c) => {
            saveContact(c);
            setContactModal(null);
          }}
        />
      )}
      {arModal && (
        <ARForm
          kind={arModal.kind}
          init={arModal.edit}
          data={data}
          onClose={() => setArModal(null)}
          onSave={(r) => {
            saveAR(r, arModal.kind);
            setArModal(null);
          }}
        />
      )}
      {payModal && (
        <PayForm
          rec={payModal.rec}
          kind={payModal.kind}
          data={data}
          ctById={ctById}
          onClose={() => setPayModal(null)}
          onSave={(t) => {
            saveTx(t);
            setPayModal(null);
          }}
        />
      )}
      {importModal && (
        <ImportMutasi
          data={data}
          onClose={() => setImportModal(null)}
          onImport={(list) => {
            importTx(list);
            setImportModal(null);
            notify("Berhasil import " + list.length + " transaksi.");
          }}
        />
      )}
      {groupModal && (
        <GroupForm
          init={groupModal}
          data={data}
          onAddCategory={quickAddCat}
          onAddContact={quickAddContact}
          onClose={() => setGroupModal(null)}
          onSave={(g) => {
            saveGroup(g);
            setGroupModal(null);
          }}
        />
      )}
      {jamaahModal && (
        <JamaahForm
          init={jamaahModal}
          data={data}
          onClose={() => setJamaahModal(null)}
          onSave={(j) => {
            saveJamaah(j);
            setJamaahModal(null);
          }}
        />
      )}
      {bulkJamaahModal && (
        <BulkJamaahImport
          init={bulkJamaahModal}
          data={data}
          onClose={() => setBulkJamaahModal(null)}
          onImport={(list) => {
            importJamaah(list);
            setBulkJamaahModal(null);
            notify("Berhasil menambah " + list.length + " jamaah.");
          }}
        />
      )}
      {invoiceModal && (
        <InvoiceModal
          jamaah={invoiceModal}
          data={data}
          onClose={() => setInvoiceModal(null)}
        />
      )}
      {catModal && (
        <CatForm
          init={catModal.edit}
          onClose={() => setCatModal(null)}
          onSave={(c) => {
            saveCat(c);
            setCatModal(null);
          }}
        />
      )}
      {productModal && (
        <ProductForm
          init={productModal.edit}
          onClose={() => setProductModal(null)}
          onSave={(p) => {
            saveProduct(p);
            setProductModal(null);
          }}
        />
      )}
      {assetModal && (
        <AssetForm
          init={assetModal.edit}
          onClose={() => setAssetModal(null)}
          onSave={(a) => {
            saveAsset(a);
            setAssetModal(null);
          }}
        />
      )}
    </div>
  );
}

/* ============================================================
   VIEW: DASHBOARD
   ============================================================ */
function Dashboard({
  data,
  metrics,
  monthlySeries,
  expensePie,
  accById,
  ctById,
  filteredTx,
  setView,
  setTxModal,
  setDealModal,
}) {
  const PIE_COLORS = [
    "#11704f",
    "#c79a3e",
    "#3b5b9a",
    "#c0492f",
    "#1f9d6b",
    "#8a8578",
    "#7b5ea7",
    "#d98032",
  ];
  const recent = filteredTx.slice(0, 7);
  const txById = Object.fromEntries(filteredTx.map((t) => [t.id, t]));
  const hour = new Date().getHours();
  const greet =
    hour < 11
      ? "Assalamualaikum, selamat pagi"
      : hour < 15
      ? "Assalamualaikum, selamat siang"
      : hour < 19
      ? "Assalamualaikum, selamat sore"
      : "Assalamualaikum, selamat malam";

  return (
    <div className="stack">
      <div className="greet">
        <span>
          🌙 {greet}, {data.company.owner}. Berikut ringkasan keuangan hari ini.
        </span>
        {(gregDate() || hijriDate()) && (
          <span className="greet-date">
            {[gregDate(), hijriDate()].filter(Boolean).join(" · ")}
          </span>
        )}
      </div>

      <div className="saldo-panel">
        <div className="saldo-box saldo-main">
          <div className="saldo-cap">
            <CircleDollarSign size={14} /> Saldo Gabungan
          </div>
          <div className="saldo-amt mono">{rupiah(metrics.totalSaldo)}</div>
          <div className="saldo-note">Semua rekening (PT + Pribadi)</div>
        </div>
        <div className="saldo-box saldo-pt">
          <div className="saldo-cap">
            <Building2 size={14} /> Saldo PT
          </div>
          <div className="saldo-amt mono">{rupiah(metrics.saldoPT)}</div>
          <div className="saldo-note">Rekening perusahaan saja</div>
        </div>
        <div className="saldo-box">
          <div className="saldo-cap">
            <Star size={14} /> Pribadi (Bisnis)
          </div>
          <div className="saldo-amt mono">{rupiah(metrics.saldoPB)}</div>
          <div className="saldo-note">Dana bisnis di rek pribadi</div>
        </div>
        <div className="saldo-box">
          <div className="saldo-cap">
            <User size={14} /> Pribadi Murni
          </div>
          <div className="saldo-amt mono">{rupiah(metrics.saldoPri)}</div>
          <div className="saldo-note">Bukan dana bisnis</div>
        </div>
      </div>

      <div className="kekayaan-strip">
        <div className="kk-box kk-total">
          <div className="kk-cap">💎 Total Kekayaan</div>
          <div className="kk-amt mono">
            {rupiah(metrics.totalSaldo + metrics.goldValue)}
          </div>
          <div className="kk-note">Saldo semua rekening + aset emas</div>
        </div>
        <div className="kk-box kk-gold" onClick={() => setView("asetemas")}>
          <div className="kk-cap">
            <Coins size={14} /> Aset Emas —{" "}
            {metrics.goldGram.toLocaleString("id-ID")} gram
          </div>
          <div className="kk-amt mono">{rupiah(metrics.goldValue)}</div>
          <div className="kk-note">
            {metrics.goldValue - metrics.goldModal >= 0 ? "Untung " : "Rugi "}
            {rupiah(Math.abs(metrics.goldValue - metrics.goldModal))} vs modal →
          </div>
        </div>
      </div>

      <div className="grid-3">
        <StatCard
          icon={TrendingUp}
          tone="green"
          label="Pemasukan Bulan Ini"
          value={rupiah(metrics.incomeM)}
        />
        <StatCard
          icon={TrendingDown}
          tone="red"
          label="Pengeluaran Bulan Ini"
          value={rupiah(metrics.expenseM)}
        />
        <StatCard
          icon={Coins}
          tone={metrics.labaM >= 0 ? "emerald" : "red"}
          label="Laba Bersih Bulan Ini"
          value={rupiah(metrics.labaM)}
        />
      </div>

      <div className="grid-3">
        <StatCard
          icon={HandCoins}
          tone="blue"
          label="Total Piutang Aktif"
          value={rupiah(metrics.piutang)}
          foot={`${
            data.receivables.filter((r) => r.total - r.paid > 0).length
          } tagihan customer`}
          onClick={() => setView("piutang")}
        />
        <StatCard
          icon={Banknote}
          tone="amber"
          label="Total Utang Aktif"
          value={rupiah(metrics.utang)}
          foot={`${
            data.payables.filter((p) => p.total - p.paid > 0).length
          } tagihan vendor`}
          onClick={() => setView("piutang")}
        />
        <StatCard
          icon={Star}
          tone="gold"
          label="Dana Bisnis di Rek Pribadi"
          value={rupiah(metrics.danaPribadi)}
          foot="Perlu dipindahkan ke rekening PT →"
          onClick={() => setView("dana")}
          highlight
        />
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-head">
            <h3>Arus Kas Bisnis — 6 Bulan</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart
              data={monthlySeries}
              margin={{ top: 10, right: 8, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="gIn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1f9d6b" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#1f9d6b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gOut" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c0492f" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#c0492f" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#ece7da"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12, fill: "#8a8578" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={rupiahShort}
                tick={{ fontSize: 11, fill: "#8a8578" }}
                axisLine={false}
                tickLine={false}
                width={52}
              />
              <Tooltip
                formatter={(v) => rupiah(v)}
                contentStyle={tooltipStyle}
              />
              <Area
                type="monotone"
                dataKey="masuk"
                name="Pemasukan"
                stroke="#1f9d6b"
                fill="url(#gIn)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="keluar"
                name="Pengeluaran"
                stroke="#c0492f"
                fill="url(#gOut)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-head">
            <h3>Pengeluaran per Kategori — Bulan Ini</h3>
          </div>
          {expensePie.length === 0 ? (
            <Empty text="Belum ada pengeluaran bulan ini" />
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={expensePie}
                  dataKey="value"
                  nameKey="name"
                  cx="42%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={82}
                  paddingAngle={2}
                >
                  {expensePie.map((e, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v) => rupiah(v)}
                  contentStyle={tooltipStyle}
                />
                <Legend
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                  iconType="circle"
                  wrapperStyle={{ fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <h3>Transaksi Terbaru</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              className="btn btn-out btn-xs"
              onClick={() => setDealModal({})}
            >
              <Repeat size={14} /> Masuk + Keluar
            </button>
            <button className="link" onClick={() => setView("transaksi")}>
              Lihat semua <ChevronRight size={14} />
            </button>
          </div>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Tipe</th>
                <th>Deskripsi</th>
                <th>Kontak</th>
                <th>Rekening</th>
                <th className="r">Nominal</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((t) => (
                <tr
                  key={t.id}
                  className="clickable"
                  onClick={() => setTxModal(t)}
                >
                  <td className="nowrap mono sm">{fmtDate(t.date)}</td>
                  <td>
                    <TypePill type={t.type} refund={isRefundTx(t)} />
                  </td>
                  <td>{t.description || <span className="muted">—</span>}</td>
                  <td className="sm">
                    {ctById[t.contactId]?.name || (
                      <span className="muted">—</span>
                    )}
                    {t.refundOfTxId && txById[t.refundOfTxId] && (
                      <div className="muted xs refund-ref">
                        Refund untuk:{" "}
                        {txById[t.refundOfTxId].description ||
                          txById[t.refundOfTxId].reference ||
                          fmtDate(txById[t.refundOfTxId].date)}
                      </div>
                    )}
                  </td>
                  <td className="sm">
                    {accById[t.accountId]?.name}
                    {t.type === "transfer" && t.toAccountId
                      ? ` → ${accById[t.toAccountId]?.name}`
                      : ""}
                  </td>
                  <td className={"r mono nowrap amt-" + t.type}>
                    {t.type === "expense"
                      ? "-"
                      : t.type === "income"
                      ? "+"
                      : ""}
                    {rupiah(t.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: I,
  label,
  value,
  foot,
  tone = "emerald",
  onClick,
  highlight,
}) {
  return (
    <div
      className={
        "card stat " +
        (highlight ? "stat-hot " : "") +
        (onClick ? "clickable" : "")
      }
      onClick={onClick}
    >
      <div className={"stat-icon tone-" + tone}>
        <I size={18} />
      </div>
      <div className="stat-label">{label}</div>
      <div className="stat-val mono">{value}</div>
      {foot && <div className="stat-foot">{foot}</div>}
    </div>
  );
}

/* ============================================================
   VIEW: TRANSAKSI
   ============================================================ */
function Transaksi({
  filteredTx,
  accById,
  catById,
  ctById,
  setTxModal,
  delTx,
  setImportModal,
  setDealModal,
}) {
  const [q, setQ] = useState("");
  const [typeF, setTypeF] = useState("all");
  const [catF, setCatF] = useState("all");
  const [sort, setSort] = useState({ key: "date", dir: "desc" });
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const fmtD = (x) =>
    x.getFullYear() +
    "-" +
    String(x.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(x.getDate()).padStart(2, "0");
  const setMonth = (off) => {
    const n = new Date();
    const d = new Date(n.getFullYear(), n.getMonth() + off, 1);
    setFrom(fmtD(new Date(d.getFullYear(), d.getMonth(), 1)));
    setTo(fmtD(new Date(d.getFullYear(), d.getMonth() + 1, 0)));
  };
  const setSortKey = (key) =>
    setSort((s) => ({
      key,
      dir: s.key === key && s.dir === "asc" ? "desc" : "asc",
    }));
  const sortMark = (key) =>
    sort.key === key ? (sort.dir === "asc" ? " ▲" : " ▼") : "";
  const sortButton = (key, label, align = "") => (
    <button className={"th-sort " + align} onClick={() => setSortKey(key)}>
      {label}
      <span>{sortMark(key)}</span>
    </button>
  );
  const categoryOptions = Object.entries(
    filteredTx.reduce((m, t) => {
      const k = t.categoryId || "__NONE__";
      m[k] = catById[t.categoryId]?.name || "Tanpa Kategori";
      return m;
    }, {})
  ).sort((a, b) => a[1].localeCompare(b[1], "id-ID"));
  const list = filteredTx
    .filter((t) => {
      if (typeF !== "all" && t.type !== typeF) return false;
      if (catF !== "all" && (t.categoryId || "__NONE__") !== catF) return false;
      if (from && t.date < from) return false;
      if (to && t.date > to + "T23:59:59") return false;
      if (!q) return true;
      const hay = `${t.description} ${ctById[t.contactId]?.name || ""} ${
        accById[t.accountId]?.name || ""
      } ${catById[t.categoryId]?.name || ""} ${t.reference}`.toLowerCase();
      return hay.includes(q.toLowerCase());
    })
    .sort((a, b) => {
      const val = (t) => {
        if (sort.key === "date") return new Date(t.date).getTime() || 0;
        if (sort.key === "type") {
          const order = { income: 1, expense: 2, transfer: 3 };
          return order[t.type] || 9;
        }
        if (sort.key === "description") return t.description || "";
        if (sort.key === "category") return catById[t.categoryId]?.name || "";
        if (sort.key === "contact") return ctById[t.contactId]?.name || "";
        if (sort.key === "account") return accById[t.accountId]?.name || "";
        if (sort.key === "ownership") return OWN[t.ownership]?.short || "";
        if (sort.key === "amount") return Number(t.amount) || 0;
        return "";
      };
      const av = val(a);
      const bv = val(b);
      const cmp =
        typeof av === "number" && typeof bv === "number"
          ? av - bv
          : String(av).localeCompare(String(bv), "id-ID");
      return sort.dir === "asc" ? cmp : -cmp;
    });
  const txById = Object.fromEntries(filteredTx.map((t) => [t.id, t]));
  const dealMap = {};
  filteredTx.forEach((t) => {
    if (!t.dealId) return;
    const m = (dealMap[t.dealId] = dealMap[t.dealId] || {
      income: 0,
      expense: 0,
    });
    if (t.type === "income") m.income += Number(t.amount) || 0;
    else if (t.type === "expense") m.expense += Number(t.amount) || 0;
  });
  const sumIn = list
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const sumOut = list
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);
  return (
    <div className="stack">
      <div className="toolbar">
        <div className="search">
          <Search size={15} />
          <input
            placeholder="Cari deskripsi, kontak, referensi…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="seg">
          {[
            ["all", "Semua"],
            ["income", "Masuk"],
            ["expense", "Keluar"],
            ["transfer", "Transfer"],
          ].map(([k, l]) => (
            <button
              key={k}
              className={typeF === k ? "seg-on" : ""}
              onClick={() => setTypeF(k)}
            >
              {l}
            </button>
          ))}
        </div>
        <div className="grow" />
        <button className="btn btn-primary" onClick={() => setImportModal({})}>
          <Download size={15} /> Import Mutasi
        </button>
        <button className="btn btn-out" onClick={() => setDealModal({})}>
          <Repeat size={15} /> Masuk + Keluar
        </button>
        <button
          className="btn btn-out"
          onClick={() => setTxModal({ type: "income" })}
        >
          <ArrowDownLeft size={15} /> Pemasukan
        </button>
        <button
          className="btn btn-out"
          onClick={() => setTxModal({ type: "expense" })}
        >
          <ArrowUpRight size={15} /> Pengeluaran
        </button>
        <button
          className="btn btn-out"
          onClick={() => setTxModal({ type: "transfer" })}
        >
          <Repeat size={15} /> Transfer
        </button>
      </div>
      <div className="txfilter">
        <span className="txf-label">
          <CalendarDays size={14} /> Periode
        </span>
        <input
          type="date"
          className="input"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
        <span className="muted sm">s/d</span>
        <input
          type="date"
          className="input"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
        <button className="btn btn-ghost btn-xs" onClick={() => setMonth(0)}>
          Bulan Ini
        </button>
        <button className="btn btn-ghost btn-xs" onClick={() => setMonth(-1)}>
          Bulan Lalu
        </button>
        {(from || to) && (
          <button
            className="btn btn-ghost btn-xs"
            onClick={() => {
              setFrom("");
              setTo("");
            }}
          >
            Reset
          </button>
        )}
        <select
          className="input txf-select"
          value={catF}
          onChange={(e) => setCatF(e.target.value)}
        >
          <option value="all">Semua Kategori</option>
          {categoryOptions.map(([id, name]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>
        {(catF !== "all" || sort.key !== "date" || sort.dir !== "desc") && (
          <button
            className="btn btn-ghost btn-xs"
            onClick={() => {
              setCatF("all");
              setSort({ key: "date", dir: "desc" });
            }}
          >
            Reset Urutan
          </button>
        )}
        <div className="grow" />
        <span className="txf-sum">
          {list.length} transaksi&nbsp;·&nbsp;
          <span className="amt-income">+{rupiah(sumIn)}</span>&nbsp;·&nbsp;
          <span className="amt-expense">−{rupiah(sumOut)}</span>
        </span>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>{sortButton("date", "Tanggal")}</th>
                <th>{sortButton("type", "Tipe")}</th>
                <th>{sortButton("description", "Deskripsi")}</th>
                <th>{sortButton("category", "Kategori")}</th>
                <th>{sortButton("contact", "Kontak")}</th>
                <th>{sortButton("account", "Rekening")}</th>
                <th>{sortButton("ownership", "Sumber Dana")}</th>
                <th className="r">
                  {sortButton("amount", "Nominal", "right")}
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {list.map((t) => (
                <tr key={t.id}>
                  <td className="nowrap mono sm">{fmtDate(t.date)}</td>
                  <td>
                    <TypePill type={t.type} refund={isRefundTx(t)} />
                  </td>
                  <td>
                    {t.description || <span className="muted">—</span>}
                    {t.reference && (
                      <div className="muted xs mono">{t.reference}</div>
                    )}
                    {t.dealId && dealMap[t.dealId] && (
                      <div className="muted xs refund-ref">
                        🔗{" "}
                        {t.type === "income"
                          ? "Pasangan keluar −" +
                            rupiah(dealMap[t.dealId].expense) +
                            " · Profit " +
                            rupiah(
                              dealMap[t.dealId].income -
                                dealMap[t.dealId].expense
                            )
                          : "Pasangan masuk +" +
                            rupiah(dealMap[t.dealId].income)}
                      </div>
                    )}
                    {t.refundOfTxId && txById[t.refundOfTxId] && (
                      <div className="muted xs refund-ref">
                        Refund untuk:{" "}
                        {txById[t.refundOfTxId].description ||
                          txById[t.refundOfTxId].reference ||
                          fmtDate(txById[t.refundOfTxId].date)}
                      </div>
                    )}
                  </td>
                  <td className="sm">
                    {catById[t.categoryId]?.name || (
                      <span className="muted">—</span>
                    )}
                  </td>
                  <td className="sm">
                    {ctById[t.contactId]?.name || (
                      <span className="muted">—</span>
                    )}
                  </td>
                  <td className="sm">
                    {accById[t.accountId]?.name}
                    {t.type === "transfer" && t.toAccountId
                      ? ` → ${accById[t.toAccountId]?.name}`
                      : ""}
                  </td>
                  <td>
                    <Badge ownership={t.ownership} />
                  </td>
                  <td className={"r mono nowrap amt-" + t.type}>
                    {t.type === "expense"
                      ? "-"
                      : t.type === "income"
                      ? "+"
                      : ""}
                    {rupiah(t.amount)}
                  </td>
                  <td className="actions">
                    <button
                      className="icon-btn sm"
                      onClick={() => setTxModal(t)}
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      className="icon-btn sm danger"
                      onClick={() => {
                        if (confirmAct("Hapus transaksi ini?")) delTx(t.id);
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr>
                  <td colSpan={9}>
                    <Empty text="Tidak ada transaksi yang cocok" />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   VIEW: REKENING
   ============================================================ */
function Rekening({
  data,
  balances,
  setAccModal,
  delAcc,
  setGoldPrice,
  setAssetModal,
  delAsset,
  loadInitialGold,
}) {
  const [tab, setTab] = useState("rekening");
  const groups = [
    ["COMPANY", "Rekening Perusahaan (PT)"],
    ["PERSONAL_BUSINESS", "Rekening Pribadi dipakai Bisnis"],
    ["PERSONAL", "Rekening Pribadi Murni"],
  ];
  return (
    <div className="stack">
      <div className="seg">
        <button
          className={tab === "rekening" ? "seg-on" : ""}
          onClick={() => setTab("rekening")}
        >
          Rekening & Kas
        </button>
        <button
          className={tab === "emas" ? "seg-on" : ""}
          onClick={() => setTab("emas")}
        >
          Aset Emas
        </button>
      </div>
      {tab === "emas" && (
        <AsetEmas
          {...{ data, setGoldPrice, setAssetModal, delAsset, loadInitialGold }}
        />
      )}
      {tab === "rekening" && (
        <>
          <div className="toolbar">
            <p className="muted">
              Saldo dihitung otomatis dari saldo awal + seluruh transaksi.
            </p>
            <div className="grow" />
            <button
              className="btn btn-primary"
              onClick={() =>
                setAccModal({
                  ownership: "COMPANY",
                  type: "BANK",
                  color: "#11704f",
                  initial: 0,
                })
              }
            >
              <Plus size={16} /> Tambah Rekening
            </button>
          </div>
          {groups.map(([own, title]) => {
            const accts = data.accounts.filter((a) => a.ownership === own);
            if (accts.length === 0) return null;
            const sub = accts.reduce((s, a) => s + (balances[a.id] || 0), 0);
            return (
              <div key={own} className="stack-sm">
                <div className="group-head">
                  <Badge ownership={own} />
                  <h3>{title}</h3>
                  <span className="muted">· Subtotal {rupiah(sub)}</span>
                </div>
                <div className="grid-3">
                  {accts.map((a) => (
                    <div
                      key={a.id}
                      className="acc-card"
                      style={{ "--accent": a.color }}
                    >
                      <div className="acc-top">
                        <span className="acc-type">
                          {ACCT_TYPE[a.type]}
                          {a.bank ? " · " + a.bank : ""}
                        </span>
                        <div className="actions">
                          <button
                            className="icon-btn sm"
                            onClick={() => setAccModal(a)}
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            className="icon-btn sm danger"
                            onClick={() => {
                              if (
                                confirmAct(
                                  "Hapus rekening? Transaksi terkait tetap ada."
                                )
                              )
                                delAcc(a.id);
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                      <div className="acc-name">{a.name}</div>
                      {a.number && (
                        <div className="acc-num mono">{a.number}</div>
                      )}
                      <div className="acc-bal mono">
                        {rupiah(balances[a.id] || 0)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

/* ============================================================
   VIEW: DANA DI REKENING PRIBADI
   ============================================================ */
function DanaPribadi({ data, metrics, accById, ctById, setTxModal }) {
  const pbAccts = data.accounts.filter(
    (a) => a.ownership === "PERSONAL_BUSINESS"
  );
  const ptDefault = data.accounts.find((a) => a.ownership === "COMPANY");
  const list = [...metrics.danaTx].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
  return (
    <div className="stack">
      <div className="hero-gold">
        <div>
          <div className="hero-label">
            <Star size={14} /> Dana Bisnis yang Masih di Rekening Pribadi
          </div>
          <div className="hero-val mono">{rupiah(metrics.danaPribadi)}</div>
          <p className="hero-sub">
            Ini uang hasil bisnis yang masuk ke rekening pribadi owner dan{" "}
            <b>belum dipindahkan</b> ke rekening PT. Tetap tercatat sebagai
            transaksi bisnis, namun terpisah agar laporan PT tetap bersih.
          </p>
        </div>
        {pbAccts[0] && ptDefault && metrics.danaPribadi > 0 && (
          <button
            className="btn btn-gold lg"
            onClick={() =>
              setTxModal({
                type: "transfer",
                accountId: pbAccts[0].id,
                toAccountId: ptDefault.id,
                amount: metrics.danaPribadi,
                ownership: "PERSONAL_BUSINESS",
                description:
                  "Pemindahan dana bisnis dari rekening pribadi ke rekening PT",
              })
            }
          >
            <Send size={17} /> Pindahkan ke Rekening PT
          </button>
        )}
      </div>

      <div className="grid-3">
        {pbAccts.map((a) => {
          const net = list
            .filter((t) => t.accountId === a.id)
            .reduce((s, t) => {
              if (t.type === "income") return s + t.amount;
              if (t.type === "expense") return s - t.amount;
              if (t.type === "transfer") return s - t.amount;
              return s;
            }, 0);
          return (
            <div key={a.id} className="card">
              <div className="muted sm">{a.name}</div>
              <div className="stat-val mono" style={{ color: "#c79a3e" }}>
                {rupiah(net)}
              </div>
              <div className="muted xs">
                dana bisnis tertahan di rekening ini
              </div>
            </div>
          );
        })}
      </div>

      <div className="card">
        <div className="card-head">
          <h3>Rincian Transaksi Bisnis di Rekening Pribadi</h3>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Tipe</th>
                <th>Deskripsi</th>
                <th>Dari/Untuk</th>
                <th>Rekening</th>
                <th className="r">Nominal</th>
              </tr>
            </thead>
            <tbody>
              {list.map((t) => (
                <tr
                  key={t.id}
                  className="clickable"
                  onClick={() => setTxModal(t)}
                >
                  <td className="nowrap mono sm">{fmtDate(t.date)}</td>
                  <td>
                    <TypePill type={t.type} refund={isRefundTx(t)} />
                  </td>
                  <td>{t.description}</td>
                  <td className="sm">
                    {ctById[t.contactId]?.name || (
                      <span className="muted">—</span>
                    )}
                  </td>
                  <td className="sm">
                    {accById[t.accountId]?.name}
                    {t.toAccountId ? ` → ${accById[t.toAccountId]?.name}` : ""}
                  </td>
                  <td className={"r mono nowrap amt-" + t.type}>
                    {t.type === "expense" || t.type === "transfer" ? "-" : "+"}
                    {rupiah(t.amount)}
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <Empty text="Belum ada dana bisnis di rekening pribadi" />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   VIEW: PIUTANG & UTANG
   ============================================================ */
function PiutangUtang({ data, ctById, setArModal, setPayModal, delAR }) {
  const [tab, setTab] = useState("piutang");
  const rows = tab === "piutang" ? data.receivables : data.payables;
  const kind = tab === "piutang" ? "rc" : "py";
  const status = (r) => {
    const rem = r.total - r.paid;
    if (rem <= 0) return ["Lunas", "st-paid"];
    const due = new Date(r.dueDate);
    if (due < new Date()) return ["Jatuh Tempo", "st-over"];
    if (r.paid > 0) return ["Sebagian", "st-part"];
    return ["Belum Bayar", "st-unpaid"];
  };
  return (
    <div className="stack">
      <div className="toolbar">
        <div className="seg">
          <button
            className={tab === "piutang" ? "seg-on" : ""}
            onClick={() => setTab("piutang")}
          >
            Piutang (Customer)
          </button>
          <button
            className={tab === "utang" ? "seg-on" : ""}
            onClick={() => setTab("utang")}
          >
            Utang (Vendor)
          </button>
        </div>
        <div className="grow" />
        <button
          className="btn btn-primary"
          onClick={() => setArModal({ kind })}
        >
          <Plus size={16} /> Tambah {tab === "piutang" ? "Piutang" : "Utang"}
        </button>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>{tab === "piutang" ? "Customer" : "Vendor"}</th>
                <th>Keterangan</th>
                <th className="r">Total</th>
                <th className="r">Dibayar</th>
                <th className="r">Sisa</th>
                <th>Jatuh Tempo</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const [lbl, cls] = status(r);
                const rem = r.total - r.paid;
                return (
                  <tr key={r.id}>
                    <td>{ctById[r.contactId]?.name || "—"}</td>
                    <td className="sm">{r.description}</td>
                    <td className="r mono sm">{rupiah(r.total)}</td>
                    <td className="r mono sm">{rupiah(r.paid)}</td>
                    <td className="r mono">
                      <b>{rupiah(rem)}</b>
                    </td>
                    <td className="sm nowrap">{fmtDate(r.dueDate)}</td>
                    <td>
                      <span className={"st " + cls}>{lbl}</span>
                    </td>
                    <td className="actions">
                      {rem > 0 && (
                        <button
                          className="btn btn-xs btn-out"
                          onClick={() => setPayModal({ rec: r, kind })}
                        >
                          Catat Bayar
                        </button>
                      )}
                      <button
                        className="btn btn-xs btn-ghost"
                        onClick={() => setArModal({ kind, edit: r })}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-xs btn-ghost danger"
                        onClick={() => {
                          if (
                            confirmAct(
                              "Hapus " +
                                (tab === "piutang" ? "piutang" : "utang") +
                                " ini?"
                            )
                          )
                            delAR(r.id, kind);
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={8}>
                    <Empty text={`Belum ada ${tab}`} />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   VIEW: KONTAK
   ============================================================ */
function Kontak({ data, setContactModal, delContact }) {
  return (
    <div className="stack">
      <div className="toolbar">
        <p className="muted">
          Customer (jamaah/wisatawan) dan Vendor (hotel, maskapai, transport).
        </p>
        <div className="grow" />
        <button
          className="btn btn-primary"
          onClick={() => setContactModal({ role: "CUSTOMER" })}
        >
          <Plus size={16} /> Tambah Kontak
        </button>
      </div>
      <div className="grid-3">
        {data.contacts.map((c) => (
          <div key={c.id} className="card contact-card">
            <div
              className={
                "contact-ava " +
                (c.role === "CUSTOMER" ? "ava-cust" : "ava-vend")
              }
            >
              {c.name.charAt(0)}
            </div>
            <div className="grow">
              <div className="contact-name">{c.name}</div>
              <div className="muted sm">
                {c.role === "CUSTOMER" ? "Customer" : "Vendor"}
                {c.phone ? " · " + c.phone : ""}
              </div>
            </div>
            <div className="actions">
              <button
                className="icon-btn sm"
                onClick={() => setContactModal(c)}
              >
                <Pencil size={14} />
              </button>
              <button
                className="icon-btn sm danger"
                onClick={() => {
                  if (confirmAct("Hapus kontak?")) delContact(c.id);
                }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   EXPORT UTILITIES
   ============================================================ */
function downloadCSV(rows, headers, fn) {
  const e = (v) => '"' + String(v ?? "").replace(/"/g, '""') + '"';
  const csv = [
    headers.map(e).join(","),
    ...rows.map((r) => r.map(e).join(",")),
  ].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const a = Object.assign(document.createElement("a"), {
    href: URL.createObjectURL(blob),
    download: fn + ".csv",
  });
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

async function downloadExcel(sheets, fn) {
  try {
    const XLSX = await import("xlsx");
    const wb = XLSX.utils.book_new();
    sheets.forEach(({ name, aoa }) =>
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(aoa), name)
    );
    XLSX.writeFile(wb, fn + ".xlsx");
  } catch {
    notify(
      "Tambah package 'xlsx' di dependencies CodeSandbox untuk export Excel. File CSV sudah bisa diunduh."
    );
  }
}

function ExportBar({ onCSV, onExcel }) {
  return (
    <div className="export-bar no-print">
      <span className="muted sm">Export:</span>
      <button className="btn btn-xs btn-out" onClick={onCSV}>
        <Download size={13} /> CSV
      </button>
      <button className="btn btn-xs btn-out" onClick={onExcel}>
        <Download size={13} /> Excel
      </button>
      <button className="btn btn-xs btn-out" onClick={() => window.print()}>
        <Printer size={13} /> Cetak
      </button>
    </div>
  );
}

/* ============================================================
   VIEW: LAPORAN — dengan 6 tab laporan lengkap
   ============================================================ */
function Laporan({ data, balances, catById, ctById }) {
  const [tab, setTab] = useState("labarugi");
  const [from, setFrom] = useState(() => {
    const d = new Date();
    return fmtDateInput(new Date(d.getFullYear(), d.getMonth(), 1));
  });
  const [to, setTo] = useState(() => fmtDateInput(new Date()));

  const TABS = [
    ["labarugi", "Laba Rugi", FileText],
    ["aruskas", "Arus Kas", TrendingUp],
    ["neraca", "Neraca", Scale],
    ["pajak", "Estimasi Pajak", Receipt],
    ["aging", "Aging AR/AP", HandCoins],
    ["paket", "Per Paket", Plane],
  ];

  return (
    <div className="stack">
      <div className="card" style={{ padding: "14px 18px" }}>
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            alignItems: "flex-end",
          }}
        >
          <Field label="Dari">
            <input
              type="date"
              className="input"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </Field>
          <Field label="Sampai">
            <input
              type="date"
              className="input"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </Field>
        </div>
      </div>
      <div className="tab-nav">
        {TABS.map(([k, l, I]) => (
          <button
            key={k}
            className={"tab-btn" + (tab === k ? " active" : "")}
            onClick={() => setTab(k)}
          >
            <I size={14} />
            {l}
          </button>
        ))}
      </div>
      {tab === "labarugi" && (
        <LaporanLabaRugi
          data={data}
          catById={catById}
          from={from}
          to={to}
          balances={balances}
        />
      )}
      {tab === "aruskas" && (
        <LaporanArusKas
          data={data}
          balances={balances}
          catById={catById}
          from={from}
          to={to}
        />
      )}
      {tab === "neraca" && (
        <LaporanNeraca data={data} balances={balances} to={to} />
      )}
      {tab === "pajak" && (
        <LaporanPajak data={data} catById={catById} from={from} to={to} />
      )}
      {tab === "aging" && <LaporanAging data={data} ctById={ctById} />}
      {tab === "paket" && <LaporanPerPaket data={data} />}
    </div>
  );
}

/* ── LABA RUGI ──────────────────────────────────────────────────────────── */
function LaporanLabaRugi({ data, catById, from, to, balances }) {
  const inRange = (iso) => {
    const d = new Date(iso);
    return d >= new Date(from) && d <= new Date(to + "T23:59:59");
  };
  const txAll = data.tx.filter(
    (t) => inRange(t.date) && OWN[t.ownership]?.business
  );
  const txById = Object.fromEntries((data.tx || []).map((t) => [t.id, t]));
  const carryTx = txAll.filter((t) =>
    isCarryoverExpense(t, catById[t.categoryId])
  );
  const carryTotal = carryTx.reduce((s, t) => s + t.amount, 0);
  const equityTx = txAll.filter(
    (t) => isEquityCat(catById[t.categoryId]) && t.type === "income"
  );
  const equityTotal = equityTx.reduce((s, t) => s + t.amount, 0);
  const revBusinessByCat = {},
    revFinanceByCat = {},
    directCostByCat = {},
    operatingExpenseByCat = {},
    expFinanceByCat = {},
    refundRevByCat = {},
    refundExpByCat = {};
  let revBusiness = 0,
    revFinance = 0,
    directCost = 0,
    operatingExpense = 0,
    expFinance = 0,
    refundRev = 0,
    refundExp = 0;
  txAll.forEach((t) => {
    const eff = reportEffect(t, txById);
    const revCat = catById[eff.revCatId];
    const expCat = catById[eff.expCatId];
    if (eff.revDelta && !isEquityCat(revCat)) {
      const origin = eff.origin || t;
      const k = revCat?.name || "Lainnya";
      if (isFinancialIncome(t, revCat, origin)) {
        revFinance += eff.revDelta;
        addAmount(revFinanceByCat, k, eff.revDelta);
      } else {
        revBusiness += eff.revDelta;
        addAmount(revBusinessByCat, k, eff.revDelta);
      }
      if (eff.revDelta < 0) {
        refundRev += Math.abs(eff.revDelta);
        refundRevByCat[k] = (refundRevByCat[k] || 0) + Math.abs(eff.revDelta);
      }
    }
    if (
      eff.expDelta &&
      !isCarryoverExpense(t, expCat) &&
      !isEquityCat(expCat)
    ) {
      const origin = eff.origin || t;
      const k = expCat?.name || "Lainnya";
      if (isBankTaxOrFinanceCost(t, expCat, origin)) {
        expFinance += eff.expDelta;
        addAmount(expFinanceByCat, k, eff.expDelta);
      } else if (isDirectCost(t, expCat, origin)) {
        directCost += eff.expDelta;
        addAmount(directCostByCat, k, eff.expDelta);
      } else {
        operatingExpense += eff.expDelta;
        addAmount(operatingExpenseByCat, k, eff.expDelta);
      }
      if (eff.expDelta < 0) {
        refundExp += Math.abs(eff.expDelta);
        refundExpByCat[k] = (refundExpByCat[k] || 0) + Math.abs(eff.expDelta);
      }
    }
  });
  const rev = revBusiness + revFinance;
  const exp = directCost + operatingExpense + expFinance;
  const labaKotor = revBusiness - directCost;
  const labaUsaha = labaKotor - operatingExpense;
  const laba = labaUsaha + revFinance - expFinance;
  const grossMargin = revBusiness > 0 ? (labaKotor / revBusiness) * 100 : 0;
  const operatingMargin = revBusiness > 0 ? (labaUsaha / revBusiness) * 100 : 0;

  const aoa = [
    ["PT " + data.company.name],
    ["LAPORAN LABA RUGI"],
    ["Periode: " + fmtDate(from) + " — " + fmtDate(to)],
    [],
    ["PENDAPATAN USAHA", ""],
    ...Object.entries(revBusinessByCat).map(([k, v]) => [k, Math.round(v)]),
    ["Total Pendapatan Usaha", Math.round(revBusiness)],
    ...(refundRev > 0
      ? [
          [],
          ["KOREKSI REFUND PENDAPATAN", ""],
          ...Object.entries(refundRevByCat).map(([k, v]) => [
            "Refund " + k,
            -Math.round(v),
          ]),
        ]
      : []),
    [],
    ["HPP / BIAYA LANGSUNG PAKET", ""],
    ...Object.entries(directCostByCat).map(([k, v]) => [k, Math.round(v)]),
    ["Total HPP / Biaya Langsung Paket", Math.round(directCost)],
    ["LABA KOTOR (" + grossMargin.toFixed(1) + "%)", Math.round(labaKotor)],
    [],
    ["BEBAN OPERASIONAL", ""],
    ...Object.entries(operatingExpenseByCat).map(([k, v]) => [
      k,
      Math.round(v),
    ]),
    ["Total Beban Operasional", Math.round(operatingExpense)],
    ["LABA USAHA (" + operatingMargin.toFixed(1) + "%)", Math.round(labaUsaha)],
    ...(revFinance !== 0
      ? [
          [],
          ["PENDAPATAN KEUANGAN / LAIN-LAIN", ""],
          ...Object.entries(revFinanceByCat).map(([k, v]) => [
            k,
            Math.round(v),
          ]),
          ["Total Pendapatan Keuangan / Lain-lain", Math.round(revFinance)],
        ]
      : []),
    ...(expFinance !== 0
      ? [
          [],
          ["BEBAN KEUANGAN / PAJAK FINAL", ""],
          ...Object.entries(expFinanceByCat).map(([k, v]) => [
            k,
            Math.round(v),
          ]),
          ["Total Beban Keuangan / Pajak Final", Math.round(expFinance)],
        ]
      : []),
    ...(refundExp > 0
      ? [
          [],
          ["KOREKSI REFUND BEBAN", ""],
          ...Object.entries(refundExpByCat).map(([k, v]) => [
            "Refund " + k,
            Math.round(v),
          ]),
        ]
      : []),
    [],
    ["Total Pendapatan", Math.round(rev)],
    ["Total Beban", Math.round(exp)],
    ["LABA / RUGI BERSIH", Math.round(laba)],
    ...(carryTotal > 0
      ? [
          [],
          [
            "KOREKSI — Pelunasan Kewajiban Tahun Lalu (dikecualikan)",
            -Math.round(carryTotal),
          ],
        ]
      : []),
    ...(equityTotal > 0
      ? [
          [],
          [
            "SETORAN MODAL (Ekuitas, bukan pendapatan)",
            Math.round(equityTotal),
          ],
        ]
      : []),
  ];

  return (
    <div className="stack">
      <ExportBar
        onCSV={() =>
          downloadCSV(
            aoa.map((r) => [r[0] ?? "", r[1] ?? ""]),
            ["Keterangan", "Nominal"],
            "LaporanLabaRugi_" + from + "_" + to
          )
        }
        onExcel={() =>
          downloadExcel(
            [{ name: "Laba Rugi", aoa }],
            "LaporanLabaRugi_" + from + "_" + to
          )
        }
      />
      <div className="card report">
        <div className="report-head">
          <h2>{data.company.name}</h2>
          <div className="muted">LAPORAN LABA RUGI</div>
          <div className="muted sm">
            Periode {fmtDate(from)} — {fmtDate(to)}
          </div>
        </div>
        <div className="report-sec">
          <div className="report-row head">
            <span>PENDAPATAN USAHA</span>
            <span></span>
          </div>
          {Object.entries(revBusinessByCat).length === 0 && (
            <div className="report-row">
              <span className="muted">
                Belum ada pendapatan usaha pada periode ini
              </span>
              <span className="mono">Rp 0</span>
            </div>
          )}
          {Object.entries(revBusinessByCat).map(([k, v]) => (
            <div key={k} className="report-row">
              <span>{k}</span>
              <span className="mono">{rupiah(v)}</span>
            </div>
          ))}
          <div className="report-row total">
            <span>Total Pendapatan Usaha</span>
            <span className="mono">{rupiah(revBusiness)}</span>
          </div>
          {refundRev > 0 && (
            <div className="report-row">
              <span className="muted xs">
                Termasuk koreksi refund keluar sebesar {rupiah(refundRev)} yang
                mengurangi pendapatan kategori asal.
              </span>
            </div>
          )}
        </div>
        <div className="report-sec">
          <div className="report-row head">
            <span>HPP / BIAYA LANGSUNG PAKET</span>
            <span></span>
          </div>
          {Object.entries(directCostByCat).length === 0 && (
            <div className="report-row">
              <span className="muted">
                Belum ada biaya langsung paket pada periode ini
              </span>
              <span className="mono">(Rp 0)</span>
            </div>
          )}
          {Object.entries(directCostByCat).map(([k, v]) => (
            <div key={k} className="report-row">
              <span>{k}</span>
              <span className="mono">({rupiah(v)})</span>
            </div>
          ))}
          <div className="report-row total">
            <span>Total HPP / Biaya Langsung Paket</span>
            <span className="mono">({rupiah(directCost)})</span>
          </div>
        </div>
        <div className={"report-row grand " + (labaKotor >= 0 ? "pos" : "neg")}>
          <span>LABA KOTOR ({grossMargin.toFixed(1)}%)</span>
          <span className="mono">{rupiah(labaKotor)}</span>
        </div>
        <div className="report-sec">
          <div className="report-row head">
            <span>BEBAN OPERASIONAL</span>
            <span></span>
          </div>
          {Object.entries(operatingExpenseByCat).length === 0 && (
            <div className="report-row">
              <span className="muted">
                Belum ada beban operasional pada periode ini
              </span>
              <span className="mono">(Rp 0)</span>
            </div>
          )}
          {Object.entries(operatingExpenseByCat).map(([k, v]) => (
            <div key={k} className="report-row">
              <span>{k}</span>
              <span className="mono">({rupiah(v)})</span>
            </div>
          ))}
          <div className="report-row total">
            <span>Total Beban Operasional</span>
            <span className="mono">({rupiah(operatingExpense)})</span>
          </div>
          {refundExp > 0 && (
            <div className="report-row">
              <span className="muted xs">
                Termasuk koreksi refund masuk sebesar {rupiah(refundExp)} yang
                mengurangi beban kategori asal.
              </span>
            </div>
          )}
        </div>
        <div className={"report-row grand " + (labaUsaha >= 0 ? "pos" : "neg")}>
          <span>LABA USAHA ({operatingMargin.toFixed(1)}%)</span>
          <span className="mono">{rupiah(labaUsaha)}</span>
        </div>
        {(revFinance !== 0 || expFinance !== 0) && (
          <div className="report-sec">
            {revFinance !== 0 && (
              <>
                <div className="report-row head">
                  <span>PENDAPATAN KEUANGAN / LAIN-LAIN</span>
                  <span></span>
                </div>
                {Object.entries(revFinanceByCat).map(([k, v]) => (
                  <div key={k} className="report-row">
                    <span>{k}</span>
                    <span className="mono">{rupiah(v)}</span>
                  </div>
                ))}
                <div className="report-row total">
                  <span>Total Pendapatan Keuangan / Lain-lain</span>
                  <span className="mono">{rupiah(revFinance)}</span>
                </div>
              </>
            )}
            {expFinance !== 0 && (
              <>
                <div className="report-row head" style={{ marginTop: 10 }}>
                  <span>BEBAN KEUANGAN / PAJAK FINAL</span>
                  <span></span>
                </div>
                {Object.entries(expFinanceByCat).map(([k, v]) => (
                  <div key={k} className="report-row">
                    <span>{k}</span>
                    <span className="mono">({rupiah(v)})</span>
                  </div>
                ))}
                <div className="report-row total">
                  <span>Total Beban Keuangan / Pajak Final</span>
                  <span className="mono">({rupiah(expFinance)})</span>
                </div>
              </>
            )}
          </div>
        )}
        <div className="report-row total">
          <span>Total Pendapatan</span>
          <span className="mono">{rupiah(rev)}</span>
        </div>
        <div className="report-row total">
          <span>Total Beban</span>
          <span className="mono">({rupiah(exp)})</span>
        </div>
        <div className={"report-row grand " + (laba >= 0 ? "pos" : "neg")}>
          <span>LABA / RUGI BERSIH</span>
          <span className="mono">{rupiah(laba)}</span>
        </div>
        {carryTotal > 0 && (
          <div className="report-sec carry-sec">
            <div className="report-row head">
              <span>KOREKSI — Pelunasan Kewajiban Tahun Lalu</span>
              <span></span>
            </div>
            <div className="report-row">
              <span>Pelunasan Kewajiban 2025 (sudah jadi beban di 2025)</span>
              <span className="mono">({rupiah(carryTotal)})</span>
            </div>
            <div className="report-row">
              <span className="muted xs">
                Arus kas keluar ini TIDAK dihitung sebagai beban periode ini —
                inilah alasan Laba Rugi tidak minus palsu.
              </span>
            </div>
          </div>
        )}
        {equityTotal > 0 && (
          <div className="report-sec carry-sec">
            <div className="report-row head">
              <span>SETORAN MODAL (Ekuitas — bukan pendapatan)</span>
              <span></span>
            </div>
            <div className="report-row">
              <span>Setoran Modal periode ini</span>
              <span className="mono">{rupiah(equityTotal)}</span>
            </div>
            <div className="report-row">
              <span className="muted xs">
                Suntikan modal masuk ke EKUITAS di Neraca, bukan pendapatan
                usaha — jadi tidak menambah laba.
              </span>
            </div>
          </div>
        )}
      </div>
      <div className="card">
        <div className="card-head">
          <h3>Saldo per Rekening</h3>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Rekening</th>
                <th>Jenis</th>
                <th>Kepemilikan</th>
                <th className="r">Saldo</th>
              </tr>
            </thead>
            <tbody>
              {data.accounts.map((a) => (
                <tr key={a.id}>
                  <td>{a.name}</td>
                  <td className="sm">{ACCT_TYPE[a.type]}</td>
                  <td>
                    <Badge ownership={a.ownership} />
                  </td>
                  <td className="r mono">{rupiah(balances[a.id] || 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ── ARUS KAS ────────────────────────────────────────────────────────────── */
function LaporanArusKas({ data, balances, catById, from, to }) {
  const inRange = (iso) => {
    const d = new Date(iso);
    return d >= new Date(from) && d <= new Date(to + "T23:59:59");
  };
  const txPeriod = data.tx.filter(
    (t) => inRange(t.date) && OWN[t.ownership]?.business
  );

  const incByCat = {},
    incFinanceByCat = {},
    expByCat = {},
    expFinanceByCat = {},
    carryCashByCat = {};
  let totalMasukUsaha = 0,
    totalMasukFinance = 0,
    totalKeluarUsaha = 0,
    totalKeluarFinance = 0,
    totalKeluarCarry = 0;
  txPeriod.forEach((t) => {
    const cat = catById[t.categoryId];
    if (t.type === "income") {
      const k = cat?.name || "Lainnya";
      if (isFinancialIncome(t, cat)) {
        totalMasukFinance += t.amount;
        addAmount(incFinanceByCat, k, t.amount);
      } else {
        totalMasukUsaha += t.amount;
        addAmount(incByCat, k, t.amount);
      }
    } else if (t.type === "expense") {
      const k = cat?.name || "Lainnya";
      if (isCarryoverExpense(t, cat)) {
        totalKeluarCarry += t.amount;
        addAmount(carryCashByCat, k, t.amount);
      } else if (isBankTaxOrFinanceCost(t, cat)) {
        totalKeluarFinance += t.amount;
        addAmount(expFinanceByCat, k, t.amount);
      } else {
        totalKeluarUsaha += t.amount;
        addAmount(expByCat, k, t.amount);
      }
    }
  });
  const totalMasuk = totalMasukUsaha + totalMasukFinance;
  const totalKeluar = totalKeluarUsaha + totalKeluarFinance + totalKeluarCarry;
  const netOperasi = totalMasuk - totalKeluar;
  const bizAccts = data.accounts.filter((a) => OWN[a.ownership]?.business);
  const saldoAwal = bizAccts.reduce((s, a) => s + a.initial, 0);
  const saldoAkhir = bizAccts.reduce((s, a) => s + (balances[a.id] || 0), 0);

  const aoa = [
    ["PT " + data.company.name],
    ["LAPORAN ARUS KAS"],
    ["Periode: " + fmtDate(from) + " — " + fmtDate(to)],
    [],
    ["A. AKTIVITAS OPERASI", ""],
    ["  Penerimaan usaha:", ""],
    ...Object.entries(incByCat).map(([k, v]) => ["    " + k, Math.round(v)]),
    ["  Total Penerimaan Usaha", Math.round(totalMasukUsaha)],
    ...(totalMasukFinance !== 0
      ? [
          ["  Penerimaan keuangan / lain-lain:", ""],
          ...Object.entries(incFinanceByCat).map(([k, v]) => [
            "    " + k,
            Math.round(v),
          ]),
          ["  Total Penerimaan Keuangan", Math.round(totalMasukFinance)],
        ]
      : []),
    ["  Pengeluaran usaha:", ""],
    ...Object.entries(expByCat).map(([k, v]) => ["    " + k, -Math.round(v)]),
    ["  Total Pengeluaran Usaha", -Math.round(totalKeluarUsaha)],
    ...(totalKeluarFinance !== 0
      ? [
          ["  Pengeluaran keuangan / pajak final:", ""],
          ...Object.entries(expFinanceByCat).map(([k, v]) => [
            "    " + k,
            -Math.round(v),
          ]),
          [
            "  Total Pengeluaran Keuangan / Pajak Final",
            -Math.round(totalKeluarFinance),
          ],
        ]
      : []),
    ...(totalKeluarCarry !== 0
      ? [
          ["  Pembayaran kewajiban lama:", ""],
          ...Object.entries(carryCashByCat).map(([k, v]) => [
            "    " + k,
            -Math.round(v),
          ]),
          ["  Total Pembayaran Kewajiban Lama", -Math.round(totalKeluarCarry)],
        ]
      : []),
    ["  Total Pengeluaran Operasi", -Math.round(totalKeluar)],
    ["Arus Kas Bersih Aktivitas Operasi", Math.round(netOperasi)],
    [],
    ["B. AKTIVITAS INVESTASI", ""],
    ["  (tidak ada dalam periode ini)", 0],
    [],
    ["C. AKTIVITAS PEMBIAYAAN", ""],
    ["  (tidak ada dalam periode ini)", 0],
    [],
    ["POSISI KAS", ""],
    ["  Saldo Kas Awal (all-time)", Math.round(saldoAwal)],
    ["  Arus Kas Bersih Periode", Math.round(netOperasi)],
    ["  Saldo Kas Akhir (saat ini)", Math.round(saldoAkhir)],
  ];

  return (
    <div className="stack">
      <ExportBar
        onCSV={() =>
          downloadCSV(
            aoa.map((r) => [r[0] ?? "", r[1] ?? ""]),
            ["Keterangan", "Nominal (Rp)"],
            "ArusKas_" + from + "_" + to
          )
        }
        onExcel={() =>
          downloadExcel(
            [{ name: "Arus Kas", aoa }],
            "ArusKas_" + from + "_" + to
          )
        }
      />
      <div className="card report">
        <div className="report-head">
          <h2>{data.company.name}</h2>
          <div className="muted">LAPORAN ARUS KAS (Metode Langsung)</div>
          <div className="muted sm">
            Periode {fmtDate(from)} — {fmtDate(to)}
          </div>
        </div>
        <div className="report-sec">
          <div className="report-row head">
            <span>A. AKTIVITAS OPERASI</span>
            <span></span>
          </div>
          <div className="report-row" style={{ paddingLeft: 12 }}>
            <span className="muted sm" style={{ fontWeight: 600 }}>
              Penerimaan usaha:
            </span>
          </div>
          {Object.entries(incByCat).map(([k, v]) => (
            <div key={k} className="report-row" style={{ paddingLeft: 24 }}>
              <span>{k}</span>
              <span className="mono">{rupiah(v)}</span>
            </div>
          ))}
          <div
            className="report-row"
            style={{ paddingLeft: 12, fontWeight: 600 }}
          >
            <span>Sub-total Penerimaan Usaha</span>
            <span className="mono">{rupiah(totalMasukUsaha)}</span>
          </div>
          {totalMasukFinance !== 0 && (
            <>
              <div
                className="report-row"
                style={{ paddingLeft: 12, marginTop: 8 }}
              >
                <span className="muted sm" style={{ fontWeight: 600 }}>
                  Penerimaan keuangan / lain-lain:
                </span>
              </div>
              {Object.entries(incFinanceByCat).map(([k, v]) => (
                <div key={k} className="report-row" style={{ paddingLeft: 24 }}>
                  <span>{k}</span>
                  <span className="mono">{rupiah(v)}</span>
                </div>
              ))}
              <div
                className="report-row"
                style={{ paddingLeft: 12, fontWeight: 600 }}
              >
                <span>Sub-total Penerimaan Keuangan</span>
                <span className="mono">{rupiah(totalMasukFinance)}</span>
              </div>
            </>
          )}
          <div className="report-row" style={{ paddingLeft: 12, marginTop: 8 }}>
            <span className="muted sm" style={{ fontWeight: 600 }}>
              Pengeluaran usaha:
            </span>
          </div>
          {Object.entries(expByCat).map(([k, v]) => (
            <div key={k} className="report-row" style={{ paddingLeft: 24 }}>
              <span>{k}</span>
              <span className="mono" style={{ color: "var(--red)" }}>
                ({rupiah(v)})
              </span>
            </div>
          ))}
          <div
            className="report-row"
            style={{ paddingLeft: 12, fontWeight: 600 }}
          >
            <span>Sub-total Pengeluaran Usaha</span>
            <span className="mono" style={{ color: "var(--red)" }}>
              ({rupiah(totalKeluarUsaha)})
            </span>
          </div>
          {totalKeluarFinance !== 0 && (
            <>
              <div
                className="report-row"
                style={{ paddingLeft: 12, marginTop: 8 }}
              >
                <span className="muted sm" style={{ fontWeight: 600 }}>
                  Pengeluaran keuangan / pajak final:
                </span>
              </div>
              {Object.entries(expFinanceByCat).map(([k, v]) => (
                <div key={k} className="report-row" style={{ paddingLeft: 24 }}>
                  <span>{k}</span>
                  <span className="mono" style={{ color: "var(--red)" }}>
                    ({rupiah(v)})
                  </span>
                </div>
              ))}
              <div
                className="report-row"
                style={{ paddingLeft: 12, fontWeight: 600 }}
              >
                <span>Sub-total Pengeluaran Keuangan / Pajak Final</span>
                <span className="mono" style={{ color: "var(--red)" }}>
                  ({rupiah(totalKeluarFinance)})
                </span>
              </div>
            </>
          )}
          {totalKeluarCarry !== 0 && (
            <>
              <div
                className="report-row"
                style={{ paddingLeft: 12, marginTop: 8 }}
              >
                <span className="muted sm" style={{ fontWeight: 600 }}>
                  Pembayaran kewajiban lama:
                </span>
              </div>
              {Object.entries(carryCashByCat).map(([k, v]) => (
                <div key={k} className="report-row" style={{ paddingLeft: 24 }}>
                  <span>{k}</span>
                  <span className="mono" style={{ color: "var(--red)" }}>
                    ({rupiah(v)})
                  </span>
                </div>
              ))}
              <div
                className="report-row"
                style={{ paddingLeft: 12, fontWeight: 600 }}
              >
                <span>Sub-total Pembayaran Kewajiban Lama</span>
                <span className="mono" style={{ color: "var(--red)" }}>
                  ({rupiah(totalKeluarCarry)})
                </span>
              </div>
            </>
          )}
          <div className="report-row total">
            <span>Arus Kas Bersih Aktivitas Operasi</span>
            <span
              className={
                "mono " + (netOperasi >= 0 ? "amt-income" : "amt-expense")
              }
            >
              {netOperasi >= 0 ? "" : "("}
              {rupiah(Math.abs(netOperasi))}
              {netOperasi < 0 ? ")" : ""}
            </span>
          </div>
        </div>
        <div className="report-sec">
          <div className="report-row head">
            <span>B. AKTIVITAS INVESTASI & PEMBIAYAAN</span>
            <span></span>
          </div>
          <div className="report-row">
            <span className="muted">
              Tidak ada aktivitas investasi/pembiayaan pada periode ini
            </span>
            <span className="mono">—</span>
          </div>
          <div className="report-row total">
            <span>Arus Kas Bersih Aktivitas Investasi & Pembiayaan</span>
            <span className="mono">Rp 0</span>
          </div>
        </div>
        <div className="report-sec">
          <div className="report-row head">
            <span>POSISI KAS BISNIS</span>
            <span></span>
          </div>
          <div className="report-row">
            <span>Saldo Kas Awal (seluruh rekening bisnis)</span>
            <span className="mono">{rupiah(saldoAwal)}</span>
          </div>
          <div className="report-row">
            <span>Arus Kas Bersih Periode Ini</span>
            <span
              className={
                "mono " + (netOperasi >= 0 ? "amt-income" : "amt-expense")
              }
            >
              {netOperasi >= 0 ? "+" : "-"}
              {rupiah(Math.abs(netOperasi))}
            </span>
          </div>
          <div className={"report-row grand pos"}>
            <span>Saldo Kas Akhir (saat ini)</span>
            <span className="mono">{rupiah(saldoAkhir)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── NERACA ─────────────────────────────────────────────────────────────── */
function LaporanNeraca({ data, balances, to }) {
  const compAccts = data.accounts.filter((a) => a.ownership === "COMPANY");
  const pbAccts = data.accounts.filter(
    (a) => a.ownership === "PERSONAL_BUSINESS"
  );
  const priAccts = data.accounts.filter((a) => a.ownership === "PERSONAL");
  const sumBal = (list) => list.reduce((s, a) => s + (balances[a.id] || 0), 0);

  const kasPerusahaan = sumBal(compAccts);
  const kasPribadiBiz = sumBal(pbAccts);
  const totalPiutang = data.receivables.reduce(
    (s, r) => s + Math.max(0, r.total - r.paid),
    0
  );
  const totalAset = kasPerusahaan + kasPribadiBiz + totalPiutang;

  const totalUtang = data.payables.reduce(
    (s, p) => s + Math.max(0, p.total - p.paid),
    0
  );
  const totalKewajiban = totalUtang;

  const ekuitas = totalAset - totalKewajiban;

  const aoa = [
    ["PT " + data.company.name],
    ["NERACA (BALANCE SHEET)"],
    ["Per Tanggal: " + fmtDate(to)],
    [],
    ["ASET", ""],
    ["  Kas & Setara Kas — Rekening PT", Math.round(kasPerusahaan)],
    ["  Kas di Tangan Pemilik (Rek Pribadi-Bisnis)", Math.round(kasPribadiBiz)],
    ["  Piutang Usaha (outstanding)", Math.round(totalPiutang)],
    ["TOTAL ASET", Math.round(totalAset)],
    [],
    ["KEWAJIBAN", ""],
    ["  Utang Usaha (outstanding)", Math.round(totalUtang)],
    ["TOTAL KEWAJIBAN", Math.round(totalKewajiban)],
    [],
    ["EKUITAS", ""],
    ["  Ekuitas Pemilik (Aset - Kewajiban)", Math.round(ekuitas)],
    ["TOTAL KEWAJIBAN + EKUITAS", Math.round(totalKewajiban + ekuitas)],
  ];

  const balanced = Math.abs(totalAset - (totalKewajiban + ekuitas)) < 1;

  return (
    <div className="stack">
      <ExportBar
        onCSV={() =>
          downloadCSV(
            aoa.map((r) => [r[0] ?? "", r[1] ?? ""]),
            ["Pos", "Nominal (Rp)"],
            "Neraca_" + to
          )
        }
        onExcel={() => downloadExcel([{ name: "Neraca", aoa }], "Neraca_" + to)}
      />
      <div className="card report">
        <div className="report-head">
          <h2>{data.company.name}</h2>
          <div className="muted">NERACA (BALANCE SHEET)</div>
          <div className="muted sm">Per Tanggal {fmtDate(to)}</div>
        </div>
        <div className="neraca-grid">
          <div>
            <div className="report-row head">
              <span>ASET</span>
              <span></span>
            </div>
            <div className="report-row head2">
              <span>Aset Lancar</span>
            </div>
            {compAccts.map((a) => (
              <div
                key={a.id}
                className="report-row"
                style={{ paddingLeft: 16 }}
              >
                <span>{a.name}</span>
                <span className="mono">{rupiah(balances[a.id] || 0)}</span>
              </div>
            ))}
            {pbAccts.length > 0 && (
              <div className="report-row head2">
                <span>Kas di Tangan Pemilik (Bisnis)</span>
              </div>
            )}
            {pbAccts.map((a) => (
              <div
                key={a.id}
                className="report-row"
                style={{ paddingLeft: 16 }}
              >
                <span>{a.name}</span>
                <span className="mono">{rupiah(balances[a.id] || 0)}</span>
              </div>
            ))}
            <div className="report-row head2">
              <span>Piutang Usaha</span>
            </div>
            <div className="report-row" style={{ paddingLeft: 16 }}>
              <span>Piutang Outstanding</span>
              <span className="mono">{rupiah(totalPiutang)}</span>
            </div>
            <div className="report-row total">
              <span>TOTAL ASET</span>
              <span className="mono">{rupiah(totalAset)}</span>
            </div>
          </div>
          <div>
            <div className="report-row head">
              <span>KEWAJIBAN</span>
              <span></span>
            </div>
            <div className="report-row head2">
              <span>Kewajiban Lancar</span>
            </div>
            <div className="report-row" style={{ paddingLeft: 16 }}>
              <span>Utang Usaha (Vendor)</span>
              <span className="mono">{rupiah(totalUtang)}</span>
            </div>
            <div className="report-row total">
              <span>TOTAL KEWAJIBAN</span>
              <span className="mono">{rupiah(totalKewajiban)}</span>
            </div>
            <div className="report-row head" style={{ marginTop: 16 }}>
              <span>EKUITAS</span>
              <span></span>
            </div>
            <div className="report-row" style={{ paddingLeft: 16 }}>
              <span>Ekuitas Pemilik</span>
              <span className="mono">{rupiah(ekuitas)}</span>
            </div>
            <div className="report-row total">
              <span>TOTAL KEWAJIBAN + EKUITAS</span>
              <span className="mono">{rupiah(totalKewajiban + ekuitas)}</span>
            </div>
          </div>
        </div>
        {balanced ? (
          <div className="bal-check ok">
            <Check size={14} /> Neraca seimbang — Total Aset = Total Kewajiban +
            Ekuitas
          </div>
        ) : (
          <div className="bal-check err">
            <AlertTriangle size={14} /> Neraca tidak seimbang — ada transaksi
            yang belum tercatat.
          </div>
        )}
      </div>
    </div>
  );
}

/* ── ESTIMASI PAJAK ──────────────────────────────────────────────────────── */
function LaporanPajak({ data, catById, from, to }) {
  const inRange = (iso) => {
    const d = new Date(iso);
    return d >= new Date(from) && d <= new Date(to + "T23:59:59");
  };
  const txR = data.tx.filter(
    (t) => inRange(t.date) && OWN[t.ownership]?.business
  );

  let rev = 0,
    revFinance = 0,
    expTotal = 0,
    expGaji = 0,
    finalBankTaxPaid = 0,
    carryoverPaid = 0;
  txR.forEach((t) => {
    const cat = catById[t.categoryId];
    if (t.type === "income" && !isEquityCat(cat)) {
      if (isFinancialIncome(t, cat)) revFinance += t.amount;
      else rev += t.amount;
    } else if (t.type === "expense") {
      if (isCarryoverExpense(t, cat)) {
        carryoverPaid += t.amount;
        return;
      }
      if (
        /pajak dari bank|pajak final|pph final|pajak bunga|pajak deposito/i.test(
          txText(t, cat)
        )
      ) {
        finalBankTaxPaid += t.amount;
        return;
      }
      expTotal += t.amount;
      if (isPayrollExpense(t, cat)) expGaji += t.amount;
    }
  });
  const labaKenaPajak = Math.max(0, rev - expTotal);
  const pphBadan = labaKenaPajak * 0.22;
  const pphPasal21 = expGaji * 0.05;
  const pphPasal4 = rev * 0.005; // PPh Final jasa travel 0.5%
  const ppnRev = rev * 0.11; // PPN output (belum dikurangi pajak masukan)
  const totalEstimasiPajak = pphBadan + pphPasal21 + pphPasal4 + ppnRev;

  const aoa = [
    ["PT " + data.company.name],
    ["ESTIMASI PAJAK (BUKAN UNTUK PELAPORAN RESMI)"],
    ["Periode: " + fmtDate(from) + " — " + fmtDate(to)],
    [],
    ["A. PPh BADAN (22%)", ""],
    ["  Pendapatan Bruto Usaha", Math.round(rev)],
    ["  Pendapatan Keuangan / Bank (dipisah)", Math.round(revFinance)],
    ["  Beban Deductible", -Math.round(expTotal)],
    ["  Penghasilan Kena Pajak", Math.round(labaKenaPajak)],
    ["  Estimasi PPh Badan 22%", Math.round(pphBadan)],
    [],
    ["B. PPh PASAL 21 — GAJI", ""],
    ["  Total Gaji Dibayar", Math.round(expGaji)],
    ["  Estimasi PPh 21 (tarif 5% sederhana)", Math.round(pphPasal21)],
    [],
    ["C. PPh PASAL 4 AYAT 2 FINAL — JASA TRAVEL (0.5%)", ""],
    ["  Estimasi PPh Final", Math.round(pphPasal4)],
    ...(finalBankTaxPaid > 0
      ? [
          [],
          ["CATATAN PAJAK FINAL BANK", ""],
          [
            "  PPh Final Bank yang sudah dipotong bank",
            Math.round(finalBankTaxPaid),
          ],
        ]
      : []),
    ...(carryoverPaid > 0
      ? [
          [],
          ["CATATAN PEMBAYARAN KEWAJIBAN LAMA", ""],
          [
            "  Pembayaran kewajiban lama (bukan beban periode ini)",
            Math.round(carryoverPaid),
          ],
        ]
      : []),
    [],
    ["D. PPN (11% dari Pendapatan Bruto)", ""],
    ["  PPN Output Estimasi", Math.round(ppnRev)],
    [],
    ["TOTAL ESTIMASI KEWAJIBAN PAJAK", Math.round(totalEstimasiPajak)],
  ];

  return (
    <div className="stack">
      <ExportBar
        onCSV={() =>
          downloadCSV(
            aoa.map((r) => [r[0] ?? "", r[1] ?? ""]),
            ["Komponen", "Nominal (Rp)"],
            "EstimasiPajak_" + from + "_" + to
          )
        }
        onExcel={() =>
          downloadExcel(
            [{ name: "Estimasi Pajak", aoa }],
            "EstimasiPajak_" + from + "_" + to
          )
        }
      />
      <div className="card report">
        <div className="report-head">
          <h2>{data.company.name}</h2>
          <div className="muted">RINGKASAN ESTIMASI PAJAK</div>
          <div className="muted sm">
            Periode {fmtDate(from)} — {fmtDate(to)}
          </div>
        </div>
        <div className="report-sec">
          <div className="report-row head">
            <span>A. PPh BADAN (Tarif 22%)</span>
            <span></span>
          </div>
          <div className="report-row">
            <span>Pendapatan Bruto Bisnis</span>
            <span className="mono">{rupiah(rev)}</span>
          </div>
          {revFinance > 0 && (
            <div className="report-row">
              <span className="muted">
                Pendapatan Keuangan / Bank (dipisah dari omzet usaha)
              </span>
              <span className="mono">{rupiah(revFinance)}</span>
            </div>
          )}
          <div className="report-row">
            <span>Beban yang Dapat Dikurangkan</span>
            <span className="mono">({rupiah(expTotal)})</span>
          </div>
          <div className="report-row total">
            <span>Penghasilan Kena Pajak</span>
            <span className="mono">{rupiah(labaKenaPajak)}</span>
          </div>
          <div className="report-row" style={{ paddingLeft: 12 }}>
            <span>Estimasi PPh Badan (×22%)</span>
            <span className="mono amt-expense">{rupiah(pphBadan)}</span>
          </div>
        </div>
        <div className="report-sec">
          <div className="report-row head">
            <span>B. PPh PASAL 21 — Gaji Karyawan</span>
            <span></span>
          </div>
          <div className="report-row">
            <span>Total Gaji Dibayar</span>
            <span className="mono">{rupiah(expGaji)}</span>
          </div>
          <div className="report-row">
            <span>Estimasi PPh 21 (tarif 5% sederhana)</span>
            <span className="mono amt-expense">{rupiah(pphPasal21)}</span>
          </div>
        </div>
        <div className="report-sec">
          <div className="report-row head">
            <span>C. PPh PASAL 4 AYAT 2 FINAL — Jasa Travel (0,5%)</span>
            <span></span>
          </div>
          <div className="report-row">
            <span>Estimasi PPh Final</span>
            <span className="mono amt-expense">{rupiah(pphPasal4)}</span>
          </div>
          {finalBankTaxPaid > 0 && (
            <div className="report-row">
              <span className="muted">
                PPh Final Bank yang sudah dipotong bank
              </span>
              <span className="mono amt-expense">
                {rupiah(finalBankTaxPaid)}
              </span>
            </div>
          )}
          {carryoverPaid > 0 && (
            <div className="report-row">
              <span className="muted">
                Pembayaran kewajiban lama tidak dimasukkan sebagai beban pajak
                periode ini
              </span>
              <span className="mono">{rupiah(carryoverPaid)}</span>
            </div>
          )}
        </div>
        <div className="report-sec">
          <div className="report-row head">
            <span>D. PPN (11% dari Pendapatan Bruto)</span>
            <span></span>
          </div>
          <div className="report-row">
            <span>PPN Output Estimasi</span>
            <span className="mono amt-expense">{rupiah(ppnRev)}</span>
          </div>
          <div className="report-row muted sm" style={{ fontStyle: "italic" }}>
            <span>
              Kurangi dengan PPN masukan (faktur pajak dari vendor) untuk PPN
              terutang sesungguhnya.
            </span>
          </div>
        </div>
        <div className="report-row grand">
          <span>TOTAL ESTIMASI PAJAK</span>
          <span className="mono amt-expense">{rupiah(totalEstimasiPajak)}</span>
        </div>
      </div>
      <div className="note">
        <AlertTriangle size={16} />
        <div>
          <b>Ini adalah estimasi panduan awal — bukan dokumen resmi SPT.</b>{" "}
          Perhitungan tarif pajak travel dapat berbeda tergantung jenis jasa
          (Umroh/Haji mungkin mendapat fasilitas PPN Tidak Dipungut), status
          PKP, dan skema pembukuan. Untuk pelaporan pajak resmi, konsultasikan
          dengan konsultan pajak atau akuntan publik berlisensi.
        </div>
      </div>
    </div>
  );
}

/* ── AGING PIUTANG & UTANG ──────────────────────────────────────────────── */
function LaporanAging({ data, ctById }) {
  const today = new Date();
  const ageBucket = (dueDateIso) => {
    const due = new Date(dueDateIso);
    if (due >= today) return 0; // Belum jatuh tempo
    const days = Math.floor((today - due) / 864e5);
    if (days <= 30) return 1;
    if (days <= 60) return 2;
    if (days <= 90) return 3;
    return 4;
  };
  const BUCKET_LABELS = [
    "Belum Jatuh Tempo",
    "1–30 Hari",
    "31–60 Hari",
    "61–90 Hari",
    "> 90 Hari",
  ];
  const BUCKET_CLS = ["st-paid", "st-part", "st-part", "st-over", "st-over"];

  const buildAging = (rows) => {
    const buckets = [[], [], [], [], []];
    rows.forEach((r) => {
      const rem = r.total - r.paid;
      if (rem <= 0) return;
      buckets[ageBucket(r.dueDate)].push(r);
    });
    return buckets;
  };
  const rcBuckets = buildAging(data.receivables);
  const pyBuckets = buildAging(data.payables);
  const sumBucket = (b) => b.flat().reduce((s, r) => s + (r.total - r.paid), 0);

  const rcAoa = [
    ["AGING PIUTANG (RECEIVABLE)"],
    [
      "Nama Customer",
      "Keterangan",
      "Total",
      "Dibayar",
      "Sisa",
      "Jatuh Tempo",
      "Bucket",
    ],
    ...data.receivables
      .filter((r) => r.total - r.paid > 0)
      .map((r) => [
        ctById[r.contactId]?.name || "—",
        r.description,
        r.total,
        r.paid,
        r.total - r.paid,
        r.dueDate,
        BUCKET_LABELS[ageBucket(r.dueDate)],
      ]),
  ];
  const pyAoa = [
    ["AGING UTANG (PAYABLE)"],
    [
      "Nama Vendor",
      "Keterangan",
      "Total",
      "Dibayar",
      "Sisa",
      "Jatuh Tempo",
      "Bucket",
    ],
    ...data.payables
      .filter((p) => p.total - p.paid > 0)
      .map((p) => [
        ctById[p.contactId]?.name || "—",
        p.description,
        p.total,
        p.paid,
        p.total - p.paid,
        p.dueDate,
        BUCKET_LABELS[ageBucket(p.dueDate)],
      ]),
  ];

  return (
    <div className="stack">
      <ExportBar
        onCSV={() =>
          downloadCSV(
            rcAoa.slice(2).map((r) => r.map(String)),
            [
              "Customer",
              "Ket.",
              "Total",
              "Dibayar",
              "Sisa",
              "Jatuh Tempo",
              "Bucket",
            ],
            "AgingPiutang"
          )
        }
        onExcel={() =>
          downloadExcel(
            [
              { name: "Aging Piutang", aoa: rcAoa },
              { name: "Aging Utang", aoa: pyAoa },
            ],
            "Aging_AR_AP"
          )
        }
      />
      {["Piutang (Receivable)", "Utang (Payable)"].map((title, ti) => {
        const bkts = ti === 0 ? rcBuckets : pyBuckets;
        const rows = ti === 0 ? data.receivables : data.payables;
        const hasData = rows.some((r) => r.total - r.paid > 0);
        return (
          <div key={title} className="card">
            <div className="card-head">
              <h3>Aging {title}</h3>
            </div>
            {!hasData ? (
              <Empty text={"Tidak ada " + title.toLowerCase() + " aktif"} />
            ) : (
              <>
                <div className="aging-summary">
                  {BUCKET_LABELS.map((l, i) => (
                    <div
                      key={i}
                      className={
                        "aging-box " + (bkts[i].length ? BUCKET_CLS[i] : "")
                      }
                    >
                      <div className="muted xs">{l}</div>
                      <div
                        className="mono"
                        style={{ fontWeight: 700, fontSize: 15 }}
                      >
                        {rupiah(
                          bkts[i].reduce((s, r) => s + (r.total - r.paid), 0)
                        )}
                      </div>
                      <div className="muted xs">{bkts[i].length} item</div>
                    </div>
                  ))}
                </div>
                <div className="table-wrap" style={{ marginTop: 14 }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>{ti === 0 ? "Customer" : "Vendor"}</th>
                        <th>Keterangan</th>
                        <th className="r">Sisa</th>
                        <th>Jatuh Tempo</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows
                        .filter((r) => r.total - r.paid > 0)
                        .map((r) => {
                          const b = ageBucket(r.dueDate);
                          return (
                            <tr key={r.id}>
                              <td>{ctById[r.contactId]?.name || "—"}</td>
                              <td className="sm">{r.description}</td>
                              <td className="r mono">
                                <b>{rupiah(r.total - r.paid)}</b>
                              </td>
                              <td className="sm nowrap">
                                {fmtDate(r.dueDate)}
                              </td>
                              <td>
                                <span className={"st " + BUCKET_CLS[b]}>
                                  {BUCKET_LABELS[b]}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── PER PAKET TRAVEL ───────────────────────────────────────────────────── */
function LaporanPerPaket({ data }) {
  const paketData = data.products
    .map((p) => {
      const txLinked = data.tx.filter(
        (t) => t.productId === p.id && t.type === "income"
      );
      const revenue = txLinked.reduce((s, t) => s + t.amount, 0);
      const jumlahTx = txLinked.length;
      const hpp = jumlahTx * p.cost; // estimasi HPP: jumlah transaksi × cost per unit
      const laba = revenue - hpp;
      const margin = revenue > 0 ? (laba / revenue) * 100 : 0;
      return { ...p, revenue, jumlahTx, hpp, laba, margin };
    })
    .sort((a, b) => b.revenue - a.revenue);

  const totalRev = paketData.reduce((s, p) => s + p.revenue, 0);

  const aoa = [
    ["LAPORAN PROFITABILITAS PER PAKET TRAVEL"],
    [],
    [
      "Paket",
      "Jenis",
      "Jml Transaksi",
      "Revenue",
      "HPP (Est.)",
      "Laba Kotor",
      "Margin %",
    ],
    ...paketData.map((p) => [
      p.name,
      p.type,
      p.jumlahTx,
      Math.round(p.revenue),
      Math.round(p.hpp),
      Math.round(p.laba),
      p.margin.toFixed(1) + "%",
    ]),
    [],
    [
      "TOTAL",
      "",
      paketData.reduce((s, p) => s + p.jumlahTx, 0),
      Math.round(totalRev),
      "",
      "",
      "",
    ],
  ];

  return (
    <div className="stack">
      <ExportBar
        onCSV={() =>
          downloadCSV(
            paketData.map((p) => [
              p.name,
              p.type,
              p.jumlahTx,
              rupiah(p.revenue),
              rupiah(p.hpp),
              rupiah(p.laba),
              p.margin.toFixed(1) + "%",
            ]),
            [
              "Paket",
              "Jenis",
              "Jml Tx",
              "Revenue",
              "HPP Est.",
              "Laba Kotor",
              "Margin",
            ],
            "PerPaket"
          )
        }
        onExcel={() => downloadExcel([{ name: "Per Paket", aoa }], "PerPaket")}
      />
      <div className="card">
        <div className="card-head">
          <h3>Profitabilitas per Paket Travel</h3>
          <span className="muted sm">
            HPP dihitung dari harga modal × jumlah transaksi
          </span>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Paket</th>
                <th>Jenis</th>
                <th className="r">Jml Tx</th>
                <th className="r">Revenue</th>
                <th className="r">HPP Est.</th>
                <th className="r">Laba Kotor</th>
                <th className="r">Margin</th>
              </tr>
            </thead>
            <tbody>
              {paketData.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td className="sm">{p.type}</td>
                  <td className="r mono">{p.jumlahTx}</td>
                  <td className="r mono">{rupiah(p.revenue)}</td>
                  <td className="r mono">{rupiah(p.hpp)}</td>
                  <td
                    className={
                      "r mono " + (p.laba >= 0 ? "amt-income" : "amt-expense")
                    }
                  >
                    {rupiah(p.laba)}
                  </td>
                  <td className="r">
                    <div className="margin-bar-wrap">
                      <div
                        className="margin-bar"
                        style={{
                          width: Math.min(100, Math.max(0, p.margin)) + "%",
                          background:
                            p.margin > 30
                              ? "var(--green)"
                              : p.margin > 15
                              ? "var(--gold)"
                              : "var(--red)",
                        }}
                      />
                      <span className="mono sm">{p.margin.toFixed(1)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
              <tr className="total-row">
                <td colSpan={3}>
                  <b>TOTAL</b>
                </td>
                <td className="r mono">
                  <b>{rupiah(totalRev)}</b>
                </td>
                <td className="r mono">
                  <b>{rupiah(paketData.reduce((s, p) => s + p.hpp, 0))}</b>
                </td>
                <td className="r mono amt-income">
                  <b>{rupiah(paketData.reduce((s, p) => s + p.laba, 0))}</b>
                </td>
                <td className="r mono">
                  <b>
                    {totalRev > 0
                      ? (
                          (paketData.reduce((s, p) => s + p.laba, 0) /
                            totalRev) *
                          100
                        ).toFixed(1)
                      : 0}
                    %
                  </b>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="grid-3">
        {paketData.slice(0, 3).map((p, i) => (
          <div key={p.id} className="card">
            <div className="muted xs">
              #{i + 1} — {p.type}
            </div>
            <div className="contact-name" style={{ marginTop: 4 }}>
              {p.name}
            </div>
            <div
              className="stat-val mono"
              style={{ marginTop: 8, fontSize: 18 }}
            >
              {rupiah(p.laba)}
            </div>
            <div className="muted sm">
              laba kotor · margin {p.margin.toFixed(1)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   VIEW: PENGATURAN
   ============================================================ */
function Pengaturan({
  data,
  updateCompany,
  setCatModal,
  delCat,
  setProductModal,
  delProduct,
}) {
  return (
    <div className="stack">
      <div className="card">
        <div className="card-head">
          <h3>Profil Perusahaan</h3>
        </div>
        <div className="grid-2">
          <Field label="Nama Perusahaan">
            <input
              className="input"
              value={data.company.name}
              onChange={(e) => updateCompany({ name: e.target.value })}
            />
          </Field>
          <Field label="Bidang Usaha">
            <input
              className="input"
              value={data.company.field}
              onChange={(e) => updateCompany({ field: e.target.value })}
            />
          </Field>
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <h3>Kategori Transaksi</h3>
          <button
            className="btn btn-out btn-xs"
            onClick={() => setCatModal({})}
          >
            <Plus size={14} /> Tambah
          </button>
        </div>
        <div className="grid-2">
          {["income", "expense"].map((kind) => (
            <div key={kind} className="stack-sm">
              <div className="muted sm" style={{ fontWeight: 600 }}>
                {kind === "income" ? "Pemasukan" : "Pengeluaran"}
              </div>
              <div className="chips">
                {data.categories
                  .filter((c) => c.kind === kind)
                  .map((c) => (
                    <span key={c.id} className="chip">
                      {c.name}
                      <button
                        className="ed"
                        title="Edit"
                        onClick={() => setCatModal({ edit: c })}
                      >
                        <Pencil size={11} />
                      </button>
                      <button
                        title="Hapus"
                        onClick={() => {
                          if (confirmAct("Hapus kategori?")) delCat(c.id);
                        }}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <h3>Paket Travel</h3>
          <button
            className="btn btn-out btn-xs"
            onClick={() => setProductModal({})}
          >
            <Plus size={14} /> Tambah Paket
          </button>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Paket</th>
                <th>Jenis</th>
                <th className="r">Harga Jual</th>
                <th className="r">Modal (HPP)</th>
                <th className="r">Margin</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.products.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td className="sm">{p.type}</td>
                  <td className="r mono sm">{rupiah(p.price)}</td>
                  <td className="r mono sm">{rupiah(p.cost)}</td>
                  <td className="r mono">
                    <b style={{ color: "#11704f" }}>
                      {rupiah(p.price - p.cost)}
                    </b>
                    <div className="muted xs">
                      {p.price > 0
                        ? (((p.price - p.cost) / p.price) * 100).toFixed(0)
                        : 0}
                      %
                    </div>
                  </td>
                  <td className="actions">
                    <button
                      className="btn btn-xs btn-ghost"
                      onClick={() => setProductModal({ edit: p })}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-xs btn-ghost danger"
                      onClick={() => {
                        if (confirmAct("Hapus paket " + p.name + "?"))
                          delProduct(p.id);
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
              {data.products.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <Empty text="Belum ada paket travel" />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="note">
        <AlertTriangle size={16} />
        <div>
          <b>Tersimpan di cloud (Supabase).</b> Data tersinkron otomatis dan
          bisa diakses dari perangkat lain. Untuk produksi penuh — login
          multi-user (Owner/Finance), double-entry ledger, integrasi mutasi bank
          otomatis, dan ekspor PDF audit-ready — gunakan kerangka backend
          (Next.js + Prisma) yang sudah disiapkan. Pastikan{" "}
          <b>Row Level Security</b> di Supabase sudah aktif.
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   VIEW: KEBERANGKATAN (rombongan + detail)
   ============================================================ */
function Keberangkatan({
  data,
  setGroupModal,
  delGroup,
  selGroup,
  setSelGroup,
  setService,
  setJamaahModal,
  delJamaah,
  setTxModal,
  setInvoiceModal,
}) {
  if (selGroup) {
    const g = data.groups.find((x) => x.id === selGroup);
    if (!g)
      return (
        <div className="stack">
          <button
            className="btn btn-out btn-xs"
            onClick={() => setSelGroup(null)}
          >
            ← Kembali
          </button>
          <div className="card">
            <Empty text="Rombongan tidak ditemukan" />
          </div>
        </div>
      );
    return (
      <GroupDetail
        {...{
          g,
          data,
          setGroupModal,
          setSelGroup,
          setService,
          setJamaahModal,
          delJamaah,
          setTxModal,
          setInvoiceModal,
        }}
      />
    );
  }

  const groups = [...data.groups].sort(
    (a, b) =>
      new Date(a.departDate || "2999") - new Date(b.departDate || "2999")
  );
  const clashIds = new Set();
  for (let i = 0; i < groups.length; i++)
    for (let j = i + 1; j < groups.length; j++) {
      const a = groups[i],
        b = groups[j];
      if (!a.departDate || !b.departDate) continue;
      const diff = Math.abs(
        (new Date(a.departDate) - new Date(b.departDate)) / 864e5
      );
      if (diff <= 3) {
        clashIds.add(a.id);
        clashIds.add(b.id);
      }
    }
  const upcoming = groups.filter((g) => {
    const n = daysUntil(g.departDate);
    return n === null || n >= 0;
  });
  const next30 = groups.filter((g) => {
    const n = daysUntil(g.departDate);
    return n !== null && n >= 0 && n <= 30;
  }).length;
  const needCheck = groups.reduce((s, g) => s + groupAlerts(g), 0);

  return (
    <div className="stack">
      <div className="toolbar">
        <p className="muted">
          Pantau tiap rombongan: tanggal berangkat, progress layanan, dan apa
          yang perlu dicek.
        </p>
        <div className="grow" />
        <button className="btn btn-primary" onClick={() => setGroupModal({})}>
          <Plus size={16} /> Tambah Rombongan
        </button>
      </div>
      <div className="grid-4">
        <StatCard
          icon={Plane}
          tone="emerald"
          label="Rombongan Mendatang"
          value={upcoming.length}
        />
        <StatCard
          icon={Users}
          tone="blue"
          label="Total Jamaah"
          value={data.jamaah.length}
        />
        <StatCard
          icon={CalendarDays}
          tone="amber"
          label="Berangkat ≤ 30 Hari"
          value={next30}
        />
        <StatCard
          icon={AlertCircle}
          tone={needCheck ? "red" : "green"}
          label="Item Perlu Dicek"
          value={needCheck}
        />
      </div>
      {clashIds.size > 0 && (
        <div className="clash-banner">
          <AlertTriangle size={16} />
          <span>
            Ada {clashIds.size} rombongan dengan tanggal berangkat berdekatan (≤
            3 hari). Pastikan tim handling & jadwal tidak tabrakan.
          </span>
        </div>
      )}
      {groups.length === 0 ? (
        <div className="card">
          <Empty text="Belum ada rombongan. Klik 'Tambah Rombongan' untuk mulai." />
        </div>
      ) : (
        <div className="grid-3">
          {groups.map((g) => (
            <GroupCard
              key={g.id}
              g={g}
              data={data}
              clash={clashIds.has(g.id)}
              onOpen={() => setSelGroup(g.id)}
              onFinance={() => setSelGroup(g.id)}
              onEdit={() => setGroupModal(g)}
              onDelete={() => {
                if (
                  confirmAct(
                    "Hapus rombongan " +
                      g.name +
                      "? Jamaah di dalamnya tidak ikut terhapus, hanya dilepas dari rombongan."
                  )
                )
                  delGroup(g.id);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function GroupCard({ g, data, clash, onOpen, onFinance, onEdit, onDelete }) {
  const prog = groupProgress(g);
  const jcount = data.jamaah.filter((j) => j.groupId === g.id).length;
  const alerts = groupAlerts(g);
  const fin = groupFinance(g, data);
  const depN = daysUntil(g.departDate);
  const cdCls =
    depN === null
      ? "cd-ok"
      : depN < 0
      ? "cd-past"
      : depN <= 7
      ? "cd-soon"
      : "cd-ok";
  return (
    <div className={"card group-card" + (alerts ? " has-alert" : "")}>
      <div className="gc-top">
        <div>
          <div className="gc-name">{g.name}</div>
          <div className="gc-sub">
            <span className="badge own-pt">{g.packageType || "Umroh"}</span>
            {clash && (
              <span className="badge clash-badge">
                <AlertTriangle size={11} /> Berdekatan
              </span>
            )}
          </div>
        </div>
        <div className={"countdown " + cdCls}>
          {countdownLabel(g.departDate)}
        </div>
      </div>
      <div className="gc-meta">
        <span>
          <CalendarDays size={13} />{" "}
          {g.departDate ? fmtDate(g.departDate) : "—"} →{" "}
          {g.returnDate ? fmtDate(g.returnDate) : "—"}
        </span>
        <span>
          <Users size={13} /> {g.pax || jcount} pax · {jcount} terdata
        </span>
      </div>
      <div className="group-money">
        <span>
          Masuk <b className="amt-income mono">{rupiah(fin.income)}</b>
        </span>
        <span>
          Keluar <b className="amt-expense mono">{rupiah(fin.expense)}</b>
        </span>
        <span>
          Profit{" "}
          <b
            className={
              (fin.profit >= 0 ? "amt-income" : "amt-expense") + " mono"
            }
          >
            {rupiah(fin.profit)}
          </b>
        </span>
      </div>
      <div className="gc-prog">
        <div className="prog-track">
          <div className="prog-fill" style={{ width: prog.pct + "%" }} />
        </div>
        <span className="prog-label mono">
          {prog.done}/{prog.total}
        </span>
      </div>
      <div className="svc-dots">
        {neededIds(g).map((id) => {
          const s = SERVICES.find((x) => x.id === id);
          if (!s) return null;
          const sv = (g.services && g.services[s.id]) || { status: "Belum" };
          const al = serviceAlert(g, s.id);
          return (
            <span
              key={s.id}
              title={s.label + ": " + sv.status}
              className={
                "svc-dot " + SVC_CLS[sv.status] + (al ? " dot-alert" : "")
              }
            />
          );
        })}
      </div>
      {alerts > 0 && (
        <div className="gc-alert">
          <AlertCircle size={13} /> {alerts} layanan perlu dicek
        </div>
      )}
      <div className="gc-actions">
        <button className="btn btn-xs btn-primary" onClick={onOpen}>
          Kelola Layanan
        </button>
        <button className="btn btn-xs btn-out" onClick={onFinance}>
          <Receipt size={13} /> Keuangan
        </button>
        <button className="btn btn-xs btn-out" onClick={onEdit}>
          <Pencil size={13} />
        </button>
        <button className="btn btn-xs btn-out" onClick={onDelete}>
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

function GroupDetail({
  g,
  data,
  setGroupModal,
  setSelGroup,
  setService,
  setJamaahModal,
  delJamaah,
  setTxModal,
  setInvoiceModal,
}) {
  const jam = data.jamaah.filter((j) => j.groupId === g.id);
  const tx = groupTx(g, data);
  const prog = groupProgress(g);
  const fin = groupFinance(g, data);
  const depN = daysUntil(g.departDate);
  const cdCls =
    depN === null
      ? "cd-ok"
      : depN < 0
      ? "cd-past"
      : depN <= 7
      ? "cd-soon"
      : "cd-ok";
  return (
    <div className="stack">
      <div className="toolbar">
        <button
          className="btn btn-out btn-xs"
          onClick={() => setSelGroup(null)}
        >
          ← Kembali ke daftar
        </button>
        <div className="grow" />
        <button className="btn btn-out btn-xs" onClick={() => setGroupModal(g)}>
          <Pencil size={13} /> Edit Info Rombongan
        </button>
      </div>
      <div className="card detail-head">
        <div>
          <div className="gc-name" style={{ fontSize: 21 }}>
            {g.name}
          </div>
          <div
            className="gc-meta"
            style={{
              marginTop: 8,
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 14,
            }}
          >
            <span className="badge own-pt">{g.packageType || "Umroh"}</span>
            <span>
              <CalendarDays size={13} />{" "}
              {g.departDate ? fmtDate(g.departDate) : "—"} →{" "}
              {g.returnDate ? fmtDate(g.returnDate) : "—"}
            </span>
            <span>
              <Users size={13} /> {g.pax || jam.length} pax
            </span>
            {g.driveLink && (
              <a
                href={g.driveLink}
                target="_blank"
                rel="noreferrer"
                className="link"
              >
                Berkas Drive →
              </a>
            )}
          </div>
          {g.notes && (
            <p className="muted sm" style={{ marginTop: 8 }}>
              {g.notes}
            </p>
          )}
        </div>
        <div className={"countdown lg " + cdCls}>
          {countdownLabel(g.departDate)}
        </div>
      </div>
      <div className="grid-3">
        <StatCard
          icon={ArrowDownLeft}
          tone="green"
          label="Uang Masuk Rombongan"
          value={rupiah(fin.income)}
          foot={fin.count + " transaksi terkait"}
        />
        <StatCard
          icon={ArrowUpRight}
          tone="red"
          label="Uang Keluar Rombongan"
          value={rupiah(fin.expense)}
        />
        <StatCard
          icon={TrendingUp}
          tone={fin.profit >= 0 ? "emerald" : "red"}
          label="Profit Rombongan"
          value={rupiah(fin.profit)}
        />
      </div>
      <div className="card">
        <div className="card-head">
          <h3>Transaksi Rombongan</h3>
          <span className="muted sm mono">
            Masuk {rupiah(fin.income)} Keluar {rupiah(fin.expense)}
            Profit {rupiah(fin.profit)}
          </span>
        </div>
        {tx.length === 0 ? (
          <Empty text="Belum ada transaksi yang dihubungkan ke rombongan ini. Buka transaksi lalu isi kolom rombongan / paket terkait." />
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Tipe</th>
                  <th>Deskripsi</th>
                  <th>Nominal</th>
                  <th>Rekening</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {tx.map((t) => (
                  <tr key={t.id}>
                    <td className="nowrap mono sm">{fmtDate(t.date)}</td>
                    <td>
                      <TypePill type={t.type} refund={isRefundTx(t)} />
                    </td>
                    <td>
                      {t.description || <span className="muted">"-"</span>}
                      {t.dealId && (
                        <div className="muted xs refund-ref">
                          <Receipt size={11} /> Terkait paket / rombongan
                        </div>
                      )}
                      {t.refundOfTxId && (
                        <div className="muted xs refund-ref">
                          <Repeat size={11} /> Koreksi transaksi lama
                        </div>
                      )}
                    </td>
                    <td className={"r mono nowrap amt-" + t.type}>
                      {t.type === "expense"
                        ? "-"
                        : t.type === "income"
                        ? "+"
                        : ""}
                      {rupiah(t.amount)}
                    </td>
                    <td className="sm">
                      {data.accounts.find((a) => a.id === t.accountId)?.name ||
                        "-"}
                    </td>
                    <td className="actions">
                      <button
                        className="icon-btn sm"
                        onClick={() => setTxModal(t)}
                        title="Edit transaksi"
                      >
                        <Pencil size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="card">
        <div className="card-head">
          <h3>Checklist Layanan</h3>
          <span className="muted sm mono">
            {prog.done}/{prog.total} selesai · {prog.pct}%
          </span>
        </div>
        <div className="prog-track" style={{ marginBottom: 14 }}>
          <div className="prog-fill" style={{ width: prog.pct + "%" }} />
        </div>
        <div className="svc-list">
          {neededIds(g).length === 0 && (
            <Empty text="Belum ada layanan dipilih. Klik 'Edit Info Rombongan' untuk memilih layanan yang dibutuhkan." />
          )}
          {neededIds(g).map((id) => {
            const s = SERVICES.find((x) => x.id === id);
            if (!s) return null;
            return (
              <ServiceRow
                key={s.id}
                svcDef={s}
                sv={
                  (g.services && g.services[s.id]) || {
                    status: "Belum",
                    due: null,
                    pic: "",
                    note: "",
                    link: "",
                  }
                }
                alert={serviceAlert(g, s.id)}
                onChange={(patch) => setService(g.id, s.id, patch)}
              />
            );
          })}
        </div>
      </div>
      <div className="card">
        <div className="card-head">
          <h3>Jamaah dalam Rombongan ({jam.length})</h3>
          <button
            className="btn btn-out btn-xs"
            onClick={() => setJamaahModal({ groupId: g.id })}
          >
            <Plus size={14} /> Tambah Jamaah
          </button>
        </div>
        {jam.length === 0 ? (
          <Empty text="Belum ada jamaah di rombongan ini" />
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>L/P</th>
                  <th>No Paspor</th>
                  <th>Exp Paspor</th>
                  <th>Kontak</th>
                  <th>Bayar</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {jam.map((j) => {
                  const exp = daysUntil(j.passportExpiry);
                  const expCls =
                    exp === null
                      ? ""
                      : exp < 0
                      ? "st-over"
                      : exp < 180
                      ? "st-part"
                      : "st-paid";
                  return (
                    <tr key={j.id}>
                      <td>{j.name}</td>
                      <td className="sm">{j.gender || "—"}</td>
                      <td className="sm mono">{j.passportNo || "—"}</td>
                      <td className="sm">
                        {j.passportExpiry ? (
                          <span className={"st " + expCls}>
                            {fmtDate(j.passportExpiry)}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="sm">{j.phone || "—"}</td>
                      <td>
                        <span
                          className={
                            "st " +
                            (j.paymentStatus === "Lunas"
                              ? "st-paid"
                              : j.paymentStatus === "DP"
                              ? "st-part"
                              : "st-unpaid")
                          }
                        >
                          {j.paymentStatus || "Belum"}
                        </span>
                      </td>
                      <td className="actions">
                        <button
                          className="icon-btn sm"
                          title="Cetak Invoice"
                          onClick={() => setInvoiceModal(j)}
                        >
                          <Printer size={13} />
                        </button>
                        <button
                          className="icon-btn sm"
                          onClick={() => setJamaahModal(j)}
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          className="icon-btn sm danger"
                          onClick={() => {
                            if (confirmAct("Hapus jamaah?")) delJamaah(j.id);
                          }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function ServiceRow({ svcDef, sv, alert, onChange }) {
  const I = svcDef.icon;
  const [pic, setPic] = useState(sv.pic || "");
  const [note, setNote] = useState(sv.note || "");
  const [link, setLink] = useState(sv.link || "");
  useEffect(() => {
    setPic(sv.pic || "");
    setNote(sv.note || "");
    setLink(sv.link || "");
  }, [sv.pic, sv.note, sv.link]);
  return (
    <div className={"svc-row" + (alert ? " svc-row-" + alert : "")}>
      <div className="svc-row-name">
        <span className={"svc-ic " + SVC_CLS[sv.status]}>
          <I size={15} />
        </span>
        {svcDef.label}
        {alert === "overdue" && (
          <span className="svc-flag over">Lewat tempo</span>
        )}
        {alert === "soon" && <span className="svc-flag soon">Segera</span>}
      </div>
      <select
        className="input"
        value={sv.status}
        onChange={(e) => onChange({ status: e.target.value })}
      >
        {SVC_STATUS.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <input
        type="date"
        className="input"
        title="Deadline"
        value={sv.due ? fmtDateInput(sv.due) : ""}
        onChange={(e) =>
          onChange({
            due: e.target.value ? new Date(e.target.value).toISOString() : null,
          })
        }
      />
      <input
        className="input"
        placeholder="PIC"
        value={pic}
        onChange={(e) => setPic(e.target.value)}
        onBlur={() => onChange({ pic })}
      />
      <input
        className="input"
        placeholder="Catatan"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        onBlur={() => onChange({ note })}
      />
      <input
        className="input"
        placeholder="Link berkas"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        onBlur={() => onChange({ link })}
      />
    </div>
  );
}

/* ============================================================
   VIEW: PELAYANAN (worklist + matriks)
   ============================================================ */
function Pelayanan({ data, setSelGroup, setView, setService }) {
  const items = [];
  data.groups.forEach((g) =>
    neededIds(g).forEach((id) => {
      const s = SERVICES.find((x) => x.id === id);
      if (!s) return;
      const sv = g.services && g.services[s.id];
      if (!sv || sv.status === "Selesai" || sv.status === "N/A") return;
      items.push({ g, s, sv, al: serviceAlert(g, s.id) });
    })
  );
  const rank = { overdue: 0, soon: 1, null: 2 };
  items.sort(
    (a, b) =>
      rank[a.al] - rank[b.al] ||
      new Date(a.g.departDate || "2999") - new Date(b.g.departDate || "2999")
  );
  const overdue = items.filter((i) => i.al === "overdue").length;
  const soon = items.filter((i) => i.al === "soon").length;
  const groupsUp = [...data.groups]
    .filter((g) => {
      const n = daysUntil(g.departDate);
      return n === null || n >= -1;
    })
    .sort(
      (a, b) =>
        new Date(a.departDate || "2999") - new Date(b.departDate || "2999")
    );
  const open = (gid) => {
    setSelGroup(gid);
    setView("keberangkatan");
  };

  return (
    <div className="stack">
      <div className="grid-3">
        <StatCard
          icon={ClipboardList}
          tone="blue"
          label="Total Tugas Layanan"
          value={items.length}
        />
        <StatCard
          icon={AlertCircle}
          tone="red"
          label="Lewat Tempo"
          value={overdue}
        />
        <StatCard
          icon={Clock}
          tone="amber"
          label="Segera (dekat berangkat)"
          value={soon}
        />
      </div>
      <div className="card">
        <div className="card-head">
          <h3>Yang Perlu Dikerjakan</h3>
          <span className="muted sm">diurutkan dari paling mendesak</span>
        </div>
        {items.length === 0 ? (
          <Empty text="Semua layanan beres 🎉" />
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Layanan</th>
                  <th>Rombongan</th>
                  <th>Status</th>
                  <th>Deadline</th>
                  <th>Berangkat</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, idx) => (
                  <tr
                    key={idx}
                    className={
                      it.al === "overdue"
                        ? "row-over"
                        : it.al === "soon"
                        ? "row-soon"
                        : ""
                    }
                  >
                    <td>{it.s.label}</td>
                    <td className="sm">{it.g.name}</td>
                    <td>
                      <span
                        className={
                          "st " +
                          (it.sv.status === "Proses" ? "st-part" : "st-unpaid")
                        }
                      >
                        {it.sv.status}
                      </span>
                    </td>
                    <td className="sm">
                      {it.sv.due ? (
                        fmtDate(it.sv.due)
                      ) : (
                        <span className="muted">—</span>
                      )}
                      {it.al === "overdue" && (
                        <span className="svc-flag over">lewat</span>
                      )}
                    </td>
                    <td className="sm nowrap">
                      {countdownLabel(it.g.departDate)}
                    </td>
                    <td className="actions">
                      <button
                        className="btn btn-xs btn-out"
                        onClick={() => open(it.g.id)}
                      >
                        Buka
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="card">
        <div className="card-head">
          <h3>Matriks Status Layanan</h3>
          <span className="muted sm">klik nama rombongan untuk kelola</span>
        </div>
        {groupsUp.length === 0 ? (
          <Empty text="Belum ada rombongan" />
        ) : (
          <div className="table-wrap">
            <table className="table matrix">
              <thead>
                <tr>
                  <th>Rombongan</th>
                  {SERVICES.map((s) => (
                    <th key={s.id} className="mtx-h" title={s.label}>
                      {s.short}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {groupsUp.map((g) => (
                  <tr key={g.id}>
                    <td className="nowrap">
                      <button className="link" onClick={() => open(g.id)}>
                        {g.name}
                      </button>
                      <div className="muted xs">
                        {countdownLabel(g.departDate)}
                      </div>
                    </td>
                    {SERVICES.map((s) => {
                      if (!neededIds(g).includes(s.id))
                        return (
                          <td key={s.id} className="mtx-c">
                            <span className="mtx-na">–</span>
                          </td>
                        );
                      const sv = (g.services && g.services[s.id]) || {
                        status: "Belum",
                      };
                      const al = serviceAlert(g, s.id);
                      return (
                        <td key={s.id} className="mtx-c">
                          <span
                            title={s.label + ": " + sv.status}
                            className={
                              "svc-dot " +
                              SVC_CLS[sv.status] +
                              (al ? " dot-alert" : "")
                            }
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   VIEW: JAMAAH (database)
   ============================================================ */
function JamaahView({
  data,
  setJamaahModal,
  delJamaah,
  setBulkJamaahModal,
  setInvoiceModal,
}) {
  const [q, setQ] = useState("");
  const [grp, setGrp] = useState("ALL");
  const gById = Object.fromEntries(data.groups.map((g) => [g.id, g]));
  let list = data.jamaah;
  if (grp === "NONE") list = list.filter((j) => !j.groupId);
  else if (grp !== "ALL") list = list.filter((j) => j.groupId === grp);
  if (q)
    list = list.filter((j) =>
      (
        j.name +
        " " +
        (j.passportNo || "") +
        " " +
        (j.nik || "") +
        " " +
        (j.phone || "")
      )
        .toLowerCase()
        .includes(q.toLowerCase())
    );
  const expSoon = data.jamaah.filter((j) => {
    const n = daysUntil(j.passportExpiry);
    return n !== null && n >= 0 && n < 180;
  }).length;
  const expired = data.jamaah.filter((j) => {
    const n = daysUntil(j.passportExpiry);
    return n !== null && n < 0;
  }).length;

  return (
    <div className="stack">
      <div className="grid-3">
        <StatCard
          icon={Users}
          tone="emerald"
          label="Total Jamaah"
          value={data.jamaah.length}
        />
        <StatCard
          icon={Clock}
          tone="amber"
          label="Paspor < 6 Bulan"
          value={expSoon}
        />
        <StatCard
          icon={AlertCircle}
          tone={expired ? "red" : "green"}
          label="Paspor Kedaluwarsa"
          value={expired}
        />
      </div>
      <div className="toolbar">
        <div className="search">
          <Search size={15} />
          <input
            placeholder="Cari nama, paspor, NIK, HP…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <select
          className="input"
          style={{ maxWidth: 210 }}
          value={grp}
          onChange={(e) => setGrp(e.target.value)}
        >
          <option value="ALL">Semua Rombongan</option>
          <option value="NONE">Tanpa Rombongan</option>
          {data.groups.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
        <div className="grow" />
        <button className="btn btn-out" onClick={() => setBulkJamaahModal({})}>
          <Plus size={16} /> Import Massal
        </button>
        <button className="btn btn-primary" onClick={() => setJamaahModal({})}>
          <Plus size={16} /> Tambah Jamaah
        </button>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Nama</th>
                <th>L/P</th>
                <th>No Paspor</th>
                <th>Exp</th>
                <th>Kontak</th>
                <th>Rombongan</th>
                <th>Bayar</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {list.map((j) => {
                const exp = daysUntil(j.passportExpiry);
                const expCls =
                  exp === null
                    ? ""
                    : exp < 0
                    ? "st-over"
                    : exp < 180
                    ? "st-part"
                    : "st-paid";
                return (
                  <tr key={j.id}>
                    <td>
                      {j.name}
                      {j.nik && <div className="muted xs mono">{j.nik}</div>}
                    </td>
                    <td className="sm">{j.gender || "—"}</td>
                    <td className="sm mono">{j.passportNo || "—"}</td>
                    <td className="sm">
                      {j.passportExpiry ? (
                        <span className={"st " + expCls}>
                          {fmtDate(j.passportExpiry)}
                        </span>
                      ) : (
                        <span className="muted">—</span>
                      )}
                    </td>
                    <td className="sm">{j.phone || "—"}</td>
                    <td className="sm">
                      {gById[j.groupId] ? (
                        gById[j.groupId].name
                      ) : (
                        <span className="muted">—</span>
                      )}
                    </td>
                    <td>
                      <span
                        className={
                          "st " +
                          (j.paymentStatus === "Lunas"
                            ? "st-paid"
                            : j.paymentStatus === "DP"
                            ? "st-part"
                            : "st-unpaid")
                        }
                      >
                        {j.paymentStatus || "Belum"}
                      </span>
                    </td>
                    <td className="actions">
                      <button
                        className="icon-btn sm"
                        title="Cetak Invoice"
                        onClick={() => setInvoiceModal(j)}
                      >
                        <Printer size={14} />
                      </button>
                      <button
                        className="icon-btn sm"
                        onClick={() => setJamaahModal(j)}
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        className="icon-btn sm danger"
                        onClick={() => {
                          if (confirmAct("Hapus jamaah?")) delJamaah(j.id);
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {list.length === 0 && (
                <tr>
                  <td colSpan={8}>
                    <Empty text="Tidak ada jamaah yang cocok" />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ── MODAL: CETAK INVOICE ── */
function InvoiceModal({ jamaah, data, onClose, initSelected }) {
  const group = data.groups.find((g) => g.id === jamaah.groupId);
  const today = new Date();
  const defNomor =
    "INV-" +
    String(today.getFullYear()).slice(-2) +
    String(today.getMonth() + 1).padStart(2, "0") +
    String(today.getDate()).padStart(2, "0") +
    "-" +
    String(jamaah.id || "").replace(/\D/g, "").slice(-4).padStart(4, "0");
  const defPeriode = group
    ? [group.departDate, group.returnDate]
        .filter(Boolean)
        .map((d) => fmtDate(d))
        .join(" - ")
    : "";
  const defKuantitas = (group?.pax || 1) + " Pax";

  const [nomor, setNomor] = useState(defNomor);
  const [tanggal, setTanggal] = useState(fmtDateInput(today));
  const [periode, setPeriode] = useState(defPeriode);
  const [nama, setNama] = useState(jamaah.name || "");
  const [telepon, setTelepon] = useState(jamaah.phone || "");
  const [email, setEmail] = useState(jamaah.email || "");
  const [items, setItems] = useState(
    SERVICES.map((s) => ({
      id: s.id,
      label: s.label,
      checked: !!(initSelected && initSelected[s.id] != null),
      kuantitas: defKuantitas,
      total: (initSelected && initSelected[s.id]) || 0,
    }))
  );
  const setItem = (id, patch) =>
    setItems((arr) => arr.map((it) => (it.id === id ? { ...it, ...patch } : it)));

  const selected = items.filter((it) => it.checked);
  const invData = {
    customerName: nama,
    periode,
    telepon,
    email,
    nomor,
    tanggal,
    items: selected.map((it) => ({
      deskripsi: it.label,
      kuantitas: it.kuantitas,
      total: it.total,
    })),
  };

  return (
    <Modal
      title="Cetak Invoice"
      sub={jamaah.name + (group ? " — " + group.name : "")}
      onClose={onClose}
      wide
    >
      <div className="no-print stack">
        <div className="grid-3">
          <Field label="Nama">
            <input
              className="input"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
            />
          </Field>
          <Field label="Telepon">
            <input
              className="input"
              value={telepon}
              onChange={(e) => setTelepon(e.target.value)}
            />
          </Field>
          <Field label="Email">
            <input
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
          <Field label="Nomor Invoice">
            <input
              className="input"
              value={nomor}
              onChange={(e) => setNomor(e.target.value)}
            />
          </Field>
          <Field label="Tanggal">
            <input
              type="date"
              className="input"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
            />
          </Field>
          <Field label="Periode (opsional)">
            <input
              className="input"
              value={periode}
              onChange={(e) => setPeriode(e.target.value)}
            />
          </Field>
        </div>
        <Field label="Pilih Layanan">
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th></th>
                  <th>Layanan</th>
                  <th>Kuantitas</th>
                  <th>Total (Rp)</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={it.checked}
                        onChange={(e) =>
                          setItem(it.id, { checked: e.target.checked })
                        }
                      />
                    </td>
                    <td>{it.label}</td>
                    <td>
                      <input
                        className="input"
                        style={{ maxWidth: 110 }}
                        disabled={!it.checked}
                        value={it.kuantitas}
                        onChange={(e) =>
                          setItem(it.id, { kuantitas: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="input"
                        style={{ maxWidth: 160 }}
                        disabled={!it.checked}
                        value={it.total || ""}
                        onChange={(e) =>
                          setItem(it.id, { total: Number(e.target.value) || 0 })
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Field>
        <div className="modal-foot">
          <button className="btn btn-out" onClick={onClose}>
            Tutup
          </button>
          <button
            className="btn btn-primary"
            disabled={!selected.length}
            onClick={() => window.print()}
          >
            <Printer size={16} /> Cetak Invoice
          </button>
        </div>
      </div>
      <div className="invoice-preview no-print">
        <InvoicePrint logo={LOGO_GOLD} data={invData} />
      </div>
      {createPortal(
        <div className="invoice-print-portal">
          <InvoicePrint logo={LOGO_GOLD} data={invData} />
        </div>,
        document.body
      )}
      <style>{`
        .invoice-preview{margin-top:16px;overflow:auto}
        .invoice-preview .inv-page{transform:scale(.55);transform-origin:top left}
        .invoice-preview{height:calc(297mm * .55 + 20px)}
        .invoice-print-portal{display:none}
        @media print{
          body>#root{display:none!important}
          .invoice-print-portal{display:block}
          .invoice-print-portal .inv-page{box-shadow:none;width:auto;margin:0}
        }
      `}</style>
    </Modal>
  );
}

/* ── FORM: ROMBONGAN ── */
function GroupForm({
  init,
  data,
  onClose,
  onSave,
  onAddCategory,
  onAddContact,
}) {
  const defaultAccountId = defaultGroupAccount(data);
  const [f, setF] = useState({
    name: "",
    packageType: "Umroh",
    pax: 0,
    muthawif: "",
    driveLink: "",
    notes: "",
    ...init,
    needed: normalizeNeededServices(init.needed),
    departDate: init.departDate ? fmtDateInput(init.departDate) : "",
    returnDate: init.returnDate ? fmtDateInput(init.returnDate) : "",
    txDate: fmtDateInput(new Date()),
    txAccountId: defaultAccountId,
    txMethod: "Transfer",
    incomeAmount: 0,
    incomeCategoryId: defaultIncomeCategory(data),
    incomeContactId: "",
    incomeReference: "",
    incomeDescription: "",
    expenseAmount: 0,
    expenseCategoryId: defaultExpenseCategory(data),
    expenseContactId: "",
    expenseReference: "",
    expenseDescription: "",
    adminAmount: 0,
    adminCategoryId: "",
    adminDescription: "",
  });
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const incomeCats = data.categories.filter((c) => c.kind === "income");
  const expenseCats = data.categories.filter((c) => c.kind === "expense");
  const selectedAcc = data.accounts.find((a) => a.id === f.txAccountId);
  const incomePreview = Math.round(Number(f.incomeAmount) || 0);
  const expensePreview =
    Math.round(Number(f.expenseAmount) || 0) +
    Math.round(Number(f.adminAmount) || 0);
  const profitPreview = incomePreview - expensePreview;
  const packageTypeOptions = Array.from(
    new Set([
      ...PACKAGE_TYPES,
      ...(data.groups || []).map((g) => g.packageType).filter(Boolean),
    ])
  );
  return (
    <Modal
      title={init.id ? "Edit Rombongan" : "Rombongan Baru"}
      onClose={onClose}
      wide
    >
      <div className="grid-2">
        <Field label="Nama Rombongan / Grup">
          <input
            className="input"
            value={f.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="cth: Yura Eropa"
          />
        </Field>
        <Field label="Jenis Paket">
          <input
            className="input"
            list="package-type-options"
            value={f.packageType}
            onChange={(e) => set("packageType", e.target.value)}
            placeholder="Umroh / Haji / Tour / jenis baru"
          />
          <datalist id="package-type-options">
            {packageTypeOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </datalist>
        </Field>
      </div>
      <div className="grid-2">
        <Field label="Tanggal Berangkat">
          <input
            type="date"
            className="input"
            value={f.departDate}
            onChange={(e) => set("departDate", e.target.value)}
          />
        </Field>
        <Field label="Tanggal Pulang">
          <input
            type="date"
            className="input"
            value={f.returnDate}
            onChange={(e) => set("returnDate", e.target.value)}
          />
        </Field>
      </div>
      <Field label="Jumlah Pax">
        <input
          type="number"
          className="input"
          value={f.pax}
          onChange={(e) => set("pax", e.target.value)}
        />
      </Field>
      <Field label="Layanan yang Dibutuhkan">
        <div className="svc-pick-head">
          <span className="muted xs">
            {f.needed.length} dari {SERVICES.length} layanan dipilih
          </span>
          <div className="grow" />
          <button
            type="button"
            className="link"
            onClick={() =>
              set(
                "needed",
                SERVICES.map((s) => s.id)
              )
            }
          >
            Pilih semua
          </button>
          <button
            type="button"
            className="link"
            onClick={() => set("needed", [])}
          >
            Kosongkan
          </button>
        </div>
        <div className="svc-pick">
          {SERVICES.map((s) => {
            const on = f.needed.includes(s.id);
            const I = s.icon;
            return (
              <button
                type="button"
                key={s.id}
                className={"svc-chip" + (on ? " on" : "")}
                onClick={() =>
                  set(
                    "needed",
                    on
                      ? f.needed.filter((x) => x !== s.id)
                      : [...f.needed, s.id]
                  )
                }
              >
                <I size={13} /> {s.short}
                {on && <Check size={12} />}
              </button>
            );
          })}
        </div>
      </Field>
      <Field label="Link Berkas (Google Drive, opsional)">
        <input
          className="input"
          value={f.driveLink}
          onChange={(e) => set("driveLink", e.target.value)}
          placeholder="https://drive.google.com/…"
        />
      </Field>
      <Field label="Catatan">
        <input
          className="input"
          value={f.notes}
          onChange={(e) => set("notes", e.target.value)}
        />
      </Field>
      <div className="card group-tx-box">
        <div className="card-head">
          <div>
            <h3>Transaksi Rombongan</h3>
            <p className="muted sm">
              Opsional. Isi kalau kamu juga ingin langsung mencatat uang masuk
              dan uang keluar untuk rombongan ini.
            </p>
          </div>
        </div>
        <div className="grid-3">
          <Field label="Tanggal Transaksi">
            <input
              type="date"
              className="input"
              value={f.txDate}
              onChange={(e) => set("txDate", e.target.value)}
            />
          </Field>
          <Field label="Rekening">
            <select
              className="input"
              value={f.txAccountId}
              onChange={(e) => set("txAccountId", e.target.value)}
            >
              {data.accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({OWN[a.ownership]?.short || a.ownership})
                </option>
              ))}
            </select>
          </Field>
          <Field label="Metode">
            <input
              className="input"
              value={f.txMethod}
              onChange={(e) => set("txMethod", e.target.value)}
              placeholder="Transfer / Cash / QRIS"
            />
          </Field>
        </div>
        <div className="info-good">
          <Receipt size={14} />
          Transaksi otomatis masuk ke menu Transaksi dan terhubung ke rombongan
          ini. Sumber dana mengikuti rekening:{" "}
          {selectedAcc ? OWN[selectedAcc.ownership]?.label : "Belum dipilih"}.
        </div>
        <div className="grid-2">
          <div className="tx-mini-panel income-panel">
            <h4>
              <ArrowDownLeft size={15} /> Transaksi Masuk
            </h4>
            <Field label="Nominal Masuk">
              <CurrencyInput
                value={f.incomeAmount}
                onChange={(v) => set("incomeAmount", v)}
                placeholder="0"
              />
            </Field>
            <Field label="Kategori Masuk">
              <SelectAdd
                value={f.incomeCategoryId}
                onChange={(v) => set("incomeCategoryId", v)}
                placeholder="Tanpa kategori"
                addLabel="kategori masuk"
                options={incomeCats.map((c) => ({
                  value: c.id,
                  label: c.name,
                }))}
                onCreate={(name) => {
                  const c = {
                    id: uid("cat"),
                    name,
                    kind: "income",
                  };
                  onAddCategory(c);
                  return c.id;
                }}
              />
            </Field>
            <Field label="Dari Siapa">
              <SelectAdd
                value={f.incomeContactId}
                onChange={(v) => set("incomeContactId", v)}
                placeholder="- opsional -"
                addLabel="customer"
                options={data.contacts.map((c) => ({
                  value: c.id,
                  label: c.name,
                }))}
                onCreate={(name) => {
                  const c = {
                    id: uid("ct"),
                    name,
                    role: "CUSTOMER",
                    phone: "",
                  };
                  onAddContact(c);
                  return c.id;
                }}
              />
            </Field>
            <Field label="Referensi Masuk">
              <input
                className="input mono"
                value={f.incomeReference}
                onChange={(e) => set("incomeReference", e.target.value)}
                placeholder="No. mutasi / invoice"
              />
            </Field>
            <Field label="Deskripsi Masuk">
              <input
                className="input"
                value={f.incomeDescription}
                onChange={(e) => set("incomeDescription", e.target.value)}
                placeholder="Kosongkan untuk otomatis"
              />
            </Field>
          </div>
          <div className="tx-mini-panel expense-panel">
            <h4>
              <ArrowUpRight size={15} /> Transaksi Keluar
            </h4>
            <Field label="Nominal Keluar Real">
              <CurrencyInput
                value={f.expenseAmount}
                onChange={(v) => set("expenseAmount", v)}
                placeholder="0"
              />
            </Field>
            <Field label="Biaya Admin">
              <CurrencyInput
                value={f.adminAmount}
                onChange={(v) => {
                  const n = Number(v) || 0;
                  setF((s) => ({
                    ...s,
                    adminAmount: v,
                    adminCategoryId:
                      n > 0
                        ? s.adminCategoryId || defaultAdminCategory(data)
                        : "",
                  }));
                }}
                placeholder="0"
              />
            </Field>
            <Field label="Kategori Keluar Real">
              <select
                className="input"
                value={f.expenseCategoryId}
                onChange={(e) => set("expenseCategoryId", e.target.value)}
              >
                <option value="">Tanpa kategori</option>
                {expenseCats.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Kategori Biaya Admin">
              <select
                className="input"
                value={f.adminCategoryId}
                onChange={(e) => set("adminCategoryId", e.target.value)}
                disabled={!Number(f.adminAmount)}
              >
                <option value="">
                  {Number(f.adminAmount)
                    ? "Tanpa kategori"
                    : "Kosong - isi biaya admin dulu"}
                </option>
                {expenseCats.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Untuk Siapa">
              <SelectAdd
                value={f.expenseContactId}
                onChange={(v) => set("expenseContactId", v)}
                placeholder="- opsional -"
                addLabel="vendor"
                options={data.contacts.map((c) => ({
                  value: c.id,
                  label: c.name,
                }))}
                onCreate={(name) => {
                  const c = {
                    id: uid("ct"),
                    name,
                    role: "VENDOR",
                    phone: "",
                  };
                  onAddContact(c);
                  return c.id;
                }}
              />
            </Field>
            <Field label="Referensi Keluar">
              <input
                className="input mono"
                value={f.expenseReference}
                onChange={(e) => set("expenseReference", e.target.value)}
                placeholder="No. mutasi / invoice"
              />
            </Field>
            <Field label="Deskripsi Keluar Real">
              <input
                className="input"
                value={f.expenseDescription}
                onChange={(e) => set("expenseDescription", e.target.value)}
                placeholder="Kosongkan untuk otomatis"
              />
            </Field>
            <Field label="Deskripsi Biaya Admin">
              <input
                className="input"
                value={f.adminDescription}
                onChange={(e) => set("adminDescription", e.target.value)}
                placeholder="Kosongkan untuk otomatis"
              />
            </Field>
          </div>
        </div>
        <div className="group-profit-preview">
          <span>
            Masuk <b className="amt-income mono">{rupiah(incomePreview)}</b>
          </span>
          <span>
            Keluar <b className="amt-expense mono">{rupiah(expensePreview)}</b>
          </span>
          <span>
            Estimasi Profit{" "}
            <b
              className={
                (profitPreview >= 0 ? "amt-income" : "amt-expense") + " mono"
              }
            >
              {rupiah(profitPreview)}
            </b>
          </span>
        </div>
      </div>
      <div className="modal-foot">
        <div className="grow" />
        <button className="btn btn-ghost" onClick={onClose}>
          Batal
        </button>
        <button
          className="btn btn-primary"
          onClick={() => {
            if (!f.name) return notify("Nama rombongan wajib diisi");
            onSave({
              ...init,
              name: f.name,
              packageType: f.packageType,
              pax: Number(f.pax) || 0,
              needed: f.needed,
              driveLink: f.driveLink,
              notes: f.notes,
              departDate: f.departDate
                ? new Date(f.departDate).toISOString()
                : null,
              returnDate: f.returnDate
                ? new Date(f.returnDate).toISOString()
                : null,
              services: init.services,
              __txDraft: {
                date: f.txDate,
                accountId: f.txAccountId,
                method: f.txMethod,
                incomeAmount: f.incomeAmount,
                incomeCategoryId: f.incomeCategoryId,
                incomeContactId: f.incomeContactId,
                incomeReference: f.incomeReference,
                incomeDescription: f.incomeDescription,
                expenseAmount: f.expenseAmount,
                expenseCategoryId: f.expenseCategoryId,
                expenseContactId: f.expenseContactId,
                expenseReference: f.expenseReference,
                expenseDescription: f.expenseDescription,
                adminAmount: f.adminAmount,
                adminCategoryId: f.adminCategoryId,
                adminDescription: f.adminDescription,
              },
            });
          }}
        >
          Simpan
        </button>
      </div>
    </Modal>
  );
}

/* ── FORM: JAMAAH (AI Vision via Edge Function "read-doc") ── */
/* helper bersama: baca file (gambar dikompres, PDF dikirim apa adanya) */
const docFileToPayload = (file) =>
  new Promise((resolve, reject) => {
    if (file.type === "application/pdf" || /\.pdf$/i.test(file.name || "")) {
      const reader = new FileReader();
      reader.onload = () =>
        resolve({
          image: String(reader.result).split(",")[1],
          mediaType: "application/pdf",
        });
      reader.onerror = () => reject(new Error("Gagal membaca PDF."));
      reader.readAsDataURL(file);
      return;
    }
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      const maxDim = 1600;
      const scale = Math.min(1, maxDim / Math.max(width, height));
      width = Math.round(width * scale);
      height = Math.round(height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d").drawImage(img, 0, 0, width, height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
      resolve({ image: dataUrl.split(",")[1], mediaType: "image/jpeg" });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Gagal memuat gambar."));
    };
    img.src = url;
  });

/* helper bersama: bersihkan hasil AI */
const coerceDocResult = (doc) => {
  const out = { ...(doc || {}) };
  if (out.gender !== "L" && out.gender !== "P") delete out.gender;
  [
    "birthDate",
    "passportExpiry",
    "passportIssueDate",
    "visaIssueDate",
    "visaExpiry",
  ].forEach((k) => {
    if (out[k] && !/^\d{4}-\d{2}-\d{2}$/.test(out[k])) delete out[k];
  });
  Object.keys(out).forEach((k) => {
    if (!String(out[k] ?? "").trim()) delete out[k];
  });
  return out;
};

/* ── FORM: JAMAAH (AI Vision via Edge Function "read-doc") ── */
function JamaahForm({ init, data, onClose, onSave }) {
  const [f, setF] = useState({
    name: "",
    gender: "L",
    nik: "",
    passportNo: "",
    birthPlace: "",
    phone: "",
    address: "",
    groupId: "",
    paymentStatus: "Belum",
    notes: "",
    nationality: "",
    passportIssuePlace: "",
    ktpRtRw: "",
    ktpKelDesa: "",
    ktpKecamatan: "",
    ktpReligion: "",
    ktpMaritalStatus: "",
    ktpOccupation: "",
    ktpValidUntil: "",
    visaNo: "",
    visaType: "",
    visaSponsor: "",
    ...init,
    passportExpiry: init.passportExpiry
      ? fmtDateInput(init.passportExpiry)
      : "",
    birthDate: init.birthDate ? fmtDateInput(init.birthDate) : "",
    passportIssueDate: init.passportIssueDate
      ? fmtDateInput(init.passportIssueDate)
      : "",
    visaIssueDate: init.visaIssueDate ? fmtDateInput(init.visaIssueDate) : "",
    visaExpiry: init.visaExpiry ? fmtDateInput(init.visaExpiry) : "",
  });
  const [aiBusy, setAiBusy] = useState(false);
  const [aiStatus, setAiStatus] = useState("");
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));

  const LABELS = { passport: "Paspor", ktp: "KTP", visa: "Visa" };

  const applyDoc = (doc) => {
    setF((s) => {
      const next = { ...s };
      Object.entries(doc || {}).forEach(([k, v]) => {
        if (!String(v ?? "").trim()) return;
        if (k === "gender") {
          next[k] = v;
          return;
        }
        const cur = next[k];
        if (!String(cur ?? "").trim()) next[k] = v;
      });
      return next;
    });
  };

  const readDoc = async (file, kind) => {
    if (!file) return;
    setAiBusy(true);
    setAiStatus(`Membaca ${LABELS[kind]} dengan AI…`);
    try {
      const { image, mediaType } = await docFileToPayload(file);
      const { data: res, error } = await supabase.functions.invoke("read-doc", {
        body: { image, mediaType, kind },
      });
      if (error) throw error;
      if (res?.error) throw new Error(res.error);
      const parsed = coerceDocResult(res?.doc || {});
      applyDoc(parsed);
      const filled = Object.values(parsed).filter((v) =>
        String(v).trim()
      ).length;
      setAiStatus(
        filled
          ? `${LABELS[kind]} terbaca. ${filled} kolom terisi otomatis. Kolom yang sudah ada tidak ditimpa — mohon cek ulang sebelum simpan.`
          : `${LABELS[kind]} terbaca, tapi AI tidak yakin. Coba file lebih jelas/terang.`
      );
    } catch (err) {
      setAiStatus(
        err?.message ||
          "Gagal membaca dokumen. Cek koneksi internet lalu coba lagi."
      );
    } finally {
      setAiBusy(false);
    }
  };

  return (
    <Modal
      title={init.id ? "Edit Jamaah" : "Jamaah Baru"}
      onClose={onClose}
      wide
    >
      <div className="doc-upload-box">
        <div className="doc-upload-head">
          <div>
            <b>Isi Otomatis dari Dokumen (AI)</b>
            <span>
              Opsional. Upload Paspor, KTP, dan/atau Visa (foto atau PDF) — form
              terisi otomatis, sisanya tinggal lengkapi manual.
            </span>
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: 12,
          }}
        >
          <Field label="Upload Paspor">
            <input
              type="file"
              accept="image/*,application/pdf"
              className="input"
              disabled={aiBusy}
              onChange={(e) => readDoc(e.target.files?.[0], "passport")}
            />
          </Field>
          <Field label="Upload KTP">
            <input
              type="file"
              accept="image/*,application/pdf"
              className="input"
              disabled={aiBusy}
              onChange={(e) => readDoc(e.target.files?.[0], "ktp")}
            />
          </Field>
          <Field label="Upload Visa">
            <input
              type="file"
              accept="image/*,application/pdf"
              className="input"
              disabled={aiBusy}
              onChange={(e) => readDoc(e.target.files?.[0], "visa")}
            />
          </Field>
        </div>
        {aiStatus ? (
          <div className={aiBusy ? "ai-status busy" : "ai-status"}>
            {aiStatus}
          </div>
        ) : (
          <div className="ai-hint">
            Foto lurus/terang atau PDF asli memberi hasil paling akurat. Data
            hasil AI tetap wajib dicek sebelum disimpan.
          </div>
        )}
      </div>

      <div className="grid-2">
        <Field label="Nama Lengkap (sesuai paspor)">
          <input
            className="input"
            value={f.name}
            onChange={(e) => set("name", e.target.value)}
          />
        </Field>
        <Field label="Jenis Kelamin">
          <select
            className="input"
            value={f.gender}
            onChange={(e) => set("gender", e.target.value)}
          >
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </select>
        </Field>
      </div>
      <div className="grid-2">
        <Field label="NIK">
          <input
            className="input mono"
            value={f.nik}
            onChange={(e) => set("nik", e.target.value)}
          />
        </Field>
        <Field label="No. Paspor">
          <input
            className="input mono"
            value={f.passportNo}
            onChange={(e) => set("passportNo", e.target.value)}
          />
        </Field>
      </div>
      <div className="grid-2">
        <Field label="Masa Berlaku Paspor">
          <input
            type="date"
            className="input"
            value={f.passportExpiry}
            onChange={(e) => set("passportExpiry", e.target.value)}
          />
        </Field>
        <Field label="Tanggal Lahir">
          <input
            type="date"
            className="input"
            value={f.birthDate}
            onChange={(e) => set("birthDate", e.target.value)}
          />
        </Field>
      </div>
      <div className="grid-2">
        <Field label="Tempat Lahir">
          <input
            className="input"
            value={f.birthPlace}
            onChange={(e) => set("birthPlace", e.target.value)}
          />
        </Field>
        <Field label="No. HP / WhatsApp">
          <input
            className="input"
            value={f.phone}
            onChange={(e) => set("phone", e.target.value)}
          />
        </Field>
      </div>
      <Field label="Alamat">
        <input
          className="input"
          value={f.address}
          onChange={(e) => set("address", e.target.value)}
        />
      </Field>

      <div className="info-gold">
        <Stamp size={14} /> Data Visa (Arab Saudi)
      </div>
      <div className="grid-2">
        <Field label="No. Visa">
          <input
            className="input mono"
            value={f.visaNo}
            onChange={(e) => set("visaNo", e.target.value)}
          />
        </Field>
        <Field label="Jenis Visa">
          <input
            className="input"
            value={f.visaType}
            onChange={(e) => set("visaType", e.target.value)}
            placeholder="cth: Umrah / Hajj"
          />
        </Field>
      </div>
      <div className="grid-2">
        <Field label="Tanggal Terbit Visa">
          <input
            type="date"
            className="input"
            value={f.visaIssueDate}
            onChange={(e) => set("visaIssueDate", e.target.value)}
          />
        </Field>
        <Field label="Masa Berlaku Visa">
          <input
            type="date"
            className="input"
            value={f.visaExpiry}
            onChange={(e) => set("visaExpiry", e.target.value)}
          />
        </Field>
      </div>
      <Field label="Sponsor / Muassasah (opsional)">
        <input
          className="input"
          value={f.visaSponsor}
          onChange={(e) => set("visaSponsor", e.target.value)}
        />
      </Field>

      <div className="grid-2">
        <Field label="Kewarganegaraan">
          <input
            className="input"
            value={f.nationality}
            onChange={(e) => set("nationality", e.target.value)}
          />
        </Field>
        <Field label="Kantor Penerbit Paspor">
          <input
            className="input"
            value={f.passportIssuePlace}
            onChange={(e) => set("passportIssuePlace", e.target.value)}
          />
        </Field>
      </div>
      <div className="grid-2">
        <Field label="Tanggal Terbit Paspor">
          <input
            type="date"
            className="input"
            value={f.passportIssueDate}
            onChange={(e) => set("passportIssueDate", e.target.value)}
          />
        </Field>
        <Field label="Berlaku KTP">
          <input
            className="input"
            value={f.ktpValidUntil}
            onChange={(e) => set("ktpValidUntil", e.target.value)}
            placeholder="Contoh: SEUMUR HIDUP"
          />
        </Field>
      </div>
      <div className="grid-2">
        <Field label="Agama">
          <input
            className="input"
            value={f.ktpReligion}
            onChange={(e) => set("ktpReligion", e.target.value)}
          />
        </Field>
        <Field label="Status Perkawinan">
          <input
            className="input"
            value={f.ktpMaritalStatus}
            onChange={(e) => set("ktpMaritalStatus", e.target.value)}
          />
        </Field>
      </div>
      <div className="grid-2">
        <Field label="Pekerjaan">
          <input
            className="input"
            value={f.ktpOccupation}
            onChange={(e) => set("ktpOccupation", e.target.value)}
          />
        </Field>
        <Field label="RT/RW">
          <input
            className="input"
            value={f.ktpRtRw}
            onChange={(e) => set("ktpRtRw", e.target.value)}
          />
        </Field>
      </div>
      <div className="grid-2">
        <Field label="Kel/Desa">
          <input
            className="input"
            value={f.ktpKelDesa}
            onChange={(e) => set("ktpKelDesa", e.target.value)}
          />
        </Field>
        <Field label="Kecamatan">
          <input
            className="input"
            value={f.ktpKecamatan}
            onChange={(e) => set("ktpKecamatan", e.target.value)}
          />
        </Field>
      </div>
      <div className="grid-2">
        <Field label="Rombongan">
          <select
            className="input"
            value={f.groupId}
            onChange={(e) => set("groupId", e.target.value)}
          >
            <option value="">— belum ditentukan —</option>
            {data.groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Status Pembayaran">
          <select
            className="input"
            value={f.paymentStatus}
            onChange={(e) => set("paymentStatus", e.target.value)}
          >
            {PAY_STATUS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Catatan">
        <input
          className="input"
          value={f.notes}
          onChange={(e) => set("notes", e.target.value)}
        />
      </Field>

      <div className="modal-foot">
        <div className="grow" />
        <button className="btn btn-ghost" onClick={onClose}>
          Batal
        </button>
        <button
          className="btn btn-primary"
          onClick={() => {
            if (!f.name) return notify("Nama wajib diisi");
            onSave({
              ...init,
              name: f.name,
              gender: f.gender,
              nik: f.nik,
              passportNo: f.passportNo,
              birthPlace: f.birthPlace,
              phone: f.phone,
              address: f.address,
              groupId: f.groupId,
              paymentStatus: f.paymentStatus,
              notes: f.notes,
              nationality: f.nationality,
              passportIssuePlace: f.passportIssuePlace,
              ktpRtRw: f.ktpRtRw,
              ktpKelDesa: f.ktpKelDesa,
              ktpKecamatan: f.ktpKecamatan,
              ktpReligion: f.ktpReligion,
              ktpMaritalStatus: f.ktpMaritalStatus,
              ktpOccupation: f.ktpOccupation,
              ktpValidUntil: f.ktpValidUntil,
              visaNo: f.visaNo,
              visaType: f.visaType,
              visaSponsor: f.visaSponsor,
              passportExpiry: f.passportExpiry
                ? new Date(f.passportExpiry).toISOString()
                : null,
              birthDate: f.birthDate
                ? new Date(f.birthDate).toISOString()
                : null,
              passportIssueDate: f.passportIssueDate
                ? new Date(f.passportIssueDate).toISOString()
                : null,
              visaIssueDate: f.visaIssueDate
                ? new Date(f.visaIssueDate).toISOString()
                : null,
              visaExpiry: f.visaExpiry
                ? new Date(f.visaExpiry).toISOString()
                : null,
            });
          }}
        >
          Simpan
        </button>
      </div>
    </Modal>
  );
}

/* ── IMPORT MASSAL JAMAAH (banyak paspor sekaligus) ── */
function BulkJamaahImport({ init, data, onClose, onImport }) {
  const [groupId, setGroupId] = useState(init?.groupId || "");
  const [paymentStatus, setPaymentStatus] = useState("Belum");
  const [rows, setRows] = useState([]);
  const [busy, setBusy] = useState(false);

  const setRow = (id, patch) =>
    setRows((rs) => rs.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  const setField = (id, key, val) =>
    setRows((rs) =>
      rs.map((x) => (x.id === id ? { ...x, doc: { ...x.doc, [key]: val } } : x))
    );
  const removeRow = (id) => setRows((rs) => rs.filter((x) => x.id !== id));

  const onFiles = async (fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    const fresh = files.map((file) => ({
      id: uid("bulk"),
      fileName: file.name,
      file,
      status: "queue",
      doc: {},
      error: "",
    }));
    setRows((rs) => [...rs, ...fresh]);
    setBusy(true);
    for (const r of fresh) {
      setRow(r.id, { status: "reading" });
      try {
        const { image, mediaType } = await docFileToPayload(r.file);
        const { data: res, error } = await supabase.functions.invoke(
          "read-doc",
          { body: { image, mediaType, kind: "passport" } }
        );
        if (error) throw error;
        if (res?.error) throw new Error(res.error);
        const parsed = coerceDocResult(res?.doc || {});
        setRow(r.id, { status: "done", doc: parsed });
      } catch (err) {
        setRow(r.id, { status: "error", error: err?.message || "Gagal" });
      }
    }
    setBusy(false);
  };

  const ready = rows.filter((r) => r.status === "done" || r.status === "error");
  const valid = rows.filter((r) => String(r.doc?.name || "").trim());

  const doImport = () => {
    if (!valid.length)
      return notify("Belum ada jamaah dengan nama untuk disimpan.");
    const list = valid.map((r) => {
      const d = r.doc;
      return {
        name: d.name || "",
        gender: d.gender === "P" ? "P" : "L",
        nik: d.nik || "",
        passportNo: d.passportNo || "",
        birthPlace: d.birthPlace || "",
        phone: "",
        address: "",
        groupId: groupId || "",
        paymentStatus,
        notes: "",
        nationality: d.nationality || "",
        passportIssuePlace: d.passportIssuePlace || "",
        passportExpiry: d.passportExpiry
          ? new Date(d.passportExpiry).toISOString()
          : null,
        birthDate: d.birthDate ? new Date(d.birthDate).toISOString() : null,
        passportIssueDate: d.passportIssueDate
          ? new Date(d.passportIssueDate).toISOString()
          : null,
      };
    });
    onImport(list);
  };

  return (
    <Modal title="Import Massal Jamaah" onClose={onClose} wide>
      <div className="info-good">
        <Users size={14} /> Upload banyak <b>paspor</b> sekaligus (foto/PDF). 1
        file = 1 jamaah. KTP & visa bisa dilengkapi nanti lewat tombol Edit.
      </div>
      <div className="grid-2">
        <Field label="Masukkan ke Rombongan">
          <select
            className="input"
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
          >
            <option value="">— belum ditentukan —</option>
            {data.groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Status Pembayaran (semua)">
          <select
            className="input"
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
          >
            {PAY_STATUS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Pilih banyak file paspor (bisa pilih sekaligus)">
        <input
          type="file"
          accept="image/*,application/pdf"
          multiple
          className="input"
          disabled={busy}
          onChange={(e) => onFiles(e.target.files)}
        />
      </Field>
      {rows.length > 0 && (
        <div className="imp-summary">
          <span>
            <b>{rows.length}</b> file
          </span>
          <span className="dot-sep">·</span>
          <span className="st st-paid">{ready.length} selesai dibaca</span>
          {busy && <span className="st st-part">membaca…</span>}
        </div>
      )}
      {rows.length > 0 && (
        <div className="imp-table-wrap">
          <table className="table imp-table">
            <thead>
              <tr>
                <th>File</th>
                <th>Nama</th>
                <th>No Paspor</th>
                <th>L/P</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="sm">{r.fileName}</td>
                  <td>
                    <input
                      className="input"
                      value={r.doc?.name || ""}
                      placeholder={
                        r.status === "reading" ? "membaca…" : "(kosong)"
                      }
                      onChange={(e) => setField(r.id, "name", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      className="input mono"
                      value={r.doc?.passportNo || ""}
                      onChange={(e) =>
                        setField(r.id, "passportNo", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <select
                      className="input"
                      value={r.doc?.gender === "P" ? "P" : "L"}
                      onChange={(e) => setField(r.id, "gender", e.target.value)}
                    >
                      <option value="L">L</option>
                      <option value="P">P</option>
                    </select>
                  </td>
                  <td className="sm">
                    {r.status === "reading" && (
                      <span className="st st-part">Membaca…</span>
                    )}
                    {r.status === "queue" && (
                      <span className="st st-unpaid">Antre</span>
                    )}
                    {r.status === "done" && (
                      <span className="st st-paid">OK</span>
                    )}
                    {r.status === "error" && (
                      <span className="st st-over" title={r.error}>
                        Gagal
                      </span>
                    )}
                  </td>
                  <td>
                    <button
                      className="icon-btn sm danger"
                      onClick={() => removeRow(r.id)}
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="modal-foot">
        <div className="grow" />
        <button className="btn btn-ghost" onClick={onClose}>
          Batal
        </button>
        <button
          className="btn btn-primary"
          disabled={busy || !valid.length}
          onClick={doImport}
        >
          Simpan {valid.length} Jamaah
        </button>
      </div>
    </Modal>
  );
}
/* ============================================================
   IMPORT MUTASI BANK (BSI .xls/.xlsx, CSV)
   ============================================================ */
/* ── FORM: TRANSAKSI MASUK + KELUAR (sepasang, profit langsung terlihat) ── */
function DealForm({
  init,
  data,
  onClose,
  onSave,
  onAddContact,
  onAddCategory,
}) {
  const defAcc = defaultGroupAccount(data);
  const [f, setF] = useState({
    label: "",
    date: fmtDateInput(new Date()),
    method: "Transfer",
    inAmount: 0,
    inAccountId: defAcc,
    inCategoryId: defaultIncomeCategory(data),
    inContactId: "",
    inDesc: "",
    outAmount: 0,
    outAccountId: defAcc,
    outCategoryId: defaultExpenseCategory(data),
    outContactId: "",
    outDesc: "",
    adminAmount: 0,
    adminCategoryId: defaultAdminCategory(data),
    adminDesc: "",
    ...init,
  });
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const incomeCats = data.categories.filter((c) => c.kind === "income");
  const expenseCats = data.categories.filter((c) => c.kind === "expense");
  const inAmt = Math.round(Number(f.inAmount) || 0);
  const outAmt = Math.round(Number(f.outAmount) || 0);
  const adminAmt = Math.round(Number(f.adminAmount) || 0);
  const profit = inAmt - outAmt - adminAmt;

  return (
    <Modal
      title="Transaksi Masuk + Keluar"
      sub="Catat uang masuk & keluar sekaligus — profit langsung kelihatan"
      onClose={onClose}
      wide
    >
      <div className="grid-3">
        <Field label="Tanggal">
          <input
            type="date"
            className="input"
            value={f.date}
            onChange={(e) => set("date", e.target.value)}
          />
        </Field>
        <Field label="Metode">
          <input
            className="input"
            value={f.method}
            onChange={(e) => set("method", e.target.value)}
            placeholder="Transfer / Cash / QRIS"
          />
        </Field>
        <Field label="Nama Transaksi (opsional)">
          <input
            className="input"
            value={f.label}
            onChange={(e) => set("label", e.target.value)}
            placeholder="cth: Jual tiket Pak Budi"
          />
        </Field>
      </div>
      <div className="grid-2">
        <div className="tx-mini-panel income-panel">
          <h4>
            <ArrowDownLeft size={15} /> Uang Masuk
          </h4>
          <Field label="Nominal Masuk">
            <CurrencyInput
              value={f.inAmount}
              onChange={(v) => set("inAmount", v)}
            />
          </Field>
          <Field label="Diterima di Rekening">
            <select
              className="input"
              value={f.inAccountId}
              onChange={(e) => set("inAccountId", e.target.value)}
            >
              {data.accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({OWN[a.ownership]?.short})
                </option>
              ))}
            </select>
          </Field>
          <Field label="Kategori Masuk">
            <SelectAdd
              value={f.inCategoryId}
              onChange={(v) => set("inCategoryId", v)}
              placeholder="Tanpa kategori"
              addLabel="kategori masuk"
              options={incomeCats.map((c) => ({ value: c.id, label: c.name }))}
              onCreate={(name) => {
                const c = { id: uid("cat"), name, kind: "income" };
                onAddCategory(c);
                return c.id;
              }}
            />
          </Field>
          <Field label="Diterima dari">
            <SelectAdd
              value={f.inContactId}
              onChange={(v) => set("inContactId", v)}
              placeholder="- opsional -"
              addLabel="customer"
              options={data.contacts.map((c) => ({
                value: c.id,
                label: c.name,
              }))}
              onCreate={(name) => {
                const c = { id: uid("ct"), name, role: "CUSTOMER", phone: "" };
                onAddContact(c);
                return c.id;
              }}
            />
          </Field>
          <Field label="Deskripsi Masuk">
            <input
              className="input"
              value={f.inDesc}
              onChange={(e) => set("inDesc", e.target.value)}
              placeholder="Kosongkan untuk otomatis"
            />
          </Field>
        </div>
        <div className="tx-mini-panel expense-panel">
          <h4>
            <ArrowUpRight size={15} /> Uang Keluar
          </h4>
          <Field label="Nominal Keluar">
            <CurrencyInput
              value={f.outAmount}
              onChange={(v) => set("outAmount", v)}
            />
          </Field>
          <Field label="Dibayar dari Rekening">
            <select
              className="input"
              value={f.outAccountId}
              onChange={(e) => set("outAccountId", e.target.value)}
            >
              {data.accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({OWN[a.ownership]?.short})
                </option>
              ))}
            </select>
          </Field>
          <Field label="Kategori Keluar">
            <SelectAdd
              value={f.outCategoryId}
              onChange={(v) => set("outCategoryId", v)}
              placeholder="Tanpa kategori"
              addLabel="kategori keluar"
              options={expenseCats.map((c) => ({ value: c.id, label: c.name }))}
              onCreate={(name) => {
                const c = { id: uid("cat"), name, kind: "expense" };
                onAddCategory(c);
                return c.id;
              }}
            />
          </Field>
          <Field label="Dibayar ke">
            <SelectAdd
              value={f.outContactId}
              onChange={(v) => set("outContactId", v)}
              placeholder="- opsional -"
              addLabel="vendor"
              options={data.contacts.map((c) => ({
                value: c.id,
                label: c.name,
              }))}
              onCreate={(name) => {
                const c = { id: uid("ct"), name, role: "VENDOR", phone: "" };
                onAddContact(c);
                return c.id;
              }}
            />
          </Field>
          <Field label="Deskripsi Keluar">
            <input
              className="input"
              value={f.outDesc}
              onChange={(e) => set("outDesc", e.target.value)}
              placeholder="Kosongkan untuk otomatis"
            />
          </Field>
          <div
            style={{
              marginTop: 8,
              paddingTop: 10,
              borderTop: "1px dashed var(--line)",
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 11.5,
              fontWeight: 700,
              color: "#a87f29",
              textTransform: "uppercase",
              letterSpacing: ".04em",
            }}
          >
            <Receipt size={13} /> Biaya Admin (tercatat terpisah)
          </div>
          <Field label="Nominal Admin">
            <CurrencyInput
              value={f.adminAmount}
              onChange={(v) => set("adminAmount", v)}
            />
          </Field>
          <Field label="Kategori Admin">
            <SelectAdd
              value={f.adminCategoryId}
              onChange={(v) => set("adminCategoryId", v)}
              placeholder="Tanpa kategori"
              addLabel="kategori admin"
              options={expenseCats.map((c) => ({ value: c.id, label: c.name }))}
              onCreate={(name) => {
                const c = { id: uid("cat"), name, kind: "expense" };
                onAddCategory(c);
                return c.id;
              }}
            />
          </Field>
          <Field label="Deskripsi Admin">
            <input
              className="input"
              value={f.adminDesc}
              onChange={(e) => set("adminDesc", e.target.value)}
              placeholder="cth: Biaya transfer bank"
            />
          </Field>
        </div>
      </div>
      <div className="group-profit-preview">
        <span>
          Masuk <b className="amt-income mono">{rupiah(inAmt)}</b>
        </span>
        <span>
          Keluar <b className="amt-expense mono">{rupiah(outAmt)}</b>
        </span>
        <span>
          Admin <b className="amt-expense mono">{rupiah(adminAmt)}</b>
        </span>
        <span>
          Profit{" "}
          <b className={(profit >= 0 ? "amt-income" : "amt-expense") + " mono"}>
            {rupiah(profit)}
          </b>
        </span>
      </div>
      <div className="modal-foot">
        <div className="grow" />
        <button className="btn btn-ghost" onClick={onClose}>
          Batal
        </button>
        <button
          className="btn btn-primary"
          onClick={() => {
            if (inAmt <= 0 && outAmt <= 0 && adminAmt <= 0)
              return notify("Isi minimal salah satu nominal.");
            onSave({
              label: f.label,
              date: f.date,
              method: f.method,
              in: {
                amount: inAmt,
                accountId: f.inAccountId,
                categoryId: f.inCategoryId,
                contactId: f.inContactId,
                description: f.inDesc,
              },
              out: {
                amount: outAmt,
                accountId: f.outAccountId,
                categoryId: f.outCategoryId,
                contactId: f.outContactId,
                description: f.outDesc,
              },
              admin: {
                amount: adminAmt,
                accountId: f.outAccountId,
                categoryId: f.adminCategoryId,
                contactId: f.outContactId,
                description: f.adminDesc,
              },
            });
          }}
        >
          Simpan
        </button>
      </div>
    </Modal>
  );
}
function ImportMutasi({ data, onClose, onImport }) {
  const [step, setStep] = useState(1);
  const bsiDefault = data.accounts.find((a) =>
    /bsi|syariah/i.test((a.bank || "") + (a.name || ""))
  );
  const [accountId, setAccountId] = useState(
    (bsiDefault || data.accounts[0] || {}).id || ""
  );
  const [rows, setRows] = useState([]);
  const [fileName, setFileName] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const incomeCats = data.categories.filter((c) => c.kind === "income");
  const expenseCats = data.categories.filter((c) => c.kind === "expense");
  const existingKeys = new Set(data.tx.map((t) => t.importKey).filter(Boolean));

  const parseAmt = (s) => {
    if (s == null) return 0;

    if (typeof s === "number") {
      return Math.abs(s);
    }

    let t = String(s).trim();

    // format Indonesia
    if (/Rp/i.test(t) || /\.\d{3}/.test(t)) {
      t = t.replace(/[^0-9.-]/g, "").replace(/\./g, "");
    } else {
      t = t.replace(/[^0-9.,-]/g, "").replace(/,/g, "");
    }

    const n = Number(t);

    return isNaN(n) ? 0 : Math.abs(n);
  };
  const parseDate = (s) => {
    const t = String(s).trim();
    // ISO: YYYY-MM-DD
    const iso = t.match(/^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})/);
    if (iso) return new Date(+iso[1], +iso[2] - 1, +iso[3], 12).toISOString();
    // DD-MM-YYYY atau DD/MM/YYYY
    const m = t.match(/(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})/);
    if (!m) return null;
    return new Date(+m[3], +m[2] - 1, +m[1], 12).toISOString();
  };
  const parsePdfToRows = async (bytes) => {
    const pdfjs = await import("pdfjs-dist/legacy/build/pdf");
    if (pdfjs.GlobalWorkerOptions && !pdfjs.GlobalWorkerOptions.workerSrc) {
      pdfjs.GlobalWorkerOptions.workerSrc =
        "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js";
    }
    const pdf = await pdfjs.getDocument({ data: bytes }).promise;
    const out = [];
    for (let p = 1; p <= pdf.numPages; p++) {
      const page = await pdf.getPage(p);
      const text = await page.getTextContent();
      const items = (text.items || [])
        .map((it) => ({
          str: String(it.str || "")
            .replace(/\s+/g, " ")
            .trim(),
          x: Number(it.transform?.[4] || 0),
          y: Number(it.transform?.[5] || 0),
          w: Number(it.width || 0),
        }))
        .filter((it) => it.str);

      items.sort((a, b) => {
        if (Math.abs(b.y - a.y) > 2) return b.y - a.y;
        return a.x - b.x;
      });

      const lineGroups = [];
      items.forEach((it) => {
        const last = lineGroups[lineGroups.length - 1];
        if (!last || Math.abs(last.y - it.y) > 2.5) {
          lineGroups.push({ y: it.y, items: [it] });
        } else {
          last.items.push(it);
        }
      });

      lineGroups.forEach((line) => {
        const sorted = [...line.items].sort((a, b) => a.x - b.x);
        const cells = [];
        let cell = null;
        sorted.forEach((it) => {
          if (!cell) {
            cell = { text: it.str, endX: it.x + it.w };
            return;
          }
          const gap = it.x - cell.endX;
          if (gap > 18) {
            cells.push(cell.text.trim());
            cell = { text: it.str, endX: it.x + it.w };
          } else {
            cell.text += (/[/-]$/.test(cell.text) ? "" : " ") + it.str;
            cell.endX = Math.max(cell.endX, it.x + it.w);
          }
        });
        if (cell) cells.push(cell.text.trim());
        const clean = cells.filter(Boolean);
        if (clean.length) out.push(clean);
      });
    }
    return out;
  };
  const suggestCat = (desc, hint, type) => {
    const s = (desc + " " + hint).toLowerCase();
    const pool = type === "income" ? incomeCats : expenseCats;
    const find = (re) => {
      const c = pool.find((x) => re.test(x.name.toLowerCase()));
      return c ? c.id : null;
    };
    if (/adm|admin|\bfee\b|biaya admin/.test(s))
      return find(/bank|admin|biaya/);
    if (/pln|listrik|postpaid/.test(s))
      return find(/listrik|utilit|operasional|tagih/);
    if (type === "income") return find(/jamaah|pelunasan|pemasukan|dp/);
    return null;
  };

  const onFile = async (file) => {
    if (!file) return;
    setBusy(true);
    setErr("");
    setFileName(file.name);
    try {
      const buf = await file.arrayBuffer();
      const bytes = new Uint8Array(buf);
      const head = new TextDecoder()
        .decode(bytes.slice(0, 400))
        .trim()
        .toLowerCase();
      let aoa = [];
      let isGopayPdf = false;

      // CSV path (simple, no dependency)
      if (file.name.endsWith(".csv")) {
        const text = new TextDecoder("utf-8").decode(bytes);
        aoa = text.split("\n").map((line) => {
          let fields = [],
            current = "",
            inQuote = false;
          for (let i = 0; i < line.length; i++) {
            const c = line[i];
            if (c === '"' && (i === 0 || line[i - 1] !== "\\"))
              inQuote = !inQuote;
            else if (c === "," && !inQuote) {
              fields.push(current);
              current = "";
            } else current += c;
          }
          fields.push(current);
          return fields.map((f) => f.trim().replace(/^"|"$/g, ""));
        });
      }
      // HTML path (BSI .xls)
      else if (head.startsWith("<")) {
        const html = new TextDecoder("utf-8").decode(bytes);
        const doc = new DOMParser().parseFromString(html, "text/html");
        aoa = [...doc.querySelectorAll("tr")].map((tr) =>
          [...tr.querySelectorAll("td")].map((td) =>
            td.textContent.replace(/\s+/g, " ").trim()
          )
        );
      }

      // PDF path (export PDF yang masih berisi teks tabel)
      else if (file.name.endsWith(".pdf") || file.type === "application/pdf") {
        aoa = await parsePdfToRows(bytes);

        isGopayPdf =
          aoa.some((r) => r.join(" ").toLowerCase().includes("gopay saldo")) ||
          aoa.some((r) => r.join(" ").toLowerCase().includes("cashback"));
      }
      // XLSX path (needs SheetJS)
      else {
        const XLSX = await import("xlsx");
        const wb = XLSX.read(bytes, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        aoa = XLSX.utils.sheet_to_json(ws, {
          header: 1,
          raw: false,
          defval: "",
        });
      }
      if (isGopayPdf) {
        console.log("GO PAY PDF DETECTED");

        const out = [];

        for (let i = 0; i < aoa.length; i++) {
          const row = aoa[i].join(" ");

          const mDate = row.match(/(\d{2}\/\d{2}\/\d{4})/);

          if (!mDate) continue;

          const dt = mDate[1].split("/").reverse().join("-");

          const amountMatch = row.match(/-?Rp\s?[\d.]+/);

          if (!amountMatch) continue;

          const amount = parseAmt(amountMatch[0]);

          const type = amountMatch[0].includes("-") ? "expense" : "income";

          out.push({
            date: dt,
            type,
            amount: Math.abs(amount),
            description: row,
            reference: "",
            party: "",
            hint: "GoPay PDF",
            importKey: dt + "|" + amount + "|" + i,
            categoryId: null,
            include: true,
            dup: false,
          });
        }

        if (out.length) {
          setRows(out);
          setStep(2);
          setBusy(false);
          return;
        }
      }
      const hi = aoa.findIndex(
        (r) =>
          r.some((c) => /debet|nominal|tipe/i.test(c)) &&
          r.some((c) => /kredit|tipe|masuk|keluar/i.test(c))
      );
      if (hi < 0)
        throw new Error(
          "Format tidak dikenali — tidak menemukan kolom Debet/Kredit atau Tipe/Nominal."
        );
      const H = aoa[hi].map((c) => String(c).toLowerCase());
      const col = (re) => H.findIndex((c) => re.test(c));
      const ci = {
        date: col(/waktu|tanggal/),
        ref: col(/referensi/),
        kirim: col(/pengirim/),
        terima: col(/penerima/),
        desk: col(/deskripsi/),
        debet: col(/debet/),
        kredit: col(/kredit/),
        tipe: col(/^tipe$/),
        nominal: col(/nominal/),
        ket: col(/^keterangan$/),
      };

      const out = [];
      for (let i = hi + 1; i < aoa.length; i++) {
        const r = aoa[i];
        if (!r || !r.length) continue;
        const dt = parseDate(r[ci.date]);
        if (!dt) continue;

        let type, amount;
        if (ci.nominal >= 0 && ci.tipe >= 0) {
          // CSV format: Nominal + Tipe columns
          type = /masuk|in/i.test(r[ci.tipe]) ? "income" : "expense";
          amount = parseAmt(r[ci.nominal]);
        } else {
          // BSI format: Debet + Kredit columns
          const deb = ci.debet >= 0 ? parseAmt(r[ci.debet]) : 0;
          const kre = ci.kredit >= 0 ? parseAmt(r[ci.kredit]) : 0;
          if (deb === 0 && kre === 0) continue;
          type = deb > 0 ? "expense" : "income";
          amount = deb > 0 ? deb : kre;
        }

        if (amount === 0) continue;
        const desc = (ci.desk >= 0 ? r[ci.desk] : "") || "";
        const ref = (ci.ref >= 0 ? r[ci.ref] : "") || "";
        const party =
          type === "expense"
            ? ci.terima >= 0
              ? r[ci.terima]
              : ""
            : ci.kirim >= 0
            ? r[ci.kirim]
            : "";
        const hint = ci.ket >= 0 ? r[ci.ket] || "" : "";
        const importKey = (ref || "") + "|" + dt.slice(0, 10) + "|" + amount;
        out.push({
          date: dt,
          type,
          amount,
          description: desc,
          reference: ref,
          party,
          hint,
          importKey,
          categoryId: suggestCat(desc, hint, type),
          include: !existingKeys.has(importKey),
          dup: existingKeys.has(importKey),
        });
      }
      if (!out.length)
        throw new Error("Tidak ada transaksi terbaca dari file.");
      setRows(out);
      setStep(2);
    } catch (e) {
      setErr(e.message || "Gagal membaca file");
    }
    setBusy(false);
  };

  const setRow = (idx, patch) =>
    setRows((rs) => rs.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  const bulkCat = (type, catId) =>
    setRows((rs) =>
      rs.map((r) => (r.type === type ? { ...r, categoryId: catId || null } : r))
    );

  const sel = rows.filter((r) => r.include);
  const dupCount = rows.filter((r) => r.dup).length;
  const inCount = sel.filter((r) => r.type === "income").length;
  const exCount = sel.filter((r) => r.type === "expense").length;

  const doImport = () => {
    if (!accountId) return notify("Pilih akun tujuan dulu.");
    const acc = data.accounts.find((a) => a.id === accountId);
    const own = acc ? acc.ownership : "COMPANY";
    const list = sel.map((r) => ({
      type: r.type,
      date: r.date,
      amount: r.amount,
      accountId,
      ownership: own,
      categoryId: r.categoryId || null,
      contactId: null,
      productId: null,
      toAccountId: null,
      description: r.description,
      reference: r.reference,
      importKey: r.importKey,
    }));
    if (!list.length) return notify("Tidak ada transaksi terpilih.");
    onImport(list);
  };

  return (
    <Modal title="Import Mutasi Bank" onClose={onClose} wide>
      {step === 1 && (
        <div className="stack">
          <Field label="Akun Tujuan (mutasi ini masuk ke akun mana?)">
            <select
              className="input"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
            >
              {data.accounts.length === 0 && (
                <option value="">— belum ada akun —</option>
              )}
              {data.accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </Field>
          <div className="imp-drop">
            <Download size={26} />
            <p>Pilih file mutasi BSI / Gopay (.xls / .xlsx / .csv / .pdf)</p>
            <input
              type="file"
              accept=".xls,.xlsx,.csv,.pdf,application/vnd.ms-excel,application/pdf"
              onChange={(e) => onFile(e.target.files[0])}
            />
            <span className="muted xs">
              Format asli BSINet, CSV, Excel, dan PDF teks bisa langsung dibaca.
              Kalau PDF berupa scan/gambar penuh, biasanya masih perlu OCR/AI.
            </span>
          </div>
          {busy && <p className="muted sm">Membaca file…</p>}
          {err && <p className="imp-err">{err}</p>}
        </div>
      )}

      {step === 2 && (
        <div className="stack">
          <div className="imp-summary">
            <span>
              <b>{rows.length}</b> baris terbaca
            </span>
            <span className="dot-sep">·</span>
            <span className="st st-paid">{inCount} masuk</span>
            <span className="st st-unpaid">{exCount} keluar</span>
            {dupCount > 0 && (
              <>
                <span className="dot-sep">·</span>
                <span className="muted">{dupCount} duplikat (dilewati)</span>
              </>
            )}
            <div className="grow" />
            <span className="muted sm">{fileName}</span>
          </div>
          <div className="imp-bulk">
            <span className="muted xs">Atur cepat kategori:</span>
            <label className="imp-bl">
              Semua MASUK →
              <select
                className="input"
                onChange={(e) => bulkCat("income", e.target.value)}
                defaultValue=""
              >
                <option value="">(pilih)</option>
                {incomeCats.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="imp-bl">
              Semua KELUAR →
              <select
                className="input"
                onChange={(e) => bulkCat("expense", e.target.value)}
                defaultValue=""
              >
                <option value="">(pilih)</option>
                {expenseCats.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="imp-table-wrap">
            <table className="table imp-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Tgl</th>
                  <th>Deskripsi</th>
                  <th>Tipe</th>
                  <th className="ar">Nominal</th>
                  <th>Kategori</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, idx) => {
                  const pool = r.type === "income" ? incomeCats : expenseCats;
                  return (
                    <tr
                      key={idx}
                      className={
                        r.dup ? "imp-dup" : !r.include ? "imp-off" : ""
                      }
                    >
                      <td>
                        <input
                          type="checkbox"
                          checked={r.include}
                          onChange={(e) =>
                            setRow(idx, { include: e.target.checked })
                          }
                        />
                      </td>
                      <td className="sm nowrap">{fmtDate(r.date)}</td>
                      <td className="sm">
                        {r.description || <span className="muted">—</span>}
                        {r.party && <div className="muted xs">{r.party}</div>}
                        {r.dup && (
                          <span className="svc-flag soon">duplikat</span>
                        )}
                      </td>
                      <td>
                        <span
                          className={
                            "st " +
                            (r.type === "income" ? "st-paid" : "st-unpaid")
                          }
                        >
                          {r.type === "income" ? "Masuk" : "Keluar"}
                        </span>
                      </td>
                      <td className="ar mono">{rupiah(r.amount)}</td>
                      <td>
                        <select
                          className="input"
                          value={r.categoryId || ""}
                          onChange={(e) =>
                            setRow(idx, { categoryId: e.target.value || null })
                          }
                        >
                          <option value="">— tanpa kategori —</option>
                          {pool.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="modal-foot">
            <button
              className="btn btn-ghost"
              onClick={() => {
                setStep(1);
                setRows([]);
              }}
            >
              ← Pilih file lain
            </button>
            <div className="grow" />
            <button className="btn btn-ghost" onClick={onClose}>
              Batal
            </button>
            <button className="btn btn-primary" onClick={doImport}>
              Import {sel.length} Transaksi
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}

/* ============================================================
   SELECT + TAMBAH BARU (tersambung ke database)
   ============================================================ */
function SelectAdd({
  value,
  onChange,
  options,
  placeholder = "— pilih —",
  onCreate,
  addLabel = "baru",
  extraFields = [],
}) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [extra, setExtra] = useState(() =>
    Object.fromEntries(extraFields.map((fld) => [fld.key, fld.default]))
  );

  const cancel = () => {
    setAdding(false);
    setName("");
  };
  const doSave = () => {
    if (!name.trim()) {
      notify("Nama wajib diisi");
      return;
    }
    const id = onCreate(name.trim(), extra);
    if (id) onChange(id);
    setAdding(false);
    setName("");
  };

  if (adding) {
    return (
      <div className="add-inline">
        <input
          className="input"
          autoFocus
          placeholder={"Nama " + addLabel}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              doSave();
            }
            if (e.key === "Escape") cancel();
          }}
        />
        {extraFields.map((fld) => (
          <select
            key={fld.key}
            className="input"
            value={extra[fld.key]}
            onChange={(e) =>
              setExtra((s) => ({ ...s, [fld.key]: e.target.value }))
            }
          >
            {fld.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        ))}
        <div className="add-inline-actions">
          <button
            type="button"
            className="btn btn-xs btn-primary"
            onClick={doSave}
          >
            <Plus size={13} /> Simpan & Pilih
          </button>
          <button
            type="button"
            className="btn btn-xs btn-ghost"
            onClick={cancel}
          >
            Batal
          </button>
        </div>
      </div>
    );
  }
  return (
    <select
      className="input"
      value={value || ""}
      onChange={(e) => {
        if (e.target.value === "__ADD__") {
          setAdding(true);
          return;
        }
        onChange(e.target.value);
      }}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
      <option value="__ADD__">+ Tambah {addLabel}…</option>
    </select>
  );
}

function AccountSelectAdd({
  data,
  value,
  onChange,
  onAddAccount,
  onCreatedOwnership,
}) {
  return (
    <SelectAdd
      value={value}
      onChange={onChange}
      placeholder={null}
      addLabel="rekening baru"
      options={data.accounts.map((a) => ({
        value: a.id,
        label: a.name + " (" + OWN[a.ownership].short + ")",
      }))}
      extraFields={[
        {
          key: "ownership",
          default: "COMPANY",
          options: Object.entries(OWN).map(([k, o]) => ({
            value: k,
            label: o.label,
          })),
        },
        {
          key: "type",
          default: "BANK",
          options: Object.entries(ACCT_TYPE).map(([k, l]) => ({
            value: k,
            label: l,
          })),
        },
      ]}
      onCreate={(name, extra) => {
        const acc = {
          id: uid("acc"),
          name,
          type: extra.type,
          ownership: extra.ownership,
          number: "",
          bank: "",
          initial: 0,
          color: "#11704f",
        };
        onAddAccount(acc);
        if (onCreatedOwnership) onCreatedOwnership(extra.ownership);
        return acc.id;
      }}
    />
  );
}

/* ============================================================
   FORMS
   ============================================================ */
function TxForm({
  init,
  data,
  onClose,
  onSave,
  onDelete,
  onAddContact,
  onAddCategory,
  onAddAccount,
  onAddProduct,
}) {
  const accById = Object.fromEntries(data.accounts.map((a) => [a.id, a]));
  const ctById = Object.fromEntries(
    (data.contacts || []).map((c) => [c.id, c])
  );
  const catById = Object.fromEntries(
    (data.categories || []).map((c) => [c.id, c])
  );
  const txById = Object.fromEntries((data.tx || []).map((t) => [t.id, t]));
  const [type, setType] = useState(init.type || "income");
  const [f, setF] = useState({
    date: init.date ? fmtDateInput(init.date) : fmtDateInput(new Date()),
    amount: init.amount || 0,
    accountId: init.accountId || data.accounts[0]?.id,
    toAccountId:
      init.toAccountId ||
      data.accounts.find(
        (a) => a.id !== (init.accountId || data.accounts[0]?.id)
      )?.id,
    fee: init.fee || 0,
    ownership:
      init.ownership ||
      accById[init.accountId || data.accounts[0]?.id]?.ownership ||
      "COMPANY",
    categoryId: init.categoryId || "",
    contactId: init.contactId || "",
    productId: init.productId || "",
    method: init.method || "Transfer",
    reference: init.reference || "",
    description: init.description || "",
    receivableId: init.receivableId || "",
    payableId: init.payableId || "",
    refundOfTxId: init.refundOfTxId || "",
    adminAmount: 0,
    adminCategoryId: defaultAdminCategory(data),
  });
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const onAccount = (id) => {
    set("accountId", id);
    if (accById[id]) set("ownership", accById[id].ownership);
  };
  const cats = data.categories.filter(
    (c) => c.kind === (type === "income" ? "income" : "expense")
  );
  const refundOriginType =
    type === "expense" ? "income" : type === "income" ? "expense" : null;
  const refundOptions = refundOriginType
    ? (data.tx || [])
        .filter((t) => t.id !== init.id && t.type === refundOriginType)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
    : [];
  const selectedRefundOrigin = f.refundOfTxId ? txById[f.refundOfTxId] : null;
  const selectedRefundKind = refundKind(
    { ...f, type, amount: Number(f.amount) || 0, refundOfTxId: f.refundOfTxId },
    selectedRefundOrigin
  );

  const submit = () => {
    if (!f.amount || f.amount <= 0) {
      notify("Nominal harus diisi.");
      return;
    }
    if (type === "transfer" && f.accountId === f.toAccountId) {
      notify("Rekening asal dan tujuan tidak boleh sama.");
      return;
    }
    const adminAmount = Math.round(Number(f.adminAmount) || 0);
    const baseId =
      init.id || (type === "expense" && adminAmount > 0 ? uid("tx") : null);
    const t = {
      ...init,
      id: baseId || init.id,
      type,
      date: new Date(f.date).toISOString(),
      amount: Number(f.amount),
      accountId: f.accountId,
      ownership: f.ownership,
      categoryId: type === "transfer" ? null : f.categoryId || null,
      contactId: type === "transfer" ? null : f.contactId || null,
      productId: f.productId || null,
      toAccountId: type === "transfer" ? f.toAccountId : null,
      fee: 0,
      method: f.method,
      reference: f.reference,
      description: f.description,
      receivableId: type === "income" ? f.receivableId || null : null,
      payableId: type === "expense" ? f.payableId || null : null,
      refundOfTxId:
        type === "transfer" || !f.refundOfTxId ? null : f.refundOfTxId,
    };
    if (!init.id && type === "expense" && adminAmount > 0) {
      onSave([
        t,
        {
          id: uid("tx"),
          type: "expense",
          date: t.date,
          amount: adminAmount,
          accountId: f.accountId,
          ownership: f.ownership,
          categoryId: f.adminCategoryId || defaultAdminCategory(data),
          contactId: f.contactId || null,
          productId: null,
          toAccountId: null,
          fee: 0,
          method: f.method,
          reference: f.reference,
          description:
            "Biaya admin" + (f.description ? " - " + f.description : ""),
          receivableId: null,
          payableId: null,
          refundOfTxId: null,
          adminOfTxId: baseId,
        },
      ]);
      return;
    }
    onSave(t);
  };

  const isBiz = OWN[f.ownership]?.business;
  const pbToPt =
    type === "transfer" &&
    accById[f.accountId]?.ownership === "PERSONAL_BUSINESS" &&
    accById[f.toAccountId]?.ownership === "COMPANY";

  return (
    <Modal
      title={init.id ? "Edit Transaksi" : "Transaksi Baru"}
      onClose={onClose}
      wide
    >
      <div className="seg seg-big">
        {[
          ["income", "Pemasukan", ArrowDownLeft],
          ["expense", "Pengeluaran", ArrowUpRight],
          ["transfer", "Transfer", Repeat],
        ].map(([k, l, I]) => (
          <button
            key={k}
            className={type === k ? "seg-on" : ""}
            onClick={() => setType(k)}
          >
            <I size={15} /> {l}
          </button>
        ))}
      </div>

      <div className="grid-2">
        <Field label="Tanggal">
          <input
            type="date"
            className="input"
            value={f.date}
            onChange={(e) => set("date", e.target.value)}
          />
        </Field>
        <Field label="Nominal">
          <CurrencyInput value={f.amount} onChange={(v) => set("amount", v)} />
        </Field>
      </div>

      {type === "transfer" ? (
        <>
          <div className="grid-2">
            <Field label="Dari Rekening">
              <AccountSelectAdd
                data={data}
                value={f.accountId}
                onChange={onAccount}
                onAddAccount={onAddAccount}
                onCreatedOwnership={(o) => set("ownership", o)}
              />
            </Field>
            <Field label="Ke Rekening">
              <AccountSelectAdd
                data={data}
                value={f.toAccountId}
                onChange={(v) => set("toAccountId", v)}
                onAddAccount={onAddAccount}
              />
            </Field>
          </div>
          {pbToPt && (
            <div className="info-good">
              <Send size={14} /> Memindahkan dana bisnis dari rekening pribadi
              ke rekening PT.
            </div>
          )}
        </>
      ) : (
        <>
          <div className="grid-2">
            <Field
              label={
                type === "income"
                  ? "Rekening Tujuan (uang masuk)"
                  : "Rekening Sumber (uang keluar)"
              }
            >
              <AccountSelectAdd
                data={data}
                value={f.accountId}
                onChange={onAccount}
                onAddAccount={onAddAccount}
                onCreatedOwnership={(o) => set("ownership", o)}
              />
            </Field>
            <Field
              label="Sumber Dana / Kepemilikan"
              hint={
                isBiz
                  ? "Tercatat sebagai transaksi BISNIS"
                  : "Tercatat sebagai PRIBADI (tidak masuk laba bisnis)"
              }
            >
              <select
                className="input"
                value={f.ownership}
                onChange={(e) => set("ownership", e.target.value)}
              >
                {Object.entries(OWN).map(([k, o]) => (
                  <option key={k} value={k}>
                    {o.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          {f.ownership === "PERSONAL_BUSINESS" && (
            <div className="info-gold">
              <Star size={14} /> Uang bisnis ini masuk ke rekening pribadi —
              akan muncul di laman "Dana di Rek Pribadi" untuk dipindahkan ke
              PT.
            </div>
          )}
          {type === "expense" && !init.id && (
            <>
              <div className="grid-2">
                <Field
                  label="Biaya Admin (opsional)"
                  hint="Nominal utama tetap pokok pengeluaran. Biaya admin akan dibuat sebagai transaksi keluar terpisah."
                >
                  <CurrencyInput
                    value={f.adminAmount}
                    onChange={(v) =>
                      setF((s) => ({
                        ...s,
                        adminAmount: v,
                        adminCategoryId:
                          Number(v) > 0
                            ? s.adminCategoryId || defaultAdminCategory(data)
                            : s.adminCategoryId,
                      }))
                    }
                  />
                </Field>
                <Field label="Kategori Biaya Admin">
                  <SelectAdd
                    value={f.adminCategoryId}
                    onChange={(v) => set("adminCategoryId", v)}
                    placeholder="Biaya Bank"
                    addLabel="kategori admin"
                    options={data.categories
                      .filter((c) => c.kind === "expense")
                      .map((c) => ({ value: c.id, label: c.name }))}
                    onCreate={(name) => {
                      const c = {
                        id: uid("cat"),
                        name,
                        kind: "expense",
                      };
                      onAddCategory(c);
                      return c.id;
                    }}
                  />
                </Field>
              </div>
              {Number(f.adminAmount) > 0 && (
                <div className="info-good">
                  <Receipt size={14} /> Saat disimpan akan dibuat 2 baris:
                  pengeluaran pokok {rupiah(Number(f.amount) || 0)} dan biaya
                  admin {rupiah(Number(f.adminAmount) || 0)}.
                </div>
              )}
            </>
          )}
          <div className="grid-2">
            <Field label="Kategori">
              <SelectAdd
                value={f.categoryId}
                onChange={(v) => set("categoryId", v)}
                addLabel="kategori"
                options={cats.map((c) => ({ value: c.id, label: c.name }))}
                onCreate={(name) => {
                  const c = {
                    id: uid("cat"),
                    name,
                    kind: type === "income" ? "income" : "expense",
                  };
                  onAddCategory(c);
                  return c.id;
                }}
              />
            </Field>
            <Field label={type === "income" ? "Dari Siapa" : "Untuk Siapa"}>
              <SelectAdd
                value={f.contactId}
                onChange={(v) => set("contactId", v)}
                addLabel={type === "income" ? "customer" : "vendor"}
                options={data.contacts.map((c) => ({
                  value: c.id,
                  label: c.name,
                }))}
                onCreate={(name) => {
                  const c = {
                    id: uid("ct"),
                    name,
                    role: type === "income" ? "CUSTOMER" : "VENDOR",
                    phone: "",
                  };
                  onAddContact(c);
                  return c.id;
                }}
              />
            </Field>
          </div>
          {type === "income" && (
            <Field label="Kaitkan Paket Travel (opsional)">
              <SelectAdd
                value={f.productId}
                onChange={(v) => set("productId", v)}
                placeholder="— tidak ada —"
                addLabel="paket"
                options={data.products.map((p) => ({
                  value: p.id,
                  label: p.name,
                }))}
                extraFields={[
                  {
                    key: "type",
                    default: "Umroh",
                    options: ["Umroh", "Haji", "Tour", "Tiket"].map((x) => ({
                      value: x,
                      label: x,
                    })),
                  },
                ]}
                onCreate={(name, extra) => {
                  const p = {
                    id: uid("pk"),
                    name,
                    type: extra.type,
                    price: 0,
                    cost: 0,
                  };
                  onAddProduct(p);
                  return p.id;
                }}
              />
            </Field>
          )}
          <div className="refund-box">
            <label className="check-row">
              <input
                type="checkbox"
                checked={!!f.refundOfTxId}
                onChange={(e) => {
                  if (e.target.checked) {
                    set("refundOfTxId", refundOptions[0]?.id || "");
                  } else {
                    set("refundOfTxId", "");
                  }
                }}
              />
              <span>Tandai sebagai refund / koreksi transaksi lama</span>
            </label>
            {f.refundOfTxId && (
              <>
                <Field
                  label={
                    type === "expense"
                      ? "Refund keluar untuk transaksi masuk"
                      : "Refund masuk untuk transaksi keluar"
                  }
                  hint="Pilih transaksi asal agar laporan laba rugi mengurangi kategori asal, bukan mencatat biaya/pendapatan baru."
                >
                  <select
                    className="input"
                    value={f.refundOfTxId}
                    onChange={(e) => set("refundOfTxId", e.target.value)}
                  >
                    <option value="">Pilih transaksi asal</option>
                    {refundOptions.map((t) => (
                      <option key={t.id} value={t.id}>
                        {txLabel(t, ctById, catById, accById)}
                      </option>
                    ))}
                  </select>
                </Field>
                {selectedRefundOrigin ? (
                  <div className="info-good">
                    <Repeat size={14} />
                    {refundText(selectedRefundKind)} untuk:{" "}
                    {txLabel(selectedRefundOrigin, ctById, catById, accById)}
                  </div>
                ) : (
                  <div className="info-gold">
                    <AlertTriangle size={14} />
                    Transaksi asal belum dipilih. Refund akan tetap tersimpan,
                    tetapi laporan belum bisa melakukan koreksi otomatis.
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}

      <Field label="Untuk Apa / Deskripsi">
        <input
          className="input"
          value={f.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="cth: Pelunasan Umroh grup Syawal"
        />
      </Field>
      <div className="grid-2">
        <Field label="Metode">
          <input
            className="input"
            value={f.method}
            onChange={(e) => set("method", e.target.value)}
            placeholder="Transfer / Cash / QRIS"
          />
        </Field>
        <Field label="No. Referensi (opsional)">
          <input
            className="input mono"
            value={f.reference}
            onChange={(e) => set("reference", e.target.value)}
            placeholder="WS-HAJAR-00000"
          />
        </Field>
      </div>

      <div className="modal-foot">
        {onDelete && (
          <button className="btn btn-danger" onClick={onDelete}>
            <Trash2 size={15} /> Hapus
          </button>
        )}
        <div className="grow" />
        <button className="btn btn-ghost" onClick={onClose}>
          Batal
        </button>
        <button className="btn btn-primary" onClick={submit}>
          Simpan
        </button>
      </div>
    </Modal>
  );
}

function AccountSelect({ data, value, onChange }) {
  return (
    <select
      className="input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {data.accounts.map((a) => (
        <option key={a.id} value={a.id}>
          {a.name} ({OWN[a.ownership].short})
        </option>
      ))}
    </select>
  );
}

function AccForm({ init, onClose, onSave }) {
  const [f, setF] = useState({
    name: "",
    type: "BANK",
    ownership: "COMPANY",
    number: "",
    bank: "",
    initial: 0,
    color: "#11704f",
    ...init,
  });
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const colors = [
    "#11704f",
    "#1f9d6b",
    "#3b5b9a",
    "#c79a3e",
    "#c0492f",
    "#7b5ea7",
    "#8a8578",
  ];
  return (
    <Modal
      title={init.id ? "Edit Rekening" : "Rekening Baru"}
      onClose={onClose}
    >
      <Field label="Nama Rekening">
        <input
          className="input"
          value={f.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="cth: BCA — PT HAB"
        />
      </Field>
      <div className="grid-2">
        <Field label="Jenis">
          <select
            className="input"
            value={f.type}
            onChange={(e) => set("type", e.target.value)}
          >
            {Object.entries(ACCT_TYPE).map(([k, l]) => (
              <option key={k} value={k}>
                {l}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Kepemilikan">
          <select
            className="input"
            value={f.ownership}
            onChange={(e) => set("ownership", e.target.value)}
          >
            {Object.entries(OWN).map(([k, o]) => (
              <option key={k} value={k}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <div className="grid-2">
        <Field label="Nama Bank / Provider">
          <input
            className="input"
            value={f.bank}
            onChange={(e) => set("bank", e.target.value)}
            placeholder="BCA / Mandiri / GoPay"
          />
        </Field>
        <Field label="No. Rekening">
          <input
            className="input mono"
            value={f.number}
            onChange={(e) => set("number", e.target.value)}
          />
        </Field>
      </div>
      <Field label="Saldo Awal">
        <CurrencyInput value={f.initial} onChange={(v) => set("initial", v)} />
      </Field>
      <Field label="Warna Kartu">
        <div className="color-row">
          {colors.map((c) => (
            <button
              key={c}
              className={"swatch" + (f.color === c ? " on" : "")}
              style={{ background: c }}
              onClick={() => set("color", c)}
            />
          ))}
        </div>
      </Field>
      <div className="modal-foot">
        <div className="grow" />
        <button className="btn btn-ghost" onClick={onClose}>
          Batal
        </button>
        <button
          className="btn btn-primary"
          onClick={() => {
            if (!f.name) return notify("Nama wajib diisi");
            onSave({ ...f, initial: Number(f.initial) || 0 });
          }}
        >
          Simpan
        </button>
      </div>
    </Modal>
  );
}

function ContactForm({ init, onClose, onSave }) {
  const [f, setF] = useState({
    name: "",
    role: "CUSTOMER",
    phone: "",
    ...init,
  });
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
  return (
    <Modal title={init.id ? "Edit Kontak" : "Kontak Baru"} onClose={onClose}>
      <Field label="Nama">
        <input
          className="input"
          value={f.name}
          onChange={(e) => set("name", e.target.value)}
        />
      </Field>
      <div className="grid-2">
        <Field label="Tipe">
          <select
            className="input"
            value={f.role}
            onChange={(e) => set("role", e.target.value)}
          >
            <option value="CUSTOMER">Customer (Jamaah/Wisatawan)</option>
            <option value="VENDOR">Vendor (Hotel/Maskapai/Transport)</option>
          </select>
        </Field>
        <Field label="No. HP">
          <input
            className="input"
            value={f.phone}
            onChange={(e) => set("phone", e.target.value)}
          />
        </Field>
      </div>
      <div className="modal-foot">
        <div className="grow" />
        <button className="btn btn-ghost" onClick={onClose}>
          Batal
        </button>
        <button
          className="btn btn-primary"
          onClick={() => {
            if (!f.name) return notify("Nama wajib diisi");
            onSave(f);
          }}
        >
          Simpan
        </button>
      </div>
    </Modal>
  );
}

function AsetEmas({
  data,
  setGoldPrice,
  setAssetModal,
  delAsset,
  loadInitialGold,
}) {
  const [draft, setDraft] = useState(data.goldPrice?.perGram || 2799000);
  const [fetching, setFetching] = useState(false);
  const assets = data.assets || [];
  const price = data.goldPrice?.perGram || 0;
  const totalGram = assets.reduce((s, a) => s + (Number(a.gram) || 0), 0);
  const totalModal = assets.reduce((s, a) => s + (Number(a.buyTotal) || 0), 0);
  const nilaiKini = totalGram * price;
  const gain = nilaiKini - totalModal;
  const gainPct = totalModal > 0 ? (gain / totalModal) * 100 : 0;

  const fetchSpot = async () => {
    setFetching(true);
    try {
      const [gRes, fxRes] = await Promise.all([
        fetch("https://api.gold-api.com/price/XAU"),
        fetch("https://open.er-api.com/v6/latest/USD"),
      ]);
      const g = await gRes.json();
      const fx = await fxRes.json();
      const usdOz = Number(g.price);
      const idr = Number(fx.rates.IDR);
      if (!usdOz || !idr) throw new Error("data kosong");
      const spotGram = (usdOz * idr) / 31.1034768;
      const antamEst = Math.round((spotGram * 1.075) / 1000) * 1000;
      setDraft(antamEst);
      setGoldPrice(antamEst);
      notify(
        "Harga: spot $" +
          usdOz.toFixed(0) +
          "/oz, kurs Rp" +
          Math.round(idr).toLocaleString("id-ID") +
          " → estimasi Antam Rp" +
          antamEst.toLocaleString("id-ID") +
          "/gr"
      );
    } catch (e) {
      notify("Gagal ambil otomatis (CORS/jaringan). Isi manual ya.");
    }
    setFetching(false);
  };

  const byBrand = {};
  assets.forEach((a) => {
    byBrand[a.brand] = byBrand[a.brand] || { gram: 0, modal: 0 };
    byBrand[a.brand].gram += Number(a.gram) || 0;
    byBrand[a.brand].modal += Number(a.buyTotal) || 0;
  });

  return (
    <div className="stack">
      <div className="toolbar">
        <p className="muted">
          Catatan aset emas batangan — nilai mengikuti harga acuan.
        </p>
        <div className="grow" />
        {assets.length === 0 && (
          <button
            className="btn btn-out"
            onClick={() => {
              if (confirmAct("Muat 20 data emas awal milikmu?"))
                loadInitialGold();
            }}
          >
            Muat 20 Data Awal
          </button>
        )}
        <button className="btn btn-primary" onClick={() => setAssetModal({})}>
          <Plus size={16} /> Tambah Emas
        </button>
      </div>

      <div className="gold-price-card">
        <div className="gp-left">
          <div className="gp-cap">
            <Coins size={16} /> Harga Emas Acuan (Antam /gram)
          </div>
          <div className="gp-input-row">
            <CurrencyInput value={draft} onChange={setDraft} />
            <button
              className="btn btn-primary"
              onClick={() => setGoldPrice(draft)}
            >
              Simpan Harga
            </button>
            <button
              className="btn btn-out"
              disabled={fetching}
              onClick={fetchSpot}
            >
              {fetching ? "Mengambil…" : "Ambil Otomatis"}
            </button>
          </div>
          <div className="muted xs">
            {data.goldPrice?.updatedAt
              ? "Terakhir diperbarui: " +
                new Date(data.goldPrice.updatedAt).toLocaleString("id-ID", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })
              : "Belum pernah diperbarui"}
            {" · "}Tombol otomatis = spot dunia + premium ~7,5%. Untuk akurat,
            cek logammulia.com lalu isi manual.
          </div>
        </div>
      </div>

      <div className="grid-4">
        <StatCard
          icon={Scale}
          tone="blue"
          label="Total Berat"
          value={totalGram.toLocaleString("id-ID") + " gram"}
          foot={Object.keys(byBrand).length + " merek"}
        />
        <StatCard
          icon={Banknote}
          tone="amber"
          label="Total Modal Beli"
          value={rupiah(totalModal)}
          foot={
            totalGram > 0
              ? "Rp" +
                Math.round(totalModal / totalGram).toLocaleString("id-ID") +
                "/gr"
              : "—"
          }
        />
        <StatCard
          icon={CircleDollarSign}
          tone="emerald"
          label="Nilai Sekarang"
          value={rupiah(nilaiKini)}
          foot={"@ Rp" + price.toLocaleString("id-ID") + "/gr"}
        />
        <StatCard
          icon={gain >= 0 ? TrendingUp : TrendingDown}
          tone={gain >= 0 ? "green" : "red"}
          label={gain >= 0 ? "Keuntungan" : "Kerugian"}
          value={rupiah(Math.abs(gain))}
          foot={(gain >= 0 ? "+" : "") + gainPct.toFixed(1) + "% vs modal"}
        />
      </div>

      <div className="card">
        <div className="card-head">
          <h3>Rincian Batangan Emas</h3>
          <span className="muted sm">{assets.length} item</span>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Tgl Beli</th>
                <th>Merek</th>
                <th className="r">Gram</th>
                <th className="r">Beli/gr</th>
                <th className="r">Modal</th>
                <th className="r">Nilai Kini</th>
                <th className="r">Untung/Rugi</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {assets.map((a) => {
                const nilai = (Number(a.gram) || 0) * price;
                const ug = nilai - (Number(a.buyTotal) || 0);
                return (
                  <tr key={a.id}>
                    <td className="sm nowrap">
                      {a.date ? fmtDate(a.date) : "—"}
                    </td>
                    <td>
                      <b>{a.brand}</b>
                      {a.location && (
                        <div className="muted xs">{a.location}</div>
                      )}
                    </td>
                    <td className="r mono sm">{a.gram}</td>
                    <td className="r mono sm">
                      {rupiah(
                        a.buyPerGram ||
                          Math.round((a.buyTotal || 0) / (a.gram || 1))
                      )}
                    </td>
                    <td className="r mono sm">{rupiah(a.buyTotal)}</td>
                    <td className="r mono sm">{rupiah(nilai)}</td>
                    <td className="r mono">
                      <b style={{ color: ug >= 0 ? "#1f9d6b" : "#c0492f" }}>
                        {ug >= 0 ? "+" : "-"}
                        {rupiah(Math.abs(ug))}
                      </b>
                    </td>
                    <td className="actions">
                      <button
                        className="btn btn-xs btn-ghost"
                        onClick={() => setAssetModal({ edit: a })}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-xs btn-ghost danger"
                        onClick={() => {
                          if (
                            confirmAct(
                              "Hapus emas " + a.brand + " " + a.gram + "gr?"
                            )
                          )
                            delAsset(a.id);
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {assets.length === 0 && (
                <tr>
                  <td colSpan={8}>
                    <Empty text="Belum ada data emas. Klik 'Muat 20 Data Awal' atau 'Tambah Emas'." />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {Object.keys(byBrand).length > 0 && (
        <div className="card">
          <div className="card-head">
            <h3>Rekap per Merek</h3>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Merek</th>
                  <th className="r">Gram</th>
                  <th className="r">Modal</th>
                  <th className="r">Nilai Kini</th>
                  <th className="r">Untung/Rugi</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(byBrand)
                  .sort((a, b) => b[1].gram - a[1].gram)
                  .map(([brand, v]) => {
                    const nilai = v.gram * price;
                    const ug = nilai - v.modal;
                    return (
                      <tr key={brand}>
                        <td>
                          <b>{brand}</b>
                        </td>
                        <td className="r mono sm">{v.gram} gr</td>
                        <td className="r mono sm">{rupiah(v.modal)}</td>
                        <td className="r mono sm">{rupiah(nilai)}</td>
                        <td className="r mono">
                          <b style={{ color: ug >= 0 ? "#1f9d6b" : "#c0492f" }}>
                            {ug >= 0 ? "+" : "-"}
                            {rupiah(Math.abs(ug))}
                          </b>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function AssetForm({ init, onClose, onSave }) {
  const [f, setF] = useState(
    init || {
      date: fmtDateInput(new Date()),
      brand: "ANTAM",
      gram: 0,
      buyTotal: 0,
      location: "",
      note: "",
    }
  );
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const perGram =
    Number(f.gram) > 0 ? Math.round(Number(f.buyTotal) / Number(f.gram)) : 0;
  const BRANDS = [
    "ANTAM",
    "UBS",
    "Galeri 24",
    "HRTA",
    "Fine Gold",
    "Pegadaian",
    "Lotus Archi",
    "Lainnya",
  ];
  return (
    <Modal
      title={init ? "Edit Emas" : "Tambah Emas"}
      sub="Catat pembelian emas batangan"
      onClose={onClose}
    >
      <div className="grid-2">
        <Field label="Tanggal Beli">
          <input
            type="date"
            className="input"
            value={f.date}
            onChange={(e) => set("date", e.target.value)}
          />
        </Field>
        <Field label="Merek">
          <select
            className="input"
            value={f.brand}
            onChange={(e) => set("brand", e.target.value)}
          >
            {BRANDS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <div className="grid-2">
        <Field label="Berat (gram)">
          <input
            type="number"
            step="0.01"
            className="input"
            value={f.gram}
            onChange={(e) => set("gram", e.target.value)}
          />
        </Field>
        <Field label="Total Harga Beli">
          <CurrencyInput
            value={f.buyTotal}
            onChange={(v) => set("buyTotal", v)}
          />
        </Field>
      </div>
      {perGram > 0 && (
        <div className="info-good">
          <Coins size={14} /> Harga beli per gram: {rupiah(perGram)}
        </div>
      )}
      <Field label="Lokasi / Toko">
        <input
          className="input"
          value={f.location}
          onChange={(e) => set("location", e.target.value)}
          placeholder="cth: UBS Bintaro"
        />
      </Field>
      <div className="modal-foot">
        <div className="grow" />
        <button className="btn btn-ghost" onClick={onClose}>
          Batal
        </button>
        <button
          className="btn btn-primary"
          onClick={() => {
            if (!f.gram || !f.buyTotal)
              return notify("Gram & harga wajib diisi");
            onSave({
              ...f,
              id: init?.id,
              gram: Number(f.gram),
              buyTotal: Number(f.buyTotal),
              buyPerGram: perGram,
              date: f.date ? new Date(f.date).toISOString() : null,
            });
          }}
        >
          Simpan
        </button>
      </div>
    </Modal>
  );
}

function ProductForm({ init, onClose, onSave }) {
  const [f, setF] = useState(
    init || { name: "", type: "Umroh", price: 0, cost: 0 }
  );
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
  return (
    <Modal
      title={init ? "Edit Paket Travel" : "Paket Travel Baru"}
      sub="Harga jual & modal dipakai untuk hitung margin di laporan"
      onClose={onClose}
    >
      <Field label="Nama Paket">
        <input
          className="input"
          value={f.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="cth: Umroh Reguler 9 Hari"
        />
      </Field>
      <Field label="Jenis Paket">
        <select
          className="input"
          value={f.type}
          onChange={(e) => set("type", e.target.value)}
        >
          {PACKAGE_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </Field>
      <div className="grid-2">
        <Field label="Harga Jual">
          <CurrencyInput value={f.price} onChange={(v) => set("price", v)} />
        </Field>
        <Field label="Modal / HPP">
          <CurrencyInput value={f.cost} onChange={(v) => set("cost", v)} />
        </Field>
      </div>
      {Number(f.price) > 0 && (
        <div className="info-good">
          <Coins size={14} /> Margin: {rupiah(Number(f.price) - Number(f.cost))}{" "}
          (
          {(
            ((Number(f.price) - Number(f.cost)) / Number(f.price)) *
            100
          ).toFixed(0)}
          %)
        </div>
      )}
      <div className="modal-foot">
        <div className="grow" />
        <button className="btn btn-ghost" onClick={onClose}>
          Batal
        </button>
        <button
          className="btn btn-primary"
          onClick={() => {
            if (!f.name) return notify("Nama paket wajib diisi");
            onSave({
              ...f,
              id: init?.id,
              price: Number(f.price) || 0,
              cost: Number(f.cost) || 0,
            });
          }}
        >
          Simpan
        </button>
      </div>
    </Modal>
  );
}

function ARForm({ kind, init, data, onClose, onSave }) {
  const isRC = kind === "rc";
  const contacts = data.contacts.filter((c) =>
    isRC ? c.role === "CUSTOMER" : c.role === "VENDOR"
  );
  const [f, setF] = useState(
    init
      ? {
          contactId: init.contactId,
          productId: init.productId || "",
          total: init.total,
          paid: init.paid || 0,
          dueDate: fmtDateInput(new Date(init.dueDate)),
          description: init.description || "",
        }
      : {
          contactId: contacts[0]?.id || "",
          productId: "",
          total: 0,
          paid: 0,
          dueDate: fmtDateInput(new Date(Date.now() + 7 * 864e5)),
          description: "",
        }
  );
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
  return (
    <Modal
      title={
        init
          ? isRC
            ? "Edit Piutang"
            : "Edit Utang"
          : isRC
          ? "Piutang Baru"
          : "Utang Baru"
      }
      sub={isRC ? "Tagihan ke customer" : "Tagihan dari vendor"}
      onClose={onClose}
    >
      <Field label={isRC ? "Customer" : "Vendor"}>
        <select
          className="input"
          value={f.contactId}
          onChange={(e) => set("contactId", e.target.value)}
        >
          {contacts.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </Field>
      {isRC && (
        <Field label="Paket (opsional)">
          <select
            className="input"
            value={f.productId}
            onChange={(e) => set("productId", e.target.value)}
          >
            <option value="">— tidak ada —</option>
            {data.products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </Field>
      )}
      <div className="grid-2">
        <Field label="Total Tagihan">
          <CurrencyInput value={f.total} onChange={(v) => set("total", v)} />
        </Field>
        <Field label="Sudah Dibayar (DP)">
          <CurrencyInput value={f.paid} onChange={(v) => set("paid", v)} />
        </Field>
      </div>
      <Field label="Jatuh Tempo">
        <input
          type="date"
          className="input"
          value={f.dueDate}
          onChange={(e) => set("dueDate", e.target.value)}
        />
      </Field>
      <Field label="Keterangan">
        <input
          className="input"
          value={f.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </Field>
      <div className="modal-foot">
        <div className="grow" />
        <button className="btn btn-ghost" onClick={onClose}>
          Batal
        </button>
        <button
          className="btn btn-primary"
          onClick={() => {
            if (!f.total) return notify("Total wajib diisi");
            onSave({
              ...f,
              id: init?.id,
              total: Number(f.total),
              paid: Number(f.paid) || 0,
              dueDate: new Date(f.dueDate).toISOString(),
              createdAt: init?.createdAt || new Date().toISOString(),
            });
          }}
        >
          Simpan
        </button>
      </div>
    </Modal>
  );
}

function PayForm({ rec, kind, data, ctById, onClose, onSave }) {
  const isRC = kind === "rc";
  const rem = rec.total - rec.paid;
  const [amount, setAmount] = useState(rem);
  const [accountId, setAccountId] = useState(data.accounts[0]?.id);
  const accById = Object.fromEntries(data.accounts.map((a) => [a.id, a]));
  const submit = () => {
    if (!amount || amount <= 0) return notify("Nominal harus diisi");
    const t = {
      type: isRC ? "income" : "expense",
      date: new Date().toISOString(),
      amount: Number(amount),
      accountId,
      ownership: accById[accountId]?.ownership || "COMPANY",
      categoryId: null,
      contactId: rec.contactId,
      productId: rec.productId || null,
      method: "Transfer",
      reference: "",
      description:
        (isRC ? "Pembayaran piutang: " : "Pembayaran utang: ") +
        rec.description,
      receivableId: isRC ? rec.id : null,
      payableId: isRC ? null : rec.id,
      toAccountId: null,
      fee: 0,
    };
    onSave(t);
  };
  return (
    <Modal
      title="Catat Pembayaran"
      sub={`${ctById[rec.contactId]?.name} · sisa ${rupiah(rem)}`}
      onClose={onClose}
    >
      <Field label="Nominal Pembayaran">
        <CurrencyInput value={amount} onChange={setAmount} />
      </Field>
      <Field label={isRC ? "Masuk ke Rekening" : "Bayar dari Rekening"}>
        <AccountSelect data={data} value={accountId} onChange={setAccountId} />
      </Field>
      <div className="info-good">
        <Receipt size={14} /> Transaksi {isRC ? "pemasukan" : "pengeluaran"}{" "}
        otomatis dibuat & sisa tagihan diperbarui.
      </div>
      <div className="modal-foot">
        <div className="grow" />
        <button className="btn btn-ghost" onClick={onClose}>
          Batal
        </button>
        <button className="btn btn-primary" onClick={submit}>
          Simpan Pembayaran
        </button>
      </div>
    </Modal>
  );
}

function CatForm({ init, onClose, onSave }) {
  const [f, setF] = useState(init || { name: "", kind: "income" });
  return (
    <Modal title={init ? "Edit Kategori" : "Kategori Baru"} onClose={onClose}>
      <Field label="Nama Kategori">
        <input
          className="input"
          value={f.name}
          onChange={(e) => setF((s) => ({ ...s, name: e.target.value }))}
        />
      </Field>
      <Field label="Jenis">
        <select
          className="input"
          value={f.kind}
          onChange={(e) => setF((s) => ({ ...s, kind: e.target.value }))}
        >
          <option value="income">Pemasukan</option>
          <option value="expense">Pengeluaran</option>
        </select>
      </Field>
      {f.kind === "income" && (
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            margin: "4px 0 8px",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={!!f.equity}
            onChange={(e) => setF((s) => ({ ...s, equity: e.target.checked }))}
          />
          Kategori Modal/Ekuitas (mis. Setoran Modal) — tidak dihitung sebagai
          pendapatan
        </label>
      )}
      <div className="modal-foot">
        <div className="grow" />
        <button className="btn btn-ghost" onClick={onClose}>
          Batal
        </button>
        <button
          className="btn btn-primary"
          onClick={() => {
            if (!f.name) return notify("Nama wajib");
            onSave({ ...f, id: init?.id });
          }}
        >
          Simpan
        </button>
      </div>
    </Modal>
  );
}

/* ---------- misc ---------- */
function Empty({ text }) {
  return (
    <div className="empty">
      <Wallet2 size={26} />
      <span>{text}</span>
    </div>
  );
}
const tooltipStyle = {
  borderRadius: 10,
  border: "1px solid #e7e2d6",
  fontSize: 12,
  boxShadow: "0 8px 24px rgba(0,0,0,.08)",
};

/* ============================================================
   CSS — diperbaiki + animasi
   ============================================================ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#f4f1ea; --card:#ffffff; --ink:#1f231e; --muted:#8a8578; --line:#e7e2d6;
  --emerald:#11704f; --emerald-deep:#0c4731; --emerald-br:#1f9d6b; --gold:#c79a3e;
  --green:#1f9d6b; --red:#c0492f; --blue:#3b5b9a;
}
.app{font-family:'Plus Jakarta Sans',system-ui,sans-serif;color:var(--ink);background:var(--bg);min-height:100vh;display:flex;font-size:14px}
.mono{font-family:'JetBrains Mono',monospace;font-variant-numeric:tabular-nums}
h1{font-family:'Bricolage Grotesque',sans-serif;font-size:24px;font-weight:800;letter-spacing:-.02em}
h2{font-family:'Bricolage Grotesque',sans-serif;font-weight:800}
h3{font-family:'Bricolage Grotesque',sans-serif;font-size:15px;font-weight:700}
.muted{color:var(--muted)} .sm{font-size:12.5px} .xs{font-size:11px} .r{text-align:right} .nowrap{white-space:nowrap} .grow{flex:1}
.loading-screen{flex-direction:column;align-items:center;justify-content:center;gap:14px}
.spinner{width:34px;height:34px;border:3px solid var(--line);border-top-color:var(--emerald);border-radius:50%;animation:spin 1s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes modalIn{from{opacity:0;transform:translateY(14px) scale(.97)}to{opacity:1;transform:none}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}

/* sidebar */
.sidebar{width:248px;background:linear-gradient(180deg,var(--emerald-deep),#0a3a28);color:#dcefe6;display:flex;flex-direction:column;padding:18px 12px;position:sticky;top:0;height:100vh;flex-shrink:0;z-index:1000}
.brand{display:flex;gap:11px;align-items:center;padding:6px 8px 18px}
.brand-mark{width:38px;height:38px;border-radius:11px;background:linear-gradient(135deg,var(--gold),#a87f29);display:grid;place-items:center;color:#3a2c08;box-shadow:0 4px 12px rgba(0,0,0,.25)}
.brand-name{font-family:'Bricolage Grotesque';font-weight:800;font-size:16px;color:#fff;letter-spacing:-.01em}
.brand-sub{font-size:11px;color:#8fc4ad;letter-spacing:.08em;text-transform:uppercase}
.nav{display:flex;flex-direction:column;gap:3px;flex:1;overflow-y:auto;min-height:0}
.nav::-webkit-scrollbar{width:5px}
.nav::-webkit-scrollbar-thumb{background:rgba(255,255,255,.2);border-radius:3px}
.nav::-webkit-scrollbar-track{background:transparent}
.nav-item{display:flex;align-items:center;gap:11px;padding:10px 12px;border-radius:10px;background:none;border:none;color:#bfe0d2;cursor:pointer;font:inherit;font-size:13.5px;font-weight:500;text-align:left;transition:background .15s,color .15s;position:relative}
.nav-item:hover{background:rgba(255,255,255,.07);color:#fff}
.nav-item.active{background:rgba(255,255,255,.13);color:#fff;font-weight:600}
.nav-item.active::before{content:'';position:absolute;left:0;top:8px;bottom:8px;width:3px;border-radius:3px;background:var(--gold)}
.nav-dot{width:7px;height:7px;border-radius:50%;background:var(--gold);margin-left:auto;box-shadow:0 0 0 3px rgba(199,154,62,.25)}
.side-foot{margin-top:auto;padding-top:12px}
.side-card{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:13px 14px}
.side-bal{font-size:18px;font-weight:700;color:#fff;margin-top:3px}

/* main */
.main{flex:1;min-width:0;display:flex;flex-direction:column}
.topbar{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:18px 28px;border-bottom:1px solid var(--line);background:rgba(244,241,234,.85);backdrop-filter:blur(8px);position:sticky;top:0;z-index:5;flex-wrap:wrap}
.topbar-title{flex:1;min-width:160px}
.topbar h1{margin-top:2px}
.topbar-actions{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.content{padding:24px 28px 60px}
.stack{display:flex;flex-direction:column;gap:18px}
.stack-sm{display:flex;flex-direction:column;gap:10px}
.greet{background:linear-gradient(100deg,rgba(17,112,79,.1),rgba(199,154,62,.08));border:1px solid var(--line);border-radius:12px;padding:13px 16px;font-size:13.5px;color:#3a4a40}

/* entrance animation (page transition by key) */
.content>.stack>*{animation:fadeUp .45s cubic-bezier(.2,.7,.3,1) both}
.content>.stack>*:nth-child(1){animation-delay:.02s}
.content>.stack>*:nth-child(2){animation-delay:.07s}
.content>.stack>*:nth-child(3){animation-delay:.12s}
.content>.stack>*:nth-child(4){animation-delay:.17s}
.content>.stack>*:nth-child(5){animation-delay:.22s}
.content>.stack>*:nth-child(n+6){animation-delay:.26s}

/* grids */
.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
@media(max-width:1080px){.grid-4{grid-template-columns:1fr 1fr}.grid-3{grid-template-columns:1fr 1fr}}

/* mobile toggle + overlay (default desktop = hidden) */
.mobile-toggle{display:none;align-items:center;justify-content:center;background:#fff;border:1px solid var(--line);border-radius:9px;padding:8px;cursor:pointer;color:var(--emerald);margin-right:4px}
.sidebar-overlay{display:none}

@media(max-width:760px){
  .grid-2,.grid-3,.grid-4{grid-template-columns:1fr}
  .content{padding:18px 16px 60px}
  .topbar{padding:13px 16px;gap:10px}
  .topbar-actions{width:100%}
  .topbar-actions .seg{flex:1;justify-content:center}
  .sidebar{position:fixed;left:-270px;top:0;bottom:0;height:100vh;width:250px;transition:left .28s ease}
  .menu-open .sidebar{left:0;box-shadow:0 0 50px rgba(0,0,0,.35)}
  .sidebar-overlay{display:block;position:fixed;inset:0;background:rgba(0,0,0,.45);backdrop-filter:blur(2px);z-index:900;opacity:0;pointer-events:none;transition:opacity .25s}
  .menu-open .sidebar-overlay{opacity:1;pointer-events:auto}
  .mobile-toggle{display:flex}
}

/* card */
.card{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:18px;box-shadow:0 1px 2px rgba(20,30,25,.03);transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease}
.card-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;gap:10px}
.clickable{cursor:pointer}
.card.clickable:hover{border-color:#d8d0bd;transform:translateY(-3px);box-shadow:0 10px 26px rgba(20,30,25,.09)}
tr.clickable:hover{background:#faf8f2}

/* stat */
.stat{display:flex;flex-direction:column;gap:4px}
.stat-icon{width:34px;height:34px;border-radius:9px;display:grid;place-items:center;margin-bottom:6px}
.tone-emerald{background:rgba(17,112,79,.12);color:var(--emerald)}
.tone-green{background:rgba(31,157,107,.13);color:var(--green)}
.tone-red{background:rgba(192,73,47,.12);color:var(--red)}
.tone-blue{background:rgba(59,91,154,.12);color:var(--blue)}
.tone-amber{background:rgba(212,160,76,.15);color:#a87f29}
.tone-gold{background:linear-gradient(135deg,var(--gold),#a87f29);color:#fff}
.stat-label{font-size:12.5px;color:var(--muted);font-weight:500}
.stat-val{font-size:21px;font-weight:700;letter-spacing:-.01em}
.stat-foot{font-size:11.5px;color:var(--muted)}
.stat-hot{background:linear-gradient(135deg,#fffdf6,#fdf6e6);border-color:#ecd9a6}
.stat-hot .stat-foot{color:#a87f29;font-weight:600}

/* table */
.table-wrap{overflow-x:auto;margin:0 -4px}
.table{width:100%;border-collapse:collapse;font-size:13px}
.table th{text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.04em;color:var(--muted);font-weight:600;padding:8px 10px;border-bottom:1px solid var(--line)}
.table th.r{text-align:right}
.th-sort{display:inline-flex;align-items:center;gap:4px;border:none;background:none;padding:0;color:inherit;font:inherit;text-transform:inherit;letter-spacing:inherit;cursor:pointer}
.th-sort:hover{color:var(--emerald)}
.th-sort.right{justify-content:flex-end;width:100%}
.table td{padding:11px 10px;border-bottom:1px solid #f1eee5;vertical-align:middle}
.table tr:last-child td{border-bottom:none}
.amt-income{color:var(--green);font-weight:600}
.amt-expense{color:var(--red);font-weight:600}
.amt-transfer{color:var(--blue);font-weight:600}
.total-row td{border-top:2px solid var(--line);background:#faf8f2}
.actions{display:flex;gap:4px;justify-content:flex-end}

/* pills & badges */
.pill{display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:600;padding:3px 8px;border-radius:20px}
.pill-stack{display:inline-flex;align-items:center;gap:5px;flex-wrap:wrap}
.pill-in{background:rgba(31,157,107,.13);color:var(--green)}
.pill-out{background:rgba(192,73,47,.12);color:var(--red)}
.pill-tr{background:rgba(59,91,154,.12);color:var(--blue)}
.pill-refund{background:rgba(199,154,62,.16);color:#a87f29}
.badge{display:inline-flex;align-items:center;gap:4px;font-size:10.5px;font-weight:600;padding:3px 7px;border-radius:6px;border:1px solid transparent;white-space:nowrap}
.own-pt{background:rgba(17,112,79,.1);color:var(--emerald);border-color:rgba(17,112,79,.2)}
.own-pb{background:rgba(199,154,62,.13);color:#a87f29;border-color:rgba(199,154,62,.3)}
.own-pri{background:#f0eee7;color:var(--muted);border-color:var(--line)}
.st{font-size:11px;font-weight:600;padding:3px 8px;border-radius:6px}
.st-paid{background:rgba(31,157,107,.13);color:var(--green)}
.st-over{background:rgba(192,73,47,.13);color:var(--red)}
.st-part{background:rgba(212,160,76,.16);color:#a87f29}
.st-unpaid{background:#f0eee7;color:var(--muted)}

/* sync badge */
.sync{display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:600;padding:7px 11px;border-radius:9px;transition:.2s}
.sync-saving{background:rgba(199,154,62,.15);color:#a87f29}
.sync-saving svg{animation:pulse 1s infinite}
.sync-saved{background:rgba(31,157,107,.13);color:var(--green)}
.sync-error{background:rgba(192,73,47,.13);color:var(--red)}

/* document AI */
.doc-upload-box{border:1px solid var(--line);background:linear-gradient(135deg,#fff,#faf8f2);border-radius:12px;padding:14px;margin-bottom:16px}
.doc-upload-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:12px}
.doc-upload-head b{display:block;font-size:14px;color:var(--ink)}
.doc-upload-head span{display:block;margin-top:3px;font-size:12px;color:var(--muted)}
.ai-status,.ai-hint{font-size:12px;border-radius:9px;padding:9px 10px;margin-top:10px}
.ai-status{background:rgba(31,157,107,.1);color:var(--green);font-weight:650}
.ai-status.busy{background:rgba(199,154,62,.15);color:#a87f29}
.ai-hint{background:#f5f2ea;color:var(--muted)}

/* undo */
.undo-wrap{position:relative}
.undo-main:disabled{opacity:.48;cursor:not-allowed;transform:none!important;box-shadow:none}
.undo-count{display:inline-grid;place-items:center;min-width:18px;height:18px;padding:0 5px;border-radius:999px;background:rgba(17,112,79,.12);color:var(--emerald);font-size:10.5px;font-weight:800}
.undo-menu{position:absolute;right:0;top:calc(100% + 8px);width:310px;max-width:calc(100vw - 32px);background:#fff;border:1px solid var(--line);border-radius:12px;box-shadow:0 18px 45px rgba(20,30,25,.18);padding:12px;z-index:40}
.undo-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;padding-bottom:10px;border-bottom:1px solid var(--line);font-size:13px}
.undo-head span{display:block;color:var(--muted);font-size:11.5px;margin-top:2px}
.undo-primary{width:100%;display:flex;align-items:center;justify-content:center;gap:7px;border:none;background:var(--emerald);color:#fff;border-radius:9px;padding:9px 10px;font:inherit;font-size:12.5px;font-weight:700;cursor:pointer;margin-top:10px}
.undo-list{display:flex;flex-direction:column;gap:6px;max-height:230px;overflow:auto;margin-top:10px}
.undo-item{display:flex;align-items:center;justify-content:space-between;gap:10px;text-align:left;border:1px solid var(--line);background:#faf8f2;border-radius:9px;padding:9px 10px;cursor:pointer;color:var(--ink)}
.undo-item:hover{border-color:#cfc7b3;background:#fff}
.undo-item span{font-size:12.5px;font-weight:650;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.undo-item small{font-size:11px;color:var(--muted);white-space:nowrap}

/* buttons */
.btn{display:inline-flex;align-items:center;gap:7px;padding:9px 15px;border-radius:10px;border:1px solid transparent;font:inherit;font-size:13px;font-weight:600;cursor:pointer;transition:.15s;white-space:nowrap}
.btn:active{transform:translateY(1px)}
.btn-primary{background:var(--emerald);color:#fff;box-shadow:0 2px 8px rgba(17,112,79,.25)}
.btn-primary:hover{background:#0d5d41;box-shadow:0 4px 14px rgba(17,112,79,.3)}
.btn-out{background:#fff;border-color:var(--line);color:var(--ink)}
.btn-out:hover{border-color:#cfc7b3;background:#faf8f2}
.btn-ghost{background:none;color:var(--muted)}
.btn-ghost:hover{background:#f0eee7;color:var(--ink)}
.btn-gold{background:linear-gradient(135deg,var(--gold),#a87f29);color:#fff;box-shadow:0 3px 12px rgba(199,154,62,.3)}
.btn-gold:hover{filter:brightness(1.05);box-shadow:0 5px 18px rgba(199,154,62,.4)}
.btn-danger{background:rgba(192,73,47,.1);color:var(--red);border-color:rgba(192,73,47,.25)}
.btn-danger:hover{background:var(--red);color:#fff}
.btn-xs{padding:5px 10px;font-size:12px;border-radius:8px}
.btn.lg{padding:12px 20px;font-size:14px}
.icon-btn{display:grid;place-items:center;width:32px;height:32px;border-radius:8px;border:1px solid var(--line);background:#fff;cursor:pointer;color:var(--muted);transition:.15s}
.icon-btn:hover{color:var(--ink);border-color:#cfc7b3}
.icon-btn.sm{width:28px;height:28px;border-radius:7px}
.icon-btn.danger:hover{color:var(--red);border-color:rgba(192,73,47,.4);background:rgba(192,73,47,.06)}
.link{display:inline-flex;align-items:center;gap:3px;background:none;border:none;color:var(--emerald);font:inherit;font-size:13px;font-weight:600;cursor:pointer}

/* toolbar/seg/search */
.toolbar{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.toolbar .field{flex-direction:column}
.seg{display:inline-flex;background:#ebe7dc;border-radius:10px;padding:3px;gap:2px}
.seg button{border:none;background:none;font:inherit;font-size:12.5px;font-weight:600;color:var(--muted);padding:6px 12px;border-radius:8px;cursor:pointer;display:inline-flex;align-items:center;gap:5px;transition:.15s}
.seg button.seg-on{background:#fff;color:var(--emerald);box-shadow:0 1px 3px rgba(0,0,0,.08)}
.seg-big{width:100%;margin-bottom:14px}
.seg-big button{flex:1;justify-content:center;padding:10px}
.search{display:flex;align-items:center;gap:8px;background:#fff;border:1px solid var(--line);border-radius:10px;padding:0 12px;color:var(--muted);min-width:230px;flex:1;max-width:340px}
.search input{border:none;outline:none;font:inherit;font-size:13px;padding:9px 0;background:none;flex:1;color:var(--ink)}

/* account cards */
.group-head{display:flex;align-items:center;gap:9px;flex-wrap:wrap}
.acc-card{background:#fff;border:1px solid var(--line);border-radius:14px;padding:16px;border-top:3px solid var(--accent);box-shadow:0 1px 2px rgba(20,30,25,.03);transition:transform .18s ease,box-shadow .18s ease}
.acc-card:hover{transform:translateY(-3px);box-shadow:0 10px 26px rgba(20,30,25,.09)}
.acc-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
.acc-type{font-size:11px;color:var(--muted);font-weight:600;text-transform:uppercase;letter-spacing:.04em}
.acc-name{font-weight:700;font-size:14.5px}
.acc-num{font-size:12px;color:var(--muted);margin-top:2px}
.acc-bal{font-size:22px;font-weight:700;margin-top:12px}

/* contact */
.contact-card{display:flex;align-items:center;gap:12px;padding:14px}
.contact-ava{width:40px;height:40px;border-radius:11px;display:grid;place-items:center;font-weight:700;color:#fff;font-size:16px;flex-shrink:0}
.ava-cust{background:linear-gradient(135deg,var(--emerald),var(--emerald-br))}
.ava-vend{background:linear-gradient(135deg,var(--blue),#5a78b8)}
.contact-name{font-weight:600}

/* hero gold */
.hero-gold{background:linear-gradient(120deg,#fffdf6,#fbf2dc);border:1px solid #ecd9a6;border-radius:16px;padding:24px;display:flex;align-items:center;justify-content:space-between;gap:24px;flex-wrap:wrap}
.hero-label{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;font-weight:700;color:#a87f29;text-transform:uppercase;letter-spacing:.05em}
.hero-val{font-size:40px;font-weight:800;color:#8a6516;letter-spacing:-.02em;margin:6px 0;font-family:'Bricolage Grotesque'}
.hero-sub{max-width:560px;font-size:13px;color:#7a6a45;line-height:1.5}

/* report */
.report{max-width:680px}
.report-head{text-align:center;border-bottom:2px solid var(--ink);padding-bottom:14px;margin-bottom:18px}
.report-head h2{font-size:18px}
.report-sec{margin-bottom:16px}
.report-row{display:flex;justify-content:space-between;padding:6px 4px;font-size:13.5px}
.report-row.head{font-weight:700;font-size:12px;letter-spacing:.05em;color:var(--muted);border-bottom:1px solid var(--line);text-transform:uppercase}
.report-row.total{border-top:1px solid var(--line);font-weight:700;margin-top:4px}
.report-row.grand{border-top:2px solid var(--ink);border-bottom:3px double var(--ink);font-weight:800;font-size:16px;padding:12px 4px;font-family:'Bricolage Grotesque'}
.report-row.grand.pos{color:var(--emerald)}
.report-row.grand.neg{color:var(--red)}

/* fields & modal */
.field{display:flex;flex-direction:column;gap:5px;flex:1}
.field-label{font-size:12px;font-weight:600;color:#5a5648}
.field-hint{font-size:11px;color:var(--muted)}
.input{font:inherit;font-size:13.5px;padding:9px 12px;border:1px solid var(--line);border-radius:9px;background:#fff;outline:none;color:var(--ink);width:100%;transition:.15s}
.input:focus{border-color:var(--emerald);box-shadow:0 0 0 3px rgba(17,112,79,.1)}
.cur-wrap{display:flex;align-items:center;border:1px solid var(--line);border-radius:9px;background:#fff;overflow:hidden}
.cur-wrap:focus-within{border-color:var(--emerald);box-shadow:0 0 0 3px rgba(17,112,79,.1)}
.cur-prefix{padding:0 10px;color:var(--muted);font-size:13px;font-weight:600;border-right:1px solid var(--line);background:#faf8f2;align-self:stretch;display:flex;align-items:center}
.cur-input{border:none;box-shadow:none!important}
.cur-input:focus{border:none}
.overlay{position:fixed;inset:0;background:rgba(28,34,28,.45);backdrop-filter:blur(3px);display:grid;place-items:center;z-index:50;padding:20px;animation:fadeIn .2s ease}
.modal{background:var(--bg);border-radius:16px;width:100%;max-width:480px;max-height:90vh;overflow:auto;box-shadow:0 24px 70px rgba(0,0,0,.3);animation:modalIn .22s cubic-bezier(.2,.7,.3,1)}
.modal-wide{max-width:620px}
.modal-head{display:flex;align-items:flex-start;justify-content:space-between;padding:20px 22px 0}
.modal-body{padding:18px 22px 22px;display:flex;flex-direction:column;gap:14px}
.modal-foot{display:flex;align-items:center;gap:10px;margin-top:6px}
.info-good,.info-gold{display:flex;align-items:center;gap:8px;font-size:12.5px;padding:10px 12px;border-radius:9px;font-weight:500}
.info-good{background:rgba(31,157,107,.1);color:var(--emerald)}
.info-gold{background:rgba(199,154,62,.13);color:#a87f29}
.refund-box{border:1px dashed rgba(199,154,62,.55);background:#fffdf7;border-radius:12px;padding:12px;display:flex;flex-direction:column;gap:10px}
.check-row{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:700;color:#6f5a24}
.check-row input{width:16px;height:16px;accent-color:var(--emerald)}
.refund-ref{margin-top:3px;color:#a87f29}

/* chips */
.chips{display:flex;flex-wrap:wrap;gap:7px}
.chip{display:inline-flex;align-items:center;gap:5px;background:#fff;border:1px solid var(--line);border-radius:8px;padding:5px 6px 5px 11px;font-size:12.5px;font-weight:500}
.chip button{border:none;background:none;cursor:pointer;color:var(--muted);display:grid;place-items:center;padding:2px;border-radius:5px}
.chip button:hover{background:rgba(192,73,47,.12);color:var(--red)}
.chip button.ed:hover{background:rgba(17,112,79,.12);color:var(--emerald)}
.color-row{display:flex;gap:8px}
.swatch{width:26px;height:26px;border-radius:7px;border:2px solid transparent;cursor:pointer}
.swatch.on{border-color:var(--ink);box-shadow:0 0 0 2px #fff inset}

.danger-zone{display:flex;align-items:center;justify-content:space-between;gap:16px;border-color:rgba(192,73,47,.2);flex-wrap:wrap}
.note{display:flex;gap:10px;background:rgba(212,160,76,.1);border:1px solid rgba(212,160,76,.3);border-radius:12px;padding:14px 16px;font-size:12.5px;color:#7a6a45;line-height:1.55}
.note svg{flex-shrink:0;color:#a87f29;margin-top:2px}
.empty{display:flex;flex-direction:column;align-items:center;gap:8px;padding:32px;color:var(--muted);font-size:13px}

/* login */
.login-wrap{min-height:100vh;display:grid;place-items:center;padding:24px;font-family:'Plus Jakarta Sans',system-ui,sans-serif;background:radial-gradient(1100px 520px at 50% -8%,rgba(17,112,79,.14),transparent),var(--bg)}
.login-card{width:100%;max-width:382px;background:var(--card);border:1px solid var(--line);border-radius:18px;padding:26px;box-shadow:0 24px 70px rgba(20,30,25,.13);display:flex;flex-direction:column;gap:13px;animation:fadeUp .4s cubic-bezier(.2,.7,.3,1) both}
.login-brand{display:flex;align-items:center;gap:12px;margin-bottom:8px}
.login-title{font-family:'Bricolage Grotesque';font-weight:800;font-size:18px;color:var(--emerald);letter-spacing:-.01em}
.login-err{display:flex;align-items:center;gap:7px;background:rgba(192,73,47,.1);color:var(--red);font-size:12.5px;font-weight:500;padding:9px 11px;border-radius:9px}
.signout-btn{display:flex;align-items:center;justify-content:center;gap:7px;width:100%;margin-top:8px;padding:9px 10px;border-radius:10px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.06);color:#bfe0d2;font:inherit;font-size:11.5px;font-weight:600;cursor:pointer;transition:.15s;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.signout-btn:hover{background:rgba(255,255,255,.13);color:#fff}

/* tab navigasi laporan */
.tab-nav{display:flex;gap:6px;flex-wrap:wrap;background:#ebe7dc;border-radius:12px;padding:5px}
.tab-btn{display:inline-flex;align-items:center;gap:6px;padding:8px 14px;border-radius:9px;border:none;background:none;font:inherit;font-size:12.5px;font-weight:600;color:var(--muted);cursor:pointer;transition:.15s}
.tab-btn:hover{color:var(--ink);background:rgba(255,255,255,.5)}
.tab-btn.active{background:#fff;color:var(--emerald);box-shadow:0 2px 8px rgba(20,30,25,.1)}
/* export bar */
.export-bar{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
/* neraca layout */
.neraca-grid{display:grid;grid-template-columns:1fr 1fr;gap:28px;margin-top:8px}
@media(max-width:760px){.neraca-grid{grid-template-columns:1fr}}
.report-row.head2{font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.04em;padding:8px 4px 4px;margin-top:6px}
/* saldo check */
.bal-check{display:flex;align-items:center;gap:8px;font-size:12.5px;font-weight:600;padding:10px 14px;border-radius:10px;margin-top:14px}
.bal-check.ok{background:rgba(31,157,107,.12);color:var(--green)}
.bal-check.err{background:rgba(192,73,47,.12);color:var(--red)}
/* aging */
.aging-summary{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-bottom:4px}
@media(max-width:900px){.aging-summary{grid-template-columns:repeat(3,1fr)}}
@media(max-width:540px){.aging-summary{grid-template-columns:1fr 1fr}}
.aging-box{background:#faf8f2;border:1px solid var(--line);border-radius:10px;padding:10px;display:flex;flex-direction:column;gap:3px}
.aging-box.st-paid{background:rgba(31,157,107,.08);border-color:rgba(31,157,107,.2)}
.aging-box.st-part{background:rgba(212,160,76,.1);border-color:rgba(212,160,76,.3)}
.aging-box.st-over{background:rgba(192,73,47,.09);border-color:rgba(192,73,47,.2)}
/* margin bar */
.margin-bar-wrap{display:flex;align-items:center;gap:8px;min-width:100px}
.margin-bar{height:5px;border-radius:3px;flex-shrink:0;transition:.3s}

/* logo */
.brand-logo-side{width:42px;height:42px;object-fit:contain;flex-shrink:0;filter:drop-shadow(0 2px 6px rgba(0,0,0,.3))}
.brand-mark img{width:30px;height:30px;object-fit:contain}
.login-brand .brand-mark{background:var(--emerald-deep);border-radius:14px}
/* tambah baru inline */
.add-inline{display:flex;flex-direction:column;gap:8px;padding:11px;border:1px dashed var(--emerald);border-radius:10px;background:rgba(17,112,79,.05);animation:fadeUp .2s ease both}
.add-inline-actions{display:flex;gap:7px}

/* === Penyempurnaan tampilan (mewah) === */
.brand{border-bottom:1px solid rgba(199,154,62,.18);margin-bottom:8px}
.load-logo{width:66px;height:66px;object-fit:contain;margin-bottom:6px;animation:fadeIn .6s ease both;filter:drop-shadow(0 6px 16px rgba(199,154,62,.28))}
.greet{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap}
.greet-date{font-size:12px;font-weight:600;color:#8a6516;white-space:nowrap;display:inline-flex;align-items:center;gap:6px}
.greet-date::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--gold);display:inline-block;flex-shrink:0}
.stat{transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease}
.stat:hover{transform:translateY(-2px);box-shadow:0 8px 22px rgba(20,30,25,.07)}
.login-wrap{background:radial-gradient(900px 480px at 50% -10%,rgba(17,112,79,.16),transparent),radial-gradient(760px 420px at 50% 120%,rgba(199,154,62,.13),transparent),var(--bg)}
.login-brand{flex-direction:column;align-items:center;gap:6px;text-align:center}
.login-logo-badge{width:84px;height:84px;border-radius:24px;background:linear-gradient(160deg,var(--emerald),var(--emerald-deep));display:grid;place-items:center;box-shadow:0 14px 34px rgba(12,71,49,.38);margin-bottom:6px}
.login-logo-badge img{width:52px;height:52px;object-fit:contain}
.login-title{font-size:20px}

/* === PELAYANAN / KEBERANGKATAN === */
.group-card{display:flex;flex-direction:column;gap:12px}
.group-card.has-alert{border-color:rgba(192,73,47,.35)}
.gc-top{display:flex;justify-content:space-between;align-items:flex-start;gap:10px}
.gc-name{font-family:'Bricolage Grotesque';font-weight:800;font-size:16px}
.gc-sub{display:flex;gap:6px;flex-wrap:wrap;margin-top:5px}
.clash-badge{background:rgba(192,73,47,.12);color:var(--red);border-color:rgba(192,73,47,.3)}
.countdown{font-family:'Bricolage Grotesque';font-weight:800;font-size:15px;padding:5px 11px;border-radius:9px;white-space:nowrap}
.countdown.lg{font-size:20px;padding:8px 16px}
.cd-ok{background:rgba(17,112,79,.1);color:var(--emerald)}
.cd-soon{background:rgba(212,160,76,.16);color:#a87f29}
.cd-past{background:#f0eee7;color:var(--muted)}
.gc-meta{display:flex;flex-direction:column;gap:5px;font-size:12.5px;color:#5a5648}
.gc-meta span{display:inline-flex;align-items:center;gap:6px}
.gc-meta svg{color:var(--muted);flex-shrink:0}
.group-money{display:grid;grid-template-columns:1fr;gap:5px;background:#faf8f2;border:1px solid var(--line);border-radius:10px;padding:10px 11px;font-size:12px;color:var(--muted)}
.group-money span{display:flex;align-items:center;justify-content:space-between;gap:8px}
.group-tx-box{background:#fffdf8;border-color:#ecd9a6}
.tx-mini-panel{border:1px solid var(--line);border-radius:12px;padding:14px;background:#fff;display:flex;flex-direction:column;gap:10px}
.tx-mini-panel h4{display:flex;align-items:center;gap:7px;margin:0 0 2px;font-size:14px}
.income-panel{border-top:3px solid var(--green)}
.expense-panel{border-top:3px solid var(--red)}
.group-profit-preview{display:flex;align-items:center;gap:10px;flex-wrap:wrap;background:#faf8f2;border:1px solid var(--line);border-radius:10px;padding:11px 13px;margin-top:14px;font-size:12.5px;color:var(--muted)}
.group-profit-preview span{display:inline-flex;align-items:center;gap:6px}
.gc-prog{display:flex;align-items:center;gap:10px}
.prog-track{flex:1;height:8px;background:#ece7da;border-radius:5px;overflow:hidden}
.prog-fill{height:100%;background:linear-gradient(90deg,var(--emerald),var(--emerald-br));border-radius:5px;transition:width .4s}
.prog-label{font-size:12px;color:var(--muted);font-weight:600}
.svc-dots{display:flex;gap:5px;flex-wrap:wrap}
.svc-dot{width:13px;height:13px;border-radius:5px;display:inline-block;background:#d8d0bd}
.svc-belum{background:#d8d0bd}
.svc-proses{background:var(--gold)}
.svc-selesai{background:var(--green)}
.svc-na{background:#ece7da;opacity:.55}
.svc-dot.dot-alert{box-shadow:0 0 0 2px rgba(192,73,47,.55);background:var(--red)}
.gc-alert{display:flex;align-items:center;gap:6px;font-size:12px;font-weight:600;color:var(--red);background:rgba(192,73,47,.08);padding:7px 10px;border-radius:8px}
.gc-actions{display:flex;gap:6px;margin-top:auto}
.clash-banner{display:flex;align-items:center;gap:10px;background:rgba(192,73,47,.1);border:1px solid rgba(192,73,47,.3);color:#9a3a26;border-radius:12px;padding:13px 16px;font-size:13px;font-weight:500}
.detail-head{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;flex-wrap:wrap}
.svc-list{display:flex;flex-direction:column;gap:8px}
.svc-row{display:grid;grid-template-columns:1.5fr .9fr 1fr .8fr 1.3fr 1.2fr;gap:8px;align-items:center;padding:8px;border:1px solid var(--line);border-radius:10px;background:#fff}
.svc-row-overdue{border-color:rgba(192,73,47,.45);background:rgba(192,73,47,.04)}
.svc-row-soon{border-color:rgba(212,160,76,.5);background:rgba(212,160,76,.06)}
.svc-row-name{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:600}
.svc-ic{width:28px;height:28px;border-radius:8px;display:grid;place-items:center;color:#fff;flex-shrink:0}
.svc-ic.svc-belum{background:#b8b09c}
.svc-ic.svc-proses{background:var(--gold)}
.svc-ic.svc-selesai{background:var(--green)}
.svc-ic.svc-na{background:#cfc7b3}
.svc-row .input{padding:7px 9px;font-size:12.5px}
.svc-flag{font-size:10px;font-weight:700;padding:2px 6px;border-radius:5px;margin-left:6px;white-space:nowrap}
.svc-flag.over{background:rgba(192,73,47,.14);color:var(--red)}
.svc-flag.soon{background:rgba(212,160,76,.2);color:#a87f29}
@media(max-width:860px){.svc-row{grid-template-columns:1fr 1fr;gap:7px}.svc-row-name{grid-column:1/-1}}
.matrix th.mtx-h{font-size:9.5px;text-align:center;white-space:nowrap;padding:6px 3px;vertical-align:bottom}
.matrix td.mtx-c{text-align:center}
.matrix td,.matrix th{padding:8px 6px}
.row-over{background:rgba(192,73,47,.05)}
.row-soon{background:rgba(212,160,76,.06)}
.svc-pick{display:flex;flex-wrap:wrap;gap:7px}
.svc-pick-head{display:flex;align-items:center;gap:10px;margin-bottom:9px}
.svc-chip{display:inline-flex;align-items:center;gap:5px;padding:7px 11px;border-radius:9px;border:1px solid var(--line);background:#fff;font:inherit;font-size:12px;font-weight:600;color:var(--muted);cursor:pointer;transition:.15s}
.svc-chip:hover{border-color:#cfc7b3}
.svc-chip.on{background:rgba(17,112,79,.1);border-color:var(--emerald);color:var(--emerald)}
.mtx-na{color:#d8d0bd;font-weight:700}
.role-tag{text-align:center;font-size:11px;font-weight:700;padding:6px 8px;border-radius:8px;margin-bottom:8px;letter-spacing:.02em}
.rt-owner{background:rgba(17,112,79,.1);color:var(--emerald)}
.rt-admin{background:rgba(199,154,62,.14);color:#a87f29}
.imp-drop{border:2px dashed var(--line);border-radius:14px;padding:28px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:8px;color:var(--muted)}
.imp-drop svg{color:var(--emerald)}
.imp-drop p{font-weight:600;color:var(--ink);margin:0}
.imp-drop input[type=file]{margin-top:6px;font-size:13px}
.imp-err{color:var(--red);font-size:13px;font-weight:500;background:rgba(192,73,47,.08);padding:10px 12px;border-radius:9px}
.imp-summary{display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-size:13px}
.dot-sep{color:var(--line)}
.imp-bulk{display:flex;align-items:center;gap:14px;flex-wrap:wrap;background:#faf8f2;border:1px solid var(--line);border-radius:10px;padding:10px 12px}
.imp-bl{display:flex;align-items:center;gap:7px;font-size:12px;font-weight:600;color:#5a5648}
.imp-bl .input{padding:6px 8px;font-size:12px;max-width:190px}
.imp-table-wrap{max-height:46vh;overflow:auto;border:1px solid var(--line);border-radius:10px}
.imp-table{font-size:12.5px}
.imp-table th{position:sticky;top:0;background:#f4f1ea;z-index:1}
.imp-table .input{padding:5px 7px;font-size:12px;min-width:150px}
.imp-table .ar{text-align:right}
tr.imp-dup{opacity:.5}
tr.imp-off{opacity:.4}
.saldo-panel{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
.saldo-box{background:#fff;border:1px solid var(--line);border-radius:14px;padding:16px 18px}
.saldo-box.saldo-main{background:linear-gradient(135deg,#11704f,#0c5a3f);border-color:#0c5a3f}
.saldo-box.saldo-main .saldo-cap,.saldo-box.saldo-main .saldo-amt,.saldo-box.saldo-main .saldo-note{color:#fff}
.saldo-box.saldo-main .saldo-note{color:rgba(255,255,255,.75)}
.saldo-box.saldo-pt{background:linear-gradient(135deg,#fbf7ec,#fff);border-color:var(--gold)}
.saldo-cap{display:flex;align-items:center;gap:6px;font-size:12px;font-weight:600;color:var(--muted);margin-bottom:8px}
.saldo-amt{font-size:20px;font-weight:700;color:var(--ink);letter-spacing:-.02em}
.saldo-note{font-size:11px;color:var(--muted);margin-top:4px}
.btn-xs.danger{color:var(--red)}
.page-h{font-size:19px;font-weight:700;color:var(--ink);margin:0}
.txfilter{display:flex;align-items:center;gap:10px;flex-wrap:wrap;background:#fff;border:1px solid var(--line);border-radius:12px;padding:10px 14px}
.txfilter .input{padding:7px 10px;font-size:13px;width:auto}
.txfilter .txf-select{max-width:220px}
.txf-label{display:flex;align-items:center;gap:6px;font-size:13px;font-weight:600;color:var(--muted)}
.txf-sum{font-size:13px;font-weight:600;color:var(--ink)}
.setup-card{border:2px solid var(--gold);background:linear-gradient(135deg,#fbf7ec,#fff)}
.carry-sec{background:#fbf7ec;border-radius:10px;padding:8px 12px;margin-top:10px}
.carry-sec .head span{color:#a87f29}
.gold-price-card{background:linear-gradient(135deg,#fbf7ec,#fff);border:1px solid var(--gold);border-radius:14px;padding:18px 20px}
.gp-cap{display:flex;align-items:center;gap:8px;font-weight:700;color:#a87f29;margin-bottom:12px}
.gp-input-row{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:8px}
.gp-input-row>div:first-child{min-width:200px}
.kekayaan-strip{display:grid;grid-template-columns:1.3fr 1fr;gap:14px}
.kk-box{border-radius:14px;padding:18px 20px;border:1px solid var(--line)}
.kk-total{background:linear-gradient(135deg,#1a1814,#2c2820);color:#fff;border-color:#2c2820}
.kk-total .kk-cap,.kk-total .kk-amt{color:#fff}
.kk-total .kk-note{color:rgba(255,255,255,.7)}
.kk-gold{background:linear-gradient(135deg,#fbf7ec,#fff);border-color:var(--gold);cursor:pointer;transition:transform .12s}
.kk-gold:hover{transform:translateY(-2px)}
.kk-cap{display:flex;align-items:center;gap:6px;font-size:12px;font-weight:600;color:var(--muted);margin-bottom:8px}
.kk-amt{font-size:24px;font-weight:800;letter-spacing:-.02em}
.kk-gold .kk-amt{color:#a87f29}
.kk-note{font-size:11px;color:var(--muted);margin-top:4px}
@media(max-width:900px){.kekayaan-strip{grid-template-columns:1fr}}
@media(max-width:900px){.saldo-panel{grid-template-columns:repeat(2,1fr)}}

/* polish: aksesibilitas dan rasa interaksi */
button:disabled{opacity:.62;cursor:not-allowed;transform:none!important;box-shadow:none!important}
button:focus-visible,.input:focus-visible,.svc-chip:focus-visible,.tab-btn:focus-visible{outline:3px solid rgba(199,154,62,.35);outline-offset:2px}
tbody tr{transition:background .14s ease}
.table-wrap{scrollbar-width:thin;scrollbar-color:#cfc7b3 transparent}
.muted a{color:var(--emerald);font-weight:700}
@media(prefers-reduced-motion:reduce){
  *,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important;transition-duration:.01ms!important}
}

@media print{.sidebar,.topbar,.no-print,.toolbar,.sidebar-overlay,.mobile-toggle{display:none!important}.main{display:block}.content{padding:0}.card{box-shadow:none;border:1px solid #ddd}.content>.stack>*{animation:none}}
`;
