import React from "react";
import { rupiah, fmtDate } from "../utils/helpers";
import SIGNATURE, { STAMP } from "./signature";

/*
  InvoicePrint — desain mengikuti template PDF Hajar Aswad Barokah.
  Cara pakai:
    <InvoicePrint
      logo={LOGO_GOLD}
      data={{
        customerName: "Mega Merdekawati",
        periode: "30 Okt - 5 Nov 2025",       // opsional
        alamat: "Kota Banjar",
        telepon: "+62821-1996-8291",
        email: "",
        nomor: "INV-VIS25091701",
        tanggal: "2025-09-17",                 // ISO, diformat via fmtDate
        items: [
          { deskripsi: "Visa", kuantitas: "2 Pax", total: 5400000 },
          { deskripsi: "Siskopatuh", kuantitas: "2 Pax", total: 400000 },
        ],
      }}
    />
  Tombol cetak: cukup panggil window.print() dari parent (pakai class no-print
  yang sudah ada di app untuk menyembunyikan UI lain saat print).
*/

const NAVY = "#152a4e";
const GOLD = "#d8b45f";
const GOLD_DARK = "#c9a54a";

export default function InvoicePrint({ data = {}, logo }) {
  const {
    customerName = "",
    periode = "",
    telepon = "",
    email = "",
    nomor = "",
    tanggal = "",
    items = [],
  } = data;

  const grandTotal = items.reduce((s, it) => s + (Number(it.total) || 0), 0);

  return (
    <div className="inv-page">
      {/* ===== HEADER ===== */}
      <div className="inv-header">
        <div className="inv-header-left">
          <div className="inv-title">INVOICE</div>
          <div className="inv-title-rule" />
          {customerName && (
            <div className="inv-customer">{customerName.toUpperCase()}</div>
          )}
          {periode && <div className="inv-periode">PERIODE {periode.toUpperCase()}</div>}
        </div>
        <div className="inv-header-right">
          {logo && <img src={logo} alt="Hajar Aswad Barokah" className="inv-logo" />}
          <div className="inv-brand">HAJAR ASWAD</div>
          <div className="inv-brand-sub">B A R O K A H</div>
        </div>
      </div>
      <div className="inv-header-strip" />

      <div className="inv-body">
        {/* ===== DATA PEMESAN ===== */}
        <div className="inv-section-title">DATA PEMESAN</div>
        <div className="inv-pemesan">
          <table className="inv-kv">
            <tbody>
              <tr><td>Nama</td><td>:</td><td>{customerName}</td></tr>
              <tr><td>Telepon</td><td>:</td><td>{telepon}</td></tr>
              <tr><td>Email</td><td>:</td><td>{email}</td></tr>
            </tbody>
          </table>
          <table className="inv-kv">
            <tbody>
              <tr><td>Nomor</td><td>:</td><td>{nomor}</td></tr>
              <tr><td>Tanggal</td><td>:</td><td>{tanggal ? fmtDate(tanggal) : ""}</td></tr>
            </tbody>
          </table>
        </div>

        {/* ===== RINCIAN LAYANAN ===== */}
        <div className="inv-section-title">RINCIAN LAYANAN</div>
        <table className="inv-items">
          <thead>
            <tr>
              <th style={{ width: "8%" }}>No</th>
              <th style={{ width: "44%" }}>Deskripsi Layanan</th>
              <th style={{ width: "22%" }}>Kuantitas</th>
              <th style={{ width: "26%" }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{it.deskripsi}</td>
                <td>{it.kuantitas}</td>
                <td>{rupiah(it.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="inv-total-row">
          <div className="inv-total-label">Total keseluruhan</div>
          <div className="inv-total-value">{rupiah(grandTotal)}</div>
        </div>

        {/* ===== INFORMASI PEMBAYARAN ===== */}
        <div className="inv-section-title">INFORMASI PEMBAYARAN</div>
        <div className="inv-pay">
          <div className="inv-pay-left">
            <table className="inv-kv">
              <tbody>
                <tr><td>Nomor Rekening</td><td>:</td><td>BRI 035601037112500</td></tr>
                <tr><td>Nomor Rekening</td><td>:</td><td>BSI 7152864967</td></tr>
                <tr><td>Nama Rekening</td><td>:</td><td>Mohammad Hajar Zakariya</td></tr>
                <tr className="inv-kv-gap"><td>Nama Bank</td><td>:</td><td>BSI</td></tr>
                <tr><td>Nomor Rekening</td><td>:</td><td>7324499975</td></tr>
                <tr><td>Nama Rekening</td><td>:</td><td>PT Hajar Aswad Barokah</td></tr>
              </tbody>
            </table>
          </div>
          <div className="inv-pay-sign">
            <div className="inv-sign-wrap">
              <img src={STAMP} alt="" className="inv-stamp-img" />
              <img src={SIGNATURE} alt="" className="inv-sign-img" />
            </div>
            <div className="inv-sign-name">Mohammad Hajar Zakariya</div>
            <div className="inv-sign-role">Direktur Utama</div>
          </div>
        </div>

        <div className="inv-thanks">TERIMA KASIH ATAS KEPERCAYAANNYA</div>
      </div>

      {/* ===== FOOTER ===== */}
      <div className="inv-footer">
        {logo && <img src={logo} alt="" className="inv-footer-logo" />}
        <div>
          <div className="inv-footer-brand">HAJAR ASWAD</div>
          <div className="inv-footer-sub">B A R O K A H</div>
          <div className="inv-footer-addr">
            JL Angkasa 1 No 2, Kemayoran, Jakarta Pusat
            <br />
            +62821 3988 1976
            <br />
            hajaraswadbarokah@gmail.com
          </div>
        </div>
      </div>

      <style>{`
        .inv-page{
          width:210mm;min-height:297mm;margin:0 auto;background:#fff;
          font-family:'Segoe UI',Arial,sans-serif;color:#2b2b2b;
          display:flex;flex-direction:column;box-shadow:0 2px 14px rgba(0,0,0,.15);
        }
        /* Header */
        .inv-header{
          background:${NAVY};color:#fff;display:flex;justify-content:space-between;
          align-items:flex-start;padding:14mm 16mm 10mm;position:relative;
        }
        .inv-title{
          font-size:15mm;font-weight:800;letter-spacing:2mm;color:${GOLD};
          font-family:Georgia,'Times New Roman',serif;
        }
        .inv-title-rule{height:.6mm;background:${GOLD};width:90mm;margin:2mm 0 5mm}
        .inv-customer{font-size:6mm;font-weight:800;letter-spacing:.8mm;color:${GOLD}}
        .inv-periode{font-size:3.6mm;color:#e8e8e8;margin-top:2mm;letter-spacing:.3mm}
        .inv-header-right{text-align:center;min-width:52mm}
        .inv-logo{width:26mm;height:auto;display:block;margin:0 auto 2mm}
        .inv-brand{color:${GOLD};font-size:6.4mm;font-weight:700;letter-spacing:1mm;
          font-family:Georgia,serif;white-space:nowrap}
        .inv-brand-sub{color:${GOLD};font-size:3.4mm;letter-spacing:2mm}
        .inv-header-strip{height:3mm;background:${NAVY};border-top:1mm solid #0e1f3c}

        /* Body */
        .inv-body{padding:10mm 16mm;flex:1}
        .inv-section-title{
          color:${GOLD_DARK};font-weight:800;font-size:5.4mm;letter-spacing:1mm;
          margin:8mm 0 3mm;font-family:Georgia,serif;
        }
        .inv-section-title:first-child{margin-top:0}
        .inv-pemesan{display:flex;gap:14mm}
        .inv-kv{border-collapse:collapse;font-size:3.6mm}
        .inv-kv td{padding:.9mm 0;vertical-align:top}
        .inv-kv td:first-child{width:20mm;color:#444;white-space:nowrap}
        .inv-kv td:nth-child(2){width:3mm;color:#444}
        .inv-kv-gap td{padding-top:3.5mm}

        /* Items table */
        .inv-items{width:100%;border-collapse:collapse;font-size:3.7mm;margin-top:2mm}
        .inv-items th{
          text-align:left;font-weight:700;padding:2.6mm 2mm;
          border-top:.4mm solid ${GOLD};border-bottom:.4mm solid ${GOLD};color:#222;
        }
        .inv-items td{padding:3.2mm 2mm;vertical-align:top}
        .inv-total-row{
          display:flex;justify-content:space-between;align-items:center;
          border-top:.4mm solid ${GOLD};margin-top:6mm;padding:3.5mm 2mm 0;
          font-weight:800;font-size:4mm;
        }
        .inv-total-row .inv-total-label{padding-left:18mm}
        .inv-total-row .inv-total-value{padding-right:14mm}

        /* Pembayaran */
        .inv-pay{display:flex;justify-content:space-between;align-items:flex-end;gap:10mm}
        .inv-pay-sign{text-align:center;min-width:60mm;padding-bottom:1mm}
        .inv-sign-wrap{position:relative;display:inline-block}
        .inv-sign-img{height:22mm;width:auto;display:block;margin:0 auto -2mm;position:relative;z-index:1}
        .inv-stamp-img{
          position:absolute;left:50%;top:50%;height:24mm;width:auto;
          transform:translate(-72%,-56%) rotate(-12deg);opacity:.35;z-index:0;
        }
        .inv-sign-name{font-weight:800;font-size:3.7mm;text-decoration:underline}
        .inv-sign-role{font-weight:700;font-size:3.4mm;margin-top:1mm}

        .inv-thanks{
          color:${GOLD_DARK};font-weight:800;font-size:5mm;letter-spacing:.8mm;
          margin-top:9mm;font-family:Georgia,serif;
        }

        /* Footer */
        .inv-footer{
          background:${NAVY};color:${GOLD};display:flex;gap:6mm;align-items:center;
          padding:6mm 16mm;
        }
        .inv-footer-logo{width:20mm}
        .inv-footer-brand{font-size:7mm;font-weight:700;font-family:Georgia,serif;letter-spacing:.8mm}
        .inv-footer-sub{font-size:3.4mm;letter-spacing:2.4mm}
        .inv-footer-addr{color:#dfe6f2;font-size:3.2mm;margin-top:2mm;line-height:1.5}

        /* Print */
        @media print{
          .inv-page{box-shadow:none;margin:0;width:210mm;height:296mm;min-height:0;overflow:hidden}
          @page{size:A4;margin:0}
          .inv-header,.inv-footer,.inv-header-strip{
            -webkit-print-color-adjust:exact;print-color-adjust:exact;
          }
        }
      `}</style>
    </div>
  );
}
