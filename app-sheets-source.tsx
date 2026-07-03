import React, { useState, useEffect, useMemo, useRef } from "react";

const APP_VERSION = "2026.07.03-1";

/* ---------- configuração da integração com Google Sheets ---------- */
const GOOGLE_CLIENT_ID = "916443066549-qj84og3gajuru9734bgjgd207rfs3l6e.apps.googleusercontent.com";
const SPREADSHEET_ID = "1-1H2_kpa624M7v7Sfs3e8F2488gjMrrJ1D898CTHa9U";
const SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets";

const CAMINHOES_HEADER = ["id", "placa"];
const VIAGENS_HEADER = [
  "id", "caminhaoId", "data", "origem", "destino", "kmInicio", "kmFim", "dataFim",
  "contrato", "adiantamento", "dataRecebAdiantamento", "saldoReceber", "dataPagamentoSaldo",
  "empresa", "motorista", "valorComissaoBase", "pedagio", "abastecimentosJSON", "gastosExtrasJSON",
];
const VALES_HEADER = ["id", "motorista", "data", "valor", "tipo", "observacao", "origemGastoId", "agendado"];
const BOLETOS_HEADER = ["id", "empresa", "descricao", "notaFiscal", "valor", "dataVencimento", "contaBancaria", "dataPagamento", "observacao"];
const EMPRESAS_HEADER = ["id", "nome"];
const FECHAMENTOS_HEADER = ["id", "motorista", "data", "valor"];
const DESPESAS_VEICULO_HEADER = ["id", "caminhaoId", "data", "descricao", "valor", "observacao"];
const TAXAS_POOL_HEADER = ["id", "mes", "data", "valor", "descricao"];
const MOTORISTAS_HEADER = ["id", "nome"];
const CONTAS_HEADER = ["id", "nome"];

async function sheetsFetch(path, token, options = {}) {
  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Google Sheets (${res.status}): ${body}`);
  }
  return res.json();
}

async function ensureSheetsExist(token) {
  const meta = await sheetsFetch("?fields=sheets.properties.title", token);
  const titles = (meta.sheets || []).map((s) => s.properties.title);
  const missing = ["Caminhoes", "Viagens", "Vales", "Boletos", "Empresas", "Fechamentos", "DespesasVeiculo", "TaxasPool", "Motoristas", "Contas"].filter((t) => !titles.includes(t));
  if (missing.length > 0) {
    await sheetsFetch(":batchUpdate", token, {
      method: "POST",
      body: JSON.stringify({
        requests: missing.map((title) => ({ addSheet: { properties: { title } } })),
      }),
    });
  }
  // garante a linha de cabeçalho em todas as abas
  await sheetsFetch(`/values/Caminhoes!A1:B1?valueInputOption=RAW`, token, {
    method: "PUT",
    body: JSON.stringify({ range: "Caminhoes!A1:B1", values: [CAMINHOES_HEADER] }),
  });
  await sheetsFetch(`/values/Viagens!A1:S1?valueInputOption=RAW`, token, {
    method: "PUT",
    body: JSON.stringify({ range: "Viagens!A1:S1", values: [VIAGENS_HEADER] }),
  });
  await sheetsFetch(`/values/Vales!A1:H1?valueInputOption=RAW`, token, {
    method: "PUT",
    body: JSON.stringify({ range: "Vales!A1:H1", values: [VALES_HEADER] }),
  });
  await sheetsFetch(`/values/Boletos!A1:I1?valueInputOption=RAW`, token, {
    method: "PUT",
    body: JSON.stringify({ range: "Boletos!A1:I1", values: [BOLETOS_HEADER] }),
  });
  await sheetsFetch(`/values/Empresas!A1:B1?valueInputOption=RAW`, token, {
    method: "PUT",
    body: JSON.stringify({ range: "Empresas!A1:B1", values: [EMPRESAS_HEADER] }),
  });
  await sheetsFetch(`/values/Fechamentos!A1:D1?valueInputOption=RAW`, token, {
    method: "PUT",
    body: JSON.stringify({ range: "Fechamentos!A1:D1", values: [FECHAMENTOS_HEADER] }),
  });
  await sheetsFetch(`/values/DespesasVeiculo!A1:F1?valueInputOption=RAW`, token, {
    method: "PUT",
    body: JSON.stringify({ range: "DespesasVeiculo!A1:F1", values: [DESPESAS_VEICULO_HEADER] }),
  });
  await sheetsFetch(`/values/TaxasPool!A1:E1?valueInputOption=RAW`, token, {
    method: "PUT",
    body: JSON.stringify({ range: "TaxasPool!A1:E1", values: [TAXAS_POOL_HEADER] }),
  });
  await sheetsFetch(`/values/Motoristas!A1:B1?valueInputOption=RAW`, token, {
    method: "PUT",
    body: JSON.stringify({ range: "Motoristas!A1:B1", values: [MOTORISTAS_HEADER] }),
  });
  await sheetsFetch(`/values/Contas!A1:B1?valueInputOption=RAW`, token, {
    method: "PUT",
    body: JSON.stringify({ range: "Contas!A1:B1", values: [CONTAS_HEADER] }),
  });
}

function safeParseJSON(str, fallback) {
  try {
    const parsed = JSON.parse(str);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch (e) {
    return fallback;
  }
}

function rowToTruck(row) {
  return { id: row[0] || "", placa: row[1] || "" };
}
function truckToRow(t) {
  return [t.id, t.placa];
}
function rowToTrip(row) {
  return {
    id: row[0] || "",
    caminhaoId: row[1] || "",
    data: row[2] || "",
    origem: row[3] || "",
    destino: row[4] || "",
    kmInicio: row[5] || "",
    kmFim: row[6] || "",
    dataFim: row[7] || "",
    contrato: row[8] || "",
    adiantamento: row[9] || "",
    dataRecebAdiantamento: row[10] || "",
    saldoReceber: row[11] || "",
    dataPagamentoSaldo: row[12] || "",
    empresa: row[13] || "",
    motorista: row[14] || "",
    valorComissaoBase: row[15] || "",
    pedagio: row[16] || "",
    abastecimentos: safeParseJSON(row[17], []),
    gastosExtras: safeParseJSON(row[18], []),
  };
}
function tripToRow(t) {
  return [
    t.id, t.caminhaoId, t.data, t.origem, t.destino, t.kmInicio, t.kmFim, t.dataFim,
    t.contrato, t.adiantamento, t.dataRecebAdiantamento, t.saldoReceber, t.dataPagamentoSaldo,
    t.empresa, t.motorista, t.valorComissaoBase, t.pedagio,
    JSON.stringify(t.abastecimentos || []), JSON.stringify(t.gastosExtras || []),
  ];
}

function rowToVale(row) {
  return {
    id: row[0] || "",
    motorista: row[1] || "",
    data: row[2] || "",
    valor: row[3] || "",
    tipo: row[4] || "vale",
    observacao: row[5] || "",
    origemGastoId: row[6] || "",
    agendado: row[7] || "",
  };
}
function valeToRow(v) {
  return [v.id, v.motorista, v.data, v.valor, v.tipo || "vale", v.observacao || "", v.origemGastoId || "", v.agendado || ""];
}

function rowToFechamento(row) {
  return { id: row[0] || "", motorista: row[1] || "", data: row[2] || "", valor: row[3] || "" };
}
function fechamentoToRow(f) {
  return [f.id, f.motorista, f.data, f.valor];
}

function rowToDespesaVeiculo(row) {
  return {
    id: row[0] || "",
    caminhaoId: row[1] || "",
    data: row[2] || "",
    descricao: row[3] || "",
    valor: row[4] || "",
    observacao: row[5] || "",
  };
}
function despesaVeiculoToRow(d) {
  return [d.id, d.caminhaoId, d.data, d.descricao, d.valor, d.observacao || ""];
}

function rowToTaxaPool(row) {
  return { id: row[0] || "", mes: row[1] || "", data: row[2] || "", valor: row[3] || "", descricao: row[4] || "" };
}
function taxaPoolToRow(t) {
  return [t.id, t.mes, t.data, t.valor, t.descricao || ""];
}

function rowToMotorista(row) {
  return { id: row[0] || "", nome: row[1] || "" };
}
function motoristaToRow(m) {
  return [m.id, m.nome];
}

function rowToConta(row) {
  return { id: row[0] || "", nome: row[1] || "" };
}
function contaToRow(c) {
  return [c.id, c.nome];
}

function rowToBoleto(row) {
  return {
    id: row[0] || "",
    empresa: row[1] || "",
    descricao: row[2] || "",
    notaFiscal: row[3] || "",
    valor: row[4] || "",
    dataVencimento: row[5] || "",
    contaBancaria: row[6] || "",
    dataPagamento: row[7] || "",
    observacao: row[8] || "",
  };
}
function boletoToRow(b) {
  return [b.id, b.empresa, b.descricao || "", b.notaFiscal, b.valor, b.dataVencimento, b.contaBancaria, b.dataPagamento, b.observacao || ""];
}

function rowToEmpresa(row) {
  return { id: row[0] || "", nome: row[1] || "" };
}
function empresaToRow(e) {
  return [e.id, e.nome];
}

async function loadFromSheets(token) {
  await ensureSheetsExist(token);
  const [caminhoesRes, viagensRes, valesRes, boletosRes, empresasRes, fechamentosRes, despesasVeiculoRes, taxasPoolRes, motoristasRes, contasRes] = await Promise.all([
    sheetsFetch(`/values/Caminhoes!A2:B`, token),
    sheetsFetch(`/values/Viagens!A2:S`, token),
    sheetsFetch(`/values/Vales!A2:H`, token),
    sheetsFetch(`/values/Boletos!A2:I`, token),
    sheetsFetch(`/values/Empresas!A2:B`, token),
    sheetsFetch(`/values/Fechamentos!A2:D`, token),
    sheetsFetch(`/values/DespesasVeiculo!A2:F`, token),
    sheetsFetch(`/values/TaxasPool!A2:E`, token),
    sheetsFetch(`/values/Motoristas!A2:B`, token),
    sheetsFetch(`/values/Contas!A2:B`, token),
  ]);
  const trucks = (caminhoesRes.values || [])
    .filter((row) => row[0])
    .map(rowToTruck);
  const trips = (viagensRes.values || [])
    .filter((row) => row[0])
    .map(rowToTrip);
  const vales = (valesRes.values || [])
    .filter((row) => row[0])
    .map(rowToVale);
  const boletos = (boletosRes.values || [])
    .filter((row) => row[0])
    .map(rowToBoleto);
  const empresas = (empresasRes.values || [])
    .filter((row) => row[0])
    .map(rowToEmpresa);
  const fechamentos = (fechamentosRes.values || [])
    .filter((row) => row[0])
    .map(rowToFechamento);
  const despesasVeiculo = (despesasVeiculoRes.values || [])
    .filter((row) => row[0])
    .map(rowToDespesaVeiculo);
  const taxasPool = (taxasPoolRes.values || [])
    .filter((row) => row[0])
    .map(rowToTaxaPool);
  const motoristas = (motoristasRes.values || [])
    .filter((row) => row[0])
    .map(rowToMotorista);
  const contas = (contasRes.values || [])
    .filter((row) => row[0])
    .map(rowToConta);
  return { trucks, trips, vales, boletos, empresas, fechamentos, despesasVeiculo, taxasPool, motoristas, contas };
}

async function saveToSheets(token, trucks, trips, vales, boletos, empresas, fechamentos, despesasVeiculo, taxasPool, motoristas, contas) {
  await sheetsFetch(`/values/Caminhoes!A1:B5000:clear`, token, { method: "POST" });
  await sheetsFetch(`/values/Viagens!A1:S5000:clear`, token, { method: "POST" });
  await sheetsFetch(`/values/Vales!A1:H5000:clear`, token, { method: "POST" });
  await sheetsFetch(`/values/Boletos!A1:I5000:clear`, token, { method: "POST" });
  await sheetsFetch(`/values/Empresas!A1:B5000:clear`, token, { method: "POST" });
  await sheetsFetch(`/values/Fechamentos!A1:D5000:clear`, token, { method: "POST" });
  await sheetsFetch(`/values/DespesasVeiculo!A1:F5000:clear`, token, { method: "POST" });
  await sheetsFetch(`/values/TaxasPool!A1:E5000:clear`, token, { method: "POST" });
  await sheetsFetch(`/values/Motoristas!A1:B5000:clear`, token, { method: "POST" });
  await sheetsFetch(`/values/Contas!A1:B5000:clear`, token, { method: "POST" });
  const caminhoesValues = [CAMINHOES_HEADER, ...trucks.map(truckToRow)];
  const viagensValues = [VIAGENS_HEADER, ...trips.map(tripToRow)];
  const valesValues = [VALES_HEADER, ...(vales || []).map(valeToRow)];
  const boletosValues = [BOLETOS_HEADER, ...(boletos || []).map(boletoToRow)];
  const empresasValues = [EMPRESAS_HEADER, ...(empresas || []).map(empresaToRow)];
  const fechamentosValues = [FECHAMENTOS_HEADER, ...(fechamentos || []).map(fechamentoToRow)];
  const despesasVeiculoValues = [DESPESAS_VEICULO_HEADER, ...(despesasVeiculo || []).map(despesaVeiculoToRow)];
  const taxasPoolValues = [TAXAS_POOL_HEADER, ...(taxasPool || []).map(taxaPoolToRow)];
  const motoristasValues = [MOTORISTAS_HEADER, ...(motoristas || []).map(motoristaToRow)];
  const contasValues = [CONTAS_HEADER, ...(contas || []).map(contaToRow)];
  await sheetsFetch(`/values/Caminhoes!A1?valueInputOption=RAW`, token, {
    method: "PUT",
    body: JSON.stringify({ range: "Caminhoes!A1", values: caminhoesValues }),
  });
  await sheetsFetch(`/values/Viagens!A1?valueInputOption=RAW`, token, {
    method: "PUT",
    body: JSON.stringify({ range: "Viagens!A1", values: viagensValues }),
  });
  await sheetsFetch(`/values/Vales!A1?valueInputOption=RAW`, token, {
    method: "PUT",
    body: JSON.stringify({ range: "Vales!A1", values: valesValues }),
  });
  await sheetsFetch(`/values/Boletos!A1?valueInputOption=RAW`, token, {
    method: "PUT",
    body: JSON.stringify({ range: "Boletos!A1", values: boletosValues }),
  });
  await sheetsFetch(`/values/Empresas!A1?valueInputOption=RAW`, token, {
    method: "PUT",
    body: JSON.stringify({ range: "Empresas!A1", values: empresasValues }),
  });
  await sheetsFetch(`/values/Fechamentos!A1?valueInputOption=RAW`, token, {
    method: "PUT",
    body: JSON.stringify({ range: "Fechamentos!A1", values: fechamentosValues }),
  });
  await sheetsFetch(`/values/DespesasVeiculo!A1?valueInputOption=RAW`, token, {
    method: "PUT",
    body: JSON.stringify({ range: "DespesasVeiculo!A1", values: despesasVeiculoValues }),
  });
  await sheetsFetch(`/values/TaxasPool!A1?valueInputOption=RAW`, token, {
    method: "PUT",
    body: JSON.stringify({ range: "TaxasPool!A1", values: taxasPoolValues }),
  });
  await sheetsFetch(`/values/Motoristas!A1?valueInputOption=RAW`, token, {
    method: "PUT",
    body: JSON.stringify({ range: "Motoristas!A1", values: motoristasValues }),
  });
  await sheetsFetch(`/values/Contas!A1?valueInputOption=RAW`, token, {
    method: "PUT",
    body: JSON.stringify({ range: "Contas!A1", values: contasValues }),
  });
}

/* ---------- helpers ---------- */
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const BRL = (n) =>
  (Number(n) || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const fmtDate = (d) => {
  if (!d) return "—";
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
};
const emptyAbastecimento = () => ({ id: uid(), data: "", litragem: "", km: "", valor: "", posto: "", numeroCupom: "", tipo: "diesel" });
const emptyGasto = () => ({ id: uid(), data: "", valor: "", descricao: "", posto: "", numeroCupom: "", paraComissao: false });

const emptyTrip = () => ({
  id: uid(),
  caminhaoId: "",
  data: "",
  origem: "",
  destino: "",
  kmInicio: "",
  kmFim: "",
  dataFim: "",
  contrato: "",
  adiantamento: "",
  dataRecebAdiantamento: "",
  saldoReceber: "",
  dataPagamentoSaldo: "",
  empresa: "",
  motorista: "",
  valorComissaoBase: "",
  pedagio: "",
  abastecimentos: [emptyAbastecimento()],
  gastosExtras: [emptyGasto()],
});

// migra viagens antigas (campos unicos) para o novo formato de listas
const normalizeTrip = (t) => {
  if (t.abastecimentos && t.gastosExtras) return t;
  const abastecimentos =
    t.dataAbastecimento || t.litragem || t.kmAbastecimento || t.valorAbastecimento || t.posto
      ? [{ id: uid(), data: t.dataAbastecimento || "", litragem: t.litragem || "", km: t.kmAbastecimento || "", valor: t.valorAbastecimento || "", posto: t.posto || "" }]
      : [emptyAbastecimento()];
  const gastosExtras =
    t.dataGasto || t.valorGasto || t.descricaoGasto
      ? [{ id: uid(), data: t.dataGasto || "", valor: t.valorGasto || "", descricao: t.descricaoGasto || "" }]
      : [emptyGasto()];
  return { ...t, abastecimentos, gastosExtras };
};

const valorTotal = (t) => (Number(t.adiantamento) || 0) + (Number(t.saldoReceber) || 0);
const comissao = (t) => Math.max(0, ((Number(t.valorComissaoBase) || 0) - (Number(t.pedagio) || 0)) * 0.13);

/* ---------- plate chip (signature element) ---------- */
function PlateChip({ placa, active, onClick, size = "md" }) {
  const pad = size === "sm" ? "4px 10px" : "6px 14px";
  const fs = size === "sm" ? 12 : 15;
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "stretch",
        borderRadius: 6,
        overflow: "hidden",
        border: active ? "2px solid #D9A419" : "2px solid transparent",
        boxShadow: active
          ? "0 2px 10px rgba(217,164,25,0.35)"
          : "0 1px 3px rgba(27,36,48,0.15)",
        cursor: "pointer",
        transition: "transform .15s ease, box-shadow .15s ease",
        transform: active ? "translateY(-1px)" : "none",
        background: "none",
        padding: 0,
      }}
    >
      <span style={{ background: "#2451A6", width: 8 }} />
      <span
        style={{
          background: "#fff",
          color: "#1B2430",
          fontFamily: "'JetBrains Mono', monospace",
          fontWeight: 700,
          fontSize: fs,
          padding: pad,
          letterSpacing: 1,
        }}
      >
        {placa || "SEM PLACA"}
      </span>
    </button>
  );
}

/* ---------- stat sign ---------- */
function MileSign({ label, value, tone, onClick }) {
  const tones = {
    amber: { bg: "#FFF6E2", fg: "#8A5A00", ring: "#D9A419" },
    green: { bg: "#E9F5F1", fg: "#12503F", ring: "#1F6F5C" },
    red: { bg: "#FBEBE8", fg: "#7A2A1D", ring: "#B0402E" },
  }[tone];
  return (
    <div
      onClick={onClick}
      style={{
        background: tones.bg,
        border: `1px solid ${tones.ring}33`,
        borderLeft: `5px solid ${tones.ring}`,
        borderRadius: 8,
        padding: "14px 18px",
        minWidth: 150,
        flex: "1 1 150px",
        cursor: onClick ? "pointer" : "default",
      }}
    >
      <div
        style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 13,
          letterSpacing: 1.2,
          textTransform: "uppercase",
          color: tones.fg,
          opacity: 0.85,
          marginBottom: 4,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        {label}
        {onClick && <span style={{ fontSize: 11, opacity: 0.7 }}>▸ ver lista</span>}
      </div>
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontWeight: 700,
          fontSize: 24,
          color: tones.fg,
        }}
      >
        {value}
      </div>
    </div>
  );
}

/* ---------- field ---------- */
function Field({ label, children }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13 }}>
      <span style={{ color: "#5A6472", fontWeight: 600 }}>{label}</span>
      {children}
    </label>
  );
}

const inputStyle = {
  border: "1px solid #D7DBE0",
  borderRadius: 6,
  padding: "8px 10px",
  fontSize: 14,
  fontFamily: "'Inter', sans-serif",
  color: "#1B2430",
  background: "#fff",
  outline: "none",
};

function NovoMotoristaForm({ visible, onCancel, onConfirm, inputStyle }) {
  const [nome, setNome] = useState("");
  const [data, setData] = useState(() => new Date().toISOString().slice(0, 10));
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("vale");
  const [obs, setObs] = useState("");

  if (!visible) return null;

  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "flex-end", background: "#F7F8F9", padding: 10, borderRadius: 8, marginBottom: 16 }}>
      <Field label="Nome do motorista">
        <input style={inputStyle} value={nome} onChange={(e) => setNome(e.target.value)} placeholder="digite o nome" autoFocus />
      </Field>
      <Field label="Tipo">
        <select style={inputStyle} value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="vale">Vale (adiantamento pago a ele)</option>
          <option value="reembolso">Reembolso (ele pagou, devemos a ele)</option>
        </select>
      </Field>
      <Field label="Data">
        <input type="date" style={inputStyle} value={data} onChange={(e) => setData(e.target.value)} />
      </Field>
      <Field label="Valor (R$)">
        <input type="number" style={{ ...inputStyle, width: 100 }} value={valor} onChange={(e) => setValor(e.target.value)} />
      </Field>
      <Field label="Observação (opcional)">
        <input style={{ ...inputStyle, width: 140 }} value={obs} onChange={(e) => setObs(e.target.value)} />
      </Field>
      <button onClick={() => onConfirm(nome, data, valor, tipo, obs)} style={{ background: "#1F6F5C", color: "#fff", border: "none", borderRadius: 6, padding: "8px 14px", fontWeight: 700, cursor: "pointer" }}>
        Salvar
      </button>
      <button onClick={onCancel} style={{ background: "none", border: "1px solid #D7DBE0", borderRadius: 6, padding: "8px 14px", cursor: "pointer" }}>
        Cancelar
      </button>
    </div>
  );
}


function RepeatingSection({ title, items, onAdd, onRemove, onUpdate, addLabel, renderItem }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div
        style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 16,
          fontWeight: 700,
          letterSpacing: 0.5,
          textTransform: "uppercase",
          color: "#1B2430",
          borderBottom: "2px solid #EEF0F2",
          paddingBottom: 6,
          marginBottom: 12,
        }}
      >
        {title}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              background: "#F7F8F9",
              border: "1px solid #E3E7EB",
              borderRadius: 8,
              padding: "12px",
              position: "relative",
            }}
          >
            {items.length > 1 && (
              <button
                onClick={() => onRemove(item.id)}
                title="Remover"
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  background: "#B0402E",
                  color: "#fff",
                  border: "none",
                  borderRadius: "50%",
                  width: 20,
                  height: 20,
                  fontSize: 12,
                  lineHeight: "16px",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px,1fr))", gap: 10, paddingRight: 20 }}>
              {renderItem(item, (updated) => onUpdate(item.id, updated))}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={onAdd}
        style={{
          marginTop: 10,
          border: "2px dashed #B7BFC8",
          background: "transparent",
          borderRadius: 6,
          padding: "8px 14px",
          fontSize: 13,
          color: "#5A6472",
          cursor: "pointer",
        }}
      >
        {addLabel}
      </button>
    </div>
  );
}


function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div
        style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 16,
          fontWeight: 700,
          letterSpacing: 0.5,
          textTransform: "uppercase",
          color: "#1B2430",
          borderBottom: "2px solid #EEF0F2",
          paddingBottom: 6,
          marginBottom: 12,
        }}
      >
        {title}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px,1fr))", gap: 12 }}>
        {children}
      </div>
    </div>
  );
}

const CONTAS_COMUNS = [
  "Banco do Brasil Física",
  "Banco do Brasil Jurídica",
  "Sicoob",
  "Sicredi Jurídica",
  "Sicredi X",
  "Sicredi AGF",
  "Bradesco Física",
  "Bradesco Jurídica",
];

const emptyBoleto = () => ({
  id: uid(),
  empresa: "",
  descricao: "",
  notaFiscal: "",
  valor: "",
  dataVencimento: "",
  contaBancaria: "",
  dataPagamento: "",
  observacao: "",
});

function BoletosView({
  boletos, onSave, onSaveMultiple, onDelete,
  reportOpen, setReportOpen, periodStart, setPeriodStart, periodEnd, setPeriodEnd,
  empresaFilter, setEmpresaFilter, empresasList, report, exportCSV,
  empresas, onAddEmpresa, onRemoveEmpresa,
  contasList, onAddConta,
}) {
  const [panelOpen, setPanelOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [listFilter, setListFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all | pendente | vencido | pago
  const [newEmpresaName, setNewEmpresaName] = useState("");
  const [addingEmpresa, setAddingEmpresa] = useState(false);

  const emptyParcela = () => ({ id: uid(), descricao: "", valor: "", dataVencimento: "", contaBancaria: "", dataPagamento: "", observacao: "", repetirFreq: "nenhuma", repetirQtd: 1 });
  const [novoOpen, setNovoOpen] = useState(false);
  const [novoEmpresa, setNovoEmpresa] = useState("");
  const [novoNotaFiscal, setNovoNotaFiscal] = useState("");
  const [novoEmpresaCustom, setNovoEmpresaCustom] = useState(false);
  const [novoParcelas, setNovoParcelas] = useState([emptyParcela()]);

  const hoje = new Date().toISOString().slice(0, 10);

  const setQuickPeriod = (kind) => {
    const d = new Date();
    if (kind === "hoje") {
      const iso = d.toISOString().slice(0, 10);
      setPeriodStart(iso);
      setPeriodEnd(iso);
    } else if (kind === "semana") {
      const day = d.getDay();
      const start = new Date(d); start.setDate(d.getDate() - day);
      const end = new Date(d); end.setDate(d.getDate() + (6 - day));
      setPeriodStart(start.toISOString().slice(0, 10));
      setPeriodEnd(end.toISOString().slice(0, 10));
    } else if (kind === "mes") {
      setPeriodStart(new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10));
      setPeriodEnd(new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().slice(0, 10));
    } else if (kind === "tudo") {
      setPeriodStart("2000-01-01");
      setPeriodEnd("2099-12-31");
    }
  };

  // stats e lista usam o mesmo `report` (período + empresa) que alimenta o relatório/PDF,
  // assim a tela e o relatório exportado sempre batem
  const visibleBoletos = useMemo(() => {
    return report.items
      .filter((b) => {
        if (listFilter && !(b.empresa || "").toLowerCase().includes(listFilter.toLowerCase())) return false;
        const status = b.dataPagamento ? "pago" : b.dataVencimento < hoje ? "vencido" : "pendente";
        if (statusFilter !== "all" && status !== statusFilter) return false;
        return true;
      })
      .sort((a, b) => (a.dataVencimento || "").localeCompare(b.dataVencimento || ""));
  }, [report.items, listFilter, statusFilter, hoje]);

  const openNew = () => {
    setNovoEmpresa("");
    setNovoNotaFiscal("");
    setNovoParcelas([emptyParcela()]);
    setNovoEmpresaCustom(false);
    setNovoOpen(true);
  };
  const openEdit = (b) => { setEditing({ ...b }); setPanelOpen(true); };

  const addPeriodo = (isoDate, freq, n) => {
    const [y, m, d] = isoDate.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    if (freq === "semanal") dt.setDate(dt.getDate() + 7 * n);
    else if (freq === "mensal") dt.setMonth(dt.getMonth() + n);
    else if (freq === "anual") dt.setFullYear(dt.getFullYear() + n);
    return dt.toISOString().slice(0, 10);
  };

  const saveNovo = () => {
    if (!novoEmpresa.trim()) {
      alert("Preencha a empresa.");
      return;
    }
    const validas = novoParcelas.filter((p) => p.valor && p.dataVencimento);
    if (validas.length === 0) {
      alert("Preencha valor e vencimento de pelo menos um boleto.");
      return;
    }
    const nomeEmpresa = novoEmpresa.trim();
    if (!empresasList.includes(nomeEmpresa)) {
      onAddEmpresa(nomeEmpresa);
    }
    const novosBoletos = [];
    validas.forEach((p) => {
      const qtd = p.repetirFreq === "nenhuma" ? 1 : Math.max(1, Number(p.repetirQtd) || 1);
      for (let i = 0; i < qtd; i++) {
        novosBoletos.push({
          id: uid(),
          empresa: nomeEmpresa,
          descricao: p.descricao || "",
          notaFiscal: novoNotaFiscal.trim(),
          valor: p.valor,
          dataVencimento: i === 0 ? p.dataVencimento : addPeriodo(p.dataVencimento, p.repetirFreq, i),
          contaBancaria: p.contaBancaria,
          dataPagamento: i === 0 ? p.dataPagamento : "",
          observacao: p.observacao,
        });
      }
    });
    onSaveMultiple(novosBoletos);
    setNovoOpen(false);
  };

  const save = () => {
    if (!editing.empresa || !editing.dataVencimento || !editing.valor) {
      alert("Preencha ao menos empresa, valor e data de vencimento.");
      return;
    }
    onSave(editing);
    setPanelOpen(false);
    setEditing(null);
  };

  const remove = () => {
    if (!window.confirm("Excluir este boleto?")) return;
    onDelete(editing.id);
    setPanelOpen(false);
    setEditing(null);
  };

  return (
    <div style={{ padding: "24px 28px", maxWidth: 1100, margin: "0 auto" }}>
      {/* empresas cadastradas */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", marginBottom: 16 }}>
        <button
          onClick={() => setEmpresaFilter("all")}
          style={{
            padding: "8px 14px", borderRadius: 6,
            border: empresaFilter === "all" ? "2px solid #D9A419" : "2px solid #D7DBE0",
            background: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer",
          }}
        >
          Todas as empresas
        </button>
        {empresasList.map((nome) => {
          const cadastro = empresas.find((e) => e.nome === nome);
          return (
            <div key={nome} style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
              <button
                onClick={() => setEmpresaFilter(nome)}
                style={{
                  padding: "8px 14px", borderRadius: 6,
                  border: empresaFilter === nome ? "2px solid #D9A419" : "2px solid #D7DBE0",
                  background: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer",
                }}
              >
                {nome}
              </button>
              {cadastro && (
                <button
                  onClick={() => { onRemoveEmpresa(cadastro.id); if (empresaFilter === nome) setEmpresaFilter("all"); }}
                  title="Remover empresa cadastrada"
                  style={{
                    marginLeft: -6, background: "#B0402E", color: "#fff", border: "2px solid #EEF0F2",
                    borderRadius: "50%", width: 18, height: 18, fontSize: 11, lineHeight: "14px", cursor: "pointer", zIndex: 1,
                  }}
                >
                  ×
                </button>
              )}
            </div>
          );
        })}
        {addingEmpresa ? (
          <div style={{ display: "inline-flex", gap: 6 }}>
            <input
              autoFocus
              value={newEmpresaName}
              onChange={(e) => setNewEmpresaName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") { onAddEmpresa(newEmpresaName); setNewEmpresaName(""); setAddingEmpresa(false); }
              }}
              placeholder="nome da empresa"
              style={{ ...inputStyle, width: 160 }}
            />
            <button
              onClick={() => { onAddEmpresa(newEmpresaName); setNewEmpresaName(""); setAddingEmpresa(false); }}
              style={{ background: "#1F6F5C", color: "#fff", border: "none", borderRadius: 6, padding: "0 12px", fontWeight: 700, cursor: "pointer" }}
            >
              OK
            </button>
          </div>
        ) : (
          <button
            onClick={() => setAddingEmpresa(true)}
            style={{ border: "2px dashed #B7BFC8", background: "transparent", borderRadius: 6, padding: "7px 14px", fontSize: 13, color: "#5A6472", cursor: "pointer" }}
          >
            + empresa
          </button>
        )}
      </div>

      {/* periodo rapido */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap", alignItems: "flex-end" }}>
        <button onClick={() => setQuickPeriod("hoje")} style={{ fontSize: 12, padding: "6px 12px", borderRadius: 6, border: "1px solid #D7DBE0", background: "#fff", cursor: "pointer" }}>Hoje</button>
        <button onClick={() => setQuickPeriod("semana")} style={{ fontSize: 12, padding: "6px 12px", borderRadius: 6, border: "1px solid #D7DBE0", background: "#fff", cursor: "pointer" }}>Esta semana</button>
        <button onClick={() => setQuickPeriod("mes")} style={{ fontSize: 12, padding: "6px 12px", borderRadius: 6, border: "1px solid #D7DBE0", background: "#fff", cursor: "pointer" }}>Este mês</button>
        <button onClick={() => setQuickPeriod("tudo")} style={{ fontSize: 12, padding: "6px 12px", borderRadius: 6, border: "1px solid #D7DBE0", background: "#fff", cursor: "pointer" }}>Tudo</button>
        <Field label="De">
          <input type="date" style={inputStyle} value={periodStart} onChange={(e) => setPeriodStart(e.target.value)} />
        </Field>
        <Field label="Até">
          <input type="date" style={inputStyle} value={periodEnd} onChange={(e) => setPeriodEnd(e.target.value)} />
        </Field>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
        <input
          value={listFilter}
          onChange={(e) => setListFilter(e.target.value)}
          placeholder="Buscar dentro dos resultados..."
          style={{ ...inputStyle, width: 220 }}
        />
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => setReportOpen(true)}
            style={{ background: "#2451A6", color: "#fff", border: "none", borderRadius: 6, padding: "9px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
          >
            Relatório de boletos
          </button>
          <button
            onClick={openNew}
            style={{ background: "#D9A419", color: "#1B2430", border: "none", borderRadius: 6, padding: "9px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
          >
            + Lançar boleto
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
        <div onClick={() => setStatusFilter("all")} style={{ cursor: "pointer" }}>
          <MileSign label="Boletos" value={report.items.length} tone="amber" />
        </div>
        <div onClick={() => setStatusFilter("pendente")} style={{ cursor: "pointer" }}>
          <MileSign label="Pendente" value={BRL(report.totals.pendente)} tone="amber" />
        </div>
        <div onClick={() => setStatusFilter("vencido")} style={{ cursor: "pointer" }}>
          <MileSign label="Vencido" value={BRL(report.totals.vencido)} tone="red" />
        </div>
        <div onClick={() => setStatusFilter("pago")} style={{ cursor: "pointer" }}>
          <MileSign label="Pago" value={BRL(report.totals.pago)} tone="green" />
        </div>
      </div>

      {statusFilter !== "all" && (
        <div style={{ marginBottom: 14 }}>
          <button
            onClick={() => setStatusFilter("all")}
            style={{ fontSize: 12, color: "#5A6472", background: "#EEF0F2", border: "none", borderRadius: 6, padding: "5px 10px", cursor: "pointer" }}
          >
            Filtro: {statusFilter} — toque pra limpar ×
          </button>
        </div>
      )}

      {visibleBoletos.length === 0 ? (
        <div style={{ background: "#fff", borderRadius: 8, padding: "40px 20px", textAlign: "center", color: "#5A6472", border: "1px dashed #D7DBE0" }}>
          Nenhum boleto encontrado nesse período/empresa. Toque em <strong>+ Lançar boleto</strong> para começar.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {visibleBoletos.map((b) => {
            const status = b.dataPagamento ? "pago" : b.dataVencimento < hoje ? "vencido" : "pendente";
            const cor = status === "pago" ? "#1F6F5C" : status === "vencido" ? "#B0402E" : "#D9A419";
            const label = status === "pago" ? "PAGO" : status === "vencido" ? "VENCIDO" : "PENDENTE";
            return (
              <div
                key={b.id}
                onClick={() => openEdit(b)}
                style={{
                  background: "#fff", borderRadius: 8, padding: "12px 16px",
                  display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap",
                  cursor: "pointer", boxShadow: "0 1px 2px rgba(27,36,48,0.06)", borderLeft: `4px solid ${cor}`,
                }}
              >
                <div style={{ minWidth: 90, fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#5A6472" }}>
                  {fmtDate(b.dataVencimento)}
                </div>
                <div style={{ flex: "1 1 200px", fontSize: 14 }}>
                  <strong>{b.empresa}</strong>{b.descricao && <span style={{ color: "#5A6472" }}> — {b.descricao}</span>}
                  <div style={{ fontSize: 12, color: "#5A6472" }}>
                    NF {b.notaFiscal || "—"} · {b.contaBancaria || "sem conta definida"}
                  </div>
                </div>
                <div style={{ fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{BRL(Number(b.valor) || 0)}</div>
                <div style={{ fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 4, color: cor, background: `${cor}1A` }}>
                  {label}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {panelOpen && editing && (
        <>
          <div onClick={() => { setPanelOpen(false); setEditing(null); }} style={{ position: "fixed", inset: 0, background: "rgba(27,36,48,0.45)", zIndex: 20 }} />
          <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "min(480px, 100vw)", background: "#fff", zIndex: 21, overflowY: "auto", boxShadow: "-8px 0 24px rgba(0,0,0,0.15)", padding: "24px 24px 100px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 22 }}>
                {boletos.some((b) => b.id === editing.id) ? "Editar boleto" : "Novo boleto"}
              </div>
              <button onClick={() => { setPanelOpen(false); setEditing(null); }} style={{ background: "none", border: "none", fontSize: 26, cursor: "pointer", color: "#5A6472", padding: "10px", margin: "-10px", lineHeight: 1 }}>×</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px,1fr))", gap: 12, marginBottom: 20 }}>
              <Field label="Empresa">
                <select style={inputStyle} value={editing.empresa} onChange={(e) => setEditing({ ...editing, empresa: e.target.value })}>
                  <option value={editing.empresa}>{editing.empresa || "Selecione"}</option>
                  {empresasList.filter((nome) => nome !== editing.empresa).map((nome) => <option key={nome} value={nome}>{nome}</option>)}
                </select>
              </Field>
              <Field label="Nota Fiscal">
                <input style={inputStyle} value={editing.notaFiscal} onChange={(e) => setEditing({ ...editing, notaFiscal: e.target.value })} />
              </Field>
              <Field label="Descrição">
                <input style={inputStyle} value={editing.descricao} onChange={(e) => setEditing({ ...editing, descricao: e.target.value })} placeholder="ex: Odontoprev, Seguro de vida" />
              </Field>
              <Field label="Valor (R$)">
                <input type="number" style={inputStyle} value={editing.valor} onChange={(e) => setEditing({ ...editing, valor: e.target.value })} />
              </Field>
              <Field label="Data de vencimento">
                <input type="date" style={inputStyle} value={editing.dataVencimento} onChange={(e) => setEditing({ ...editing, dataVencimento: e.target.value })} />
              </Field>
              <Field label="Data de pagamento (baixa)">
                <input type="date" style={inputStyle} value={editing.dataPagamento} onChange={(e) => setEditing({ ...editing, dataPagamento: e.target.value })} />
              </Field>
              <Field label="Observação">
                <input style={inputStyle} value={editing.observacao} onChange={(e) => setEditing({ ...editing, observacao: e.target.value })} />
              </Field>
            </div>

            <Field label="Conta bancária usada">
              <select
                style={{ ...inputStyle, marginBottom: 24 }}
                value={editing.contaBancaria}
                onChange={(e) => {
                  if (e.target.value === "__nova__") {
                    const nome = window.prompt("Nome da nova conta bancária:");
                    if (nome && nome.trim()) {
                      onAddConta(nome.trim());
                      setEditing({ ...editing, contaBancaria: nome.trim() });
                    }
                  } else {
                    setEditing({ ...editing, contaBancaria: e.target.value });
                  }
                }}
              >
                <option value="">Selecione</option>
                {contasList.map((c) => <option key={c} value={c}>{c}</option>)}
                <option value="__nova__">+ nova conta...</option>
              </select>
            </Field>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={save} style={{ flex: 1, background: "#D9A419", color: "#1B2430", border: "none", borderRadius: 6, padding: "12px", fontWeight: 700, cursor: "pointer" }}>
                Salvar boleto
              </button>
              {boletos.some((b) => b.id === editing.id) && (
                <button onClick={remove} style={{ background: "#FBEBE8", color: "#B0402E", border: "1px solid #B0402E33", borderRadius: 6, padding: "12px 16px", fontWeight: 700, cursor: "pointer" }}>
                  Excluir
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {novoOpen && (
        <>
          <div onClick={() => setNovoOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(27,36,48,0.45)", zIndex: 20 }} />
          <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "min(560px, 100vw)", background: "#fff", zIndex: 21, overflowY: "auto", boxShadow: "-8px 0 24px rgba(0,0,0,0.15)", padding: "24px 24px 100px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 22 }}>Novo lançamento</div>
              <button onClick={() => setNovoOpen(false)} style={{ background: "none", border: "none", fontSize: 26, cursor: "pointer", color: "#5A6472", padding: "10px", margin: "-10px", lineHeight: 1 }}>×</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px,1fr))", gap: 12, marginBottom: 12 }}>
              <Field label="Empresa">
                {novoEmpresaCustom ? (
                  <input
                    style={inputStyle}
                    value={novoEmpresa}
                    onChange={(e) => setNovoEmpresa(e.target.value)}
                    placeholder="nome da nova empresa"
                    autoFocus
                  />
                ) : (
                  <select
                    style={inputStyle}
                    value={empresasList.includes(novoEmpresa) ? novoEmpresa : ""}
                    onChange={(e) => {
                      if (e.target.value === "__nova__") {
                        setNovoEmpresaCustom(true);
                        setNovoEmpresa("");
                      } else {
                        setNovoEmpresa(e.target.value);
                      }
                    }}
                  >
                    <option value="">Selecione</option>
                    {empresasList.map((nome) => <option key={nome} value={nome}>{nome}</option>)}
                    <option value="__nova__">+ nova empresa...</option>
                  </select>
                )}
              </Field>
              <Field label="Nota Fiscal">
                <input style={inputStyle} value={novoNotaFiscal} onChange={(e) => setNovoNotaFiscal(e.target.value)} placeholder="pode ficar em branco" />
              </Field>
            </div>
            {novoEmpresaCustom && (
              <button
                onClick={() => { setNovoEmpresaCustom(false); setNovoEmpresa(""); }}
                style={{ fontSize: 12, color: "#5A6472", background: "none", border: "none", cursor: "pointer", marginBottom: 12, padding: 0, textDecoration: "underline" }}
              >
                usar empresa já cadastrada
              </button>
            )}

            <div style={{ fontSize: 12, color: "#5A6472", marginBottom: 12 }}>
              Uma nota fiscal pode gerar mais de um boleto — adicione quantos precisar abaixo.
            </div>

            <RepeatingSection
              title="Boletos dessa nota"
              items={novoParcelas}
              onAdd={() => setNovoParcelas([...novoParcelas, emptyParcela()])}
              onRemove={(id) => setNovoParcelas(novoParcelas.filter((p) => p.id !== id))}
              onUpdate={(id, updated) => setNovoParcelas(novoParcelas.map((p) => (p.id === id ? updated : p)))}
              addLabel="+ adicionar boleto"
              renderItem={(item, update) => (
                <>
                  <Field label="Descrição">
                    <input style={inputStyle} value={item.descricao} onChange={(e) => update({ ...item, descricao: e.target.value })} placeholder="ex: Odontoprev, Seguro de vida" />
                  </Field>
                  <Field label="Valor (R$)">
                    <input type="number" style={inputStyle} value={item.valor} onChange={(e) => update({ ...item, valor: e.target.value })} />
                  </Field>
                  <Field label="Vencimento">
                    <input type="date" style={inputStyle} value={item.dataVencimento} onChange={(e) => update({ ...item, dataVencimento: e.target.value })} />
                  </Field>
                  <Field label="Conta bancária">
                    <select
                      style={inputStyle}
                      value={item.contaBancaria}
                      onChange={(e) => {
                        if (e.target.value === "__nova__") {
                          const nome = window.prompt("Nome da nova conta bancária:");
                          if (nome && nome.trim()) {
                            onAddConta(nome.trim());
                            update({ ...item, contaBancaria: nome.trim() });
                          }
                        } else {
                          update({ ...item, contaBancaria: e.target.value });
                        }
                      }}
                    >
                      <option value="">Selecione</option>
                      {contasList.map((c) => <option key={c} value={c}>{c}</option>)}
                      <option value="__nova__">+ nova conta...</option>
                    </select>
                  </Field>
                  <Field label="Data pagamento (baixa)">
                    <input type="date" style={inputStyle} value={item.dataPagamento} onChange={(e) => update({ ...item, dataPagamento: e.target.value })} />
                  </Field>
                  <Field label="Observação">
                    <input style={inputStyle} value={item.observacao} onChange={(e) => update({ ...item, observacao: e.target.value })} />
                  </Field>
                  <Field label="Repetir">
                    <select style={inputStyle} value={item.repetirFreq} onChange={(e) => update({ ...item, repetirFreq: e.target.value })}>
                      <option value="nenhuma">Não repetir</option>
                      <option value="semanal">Semanalmente</option>
                      <option value="mensal">Mensalmente</option>
                      <option value="anual">Anualmente</option>
                    </select>
                  </Field>
                  {item.repetirFreq !== "nenhuma" && (
                    <Field label="Quantas vezes">
                      <input type="number" min="1" style={inputStyle} value={item.repetirQtd} onChange={(e) => update({ ...item, repetirQtd: e.target.value })} />
                    </Field>
                  )}
                </>
              )}
            />

            <button
              onClick={saveNovo}
              style={{ width: "100%", background: "#D9A419", color: "#1B2430", border: "none", borderRadius: 6, padding: "12px", fontWeight: 700, cursor: "pointer", marginTop: 10 }}
            >
              Salvar lançamento
            </button>
          </div>
        </>
      )}

      {reportOpen && (
        <div
          onClick={() => setReportOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(27,36,48,0.45)", zIndex: 20, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, overflowY: "auto" }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ width: "min(760px, 94vw)", maxHeight: "88vh", overflowY: "auto", background: "#fff", borderRadius: 10, zIndex: 21, boxShadow: "0 12px 40px rgba(0,0,0,0.25)", padding: 24 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 22 }}>Relatório de boletos</div>
              <button onClick={() => setReportOpen(false)} style={{ background: "none", border: "none", fontSize: 26, cursor: "pointer", color: "#5A6472", padding: "10px", margin: "-10px", lineHeight: 1 }}>×</button>
            </div>

            <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
              <button onClick={() => setQuickPeriod("hoje")} style={{ fontSize: 12, padding: "6px 12px", borderRadius: 6, border: "1px solid #D7DBE0", background: "#fff", cursor: "pointer" }}>Hoje</button>
              <button onClick={() => setQuickPeriod("semana")} style={{ fontSize: 12, padding: "6px 12px", borderRadius: 6, border: "1px solid #D7DBE0", background: "#fff", cursor: "pointer" }}>Esta semana</button>
              <button onClick={() => setQuickPeriod("mes")} style={{ fontSize: 12, padding: "6px 12px", borderRadius: 6, border: "1px solid #D7DBE0", background: "#fff", cursor: "pointer" }}>Este mês</button>
              <button onClick={() => setQuickPeriod("tudo")} style={{ fontSize: 12, padding: "6px 12px", borderRadius: 6, border: "1px solid #D7DBE0", background: "#fff", cursor: "pointer" }}>Tudo</button>
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "flex-end", marginBottom: 16, flexWrap: "wrap" }}>
              <Field label="De">
                <input type="date" style={inputStyle} value={periodStart} onChange={(e) => setPeriodStart(e.target.value)} />
              </Field>
              <Field label="Até">
                <input type="date" style={inputStyle} value={periodEnd} onChange={(e) => setPeriodEnd(e.target.value)} />
              </Field>
              <Field label="Empresa">
                <select style={inputStyle} value={empresaFilter} onChange={(e) => setEmpresaFilter(e.target.value)}>
                  <option value="all">Todas</option>
                  {empresasList.map((emp) => <option key={emp} value={emp}>{emp}</option>)}
                </select>
              </Field>
              <button onClick={exportCSV} style={{ background: "#1F6F5C", color: "#fff", border: "none", borderRadius: 6, padding: "9px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                Baixar CSV
              </button>
              <button onClick={() => window.print()} style={{ background: "#2451A6", color: "#fff", border: "none", borderRadius: 6, padding: "9px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                Baixar PDF
              </button>
            </div>

            {report.items.length === 0 ? (
              <div style={{ padding: "30px 10px", textAlign: "center", color: "#5A6472", border: "1px dashed #D7DBE0", borderRadius: 8 }}>
                Nenhum boleto nesse período.
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "#EEF0F2" }}>
                      {["Empresa", "Descrição", "NF", "Vencimento", "Conta", "Pago em", "Status", "Valor"].map((h) => (
                        <th key={h} style={{ textAlign: "right", padding: "8px 10px", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {report.items.map((b) => {
                      const status = b.dataPagamento ? "Pago" : b.dataVencimento < hoje ? "Vencido" : "Pendente";
                      return (
                        <tr key={b.id} style={{ borderBottom: "1px solid #EEF0F2" }}>
                          <td style={{ padding: "8px 10px", textAlign: "left" }}>{b.empresa}</td>
                          <td style={{ padding: "8px 10px", textAlign: "left" }}>{b.descricao}</td>
                          <td style={{ padding: "8px 10px", textAlign: "left" }}>{b.notaFiscal}</td>
                          <td style={{ padding: "8px 10px", textAlign: "right" }}>{fmtDate(b.dataVencimento)}</td>
                          <td style={{ padding: "8px 10px", textAlign: "right" }}>{b.contaBancaria}</td>
                          <td style={{ padding: "8px 10px", textAlign: "right" }}>{b.dataPagamento ? fmtDate(b.dataPagamento) : "—"}</td>
                          <td style={{ padding: "8px 10px", textAlign: "right" }}>{status}</td>
                          <td style={{ padding: "8px 10px", textAlign: "right", fontWeight: 700 }}>{BRL(Number(b.valor) || 0)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr><td colSpan={7} style={{ padding: "6px 10px", textAlign: "right", fontWeight: 700 }}>Pendente:</td><td style={{ padding: "6px 10px", textAlign: "right", fontWeight: 700 }}>{BRL(report.totals.pendente)}</td></tr>
                    <tr><td colSpan={7} style={{ padding: "6px 10px", textAlign: "right", fontWeight: 700, color: "#B0402E" }}>Vencido:</td><td style={{ padding: "6px 10px", textAlign: "right", fontWeight: 700, color: "#B0402E" }}>{BRL(report.totals.vencido)}</td></tr>
                    <tr><td colSpan={7} style={{ padding: "6px 10px", textAlign: "right", fontWeight: 700, color: "#12503F" }}>Pago:</td><td style={{ padding: "6px 10px", textAlign: "right", fontWeight: 700, color: "#12503F" }}>{BRL(report.totals.pago)}</td></tr>
                    <tr style={{ background: "#F7F8F9" }}><td colSpan={7} style={{ padding: "10px", fontWeight: 700, textAlign: "right" }}>TOTAL:</td><td style={{ padding: "10px", textAlign: "right", fontWeight: 700 }}>{BRL(report.totals.total)}</td></tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("viagens"); // viagens | boletos
  const [trucks, setTrucks] = useState([]);
  const [trips, setTrips] = useState([]);
  const [vales, setVales] = useState([]);
  const [boletos, setBoletos] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [fechamentos, setFechamentos] = useState([]);
  const [despesasVeiculo, setDespesasVeiculo] = useState([]);
  const [taxasPool, setTaxasPool] = useState([]);
  const [motoristas, setMotoristas] = useState([]);
  const [contas, setContas] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [filterTruck, setFilterTruck] = useState("all");
  const [panelOpen, setPanelOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [newPlate, setNewPlate] = useState("");
  const [addingTruck, setAddingTruck] = useState(false);
  const [saveState, setSaveState] = useState("idle"); // idle | saving | saved | error
  const [reportOpen, setReportOpen] = useState(false);
  const [reportView, setReportView] = useState("resumo"); // resumo | detalhado
  const [reportMonth, setReportMonth] = useState(() => new Date().toISOString().slice(0, 7));

  const todayISO = () => new Date().toISOString().slice(0, 10);
  const [boletosReportOpen, setBoletosReportOpen] = useState(false);
  const [boletosPeriodStart, setBoletosPeriodStart] = useState(() => todayISO().slice(0, 8) + "01");
  const [boletosPeriodEnd, setBoletosPeriodEnd] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().slice(0, 10);
  });
  const [boletosReportEmpresa, setBoletosReportEmpresa] = useState("all");

  const [abastecReportOpen, setAbastecReportOpen] = useState(false);
  const [abastecPeriodStart, setAbastecPeriodStart] = useState(() => {
    const d = new Date();
    const day = d.getDay();
    const start = new Date(d);
    start.setDate(d.getDate() - day);
    return start.toISOString().slice(0, 10);
  });
  const [abastecPeriodEnd, setAbastecPeriodEnd] = useState(() => {
    const d = new Date();
    const day = d.getDay();
    const end = new Date(d);
    end.setDate(d.getDate() + (6 - day));
    return end.toISOString().slice(0, 10);
  });
  const [abastecPostoFilter, setAbastecPostoFilter] = useState("all");
  const [abastecPlacaFilter, setAbastecPlacaFilter] = useState("all");

  // ---- autenticação com o Google ----
  const [gsiReady, setGsiReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [authError, setAuthError] = useState("");
  const [connecting, setConnecting] = useState(false);
  const tokenRef = useRef(null);
  const tokenClientRef = useRef(null);

  useEffect(() => {
    const check = setInterval(() => {
      if (window.google && window.google.accounts && window.google.accounts.oauth2) {
        tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: SHEETS_SCOPE,
          callback: async (resp) => {
            if (resp.error) {
              setAuthError("O Google não autorizou o acesso. Tente novamente.");
              setConnecting(false);
              return;
            }
            tokenRef.current = resp.access_token;
            setSignedIn(true);
            setAuthError("");
            await reloadFromSheets();
            setConnecting(false);
          },
        });
        setGsiReady(true);
        clearInterval(check);
      }
    }, 200);
    return () => clearInterval(check);
  }, []);

  const connectGoogle = () => {
    if (!tokenClientRef.current) return;
    setConnecting(true);
    setAuthError("");
    tokenClientRef.current.requestAccessToken({ prompt: "" });
  };

  const reloadFromSheets = async () => {
    try {
      const { trucks: t, trips: v, vales: vl, boletos: bo, empresas: emp, fechamentos: fe, despesasVeiculo: dv, taxasPool: tp, motoristas: mo, contas: ct } = await loadFromSheets(tokenRef.current);
      setTrucks(t);
      setTrips(v.map(normalizeTrip));
      setVales(vl);
      setBoletos(bo);
      setEmpresas(emp);
      setFechamentos(fe);
      setDespesasVeiculo(dv);
      setTaxasPool(tp);
      setMotoristas(mo);
      setContas(ct);
      setLoaded(true);
    } catch (e) {
      setAuthError("Não consegui ler a planilha. Confira se ela foi compartilhada corretamente e tente de novo.");
      setLoaded(true);
    }
  };

  const persist = async (nextTrucks, nextTrips, nextVales = vales, nextBoletos = boletos, nextEmpresas = empresas, nextFechamentos = fechamentos, nextDespesasVeiculo = despesasVeiculo, nextTaxasPool = taxasPool, nextMotoristas = motoristas, nextContas = contas) => {
    if (!tokenRef.current) return;
    setSaveState("saving");
    try {
      await saveToSheets(tokenRef.current, nextTrucks, nextTrips, nextVales, nextBoletos, nextEmpresas, nextFechamentos, nextDespesasVeiculo, nextTaxasPool, nextMotoristas, nextContas);
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 1200);
    } catch (e) {
      setSaveState("error");
    }
  };

  const addVale = (motorista, data, valor, tipo, observacao) => {
    const nextVales = [...vales, { id: uid(), motorista, data, valor, tipo, observacao }];
    setVales(nextVales);
    persist(trucks, trips, nextVales);
  };

  const addValesMultiple = (novos) => {
    const nextVales = [...vales, ...novos];
    setVales(nextVales);
    persist(trucks, trips, nextVales);
  };

  const deleteVale = (id) => {
    const nextVales = vales.filter((v) => v.id !== id);
    setVales(nextVales);
    persist(trucks, trips, nextVales);
  };

  const saveBoleto = (boleto) => {
    const exists = boletos.some((b) => b.id === boleto.id);
    const nextBoletos = exists ? boletos.map((b) => (b.id === boleto.id ? boleto : b)) : [...boletos, boleto];
    setBoletos(nextBoletos);
    persist(trucks, trips, vales, nextBoletos);
  };

  const saveBoletosMultiple = (novosBoletos) => {
    const nextBoletos = [...boletos, ...novosBoletos];
    setBoletos(nextBoletos);
    persist(trucks, trips, vales, nextBoletos);
  };

  const deleteBoleto = (id) => {
    const nextBoletos = boletos.filter((b) => b.id !== id);
    setBoletos(nextBoletos);
    persist(trucks, trips, vales, nextBoletos);
  };

  const addEmpresa = (nome) => {
    const limpo = nome.trim();
    if (!limpo) return;
    if (empresas.some((e) => e.nome.toLowerCase() === limpo.toLowerCase())) return;
    const nextEmpresas = [...empresas, { id: uid(), nome: limpo }];
    setEmpresas(nextEmpresas);
    persist(trucks, trips, vales, boletos, nextEmpresas);
  };

  const removeEmpresa = (id) => {
    const nome = empresas.find((e) => e.id === id)?.nome || "essa empresa";
    if (!window.confirm(`Tem certeza que deseja remover a empresa "${nome}" da lista?`)) return;
    const nextEmpresas = empresas.filter((e) => e.id !== id);
    setEmpresas(nextEmpresas);
    persist(trucks, trips, vales, boletos, nextEmpresas);
  };

  const addFechamento = (motorista, data, valor) => {
    const nextFechamentos = [...fechamentos, { id: uid(), motorista, data, valor }];
    setFechamentos(nextFechamentos);
    persist(trucks, trips, vales, boletos, empresas, nextFechamentos);
  };

  const deleteFechamento = (id) => {
    const nextFechamentos = fechamentos.filter((f) => f.id !== id);
    setFechamentos(nextFechamentos);
    persist(trucks, trips, vales, boletos, empresas, nextFechamentos);
  };

  const addDespesaVeiculo = (caminhaoId, data, descricao, valor, observacao) => {
    const nextDespesas = [...despesasVeiculo, { id: uid(), caminhaoId, data, descricao, valor, observacao }];
    setDespesasVeiculo(nextDespesas);
    persist(trucks, trips, vales, boletos, empresas, fechamentos, nextDespesas);
  };

  const deleteDespesaVeiculo = (id) => {
    const nextDespesas = despesasVeiculo.filter((d) => d.id !== id);
    setDespesasVeiculo(nextDespesas);
    persist(trucks, trips, vales, boletos, empresas, fechamentos, nextDespesas);
  };

  const addTaxaPool = (mes, data, valor, descricao) => {
    const nextTaxas = [...taxasPool, { id: uid(), mes, data, valor, descricao }];
    setTaxasPool(nextTaxas);
    persist(trucks, trips, vales, boletos, empresas, fechamentos, despesasVeiculo, nextTaxas);
  };

  const deleteTaxaPool = (id) => {
    const nextTaxas = taxasPool.filter((t) => t.id !== id);
    setTaxasPool(nextTaxas);
    persist(trucks, trips, vales, boletos, empresas, fechamentos, despesasVeiculo, nextTaxas);
  };

  const distribuirTaxas = (mes) => {
    const doMes = taxasPool.filter((t) => t.mes === mes);
    if (doMes.length === 0 || trucks.length === 0) return;
    const total = doMes.reduce((s, t) => s + (Number(t.valor) || 0), 0);
    const porCaminhao = total / trucks.length;
    if (!window.confirm(`Dividir ${BRL(total)} de taxas entre os ${trucks.length} caminhões (${BRL(porCaminhao)} cada)? Isso lança a despesa em cada placa e limpa o cofrinho desse mês.`)) return;

    const nomesUsados = doMes.map((t) => t.descricao).filter(Boolean);
    const descricaoResumo = nomesUsados.length > 0 ? `Taxa de viagem — ${nomesUsados.join(", ")}` : "Taxa de viagem (rateio mensal)";
    const dataLancamento = new Date(Number(mes.slice(0, 4)), Number(mes.slice(5, 7)), 0).toISOString().slice(0, 10);

    const novasDespesas = trucks.map((tr) => ({
      id: uid(),
      caminhaoId: tr.id,
      data: dataLancamento,
      descricao: descricaoResumo,
      valor: porCaminhao.toFixed(2),
      observacao: `Rateio de ${BRL(total)} entre ${trucks.length} caminhões`,
    }));

    const nextDespesas = [...despesasVeiculo, ...novasDespesas];
    const nextTaxas = taxasPool.filter((t) => t.mes !== mes);
    setDespesasVeiculo(nextDespesas);
    setTaxasPool(nextTaxas);
    persist(trucks, trips, vales, boletos, empresas, fechamentos, nextDespesas, nextTaxas);
  };

  const addMotorista = (nome) => {
    const limpo = nome.trim();
    if (!limpo) return;
    if (motoristas.some((m) => m.nome.toLowerCase() === limpo.toLowerCase())) return;
    const nextMotoristas = [...motoristas, { id: uid(), nome: limpo }];
    setMotoristas(nextMotoristas);
    persist(trucks, trips, vales, boletos, empresas, fechamentos, despesasVeiculo, taxasPool, nextMotoristas);
  };

  const removeMotorista = (id) => {
    const nome = motoristas.find((m) => m.id === id)?.nome || "esse motorista";
    if (!window.confirm(`Tem certeza que deseja remover "${nome}" da lista de motoristas?`)) return;
    const nextMotoristas = motoristas.filter((m) => m.id !== id);
    setMotoristas(nextMotoristas);
    persist(trucks, trips, vales, boletos, empresas, fechamentos, despesasVeiculo, taxasPool, nextMotoristas);
  };

  const addConta = (nome) => {
    const limpo = nome.trim();
    if (!limpo) return;
    if (contasBancariasList.includes(limpo)) return;
    const nextContas = [...contas, { id: uid(), nome: limpo }];
    setContas(nextContas);
    persist(trucks, trips, vales, boletos, empresas, fechamentos, despesasVeiculo, taxasPool, motoristas, nextContas);
  };

  const removeConta = (id) => {
    const nome = contas.find((c) => c.id === id)?.nome || "essa conta";
    if (!window.confirm(`Tem certeza que deseja remover "${nome}" da lista de contas?`)) return;
    const nextContas = contas.filter((c) => c.id !== id);
    setContas(nextContas);
    persist(trucks, trips, vales, boletos, empresas, fechamentos, despesasVeiculo, taxasPool, motoristas, nextContas);
  };

  const addTruck = () => {
    const placa = newPlate.trim().toUpperCase();
    if (!placa) return;
    const next = [...trucks, { id: uid(), placa }];
    setTrucks(next);
    persist(next, trips);
    setNewPlate("");
    setAddingTruck(false);
  };

  const removeTruck = (id) => {
    const placa = trucks.find((t) => t.id === id)?.placa || "esse caminhão";
    const temViagens = trips.some((t) => t.caminhaoId === id);
    const mensagem = temViagens
      ? `Tem certeza que deseja remover a placa ${placa}? Ela tem viagens lançadas — elas continuam guardadas, só ficam sem placa vinculada.`
      : `Tem certeza que deseja remover a placa ${placa}?`;
    if (!window.confirm(mensagem)) return;
    const next = trucks.filter((t) => t.id !== id);
    setTrucks(next);
    persist(next, trips);
    if (filterTruck === id) setFilterTruck("all");
  };

  const [motoristaCustomMode, setMotoristaCustomMode] = useState(false);

  const openNewTrip = () => {
    if (trucks.length === 0) {
      alert("Cadastre um caminhão primeiro.");
      return;
    }
    setEditing(emptyTrip());
    setMotoristaCustomMode(false);
    setPanelOpen(true);
  };

  const openEditTrip = (trip) => {
    setEditing({ ...trip });
    setMotoristaCustomMode(false);
    setPanelOpen(true);
  };

  const saveTrip = () => {
    if (!editing.caminhaoId || !editing.data) {
      alert("Selecione o caminhão e a data da viagem.");
      return;
    }
    if (editing.motorista && editing.motorista.trim() && !motoristasList.includes(editing.motorista.trim())) {
      addMotorista(editing.motorista.trim());
    }
    const exists = trips.some((t) => t.id === editing.id);
    const next = exists
      ? trips.map((t) => (t.id === editing.id ? editing : t))
      : [...trips, editing];
    setTrips(next);

    // sincroniza reembolsos automaticos a partir dos gastos extras marcados
    const gastoIdsDestaViagem = (editing.gastosExtras || []).map((g) => g.id);
    const valesSemOsAntigosDestaViagem = vales.filter((v) => !gastoIdsDestaViagem.includes(v.origemGastoId));
    const novosReembolsos = (editing.gastosExtras || [])
      .filter((g) => g.paraComissao && Number(g.valor) > 0 && editing.motorista)
      .map((g) => ({
        id: uid(),
        motorista: editing.motorista,
        data: g.data || editing.data,
        valor: g.valor,
        tipo: "reembolso",
        observacao: g.descricao ? `${g.descricao} (gasto da viagem)` : "Gasto extra da viagem",
        origemGastoId: g.id,
      }));
    const nextVales = [...valesSemOsAntigosDestaViagem, ...novosReembolsos];
    setVales(nextVales);

    persist(trucks, next, nextVales);
    setPanelOpen(false);
    setEditing(null);
  };

  const deleteTrip = (id) => {
    if (!window.confirm("Excluir esta viagem?")) return;
    const trip = trips.find((t) => t.id === id);
    const next = trips.filter((t) => t.id !== id);
    setTrips(next);
    if (trip) {
      const gastoIds = (trip.gastosExtras || []).map((g) => g.id);
      const nextVales = vales.filter((v) => !gastoIds.includes(v.origemGastoId));
      setVales(nextVales);
      persist(trucks, next, nextVales);
    } else {
      persist(trucks, next);
    }
    setPanelOpen(false);
    setEditing(null);
  };

  const visibleTrips = useMemo(() => {
    const list = filterTruck === "all" ? trips : trips.filter((t) => t.caminhaoId === filterTruck);
    return [...list].sort((a, b) => (b.data || "").localeCompare(a.data || ""));
  }, [trips, filterTruck]);

  const stats = useMemo(() => {
    const totalReceber = visibleTrips.reduce(
      (s, t) => s + (t.dataPagamentoSaldo ? 0 : Number(t.saldoReceber) || 0) + (t.dataRecebAdiantamento ? 0 : Number(t.adiantamento) || 0),
      0
    );
    const totalRecebido = visibleTrips.reduce(
      (s, t) => s + (t.dataRecebAdiantamento ? Number(t.adiantamento) || 0 : 0) + (t.dataPagamentoSaldo ? Number(t.saldoReceber) || 0 : 0),
      0
    );
    return { count: visibleTrips.length, totalReceber, totalRecebido };
  }, [visibleTrips]);

  const pendingList = useMemo(() => {
    return visibleTrips
      .map((t) => {
        const pendAdiantamento = t.dataRecebAdiantamento ? 0 : Number(t.adiantamento) || 0;
        const pendSaldo = t.dataPagamentoSaldo ? 0 : Number(t.saldoReceber) || 0;
        return { trip: t, pendAdiantamento, pendSaldo, pendTotal: pendAdiantamento + pendSaldo };
      })
      .filter((r) => r.pendTotal > 0)
      .sort((a, b) => (a.trip.data || "").localeCompare(b.trip.data || ""));
  }, [visibleTrips]);

  const receivedList = useMemo(() => {
    const rows = [];
    visibleTrips.forEach((t) => {
      if (t.dataRecebAdiantamento && Number(t.adiantamento) > 0) {
        rows.push({ trip: t, tipo: "Adiantamento", valor: Number(t.adiantamento) || 0, data: t.dataRecebAdiantamento });
      }
      if (t.dataPagamentoSaldo && Number(t.saldoReceber) > 0) {
        rows.push({ trip: t, tipo: "Saldo", valor: Number(t.saldoReceber) || 0, data: t.dataPagamentoSaldo });
      }
    });
    return rows.sort((a, b) => (b.data || "").localeCompare(a.data || ""));
  }, [visibleTrips]);

  const commissionByDriver = useMemo(() => {
    const fechamentosPorMotorista = {};
    fechamentos.forEach((f) => {
      if (!fechamentosPorMotorista[f.motorista]) fechamentosPorMotorista[f.motorista] = [];
      fechamentosPorMotorista[f.motorista].push(f);
    });
    Object.values(fechamentosPorMotorista).forEach((arr) => arr.sort((a, b) => (a.data || "").localeCompare(b.data || "")));

    const groups = {};
    visibleTrips.forEach((t) => {
      const val = comissao(t);
      if (val <= 0) return;
      const key = t.motorista && t.motorista.trim() ? t.motorista.trim() : "Sem motorista definido";
      if (!groups[key]) groups[key] = { motorista: key, trips: [] };
      groups[key].trips.push({ trip: t, valor: val });
    });
    vales.forEach((v) => {
      if (!groups[v.motorista]) groups[v.motorista] = { motorista: v.motorista, trips: [] };
    });
    Object.keys(fechamentosPorMotorista).forEach((m) => {
      if (!groups[m]) groups[m] = { motorista: m, trips: [] };
    });

    return Object.values(groups)
      .map((g) => {
        const historico = fechamentosPorMotorista[g.motorista] || [];
        const ultimoFechamento = historico.length ? historico[historico.length - 1] : null;
        const cutoff = ultimoFechamento ? ultimoFechamento.data : "";

        const tripsAtuais = g.trips.filter((tv) => (tv.trip.data || "") > cutoff);
        const totalAtual = tripsAtuais.reduce((s, tv) => s + tv.valor, 0);

        const valesDoMotorista = vales
          .filter((v) => v.motorista === g.motorista)
          .sort((a, b) => (b.data || "").localeCompare(a.data || ""));
        const hojeISO = todayISO();
        const valesNoPeriodo = valesDoMotorista.filter((v) => (v.data || "") > cutoff);
        // só parcelas de repetição mensal ("agendado") ficam presas à data futura;
        // vales/reembolsos avulsos contam na hora, independente da data escolhida
        const valesAtuais = valesNoPeriodo.filter((v) => v.agendado !== "sim" || (v.data || "") <= hojeISO);
        const valesFuturos = valesNoPeriodo
          .filter((v) => v.agendado === "sim" && (v.data || "") > hojeISO)
          .sort((a, b) => (a.data || "").localeCompare(b.data || ""));
        const totalPago = valesAtuais.filter((v) => v.tipo !== "reembolso").reduce((s, v) => s + (Number(v.valor) || 0), 0);
        const totalReembolso = valesAtuais.filter((v) => v.tipo === "reembolso").reduce((s, v) => s + (Number(v.valor) || 0), 0);

        // monta o historico com os lançamentos de cada fechamento (janela entre o fechamento anterior e este)
        const historicoComItens = historico.map((f, idx) => {
          const inicioJanela = idx > 0 ? historico[idx - 1].data : "";
          const fimJanela = f.data;
          const tripsJanela = g.trips
            .filter((tv) => (tv.trip.data || "") > inicioJanela && (tv.trip.data || "") <= fimJanela)
            .sort((a, b) => (a.trip.data || "").localeCompare(b.trip.data || ""));
          const valesJanela = valesDoMotorista
            .filter((v) => (v.data || "") > inicioJanela && (v.data || "") <= fimJanela)
            .sort((a, b) => (a.data || "").localeCompare(b.data || ""));
          return { ...f, trips: tripsJanela, vales: valesJanela };
        }).reverse();

        return {
          motorista: g.motorista,
          trips: tripsAtuais.sort((a, b) => (a.trip.data || "").localeCompare(b.trip.data || "")),
          vales: valesAtuais,
          valesFuturos,
          total: totalAtual,
          totalPago,
          totalReembolso,
          saldo: totalAtual + totalReembolso - totalPago,
          historico: historicoComItens,
        };
      })
      .sort((a, b) => b.saldo - a.saldo);
  }, [visibleTrips, vales, fechamentos]);

  const [historicoExpandido, setHistoricoExpandido] = useState({});
  const toggleHistorico = (motorista) => setHistoricoExpandido((prev) => ({ ...prev, [motorista]: !prev[motorista] }));

  const [fechandoMotorista, setFechandoMotorista] = useState(null);
  const [fechamentoDataEditavel, setFechamentoDataEditavel] = useState("");

  const startFecharSaldo = (motorista) => {
    setFechandoMotorista(motorista);
    setFechamentoDataEditavel(todayISO());
  };

  const confirmFecharSaldo = (valor) => {
    addFechamento(fechandoMotorista, fechamentoDataEditavel, valor);
    setFechandoMotorista(null);
  };

  const [editandoFechamentoId, setEditandoFechamentoId] = useState(null);
  const [editandoFechamentoData, setEditandoFechamentoData] = useState("");

  const startEditFechamentoData = (fechamento) => {
    setEditandoFechamentoId(fechamento.id);
    setEditandoFechamentoData(fechamento.data);
  };

  const confirmEditFechamentoData = (motorista) => {
    const nextFechamentos = fechamentos.map((f) =>
      f.id === editandoFechamentoId ? { ...f, data: editandoFechamentoData } : f
    );
    setFechamentos(nextFechamentos);
    persist(trucks, trips, vales, boletos, empresas, nextFechamentos);
    setEditandoFechamentoId(null);
  };

  const totalComissao = useMemo(() => commissionByDriver.reduce((s, g) => s + g.total, 0), [commissionByDriver]);

  const [statsDetailOpen, setStatsDetailOpen] = useState(null); // null | "receber" | "recebido" | "comissao"
  const [addingValeFor, setAddingValeFor] = useState(null);
  const [commissionDriverFilter, setCommissionDriverFilter] = useState("all");
  const [valeData, setValeData] = useState("");
  const [valeValor, setValeValor] = useState("");
  const [valeTipo, setValeTipo] = useState("vale");
  const [valeObs, setValeObs] = useState("");
  const [valeRepetirMeses, setValeRepetirMeses] = useState(1);

  const startAddVale = (motorista) => {
    setAddingValeFor(motorista);
    setValeData(new Date().toISOString().slice(0, 10));
    setValeValor("");
    setValeTipo("vale");
    setValeObs("");
    setValeRepetirMeses(1);
  };

  const addMesesISO = (isoDate, n) => {
    const [y, m, d] = isoDate.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    dt.setMonth(dt.getMonth() + n);
    return dt.toISOString().slice(0, 10);
  };

  const confirmAddVale = () => {
    if (!valeValor || Number(valeValor) <= 0) return;
    const qtd = Math.max(1, Number(valeRepetirMeses) || 1);
    if (qtd === 1) {
      addVale(addingValeFor, valeData, valeValor, valeTipo, valeObs);
    } else {
      const obsBase = valeObs ? `${valeObs} ` : "";
      const novos = Array.from({ length: qtd }, (_, i) => ({
        id: uid(),
        motorista: addingValeFor,
        data: i === 0 ? valeData : addMesesISO(valeData, i),
        valor: valeValor,
        tipo: valeTipo,
        observacao: `${obsBase}(parcela ${i + 1}/${qtd})`.trim(),
        agendado: "sim",
      }));
      addValesMultiple(novos);
    }
    setAddingValeFor(null);
  };

  const truckLabel = (id) => trucks.find((t) => t.id === id)?.placa || "—";

  const monthlyReport = useMemo(() => {
    const tripsInMonth = trips.filter((t) => (t.data || "").slice(0, 7) === reportMonth);
    const despesasInMonth = despesasVeiculo.filter((d) => (d.data || "").slice(0, 7) === reportMonth);
    const trucksFiltered = filterTruck === "all" ? trucks : trucks.filter((tr) => tr.id === filterTruck);
    const rows = trucksFiltered.map((tr) => {
      const tripsTruck = tripsInMonth.filter((t) => t.caminhaoId === tr.id);
      const receita = tripsTruck.reduce((s, t) => s + valorTotal(t), 0);
      const comissaoTotal = tripsTruck.reduce((s, t) => s + comissao(t), 0);
      const abastecimentoTotal = tripsTruck.reduce(
        (s, t) => s + t.abastecimentos.reduce((s2, a) => s2 + (Number(a.valor) || 0), 0),
        0
      );
      const gastosTotal = tripsTruck.reduce(
        (s, t) => s + t.gastosExtras.reduce((s2, g) => s2 + (Number(g.valor) || 0), 0),
        0
      );
      const despesasVeiculoTotal = despesasInMonth
        .filter((d) => d.caminhaoId === tr.id)
        .reduce((s, d) => s + (Number(d.valor) || 0), 0);
      const liquido = receita - comissaoTotal - abastecimentoTotal - gastosTotal - despesasVeiculoTotal;
      return {
        id: tr.id,
        placa: tr.placa,
        viagens: tripsTruck.length,
        receita,
        comissaoTotal,
        abastecimentoTotal,
        gastosTotal,
        despesasVeiculoTotal,
        liquido,
      };
    });
    const totals = rows.reduce(
      (acc, r) => ({
        viagens: acc.viagens + r.viagens,
        receita: acc.receita + r.receita,
        comissaoTotal: acc.comissaoTotal + r.comissaoTotal,
        abastecimentoTotal: acc.abastecimentoTotal + r.abastecimentoTotal,
        gastosTotal: acc.gastosTotal + r.gastosTotal,
        despesasVeiculoTotal: acc.despesasVeiculoTotal + r.despesasVeiculoTotal,
        liquido: acc.liquido + r.liquido,
      }),
      { viagens: 0, receita: 0, comissaoTotal: 0, abastecimentoTotal: 0, gastosTotal: 0, despesasVeiculoTotal: 0, liquido: 0 }
    );
    return { rows, totals };
  }, [trips, trucks, reportMonth, filterTruck, despesasVeiculo]);

  const despesasVeiculoDoMes = useMemo(() => {
    return despesasVeiculo
      .filter((d) => (d.data || "").slice(0, 7) === reportMonth)
      .sort((a, b) => (b.data || "").localeCompare(a.data || ""));
  }, [despesasVeiculo, reportMonth]);

  const [addingDespesaFor, setAddingDespesaFor] = useState(null);
  const [despesaData, setDespesaData] = useState("");
  const [despesaDescricao, setDespesaDescricao] = useState("");
  const [despesaValor, setDespesaValor] = useState("");
  const [despesaObs, setDespesaObs] = useState("");

  const startAddDespesa = (caminhaoId) => {
    setAddingDespesaFor(caminhaoId);
    setDespesaData(new Date().toISOString().slice(0, 10));
    setDespesaDescricao("");
    setDespesaValor("");
    setDespesaObs("");
  };

  const confirmAddDespesa = () => {
    if (!despesaDescricao.trim() || !despesaValor || Number(despesaValor) <= 0) return;
    addDespesaVeiculo(addingDespesaFor, despesaData, despesaDescricao.trim(), despesaValor, despesaObs);
    setAddingDespesaFor(null);
  };

  const [addingTaxa, setAddingTaxa] = useState(false);
  const [taxaData, setTaxaData] = useState("");
  const [taxaValor, setTaxaValor] = useState("");
  const [taxaDescricao, setTaxaDescricao] = useState("");

  const startAddTaxa = () => {
    setAddingTaxa(true);
    setTaxaData(new Date().toISOString().slice(0, 10));
    setTaxaValor("");
    setTaxaDescricao("");
  };

  const confirmAddTaxa = () => {
    if (!taxaValor || Number(taxaValor) <= 0) return;
    addTaxaPool(reportMonth, taxaData, taxaValor, taxaDescricao.trim());
    setAddingTaxa(false);
  };

  const taxasDoMesReport = useMemo(() => {
    return taxasPool.filter((t) => t.mes === reportMonth).sort((a, b) => (b.data || "").localeCompare(a.data || ""));
  }, [taxasPool, reportMonth]);

  const taxasDoMesTotal = useMemo(() => taxasDoMesReport.reduce((s, t) => s + (Number(t.valor) || 0), 0), [taxasDoMesReport]);

  const detailedReport = useMemo(() => {
    const tripsInMonth = trips.filter((t) => (t.data || "").slice(0, 7) === reportMonth);
    const despesasInMonth = despesasVeiculo.filter((d) => (d.data || "").slice(0, 7) === reportMonth);
    const trucksFiltered = filterTruck === "all" ? trucks : trucks.filter((tr) => tr.id === filterTruck);
    const groups = trucksFiltered
      .map((tr) => {
        const tripsTruck = tripsInMonth
          .filter((t) => t.caminhaoId === tr.id)
          .sort((a, b) => (a.data || "").localeCompare(b.data || ""));
        const tripRows = tripsTruck.map((t, idx) => {
          const expenses = [];
          const com = comissao(t);
          if (com > 0) {
            expenses.push({ data: t.data, tipo: "Comissão", descricao: t.motorista || "Comissão motorista", planoDeConta: "Comissão", valor: com });
          }
          (t.abastecimentos || []).forEach((a) => {
            if (Number(a.valor) > 0) {
              expenses.push({ data: a.data || t.data, tipo: "Abastecimento", descricao: a.posto || "Abastecimento", planoDeConta: "Combustível", valor: Number(a.valor) || 0 });
            }
          });
          (t.gastosExtras || []).forEach((g) => {
            if (Number(g.valor) > 0) {
              expenses.push({ data: g.data || t.data, tipo: "Gasto extra", descricao: g.descricao || "Gasto extra", planoDeConta: "Despesas (Saídas)", valor: Number(g.valor) || 0 });
            }
          });
          expenses.sort((a, b) => (a.data || "").localeCompare(b.data || ""));
          const totalDespesas = expenses.reduce((s, e) => s + e.valor, 0);
          return {
            id: t.id,
            codigo: t.contrato || `V${idx + 1}`,
            empresa: t.empresa || "—",
            origem: t.origem || "—",
            destino: t.destino || "—",
            valorViagem: valorTotal(t),
            expenses,
            totalDespesas,
          };
        });
        const despesasVeiculoTruck = despesasInMonth
          .filter((d) => d.caminhaoId === tr.id)
          .sort((a, b) => (a.data || "").localeCompare(b.data || ""));
        const despesasVeiculoTotal = despesasVeiculoTruck.reduce((s, d) => s + (Number(d.valor) || 0), 0);
        const totalVeiculo = tripRows.reduce((s, t) => s + t.valorViagem, 0) - despesasVeiculoTotal;
        return { id: tr.id, placa: tr.placa, tripRows, despesasVeiculoTruck, despesasVeiculoTotal, totalVeiculo };
      })
      .filter((g) => g.tripRows.length > 0 || g.despesasVeiculoTruck.length > 0);
    return groups;
  }, [trips, trucks, reportMonth, filterTruck, despesasVeiculo]);

  const motoristasList = useMemo(() => {
    const set = new Set([
      ...motoristas.map((m) => m.nome),
      ...trips.map((t) => t.motorista).filter(Boolean),
      ...vales.map((v) => v.motorista).filter(Boolean),
    ]);
    return Array.from(set).sort();
  }, [motoristas, trips, vales]);

  const contasBancariasList = useMemo(() => {
    const set = new Set([
      ...CONTAS_COMUNS,
      ...contas.map((c) => c.nome),
      ...boletos.map((b) => b.contaBancaria).filter(Boolean),
    ]);
    return Array.from(set).sort();
  }, [contas, boletos]);

  const boletosEmpresas = useMemo(() => {
    const set = new Set([
      ...empresas.map((e) => e.nome),
      ...boletos.map((b) => b.empresa).filter(Boolean),
    ]);
    return Array.from(set).sort();
  }, [boletos, empresas]);

  const abastecimentosFlat = useMemo(() => {
    const flat = [];
    trips.forEach((t) => {
      (t.abastecimentos || []).forEach((a) => {
        if (Number(a.valor) > 0 || a.litragem) {
          flat.push({
            id: a.id,
            tripId: t.id,
            caminhaoId: t.caminhaoId,
            data: a.data || t.data,
            litragem: a.litragem,
            km: a.km,
            valor: Number(a.valor) || 0,
            posto: a.posto && a.posto.trim() ? a.posto.trim() : "Sem posto definido",
            numeroCupom: a.numeroCupom || "",
            tipo: a.tipo === "arla" ? "arla" : "diesel",
            origem: a.tipo === "arla" ? "Arla" : "Diesel",
          });
        }
      });
      // gastos extras com posto preenchido (ex: lubrificação no mesmo cupom do abastecimento)
      (t.gastosExtras || []).forEach((g) => {
        if (g.posto && g.posto.trim() && Number(g.valor) > 0) {
          flat.push({
            id: g.id,
            tripId: t.id,
            caminhaoId: t.caminhaoId,
            data: g.data || t.data,
            litragem: "",
            km: "",
            valor: Number(g.valor) || 0,
            posto: g.posto.trim(),
            numeroCupom: g.numeroCupom || "",
            tipo: "outro",
            origem: g.descricao || "Gasto extra",
          });
        }
      });
    });
    return flat;
  }, [trips]);

  const abastecPostosList = useMemo(() => {
    const set = new Set(abastecimentosFlat.map((a) => a.posto));
    return Array.from(set).sort();
  }, [abastecimentosFlat]);

  const abastecReport = useMemo(() => {
    const filtered = abastecimentosFlat
      .filter((a) => a.data >= abastecPeriodStart && a.data <= abastecPeriodEnd)
      .filter((a) => abastecPostoFilter === "all" || a.posto === abastecPostoFilter)
      .filter((a) => abastecPlacaFilter === "all" || a.caminhaoId === abastecPlacaFilter)
      .sort((a, b) => (a.posto || "").localeCompare(b.posto || "") || (a.data || "").localeCompare(b.data || ""));

    const porPostoMap = {};
    filtered.forEach((a) => {
      if (!porPostoMap[a.posto]) porPostoMap[a.posto] = { posto: a.posto, items: [], valor: 0, litragemDiesel: 0, litragemArla: 0 };
      porPostoMap[a.posto].items.push(a);
      porPostoMap[a.posto].valor += a.valor;
      if (a.tipo === "arla") porPostoMap[a.posto].litragemArla += Number(a.litragem) || 0;
      else if (a.tipo === "diesel") porPostoMap[a.posto].litragemDiesel += Number(a.litragem) || 0;
    });
    const porPosto = Object.values(porPostoMap).sort((a, b) => b.valor - a.valor);

    const totals = filtered.reduce(
      (acc, a) => ({
        valor: acc.valor + a.valor,
        litragemDiesel: acc.litragemDiesel + (a.tipo === "diesel" ? Number(a.litragem) || 0 : 0),
        litragemArla: acc.litragemArla + (a.tipo === "arla" ? Number(a.litragem) || 0 : 0),
      }),
      { valor: 0, litragemDiesel: 0, litragemArla: 0 }
    );
    return { items: filtered, porPosto, totals };
  }, [abastecimentosFlat, abastecPeriodStart, abastecPeriodEnd, abastecPostoFilter, abastecPlacaFilter]);

  const exportAbastecCSV = () => {
    const header = ["Posto", "Data", "Caminhão", "Origem", "Litragem", "Cupom", "Valor"];
    const lines = [header.join(";")];
    abastecReport.items.forEach((a) => {
      lines.push([a.posto, fmtDate(a.data), truckLabel(a.caminhaoId), a.origem, a.litragem || "", a.numeroCupom || "", a.valor.toFixed(2)].join(";"));
    });
    lines.push(["TOTAL", "", "", "", `${abastecReport.totals.litragemDiesel} (diesel)`, `${abastecReport.totals.litragemArla} (arla)`, abastecReport.totals.valor.toFixed(2)].join(";"));
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a2 = document.createElement("a");
    a2.href = url;
    a2.download = `abastecimentos-${abastecPeriodStart}-a-${abastecPeriodEnd}.csv`;
    a2.click();
    URL.revokeObjectURL(url);
  };

  const setAbastecQuickPeriod = (kind) => {
    const d = new Date();
    if (kind === "hoje") {
      const iso = d.toISOString().slice(0, 10);
      setAbastecPeriodStart(iso);
      setAbastecPeriodEnd(iso);
    } else if (kind === "semana") {
      const day = d.getDay();
      const start = new Date(d); start.setDate(d.getDate() - day);
      const end = new Date(d); end.setDate(d.getDate() + (6 - day));
      setAbastecPeriodStart(start.toISOString().slice(0, 10));
      setAbastecPeriodEnd(end.toISOString().slice(0, 10));
    } else if (kind === "mes") {
      setAbastecPeriodStart(new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10));
      setAbastecPeriodEnd(new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().slice(0, 10));
    } else if (kind === "tudo") {
      setAbastecPeriodStart("2000-01-01");
      setAbastecPeriodEnd("2099-12-31");
    }
  };

  const boletosReport = useMemo(() => {
    const filtered = boletos
      .filter((b) => b.dataVencimento >= boletosPeriodStart && b.dataVencimento <= boletosPeriodEnd)
      .filter((b) => boletosReportEmpresa === "all" || b.empresa === boletosReportEmpresa)
      .sort((a, b) => (a.dataVencimento || "").localeCompare(b.dataVencimento || ""));
    const hoje = todayISO();
    const totals = filtered.reduce(
      (acc, b) => {
        const valor = Number(b.valor) || 0;
        if (b.dataPagamento) acc.pago += valor;
        else if (b.dataVencimento < hoje) acc.vencido += valor;
        else acc.pendente += valor;
        acc.total += valor;
        return acc;
      },
      { pendente: 0, vencido: 0, pago: 0, total: 0 }
    );
    return { items: filtered, totals };
  }, [boletos, boletosPeriodStart, boletosPeriodEnd, boletosReportEmpresa]);

  const exportBoletosCSV = () => {
    const header = ["Empresa", "Descricao", "Nota Fiscal", "Valor", "Vencimento", "Conta Bancaria", "Data Pagamento", "Status", "Observacao"];
    const hoje = todayISO();
    const lines = [header.join(";")];
    boletosReport.items.forEach((b) => {
      const status = b.dataPagamento ? "Pago" : b.dataVencimento < hoje ? "Vencido" : "Pendente";
      lines.push(
        [b.empresa, b.descricao || "", b.notaFiscal, (Number(b.valor) || 0).toFixed(2), fmtDate(b.dataVencimento), b.contaBancaria, b.dataPagamento ? fmtDate(b.dataPagamento) : "", status, b.observacao || ""]
          .join(";")
      );
    });
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `boletos-${boletosPeriodStart}-a-${boletosPeriodEnd}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportReportCSV = () => {
    const header = ["Placa", "Viagens", "Receita", "Comissao", "Abastecimento", "Gastos Extras", "Despesas Veiculo", "Liquido"];
    const lines = [header.join(";")];
    monthlyReport.rows.forEach((r) => {
      lines.push(
        [r.placa, r.viagens, r.receita.toFixed(2), r.comissaoTotal.toFixed(2), r.abastecimentoTotal.toFixed(2), r.gastosTotal.toFixed(2), r.despesasVeiculoTotal.toFixed(2), r.liquido.toFixed(2)]
          .join(";")
      );
    });
    lines.push(
      ["TOTAL", monthlyReport.totals.viagens, monthlyReport.totals.receita.toFixed(2), monthlyReport.totals.comissaoTotal.toFixed(2), monthlyReport.totals.abastecimentoTotal.toFixed(2), monthlyReport.totals.gastosTotal.toFixed(2), monthlyReport.totals.despesasVeiculoTotal.toFixed(2), monthlyReport.totals.liquido.toFixed(2)]
        .join(";")
    );
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `relatorio-liquido-${reportMonth}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportBackup = () => {
    const data = JSON.stringify({ trucks, trips, vales, boletos, empresas, fechamentos, despesasVeiculo, taxasPool, motoristas, contas }, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `backup-controle-viagens-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importBackup = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        if (!window.confirm("Importar este backup vai SUBSTITUIR todos os dados atuais. Continuar?")) return;
        const nextTrucks = parsed.trucks || [];
        const nextTrips = (parsed.trips || []).map(normalizeTrip);
        const nextVales = parsed.vales || [];
        const nextBoletos = parsed.boletos || [];
        const nextEmpresas = parsed.empresas || [];
        const nextFechamentos = parsed.fechamentos || [];
        const nextDespesasVeiculo = parsed.despesasVeiculo || [];
        const nextTaxasPool = parsed.taxasPool || [];
        const nextMotoristas = parsed.motoristas || [];
        const nextContas = parsed.contas || [];
        setTrucks(nextTrucks);
        setTrips(nextTrips);
        setVales(nextVales);
        setBoletos(nextBoletos);
        setEmpresas(nextEmpresas);
        setFechamentos(nextFechamentos);
        setDespesasVeiculo(nextDespesasVeiculo);
        setTaxasPool(nextTaxasPool);
        setMotoristas(nextMotoristas);
        setContas(nextContas);
        persist(nextTrucks, nextTrips, nextVales, nextBoletos, nextEmpresas, nextFechamentos, nextDespesasVeiculo, nextTaxasPool, nextMotoristas, nextContas);
      } catch (err) {
        alert("Não consegui ler esse arquivo. Confira se é um backup válido exportado por este app.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  if (!signedIn) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#EEF0F2",
          fontFamily: "'Inter', sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
        }}
      >
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=Inter:wght@400;500;600&display=swap');`}</style>
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: "36px 30px",
            maxWidth: 380,
            width: "100%",
            textAlign: "center",
            boxShadow: "0 4px 20px rgba(27,36,48,0.1)",
          }}
        >
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 26, color: "#1B2430", marginBottom: 6 }}>
            CONTROLE DE VIAGENS
          </div>
          <div style={{ color: "#5A6472", fontSize: 14, marginBottom: 24 }}>
            Conecte sua conta Google pra acessar a planilha compartilhada.
          </div>
          <button
            onClick={connectGoogle}
            disabled={!gsiReady || connecting}
            style={{
              background: gsiReady ? "#D9A419" : "#D7DBE0",
              color: "#1B2430",
              border: "none",
              borderRadius: 6,
              padding: "12px 20px",
              fontWeight: 700,
              fontSize: 15,
              cursor: gsiReady ? "pointer" : "default",
              width: "100%",
            }}
          >
            {connecting ? "Conectando..." : gsiReady ? "Conectar com Google" : "Carregando..."}
          </button>
          {authError && (
            <div style={{ marginTop: 16, color: "#B0402E", fontSize: 13, background: "#FBEBE8", borderRadius: 6, padding: "10px 12px" }}>
              {authError}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!loaded) {
    return (
      <div style={{ padding: 40, fontFamily: "'Inter', sans-serif", color: "#5A6472" }}>
        Carregando dados da planilha...
      </div>
    );
  }

  return (
    <>
    <div
      className="no-print"
      style={{
        minHeight: "100vh",
        background: "#EEF0F2",
        fontFamily: "'Inter', sans-serif",
        color: "#1B2430",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;700&display=swap');
        * { box-sizing: border-box; }
        button { font-family: inherit; }
        @media print {
          .no-print { display: none !important; }
          .print-only { display: block !important; }
        }
        input:focus, select:focus, textarea:focus { border-color: #D9A419 !important; box-shadow: 0 0 0 3px rgba(217,164,25,0.15); }
      `}</style>

      {/* header */}
      <div style={{ background: "#1B2430", padding: "22px 28px", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 700,
                fontSize: 30,
                color: "#fff",
                letterSpacing: 0.5,
                lineHeight: 1,
              }}
            >
              CONTROLE DE VIAGENS
              <span style={{ fontSize: 11, color: "#6B7684", fontFamily: "'JetBrains Mono', monospace", marginLeft: 10, verticalAlign: "middle" }}>
                v{APP_VERSION}
              </span>
            </div>
            <div style={{ color: "#9AA5B1", fontSize: 13, marginTop: 4 }}>
              {trucks.length} {trucks.length === 1 ? "caminhão" : "caminhões"} na frota
              {saveState === "saving" && "  ·  salvando..."}
              {saveState === "saved" && "  ·  salvo"}
              {saveState === "error" && "  ·  erro ao salvar, tente de novo"}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              onClick={reloadFromSheets}
              title="Buscar as atualizações mais recentes da planilha"
              style={{
                background: "transparent",
                color: "#C9D0D8",
                border: "1px solid #3A4351",
                borderRadius: 6,
                padding: "9px 14px",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Atualizar
            </button>
            <button
              onClick={() => setReportOpen(true)}
              title="Ver relatório de líquido por caminhão"
              style={{
                background: "transparent",
                color: "#C9D0D8",
                border: "1px solid #3A4351",
                borderRadius: 6,
                padding: "9px 14px",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Relatório mensal
            </button>
            <button
              onClick={exportBackup}
              title="Baixar uma cópia de segurança dos dados"
              style={{
                background: "transparent",
                color: "#C9D0D8",
                border: "1px solid #3A4351",
                borderRadius: 6,
                padding: "9px 14px",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Baixar backup
            </button>
            <label
              title="Restaurar dados de um arquivo de backup"
              style={{
                background: "transparent",
                color: "#C9D0D8",
                border: "1px solid #3A4351",
                borderRadius: 6,
                padding: "9px 14px",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Importar backup
              <input type="file" accept="application/json" onChange={importBackup} style={{ display: "none" }} />
            </label>
            <button
              onClick={openNewTrip}
              style={{
                background: "#D9A419",
                color: "#1B2430",
                border: "none",
                borderRadius: 6,
                padding: "10px 18px",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
                letterSpacing: 0.3,
              }}
            >
              + Lançar viagem
            </button>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 16 }}>
          <button
            onClick={() => setView("viagens")}
            style={{
              padding: "8px 16px",
              borderRadius: "6px 6px 0 0",
              border: "none",
              borderBottom: view === "viagens" ? "3px solid #D9A419" : "3px solid transparent",
              background: view === "viagens" ? "rgba(255,255,255,0.08)" : "transparent",
              color: view === "viagens" ? "#fff" : "#9AA5B1",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            🚚 Viagens
          </button>
          <button
            onClick={() => setView("boletos")}
            style={{
              padding: "8px 16px",
              borderRadius: "6px 6px 0 0",
              border: "none",
              borderBottom: view === "boletos" ? "3px solid #D9A419" : "3px solid transparent",
              background: view === "boletos" ? "rgba(255,255,255,0.08)" : "transparent",
              color: view === "boletos" ? "#fff" : "#9AA5B1",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            🧾 Boletos
          </button>
          <button
            onClick={() => setView("abastecimentos")}
            style={{
              padding: "8px 16px",
              borderRadius: "6px 6px 0 0",
              border: "none",
              borderBottom: view === "abastecimentos" ? "3px solid #D9A419" : "3px solid transparent",
              background: view === "abastecimentos" ? "rgba(255,255,255,0.08)" : "transparent",
              color: view === "abastecimentos" ? "#fff" : "#9AA5B1",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            ⛽ Abastecimentos
          </button>
        </div>
      </div>

      {view === "viagens" && (
      <div style={{ padding: "24px 28px", maxWidth: 1100, margin: "0 auto" }}>
        {/* truck selector */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", marginBottom: 20 }}>
          <button
            onClick={() => setFilterTruck("all")}
            style={{
              padding: "8px 14px",
              borderRadius: 6,
              border: filterTruck === "all" ? "2px solid #D9A419" : "2px solid #D7DBE0",
              background: "#fff",
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Todos
          </button>
          {trucks.map((tr) => (
            <div key={tr.id} style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
              <PlateChip placa={tr.placa} active={filterTruck === tr.id} onClick={() => setFilterTruck(tr.id)} size="sm" />
              <button
                onClick={() => removeTruck(tr.id)}
                title="Remover caminhão"
                style={{
                  marginLeft: -6,
                  background: "#B0402E",
                  color: "#fff",
                  border: "2px solid #EEF0F2",
                  borderRadius: "50%",
                  width: 18,
                  height: 18,
                  fontSize: 11,
                  lineHeight: "14px",
                  cursor: "pointer",
                  zIndex: 1,
                }}
              >
                ×
              </button>
            </div>
          ))}
          {addingTruck ? (
            <div style={{ display: "inline-flex", gap: 6 }}>
              <input
                autoFocus
                value={newPlate}
                onChange={(e) => setNewPlate(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTruck()}
                placeholder="PLACA"
                style={{ ...inputStyle, width: 120, fontFamily: "'JetBrains Mono', monospace" }}
              />
              <button onClick={addTruck} style={{ background: "#1F6F5C", color: "#fff", border: "none", borderRadius: 6, padding: "0 12px", fontWeight: 700, cursor: "pointer" }}>
                OK
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAddingTruck(true)}
              style={{
                border: "2px dashed #B7BFC8",
                background: "transparent",
                borderRadius: 6,
                padding: "7px 14px",
                fontSize: 13,
                color: "#5A6472",
                cursor: "pointer",
              }}
            >
              + caminhão
            </button>
          )}
        </div>

        {/* stats */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
          <MileSign label="Viagens" value={stats.count} tone="amber" />
          <MileSign label="A receber" value={BRL(stats.totalReceber)} tone="red" onClick={() => setStatsDetailOpen("receber")} />
          <MileSign label="Recebido" value={BRL(stats.totalRecebido)} tone="green" onClick={() => setStatsDetailOpen("recebido")} />
          <MileSign label="Comissão" value={BRL(totalComissao)} tone="amber" onClick={() => setStatsDetailOpen("comissao")} />
        </div>

        {/* trips list */}
        {visibleTrips.length === 0 ? (
          <div
            style={{
              background: "#fff",
              borderRadius: 8,
              padding: "40px 20px",
              textAlign: "center",
              color: "#5A6472",
              border: "1px dashed #D7DBE0",
            }}
          >
            Nenhuma viagem lançada ainda. Toque em <strong>+ Lançar viagem</strong> para começar.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {visibleTrips.map((t) => {
              const pago = t.dataPagamentoSaldo && (t.dataRecebAdiantamento || !t.adiantamento);
              return (
                <div
                  key={t.id}
                  onClick={() => openEditTrip(t)}
                  style={{
                    background: "#fff",
                    borderRadius: 8,
                    padding: "14px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    flexWrap: "wrap",
                    cursor: "pointer",
                    boxShadow: "0 1px 2px rgba(27,36,48,0.06)",
                    borderLeft: `4px solid ${pago ? "#1F6F5C" : "#D9A419"}`,
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                    <PlateChip placa={truckLabel(t.caminhaoId)} size="sm" active={false} onClick={() => {}} />
                    {t.contrato && (
                      <div style={{ fontSize: 10, color: "#5A6472", fontFamily: "'JetBrains Mono', monospace" }}>
                        Ctr {t.contrato}
                      </div>
                    )}
                  </div>
                  <div style={{ minWidth: 90, fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#5A6472" }}>
                    <div>{fmtDate(t.data)}</div>
                    {t.dataFim && (
                      <div style={{ fontSize: 11, color: "#8A9099" }}>
                        até {fmtDate(t.dataFim)}
                      </div>
                    )}
                  </div>
                  <div style={{ flex: "1 1 200px", fontSize: 14 }}>
                    <strong>{t.origem || "?"}</strong> → <strong>{t.destino || "?"}</strong>
                    <div style={{ fontSize: 12, color: "#5A6472" }}>
                      {t.empresa} {t.motorista && `· ${t.motorista}`}
                    </div>
                  </div>
                  <div style={{ textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>
                    <div style={{ fontWeight: 700 }}>{BRL(valorTotal(t))}</div>
                    <div style={{ fontSize: 11, color: "#5A6472" }}>comissão {BRL(comissao(t))}</div>
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "3px 8px",
                      borderRadius: 4,
                      color: pago ? "#12503F" : "#8A5A00",
                      background: pago ? "#E9F5F1" : "#FFF6E2",
                    }}
                  >
                    {pago ? "PAGO" : "PENDENTE"}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      )}

      {view === "boletos" && (
        <BoletosView
          boletos={boletos}
          onSave={saveBoleto}
          onSaveMultiple={saveBoletosMultiple}
          onDelete={deleteBoleto}
          reportOpen={boletosReportOpen}
          setReportOpen={setBoletosReportOpen}
          periodStart={boletosPeriodStart}
          setPeriodStart={setBoletosPeriodStart}
          periodEnd={boletosPeriodEnd}
          setPeriodEnd={setBoletosPeriodEnd}
          empresaFilter={boletosReportEmpresa}
          setEmpresaFilter={setBoletosReportEmpresa}
          empresasList={boletosEmpresas}
          report={boletosReport}
          exportCSV={exportBoletosCSV}
          empresas={empresas}
          onAddEmpresa={addEmpresa}
          onRemoveEmpresa={removeEmpresa}
          contasList={contasBancariasList}
          onAddConta={addConta}
        />
      )}

      {/* detalhe de a receber / recebido */}
      {statsDetailOpen && (
        <div
          onClick={() => setStatsDetailOpen(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(27,36,48,0.45)", zIndex: 20, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, overflowY: "auto" }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(600px, 94vw)",
              maxHeight: "88vh",
              overflowY: "auto",
              background: "#fff",
              borderRadius: 10,
              zIndex: 21,
              boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
              padding: 24,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 22 }}>
                {statsDetailOpen === "receber" ? "Viagens a receber" : statsDetailOpen === "recebido" ? "Viagens recebidas" : "Comissão por motorista"}
              </div>
              <button
                onClick={() => setStatsDetailOpen(null)}
                style={{ background: "none", border: "none", fontSize: 26, cursor: "pointer", color: "#5A6472", padding: "10px", margin: "-10px", lineHeight: 1 }}
              >
                ×
              </button>
            </div>

            {statsDetailOpen === "receber" ? (
              pendingList.length === 0 ? (
                <div style={{ padding: "20px 0", textAlign: "center", color: "#5A6472" }}>
                  Nenhuma viagem com valor pendente. 🎉
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {pendingList.map((r) => (
                    <div
                      key={r.trip.id}
                      onClick={() => { setStatsDetailOpen(null); openEditTrip(r.trip); }}
                      style={{ background: "#FBEBE8", borderRadius: 8, padding: "10px 14px", cursor: "pointer" }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                        <strong>{truckLabel(r.trip.caminhaoId)} · {fmtDate(r.trip.data)}{r.trip.contrato && ` · Ctr ${r.trip.contrato}`}</strong>
                        <span style={{ fontWeight: 700, color: "#B0402E" }}>{BRL(r.pendTotal)}</span>
                      </div>
                      <div style={{ fontSize: 12, color: "#5A6472" }}>
                        {r.trip.origem} → {r.trip.destino} {r.trip.empresa && `· ${r.trip.empresa}`}
                      </div>
                      <div style={{ fontSize: 12, marginTop: 4 }}>
                        {r.pendAdiantamento > 0 && <span>Adiantamento pendente: {BRL(r.pendAdiantamento)}  </span>}
                        {r.pendSaldo > 0 && <span>Saldo pendente: {BRL(r.pendSaldo)}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : statsDetailOpen === "recebido" ? (
              receivedList.length === 0 ? (
                <div style={{ padding: "20px 0", textAlign: "center", color: "#5A6472" }}>
                  Nenhum recebimento registrado ainda.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {receivedList.map((r, i) => (
                    <div
                      key={i}
                      onClick={() => { setStatsDetailOpen(null); openEditTrip(r.trip); }}
                      style={{ background: "#E9F5F1", borderRadius: 8, padding: "10px 14px", cursor: "pointer" }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                        <strong>{truckLabel(r.trip.caminhaoId)} · recebido em {fmtDate(r.data)}{r.trip.contrato && ` · Ctr ${r.trip.contrato}`}</strong>
                        <span style={{ fontWeight: 700, color: "#12503F" }}>{BRL(r.valor)}</span>
                      </div>
                      <div style={{ fontSize: 12, color: "#5A6472" }}>
                        {r.trip.origem} → {r.trip.destino} {r.trip.empresa && `· ${r.trip.empresa}`} · {r.tipo}
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <>
                {commissionByDriver.length > 0 && (
                  <Field label="Motorista">
                    <select
                      style={{ ...inputStyle, marginBottom: 16 }}
                      value={commissionDriverFilter}
                      onChange={(e) => setCommissionDriverFilter(e.target.value)}
                    >
                      <option value="all">Todos os motoristas</option>
                      {commissionByDriver.map((g) => (
                        <option key={g.motorista} value={g.motorista}>{g.motorista}</option>
                      ))}
                    </select>
                  </Field>
                )}
                <NovoMotoristaForm
                  visible={addingValeFor === "__novo__"}
                  onCancel={() => setAddingValeFor(null)}
                  onConfirm={(nome, data, valor, tipo, obs) => {
                    if (!nome.trim() || !valor || Number(valor) <= 0) return;
                    addVale(nome.trim(), data, valor, tipo, obs);
                    setAddingValeFor(null);
                  }}
                  inputStyle={inputStyle}
                />
                {addingValeFor !== "__novo__" && (
                  <button
                    onClick={() => setAddingValeFor("__novo__")}
                    style={{ border: "2px dashed #B7BFC8", background: "transparent", borderRadius: 6, padding: "7px 14px", fontSize: 13, color: "#5A6472", cursor: "pointer", marginBottom: 16 }}
                  >
                    + motorista novo (sem viagem lançada ainda)
                  </button>
                )}
                {commissionByDriver.filter((g) => commissionDriverFilter === "all" || g.motorista === commissionDriverFilter).length === 0 ? (
                  <div style={{ padding: "20px 0", textAlign: "center", color: "#5A6472" }}>
                    Nenhuma comissão calculada ainda.
                  </div>
                ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                {commissionByDriver
                  .filter((g) => commissionDriverFilter === "all" || g.motorista === commissionDriverFilter)
                  .map((g) => (
                  <div key={g.motorista}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{g.motorista}</div>
                      {g.saldo !== 0 && (g.trips.length > 0 || g.vales.length > 0) && fechandoMotorista !== g.motorista && (
                        <button
                          onClick={() => startFecharSaldo(g.motorista)}
                          style={{ fontSize: 11, background: "#1B2430", color: "#fff", border: "none", borderRadius: 6, padding: "6px 10px", fontWeight: 700, cursor: "pointer" }}
                        >
                          Fechar saldo ({BRL(g.saldo)})
                        </button>
                      )}
                    </div>

                    {fechandoMotorista === g.motorista && (
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "flex-end", background: "#F7F8F9", padding: 10, borderRadius: 8, marginBottom: 10 }}>
                        <Field label="Data do pagamento/acerto">
                          <input type="date" style={inputStyle} value={fechamentoDataEditavel} onChange={(e) => setFechamentoDataEditavel(e.target.value)} />
                        </Field>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#5A6472" }}>Valor: {BRL(g.saldo)}</div>
                        <button onClick={() => confirmFecharSaldo(g.saldo)} style={{ background: "#1F6F5C", color: "#fff", border: "none", borderRadius: 6, padding: "8px 14px", fontWeight: 700, cursor: "pointer" }}>
                          Confirmar fechamento
                        </button>
                        <button onClick={() => setFechandoMotorista(null)} style={{ background: "none", border: "1px solid #D7DBE0", borderRadius: 6, padding: "8px 14px", cursor: "pointer" }}>
                          Cancelar
                        </button>
                      </div>
                    )}

                    <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                      <div style={{ flex: "1 1 90px", background: "#FFF6E2", borderRadius: 6, padding: "6px 10px" }}>
                        <div style={{ fontSize: 10, color: "#8A5A00", textTransform: "uppercase" }}>Gerado</div>
                        <div style={{ fontWeight: 700, fontSize: 13 }}>{BRL(g.total)}</div>
                      </div>
                      <div style={{ flex: "1 1 90px", background: "#FFF6E2", borderRadius: 6, padding: "6px 10px" }}>
                        <div style={{ fontSize: 10, color: "#8A5A00", textTransform: "uppercase" }}>Reembolsos</div>
                        <div style={{ fontWeight: 700, fontSize: 13 }}>+{BRL(g.totalReembolso)}</div>
                      </div>
                      <div style={{ flex: "1 1 90px", background: "#E9F5F1", borderRadius: 6, padding: "6px 10px" }}>
                        <div style={{ fontSize: 10, color: "#12503F", textTransform: "uppercase" }}>Pago (vales)</div>
                        <div style={{ fontWeight: 700, fontSize: 13 }}>−{BRL(g.totalPago)}</div>
                      </div>
                      <div style={{ flex: "1 1 90px", background: g.saldo > 0 ? "#FBEBE8" : "#E9F5F1", borderRadius: 6, padding: "6px 10px" }}>
                        <div style={{ fontSize: 10, color: g.saldo > 0 ? "#7A2A1D" : "#12503F", textTransform: "uppercase" }}>Saldo devido</div>
                        <div style={{ fontWeight: 700, fontSize: 13, color: g.saldo > 0 ? "#B0402E" : "#12503F" }}>{BRL(g.saldo)}</div>
                      </div>
                    </div>

                    <div style={{ fontSize: 11, color: "#5A6472", fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Viagens</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 }}>
                      {g.trips.map(({ trip, valor }) => (
                        <div
                          key={trip.id}
                          onClick={() => { setStatsDetailOpen(null); openEditTrip(trip); }}
                          style={{ background: "#FFF6E2", borderRadius: 8, padding: "8px 12px", cursor: "pointer", fontSize: 12 }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <strong>{truckLabel(trip.caminhaoId)} · {fmtDate(trip.data)}</strong>
                            <span style={{ fontWeight: 700 }}>{BRL(valor)}</span>
                          </div>
                          <div style={{ color: "#5A6472" }}>
                            {trip.origem} → {trip.destino} {trip.empresa && `· ${trip.empresa}`}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div style={{ fontSize: 11, color: "#5A6472", fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Vales e reembolsos</div>
                    {g.vales.length === 0 ? (
                      <div style={{ fontSize: 12, color: "#5A6472", marginBottom: 8 }}>Nenhum lançamento registrado ainda.</div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 8 }}>
                        {g.vales.map((v) => {
                          const isReembolso = v.tipo === "reembolso";
                          return (
                            <div key={v.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: isReembolso ? "#FFF6E2" : "#E9F5F1", borderRadius: 8, padding: "7px 12px", fontSize: 12 }}>
                              <div>
                                <span style={{ fontWeight: 700, fontSize: 10, textTransform: "uppercase", color: isReembolso ? "#8A5A00" : "#12503F", marginRight: 6 }}>
                                  {isReembolso ? "Reembolso" : "Vale"}
                                </span>
                                <strong>{fmtDate(v.data)}</strong> — {isReembolso ? "+" : "−"}{BRL(Number(v.valor) || 0)}
                                {v.observacao && <span style={{ color: "#5A6472" }}> · {v.observacao}</span>}
                              </div>
                              <button
                                onClick={() => deleteVale(v.id)}
                                title="Remover lançamento"
                                style={{ background: "none", border: "none", color: "#B0402E", cursor: "pointer", fontSize: 14 }}
                              >
                                ×
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {g.valesFuturos.length > 0 && (
                      <>
                        <div style={{ fontSize: 11, color: "#5A6472", fontWeight: 700, marginBottom: 4, marginTop: 10, textTransform: "uppercase" }}>
                          Lançamentos futuros (agendados, ainda não entram no saldo)
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 8 }}>
                          {g.valesFuturos.map((v) => {
                            const isReembolso = v.tipo === "reembolso";
                            return (
                              <div key={v.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#F2F3F4", border: "1px dashed #B7BFC8", borderRadius: 8, padding: "7px 12px", fontSize: 12 }}>
                                <div>
                                  <span style={{ fontWeight: 700, fontSize: 10, textTransform: "uppercase", color: "#5A6472", marginRight: 6 }}>
                                    {isReembolso ? "Reembolso" : "Vale"} agendado
                                  </span>
                                  <strong>{fmtDate(v.data)}</strong> — {isReembolso ? "+" : "−"}{BRL(Number(v.valor) || 0)}
                                  {v.observacao && <span style={{ color: "#5A6472" }}> · {v.observacao}</span>}
                                </div>
                                <button
                                  onClick={() => deleteVale(v.id)}
                                  title="Remover lançamento"
                                  style={{ background: "none", border: "none", color: "#B0402E", cursor: "pointer", fontSize: 14 }}
                                >
                                  ×
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}

                    {addingValeFor === g.motorista ? (
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "flex-end", background: "#F7F8F9", padding: 10, borderRadius: 8 }}>
                        <Field label="Tipo">
                          <select style={inputStyle} value={valeTipo} onChange={(e) => setValeTipo(e.target.value)}>
                            <option value="vale">Vale (adiantamento pago a ele)</option>
                            <option value="reembolso">Reembolso (ele pagou, devemos a ele)</option>
                          </select>
                        </Field>
                        <Field label="Data">
                          <input type="date" style={inputStyle} value={valeData} onChange={(e) => setValeData(e.target.value)} />
                        </Field>
                        <Field label="Valor (R$)">
                          <input type="number" style={{ ...inputStyle, width: 100 }} value={valeValor} onChange={(e) => setValeValor(e.target.value)} />
                        </Field>
                        <Field label="Observação (opcional)">
                          <input style={{ ...inputStyle, width: 140 }} value={valeObs} onChange={(e) => setValeObs(e.target.value)} />
                        </Field>
                        <Field label="Repetir por (meses)">
                          <input
                            type="number"
                            min="1"
                            style={{ ...inputStyle, width: 90 }}
                            value={valeRepetirMeses}
                            onChange={(e) => setValeRepetirMeses(e.target.value)}
                            title="Ex: 12 para descontar em 12 parcelas mensais (moto, empréstimo, etc.)"
                          />
                        </Field>
                        <button onClick={confirmAddVale} style={{ background: "#1F6F5C", color: "#fff", border: "none", borderRadius: 6, padding: "8px 14px", fontWeight: 700, cursor: "pointer" }}>
                          Salvar
                        </button>
                        <button onClick={() => setAddingValeFor(null)} style={{ background: "none", border: "1px solid #D7DBE0", borderRadius: 6, padding: "8px 14px", cursor: "pointer" }}>
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startAddVale(g.motorista)}
                        style={{ border: "2px dashed #B7BFC8", background: "transparent", borderRadius: 6, padding: "7px 14px", fontSize: 13, color: "#5A6472", cursor: "pointer" }}
                      >
                        + registrar vale ou reembolso
                      </button>
                    )}

                    {g.historico.length > 0 && (
                      <div style={{ marginTop: 12 }}>
                        <button
                          onClick={() => toggleHistorico(g.motorista)}
                          style={{ fontSize: 11, color: "#5A6472", background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "underline" }}
                        >
                          {historicoExpandido[g.motorista] ? "ocultar" : "ver"} histórico de fechamentos ({g.historico.length})
                        </button>
                        {historicoExpandido[g.motorista] && (
                          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
                            {g.historico.map((f) => (
                              <div key={f.id} style={{ background: "#F2F3F4", borderRadius: 8, padding: "10px 12px", fontSize: 12 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: editandoFechamentoId === f.id ? 8 : 0 }}>
                                  <span>
                                    Fechado em <strong>{fmtDate(f.data)}</strong> — {BRL(Number(f.valor) || 0)}
                                  </span>
                                  <span style={{ display: "flex", gap: 10 }}>
                                    {editandoFechamentoId !== f.id && (
                                      <button
                                        onClick={() => startEditFechamentoData(f)}
                                        style={{ background: "none", border: "none", color: "#2451A6", cursor: "pointer", fontSize: 11, textDecoration: "underline" }}
                                      >
                                        editar data
                                      </button>
                                    )}
                                    <button
                                      onClick={() => { if (window.confirm("Desfazer este fechamento? Os lançamentos voltam a aparecer como em aberto.")) deleteFechamento(f.id); }}
                                      title="Desfazer fechamento"
                                      style={{ background: "none", border: "none", color: "#B0402E", cursor: "pointer", fontSize: 11, textDecoration: "underline" }}
                                    >
                                      desfazer
                                    </button>
                                  </span>
                                </div>

                                {editandoFechamentoId === f.id && (
                                  <div style={{ display: "flex", gap: 8, alignItems: "flex-end", marginBottom: 8 }}>
                                    <Field label="Nova data do pagamento">
                                      <input type="date" style={inputStyle} value={editandoFechamentoData} onChange={(e) => setEditandoFechamentoData(e.target.value)} />
                                    </Field>
                                    <button onClick={() => confirmEditFechamentoData(g.motorista)} style={{ background: "#1F6F5C", color: "#fff", border: "none", borderRadius: 6, padding: "7px 12px", fontWeight: 700, cursor: "pointer", fontSize: 12 }}>
                                      Salvar
                                    </button>
                                    <button onClick={() => setEditandoFechamentoId(null)} style={{ background: "none", border: "1px solid #D7DBE0", borderRadius: 6, padding: "7px 12px", cursor: "pointer", fontSize: 12 }}>
                                      Cancelar
                                    </button>
                                  </div>
                                )}

                                {(f.trips.length > 0 || f.vales.length > 0) && (
                                  <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 6 }}>
                                    {f.trips.map(({ trip, valor }) => (
                                      <div key={trip.id} style={{ display: "flex", justifyContent: "space-between", background: "#fff", borderRadius: 6, padding: "5px 8px" }}>
                                        <span>{fmtDate(trip.data)} · {truckLabel(trip.caminhaoId)} · {trip.origem} → {trip.destino}</span>
                                        <strong>{BRL(valor)}</strong>
                                      </div>
                                    ))}
                                    {f.vales.map((v) => (
                                      <div key={v.id} style={{ display: "flex", justifyContent: "space-between", background: "#fff", borderRadius: 6, padding: "5px 8px" }}>
                                        <span>{fmtDate(v.data)} · {v.tipo === "reembolso" ? "Reembolso" : "Vale"} {v.observacao && `· ${v.observacao}`}</span>
                                        <strong>{v.tipo === "reembolso" ? "+" : "−"}{BRL(Number(v.valor) || 0)}</strong>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
      {/* relatorio mensal */}
      {reportOpen && (
        <div
          onClick={() => setReportOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(27,36,48,0.45)", zIndex: 20, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, overflowY: "auto" }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(760px, 94vw)",
              maxHeight: "88vh",
              overflowY: "auto",
              background: "#fff",
              borderRadius: 10,
              zIndex: 21,
              boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
              padding: 24,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4, flexWrap: "wrap", gap: 10 }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 22 }}>
                Relatório de líquido mensal
              </div>
              <button
                onClick={() => setReportOpen(false)}
                style={{ background: "none", border: "none", fontSize: 26, cursor: "pointer", color: "#5A6472", padding: "10px", margin: "-10px", lineHeight: 1 }}
              >
                ×
              </button>
            </div>
            <div style={{ fontSize: 12, color: "#5A6472", marginBottom: 14 }}>
              Mostrando: <strong>{filterTruck === "all" ? "todos os caminhões" : truckLabel(filterTruck)}</strong>
              {" "}— pra trocar, feche esse relatório e selecione outra placa lá em cima.
            </div>

            <div style={{ marginBottom: 14 }}>
              {addingDespesaFor !== null ? (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "flex-end", background: "#F7F8F9", padding: 10, borderRadius: 8 }}>
                  <Field label="Caminhão">
                    <select style={inputStyle} value={addingDespesaFor} onChange={(e) => setAddingDespesaFor(e.target.value)}>
                      {trucks.map((tr) => <option key={tr.id} value={tr.id}>{tr.placa}</option>)}
                    </select>
                  </Field>
                  <Field label="Data">
                    <input type="date" style={inputStyle} value={despesaData} onChange={(e) => setDespesaData(e.target.value)} />
                  </Field>
                  <Field label="Descrição">
                    <input style={inputStyle} value={despesaDescricao} onChange={(e) => setDespesaDescricao(e.target.value)} placeholder="ex: Seguro, Sem Parar, taxa" />
                  </Field>
                  <Field label="Valor (R$)">
                    <input type="number" style={{ ...inputStyle, width: 100 }} value={despesaValor} onChange={(e) => setDespesaValor(e.target.value)} />
                  </Field>
                  <Field label="Observação (opcional)">
                    <input style={{ ...inputStyle, width: 140 }} value={despesaObs} onChange={(e) => setDespesaObs(e.target.value)} />
                  </Field>
                  <button onClick={confirmAddDespesa} style={{ background: "#1F6F5C", color: "#fff", border: "none", borderRadius: 6, padding: "8px 14px", fontWeight: 700, cursor: "pointer" }}>
                    Salvar
                  </button>
                  <button onClick={() => setAddingDespesaFor(null)} style={{ background: "none", border: "1px solid #D7DBE0", borderRadius: 6, padding: "8px 14px", cursor: "pointer" }}>
                    Cancelar
                  </button>
                </div>
              ) : (
                trucks.length > 0 && (
                  <button
                    onClick={() => startAddDespesa(filterTruck !== "all" ? filterTruck : trucks[0].id)}
                    style={{ border: "2px dashed #B7BFC8", background: "transparent", borderRadius: 6, padding: "7px 14px", fontSize: 13, color: "#5A6472", cursor: "pointer" }}
                  >
                    + despesa do caminhão (seguro, Sem Parar, taxas...)
                  </button>
                )
              )}
            </div>

            <div style={{ marginBottom: 18, background: "#FFF6E2", borderRadius: 8, padding: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#8A5A00", textTransform: "uppercase", marginBottom: 8 }}>
                Taxa de viagem do mês (a dividir entre os caminhões)
              </div>

              {taxasDoMesReport.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 }}>
                  {taxasDoMesReport.map((t) => (
                    <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff", borderRadius: 6, padding: "6px 10px", fontSize: 12 }}>
                      <span>{fmtDate(t.data)} {t.descricao && `— ${t.descricao}`}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <strong>{BRL(Number(t.valor) || 0)}</strong>
                        <button onClick={() => deleteTaxaPool(t.id)} style={{ background: "none", border: "none", color: "#B0402E", cursor: "pointer", fontSize: 13 }}>×</button>
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {addingTaxa ? (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "flex-end" }}>
                  <Field label="Data">
                    <input type="date" style={inputStyle} value={taxaData} onChange={(e) => setTaxaData(e.target.value)} />
                  </Field>
                  <Field label="Valor (R$)">
                    <input type="number" style={{ ...inputStyle, width: 100 }} value={taxaValor} onChange={(e) => setTaxaValor(e.target.value)} autoFocus />
                  </Field>
                  <Field label="Pra quem foi pago">
                    <input style={{ ...inputStyle, width: 160 }} value={taxaDescricao} onChange={(e) => setTaxaDescricao(e.target.value)} placeholder="ex: fulano, plataforma tal" />
                  </Field>
                  <button onClick={confirmAddTaxa} style={{ background: "#1F6F5C", color: "#fff", border: "none", borderRadius: 6, padding: "8px 14px", fontWeight: 700, cursor: "pointer" }}>
                    Salvar
                  </button>
                  <button onClick={() => setAddingTaxa(false)} style={{ background: "none", border: "1px solid #D7DBE0", borderRadius: 6, padding: "8px 14px", cursor: "pointer" }}>
                    Cancelar
                  </button>
                </div>
              ) : (
                <button
                  onClick={startAddTaxa}
                  style={{ border: "2px dashed #C9A227", background: "transparent", borderRadius: 6, padding: "7px 14px", fontSize: 13, color: "#8A5A00", cursor: "pointer" }}
                >
                  + registrar taxa deste mês
                </button>
              )}

              {taxasDoMesReport.length > 0 && trucks.length > 0 && (
                <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid #E8D9A8", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                  <div style={{ fontSize: 12, color: "#5A6472" }}>
                    Total do mês: <strong>{BRL(taxasDoMesTotal)}</strong> ÷ {trucks.length} caminhões = <strong>{BRL(taxasDoMesTotal / trucks.length)}</strong> cada
                  </div>
                  <button
                    onClick={() => distribuirTaxas(reportMonth)}
                    style={{ background: "#1B2430", color: "#fff", border: "none", borderRadius: 6, padding: "8px 14px", fontWeight: 700, fontSize: 12, cursor: "pointer" }}
                  >
                    Dividir entre os caminhões
                  </button>
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 18, flexWrap: "wrap" }}>
              <Field label="Mês de referência">
                <input
                  type="month"
                  style={inputStyle}
                  value={reportMonth}
                  onChange={(e) => setReportMonth(e.target.value)}
                />
              </Field>
              <button
                onClick={exportReportCSV}
                style={{
                  marginTop: 20,
                  background: "#1F6F5C",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "9px 16px",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Baixar CSV
              </button>
              <button
                onClick={() => window.print()}
                style={{
                  marginTop: 20,
                  background: "#2451A6",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "9px 16px",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Baixar PDF
              </button>
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
              <button
                onClick={() => setReportView("resumo")}
                style={{
                  padding: "7px 14px",
                  borderRadius: 6,
                  border: reportView === "resumo" ? "2px solid #D9A419" : "2px solid #D7DBE0",
                  background: "#fff",
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Resumido
              </button>
              <button
                onClick={() => setReportView("detalhado")}
                style={{
                  padding: "7px 14px",
                  borderRadius: 6,
                  border: reportView === "detalhado" ? "2px solid #D9A419" : "2px solid #D7DBE0",
                  background: "#fff",
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Detalhado
              </button>
            </div>

            <div style={{ fontSize: 12, color: "#5A6472", marginBottom: 10 }}>
              {reportView === "resumo"
                ? <>Líquido = receita das viagens − comissão − abastecimento − gastos extras (considera a <strong>data da viagem</strong>).</>
                : <>Mostra cada viagem com seus lançamentos de comissão, abastecimento e gastos extras, igual ao relatório de referência.</>}
            </div>

            {reportView === "resumo" ? (
              monthlyReport.rows.every((r) => r.viagens === 0) ? (
              <div style={{ padding: "30px 10px", textAlign: "center", color: "#5A6472", border: "1px dashed #D7DBE0", borderRadius: 8 }}>
                Nenhuma viagem lançada nesse mês ainda.
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "#EEF0F2" }}>
                      {["Caminhão", "Viagens", "Receita", "Comissão", "Abastec.", "Gastos", "Desp. Veíc.", "Líquido"].map((h) => (
                        <th key={h} style={{ textAlign: "right", padding: "8px 10px", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: 0.3 }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyReport.rows.map((r) => (
                      <tr key={r.id} style={{ borderBottom: "1px solid #EEF0F2" }}>
                        <td style={{ padding: "8px 10px", textAlign: "left", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>{r.placa}</td>
                        <td style={{ padding: "8px 10px", textAlign: "right" }}>{r.viagens}</td>
                        <td style={{ padding: "8px 10px", textAlign: "right" }}>{BRL(r.receita)}</td>
                        <td style={{ padding: "8px 10px", textAlign: "right", color: "#B0402E" }}>−{BRL(r.comissaoTotal)}</td>
                        <td style={{ padding: "8px 10px", textAlign: "right", color: "#B0402E" }}>−{BRL(r.abastecimentoTotal)}</td>
                        <td style={{ padding: "8px 10px", textAlign: "right", color: "#B0402E" }}>−{BRL(r.gastosTotal)}</td>
                        <td style={{ padding: "8px 10px", textAlign: "right", color: "#B0402E" }}>−{BRL(r.despesasVeiculoTotal)}</td>
                        <td style={{ padding: "8px 10px", textAlign: "right", fontWeight: 700, color: r.liquido >= 0 ? "#12503F" : "#B0402E" }}>
                          {BRL(r.liquido)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{ background: "#F7F8F9" }}>
                      <td style={{ padding: "10px", fontWeight: 700 }}>TOTAL</td>
                      <td style={{ padding: "10px", textAlign: "right", fontWeight: 700 }}>{monthlyReport.totals.viagens}</td>
                      <td style={{ padding: "10px", textAlign: "right", fontWeight: 700 }}>{BRL(monthlyReport.totals.receita)}</td>
                      <td style={{ padding: "10px", textAlign: "right", fontWeight: 700, color: "#B0402E" }}>−{BRL(monthlyReport.totals.comissaoTotal)}</td>
                      <td style={{ padding: "10px", textAlign: "right", fontWeight: 700, color: "#B0402E" }}>−{BRL(monthlyReport.totals.abastecimentoTotal)}</td>
                      <td style={{ padding: "10px", textAlign: "right", fontWeight: 700, color: "#B0402E" }}>−{BRL(monthlyReport.totals.gastosTotal)}</td>
                      <td style={{ padding: "10px", textAlign: "right", fontWeight: 700, color: "#B0402E" }}>−{BRL(monthlyReport.totals.despesasVeiculoTotal)}</td>
                      <td style={{ padding: "10px", textAlign: "right", fontWeight: 700, color: monthlyReport.totals.liquido >= 0 ? "#12503F" : "#B0402E" }}>
                        {BRL(monthlyReport.totals.liquido)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              )
            ) : detailedReport.length === 0 ? (
              <div style={{ padding: "30px 10px", textAlign: "center", color: "#5A6472", border: "1px dashed #D7DBE0", borderRadius: 8 }}>
                Nenhuma viagem lançada nesse mês ainda.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {detailedReport.map((g) => (
                  <div key={g.id}>
                    <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6 }}>
                      Veículo: <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{g.placa}</span>
                    </div>
                    {g.tripRows.map((t) => (
                      <div key={t.id} style={{ marginBottom: 10 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", background: "#EEF0F2", padding: "6px 10px", fontSize: 13, fontWeight: 700 }}>
                          <span>{t.codigo}  {t.empresa}</span>
                          <span>{t.origem} → {t.destino}</span>
                          <span>{BRL(t.valorViagem)}</span>
                        </div>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                          <tbody>
                            {t.expenses.map((e, i) => (
                              <tr key={i} style={{ borderBottom: "1px solid #F2F3F4" }}>
                                <td style={{ padding: "5px 10px", width: 90 }}>{fmtDate(e.data)}</td>
                                <td style={{ padding: "5px 10px" }}>{e.tipo}</td>
                                <td style={{ padding: "5px 10px" }}>{e.descricao}</td>
                                <td style={{ padding: "5px 10px", color: "#5A6472" }}>{e.planoDeConta}</td>
                                <td style={{ padding: "5px 10px", textAlign: "right" }}>{BRL(e.valor)}</td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr>
                              <td colSpan={4} style={{ padding: "5px 10px", textAlign: "right", fontWeight: 700 }}>Total de Despesas:</td>
                              <td style={{ padding: "5px 10px", textAlign: "right", fontWeight: 700 }}>{BRL(t.totalDespesas)}</td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    ))}

                    {g.despesasVeiculoTruck.length > 0 && (
                      <div style={{ marginBottom: 8 }}>
                        <div style={{ fontSize: 11, color: "#5A6472", fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Despesas do veículo</div>
                        {g.despesasVeiculoTruck.map((d) => (
                          <div key={d.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#FBEBE8", borderRadius: 8, padding: "6px 10px", fontSize: 12, marginBottom: 4 }}>
                            <span>{fmtDate(d.data)} — {d.descricao} {d.observacao && <span style={{ color: "#5A6472" }}>({d.observacao})</span>}</span>
                            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <strong style={{ color: "#B0402E" }}>−{BRL(Number(d.valor) || 0)}</strong>
                              <button onClick={() => deleteDespesaVeiculo(d.id)} style={{ background: "none", border: "none", color: "#B0402E", cursor: "pointer", fontSize: 13 }}>×</button>
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div style={{ textAlign: "right", fontWeight: 700, fontSize: 13, borderTop: "2px solid #1B2430", paddingTop: 6 }}>
                      Total do Veículo: {BRL(g.totalVeiculo)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {view === "abastecimentos" && (
        <div style={{ padding: "24px 28px", maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontSize: 12, color: "#5A6472", marginBottom: 12 }}>
            Confere com o relatório que o posto te manda antes de pagar — se um abastecimento não estiver aqui, é porque não foi lançado numa viagem ainda.
          </div>

          <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
            <button onClick={() => setAbastecQuickPeriod("hoje")} style={{ fontSize: 12, padding: "6px 12px", borderRadius: 6, border: "1px solid #D7DBE0", background: "#fff", cursor: "pointer" }}>Hoje</button>
            <button onClick={() => setAbastecQuickPeriod("semana")} style={{ fontSize: 12, padding: "6px 12px", borderRadius: 6, border: "1px solid #D7DBE0", background: "#fff", cursor: "pointer" }}>Esta semana</button>
            <button onClick={() => setAbastecQuickPeriod("mes")} style={{ fontSize: 12, padding: "6px 12px", borderRadius: 6, border: "1px solid #D7DBE0", background: "#fff", cursor: "pointer" }}>Este mês</button>
            <button onClick={() => setAbastecQuickPeriod("tudo")} style={{ fontSize: 12, padding: "6px 12px", borderRadius: 6, border: "1px solid #D7DBE0", background: "#fff", cursor: "pointer" }}>Tudo</button>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "flex-end", marginBottom: 16, flexWrap: "wrap" }}>
            <Field label="De">
              <input type="date" style={inputStyle} value={abastecPeriodStart} onChange={(e) => setAbastecPeriodStart(e.target.value)} />
            </Field>
            <Field label="Até">
              <input type="date" style={inputStyle} value={abastecPeriodEnd} onChange={(e) => setAbastecPeriodEnd(e.target.value)} />
            </Field>
            <Field label="Posto">
              <select style={inputStyle} value={abastecPostoFilter} onChange={(e) => setAbastecPostoFilter(e.target.value)}>
                <option value="all">Todos</option>
                {abastecPostosList.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </Field>
            <Field label="Placa">
              <select style={inputStyle} value={abastecPlacaFilter} onChange={(e) => setAbastecPlacaFilter(e.target.value)}>
                <option value="all">Todas</option>
                {trucks.map((tr) => <option key={tr.id} value={tr.id}>{tr.placa}</option>)}
              </select>
            </Field>
            <button onClick={exportAbastecCSV} style={{ background: "#1F6F5C", color: "#fff", border: "none", borderRadius: 6, padding: "9px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
              Baixar CSV
            </button>
            <button onClick={() => window.print()} style={{ background: "#2451A6", color: "#fff", border: "none", borderRadius: 6, padding: "9px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
              Baixar PDF
            </button>
          </div>

          {abastecReport.porPosto.length === 0 ? (
            <div style={{ background: "#fff", padding: "30px 10px", textAlign: "center", color: "#5A6472", border: "1px dashed #D7DBE0", borderRadius: 8 }}>
              Nenhum abastecimento nesse período.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {abastecReport.porPosto.map((grupo) => (
                <div key={grupo.posto} style={{ background: "#fff", borderRadius: 8, padding: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 14, marginBottom: 6, borderBottom: "2px solid #EEF0F2", paddingBottom: 4 }}>
                    <span>{grupo.posto}</span>
                    <span>{BRL(grupo.valor)} {(grupo.litragemDiesel > 0 || grupo.litragemArla > 0) && <span style={{ fontWeight: 400, color: "#5A6472", fontSize: 12 }}>({grupo.litragemDiesel > 0 && `${grupo.litragemDiesel}L diesel`}{grupo.litragemDiesel > 0 && grupo.litragemArla > 0 && " · "}{grupo.litragemArla > 0 && `${grupo.litragemArla}L arla`})</span>}</span>
                  </div>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                    <tbody>
                      {grupo.items.map((a) => (
                        <tr key={a.id} style={{ borderBottom: "1px solid #EEF0F2" }}>
                          <td style={{ padding: "5px 8px", width: 80 }}>{fmtDate(a.data)}</td>
                          <td style={{ padding: "5px 8px" }}>{truckLabel(a.caminhaoId)}</td>
                          <td style={{ padding: "5px 8px", color: "#5A6472" }}>{a.origem}</td>
                          <td style={{ padding: "5px 8px", color: "#5A6472" }}>{a.litragem ? `${a.litragem} L` : ""}</td>
                          <td style={{ padding: "5px 8px", color: "#5A6472" }}>{a.numeroCupom ? `cupom ${a.numeroCupom}` : ""}</td>
                          <td style={{ padding: "5px 8px", textAlign: "right", fontWeight: 700 }}>{BRL(a.valor)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
              <div style={{ background: "#fff", borderRadius: 8, padding: 14, display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 15 }}>
                <span>TOTAL</span>
                <span>{BRL(abastecReport.totals.valor)} {(abastecReport.totals.litragemDiesel > 0 || abastecReport.totals.litragemArla > 0) && <span style={{ fontWeight: 400, color: "#5A6472", fontSize: 12 }}>({abastecReport.totals.litragemDiesel > 0 && `${abastecReport.totals.litragemDiesel}L diesel`}{abastecReport.totals.litragemDiesel > 0 && abastecReport.totals.litragemArla > 0 && " · "}{abastecReport.totals.litragemArla > 0 && `${abastecReport.totals.litragemArla}L arla`})</span>}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* slide-over panel */}
      {panelOpen && editing && (
        <>
          <div
            onClick={() => { setPanelOpen(false); setEditing(null); }}
            style={{ position: "fixed", inset: 0, background: "rgba(27,36,48,0.45)", zIndex: 20 }}
          />
          <div
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              width: "min(520px, 100vw)",
              background: "#fff",
              zIndex: 21,
              overflowY: "auto",
              boxShadow: "-8px 0 24px rgba(0,0,0,0.15)",
              padding: "24px 24px 100px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 22 }}>
                {trips.some((t) => t.id === editing.id) ? "Editar viagem" : "Nova viagem"}
              </div>
              <button
                onClick={() => { setPanelOpen(false); setEditing(null); }}
                style={{ background: "none", border: "none", fontSize: 26, cursor: "pointer", color: "#5A6472", padding: "10px", margin: "-10px", lineHeight: 1 }}
              >
                ×
              </button>
            </div>

            <Section title="Viagem">
              <Field label="Caminhão">
                <select
                  value={editing.caminhaoId}
                  onChange={(e) => setEditing({ ...editing, caminhaoId: e.target.value })}
                  style={inputStyle}
                >
                  <option value="">Selecione</option>
                  {trucks.map((tr) => (
                    <option key={tr.id} value={tr.id}>{tr.placa}</option>
                  ))}
                </select>
              </Field>
              <Field label="Data">
                <input type="date" style={inputStyle} value={editing.data} onChange={(e) => setEditing({ ...editing, data: e.target.value })} />
              </Field>
              <Field label="Origem">
                <input style={inputStyle} value={editing.origem} onChange={(e) => setEditing({ ...editing, origem: e.target.value })} />
              </Field>
              <Field label="Destino">
                <input style={inputStyle} value={editing.destino} onChange={(e) => setEditing({ ...editing, destino: e.target.value })} />
              </Field>
              <Field label="KM início">
                <input type="number" style={inputStyle} value={editing.kmInicio} onChange={(e) => setEditing({ ...editing, kmInicio: e.target.value })} />
              </Field>
              <Field label="KM fim">
                <input type="number" style={inputStyle} value={editing.kmFim} onChange={(e) => setEditing({ ...editing, kmFim: e.target.value })} />
              </Field>
              <Field label="Data fim da viagem">
                <input type="date" style={inputStyle} value={editing.dataFim} onChange={(e) => setEditing({ ...editing, dataFim: e.target.value })} />
              </Field>
              <Field label="Contrato">
                <input style={inputStyle} value={editing.contrato} onChange={(e) => setEditing({ ...editing, contrato: e.target.value })} />
              </Field>
            </Section>

            <Section title="Financeiro">
              <Field label="Empresa">
                <input style={inputStyle} value={editing.empresa} onChange={(e) => setEditing({ ...editing, empresa: e.target.value })} />
              </Field>
              <Field label="Motorista">
                {motoristaCustomMode ? (
                  <input
                    style={inputStyle}
                    value={editing.motorista}
                    onChange={(e) => setEditing({ ...editing, motorista: e.target.value })}
                    placeholder="nome do novo motorista"
                    autoFocus
                  />
                ) : (
                  <select
                    style={inputStyle}
                    value={motoristasList.includes(editing.motorista) ? editing.motorista : ""}
                    onChange={(e) => {
                      if (e.target.value === "__novo__") {
                        setMotoristaCustomMode(true);
                        setEditing({ ...editing, motorista: "" });
                      } else {
                        setEditing({ ...editing, motorista: e.target.value });
                      }
                    }}
                  >
                    <option value="">Selecione</option>
                    {motoristasList.map((nome) => <option key={nome} value={nome}>{nome}</option>)}
                    <option value="__novo__">+ novo motorista...</option>
                  </select>
                )}
                {motoristaCustomMode && (
                  <button
                    type="button"
                    onClick={() => { setMotoristaCustomMode(false); setEditing({ ...editing, motorista: "" }); }}
                    style={{ fontSize: 11, color: "#5A6472", background: "none", border: "none", cursor: "pointer", padding: 0, marginTop: 4, textDecoration: "underline", textAlign: "left" }}
                  >
                    usar motorista já cadastrado
                  </button>
                )}
              </Field>
              <Field label="Adiantamento (R$)">
                <input type="number" style={inputStyle} value={editing.adiantamento} onChange={(e) => setEditing({ ...editing, adiantamento: e.target.value })} />
              </Field>
              <Field label="Data recebimento adiantamento">
                <input type="date" style={inputStyle} value={editing.dataRecebAdiantamento} onChange={(e) => setEditing({ ...editing, dataRecebAdiantamento: e.target.value })} />
              </Field>
              <Field label="Saldo a receber (R$)">
                <input type="number" style={inputStyle} value={editing.saldoReceber} onChange={(e) => setEditing({ ...editing, saldoReceber: e.target.value })} />
              </Field>
              <Field label="Data pagamento do saldo">
                <input type="date" style={inputStyle} value={editing.dataPagamentoSaldo} onChange={(e) => setEditing({ ...editing, dataPagamentoSaldo: e.target.value })} />
              </Field>
              <Field label="Valor p/ comissão (R$)">
                <input type="number" style={inputStyle} value={editing.valorComissaoBase} onChange={(e) => setEditing({ ...editing, valorComissaoBase: e.target.value })} />
              </Field>
              <Field label="Pedágio (R$)">
                <input type="number" style={inputStyle} value={editing.pedagio} onChange={(e) => setEditing({ ...editing, pedagio: e.target.value })} />
              </Field>
            </Section>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                background: "#EEF0F2",
                borderRadius: 8,
                padding: "10px 14px",
                marginBottom: 22,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              <span>Total a receber: {BRL(valorTotal(editing))}</span>
              <span>Comissão: {BRL(comissao(editing))}</span>
            </div>

            <RepeatingSection
              title="Abastecimentos"
              items={editing.abastecimentos}
              onAdd={() => setEditing({ ...editing, abastecimentos: [...editing.abastecimentos, emptyAbastecimento()] })}
              onRemove={(id) => setEditing({ ...editing, abastecimentos: editing.abastecimentos.filter((a) => a.id !== id) })}
              onUpdate={(id, updated) => setEditing({ ...editing, abastecimentos: editing.abastecimentos.map((a) => (a.id === id ? updated : a)) })}
              addLabel="+ adicionar abastecimento"
              renderItem={(item, update) => (
                <>
                  <Field label="Data">
                    <input type="date" style={inputStyle} value={item.data} onChange={(e) => update({ ...item, data: e.target.value })} />
                  </Field>
                  <Field label="Tipo">
                    <select style={inputStyle} value={item.tipo || "diesel"} onChange={(e) => update({ ...item, tipo: e.target.value })}>
                      <option value="diesel">Diesel</option>
                      <option value="arla">Arla</option>
                    </select>
                  </Field>
                  <Field label="Litragem">
                    <input type="number" style={inputStyle} value={item.litragem} onChange={(e) => update({ ...item, litragem: e.target.value })} />
                  </Field>
                  <Field label="KM">
                    <input type="number" style={inputStyle} value={item.km} onChange={(e) => update({ ...item, km: e.target.value })} />
                  </Field>
                  <Field label="Valor (R$)">
                    <input type="number" style={inputStyle} value={item.valor} onChange={(e) => update({ ...item, valor: e.target.value })} />
                  </Field>
                  <Field label="Posto">
                    <input style={inputStyle} value={item.posto} onChange={(e) => update({ ...item, posto: e.target.value })} />
                  </Field>
                  <Field label="Nº cupom / NFC-e">
                    <input style={inputStyle} value={item.numeroCupom} onChange={(e) => update({ ...item, numeroCupom: e.target.value })} placeholder="ex: 000247827" />
                  </Field>
                </>
              )}
            />

            <RepeatingSection
              title="Gastos extras"
              items={editing.gastosExtras}
              onAdd={() => setEditing({ ...editing, gastosExtras: [...editing.gastosExtras, emptyGasto()] })}
              onRemove={(id) => setEditing({ ...editing, gastosExtras: editing.gastosExtras.filter((g) => g.id !== id) })}
              onUpdate={(id, updated) => setEditing({ ...editing, gastosExtras: editing.gastosExtras.map((g) => (g.id === id ? updated : g)) })}
              addLabel="+ adicionar gasto"
              renderItem={(item, update) => (
                <>
                  <Field label="Data">
                    <input type="date" style={inputStyle} value={item.data} onChange={(e) => update({ ...item, data: e.target.value })} />
                  </Field>
                  <Field label="Valor (R$)">
                    <input type="number" style={inputStyle} value={item.valor} onChange={(e) => update({ ...item, valor: e.target.value })} />
                  </Field>
                  <Field label="Descrição">
                    <input style={inputStyle} value={item.descricao} onChange={(e) => update({ ...item, descricao: e.target.value })} placeholder="ex: Lubrificação" />
                  </Field>
                  <Field label="Posto (se for do mesmo cupom)">
                    <input style={inputStyle} value={item.posto} onChange={(e) => update({ ...item, posto: e.target.value })} />
                  </Field>
                  <Field label="Nº cupom / NFC-e">
                    <input style={inputStyle} value={item.numeroCupom} onChange={(e) => update({ ...item, numeroCupom: e.target.value })} placeholder="mesmo número do abastecimento" />
                  </Field>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#5A6472", gridColumn: "1 / -1" }}>
                    <input
                      type="checkbox"
                      checked={!!item.paraComissao}
                      onChange={(e) => update({ ...item, paraComissao: e.target.checked })}
                    />
                    Motorista pagou do próprio bolso — enviar como reembolso na comissão dele
                  </label>
                </>
              )}
            />

            <div style={{ display: "flex", gap: 10, position: "sticky", bottom: 0, background: "#fff", paddingTop: 12 }}>
              <button
                onClick={saveTrip}
                style={{ flex: 1, background: "#D9A419", color: "#1B2430", border: "none", borderRadius: 6, padding: "12px", fontWeight: 700, cursor: "pointer" }}
              >
                Salvar viagem
              </button>
              {trips.some((t) => t.id === editing.id) && (
                <button
                  onClick={() => deleteTrip(editing.id)}
                  style={{ background: "#FBEBE8", color: "#B0402E", border: "1px solid #B0402E33", borderRadius: 6, padding: "12px 16px", fontWeight: 700, cursor: "pointer" }}
                >
                  Excluir
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>

    {/* bloco somente para impressao / PDF */}
    {reportOpen && reportView === "resumo" && (
      <div className="print-only" style={{ display: "none", padding: 24, fontFamily: "'Inter', sans-serif", color: "#1B2430" }}>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 24, marginBottom: 4 }}>
          Relatório de líquido mensal
        </div>
        <div style={{ fontSize: 13, color: "#5A6472", marginBottom: 4 }}>
          Referência: {reportMonth} · {filterTruck === "all" ? "todos os caminhões" : truckLabel(filterTruck)} · gerado em {new Date().toLocaleDateString("pt-BR")}
        </div>
        <div style={{ fontSize: 11, color: "#5A6472", marginBottom: 16 }}>
          Líquido = receita das viagens − comissão − abastecimento − gastos extras − despesas do veículo (data da viagem)
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr>
              {["Caminhão", "Viagens", "Receita", "Comissão", "Abastec.", "Gastos", "Desp. Veíc.", "Líquido"].map((h) => (
                <th key={h} style={{ textAlign: "right", padding: "6px 8px", borderBottom: "2px solid #1B2430" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {monthlyReport.rows.map((r) => (
              <tr key={r.id}>
                <td style={{ padding: "6px 8px", textAlign: "left", borderBottom: "1px solid #D7DBE0" }}>{r.placa}</td>
                <td style={{ padding: "6px 8px", textAlign: "right", borderBottom: "1px solid #D7DBE0" }}>{r.viagens}</td>
                <td style={{ padding: "6px 8px", textAlign: "right", borderBottom: "1px solid #D7DBE0" }}>{BRL(r.receita)}</td>
                <td style={{ padding: "6px 8px", textAlign: "right", borderBottom: "1px solid #D7DBE0" }}>−{BRL(r.comissaoTotal)}</td>
                <td style={{ padding: "6px 8px", textAlign: "right", borderBottom: "1px solid #D7DBE0" }}>−{BRL(r.abastecimentoTotal)}</td>
                <td style={{ padding: "6px 8px", textAlign: "right", borderBottom: "1px solid #D7DBE0" }}>−{BRL(r.gastosTotal)}</td>
                <td style={{ padding: "6px 8px", textAlign: "right", borderBottom: "1px solid #D7DBE0" }}>−{BRL(r.despesasVeiculoTotal)}</td>
                <td style={{ padding: "6px 8px", textAlign: "right", fontWeight: 700, borderBottom: "1px solid #D7DBE0" }}>{BRL(r.liquido)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td style={{ padding: "8px", fontWeight: 700, borderTop: "2px solid #1B2430" }}>TOTAL</td>
              <td style={{ padding: "8px", textAlign: "right", fontWeight: 700, borderTop: "2px solid #1B2430" }}>{monthlyReport.totals.viagens}</td>
              <td style={{ padding: "8px", textAlign: "right", fontWeight: 700, borderTop: "2px solid #1B2430" }}>{BRL(monthlyReport.totals.receita)}</td>
              <td style={{ padding: "8px", textAlign: "right", fontWeight: 700, borderTop: "2px solid #1B2430" }}>−{BRL(monthlyReport.totals.comissaoTotal)}</td>
              <td style={{ padding: "8px", textAlign: "right", fontWeight: 700, borderTop: "2px solid #1B2430" }}>−{BRL(monthlyReport.totals.abastecimentoTotal)}</td>
              <td style={{ padding: "8px", textAlign: "right", fontWeight: 700, borderTop: "2px solid #1B2430" }}>−{BRL(monthlyReport.totals.gastosTotal)}</td>
              <td style={{ padding: "8px", textAlign: "right", fontWeight: 700, borderTop: "2px solid #1B2430" }}>−{BRL(monthlyReport.totals.despesasVeiculoTotal)}</td>
              <td style={{ padding: "8px", textAlign: "right", fontWeight: 700, borderTop: "2px solid #1B2430" }}>{BRL(monthlyReport.totals.liquido)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    )}

    {reportOpen && reportView === "detalhado" && (
      <div className="print-only" style={{ display: "none", padding: 24, fontFamily: "'Inter', sans-serif", color: "#1B2430", fontSize: 11 }}>
        <div style={{ background: "#2451A6", color: "#fff", padding: "8px 12px", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 18, marginBottom: 4 }}>
          Viagens e Despesas
        </div>
        <div style={{ fontSize: 11, color: "#5A6472", marginBottom: 2 }}>
          Referência: {reportMonth} · {filterTruck === "all" ? "todos os caminhões" : truckLabel(filterTruck)}
        </div>
        <div style={{ fontSize: 10, color: "#5A6472", fontStyle: "italic", marginBottom: 12 }}>
          Relatório de viagens com lançamentos de despesa · gerado em {new Date().toLocaleDateString("pt-BR")}
        </div>
        {detailedReport.map((g) => (
          <div key={g.id} style={{ marginBottom: 18, breakInside: "avoid" }}>
            <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 4 }}>Veículo: {g.placa}</div>
            {g.tripRows.map((t) => (
              <div key={t.id} style={{ marginBottom: 8 }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#2451A6", color: "#fff" }}>
                      <td style={{ padding: "4px 6px", fontWeight: 700 }}>{t.codigo}</td>
                      <td style={{ padding: "4px 6px" }}>{t.empresa}</td>
                      <td style={{ padding: "4px 6px" }}>{t.origem}</td>
                      <td style={{ padding: "4px 6px", textAlign: "right" }} colSpan={2}>{t.destino}</td>
                    </tr>
                  </thead>
                  <tbody>
                    {t.expenses.map((e, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid #EEF0F2" }}>
                        <td style={{ padding: "3px 6px", width: 70 }}>{fmtDate(e.data)}</td>
                        <td style={{ padding: "3px 6px", width: 90 }}>{e.tipo}</td>
                        <td style={{ padding: "3px 6px" }}>{e.descricao}</td>
                        <td style={{ padding: "3px 6px", color: "#5A6472" }}>{e.planoDeConta}</td>
                        <td style={{ padding: "3px 6px", textAlign: "right", width: 80 }}>{BRL(e.valor)}</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={3}></td>
                      <td style={{ padding: "3px 6px", textAlign: "right", fontWeight: 700 }}>Total de Despesas:</td>
                      <td style={{ padding: "3px 6px", textAlign: "right", fontWeight: 700 }}>{BRL(t.totalDespesas)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))}
            {g.despesasVeiculoTruck.length > 0 && (
              <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 8 }}>
                <thead>
                  <tr style={{ background: "#B0402E", color: "#fff" }}>
                    <td colSpan={5} style={{ padding: "4px 6px", fontWeight: 700 }}>Despesas do veículo</td>
                  </tr>
                </thead>
                <tbody>
                  {g.despesasVeiculoTruck.map((d) => (
                    <tr key={d.id} style={{ borderBottom: "1px solid #EEF0F2" }}>
                      <td style={{ padding: "3px 6px", width: 70 }}>{fmtDate(d.data)}</td>
                      <td colSpan={3} style={{ padding: "3px 6px" }}>{d.descricao} {d.observacao && `(${d.observacao})`}</td>
                      <td style={{ padding: "3px 6px", textAlign: "right", width: 80 }}>−{BRL(Number(d.valor) || 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div style={{ textAlign: "right", fontWeight: 700, fontSize: 12, borderTop: "2px solid #1B2430", paddingTop: 4 }}>
              Total do Veículo: {BRL(g.totalVeiculo)}
            </div>
          </div>
        ))}
      </div>
    )}

    {boletosReportOpen && (
      <div className="print-only" style={{ display: "none", padding: 24, fontFamily: "'Inter', sans-serif", color: "#1B2430", fontSize: 12 }}>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 24, marginBottom: 4 }}>
          Relatório de Boletos
        </div>
        <div style={{ fontSize: 12, color: "#5A6472", marginBottom: 16 }}>
          Período: {fmtDate(boletosPeriodStart)} a {fmtDate(boletosPeriodEnd)}
          {boletosReportEmpresa !== "all" && <> · Empresa: {boletosReportEmpresa}</>}
          {" "}· gerado em {new Date().toLocaleDateString("pt-BR")}
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr>
              {["Empresa", "Descrição", "Nota Fiscal", "Vencimento", "Conta", "Pago em", "Status", "Valor"].map((h) => (
                <th key={h} style={{ textAlign: "right", padding: "6px 8px", borderBottom: "2px solid #1B2430" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {boletosReport.items.map((b) => {
              const hoje = todayISO();
              const status = b.dataPagamento ? "Pago" : b.dataVencimento < hoje ? "Vencido" : "Pendente";
              return (
                <tr key={b.id}>
                  <td style={{ padding: "6px 8px", textAlign: "left", borderBottom: "1px solid #D7DBE0" }}>{b.empresa}</td>
                  <td style={{ padding: "6px 8px", textAlign: "left", borderBottom: "1px solid #D7DBE0" }}>{b.descricao}</td>
                  <td style={{ padding: "6px 8px", textAlign: "left", borderBottom: "1px solid #D7DBE0" }}>{b.notaFiscal}</td>
                  <td style={{ padding: "6px 8px", textAlign: "right", borderBottom: "1px solid #D7DBE0" }}>{fmtDate(b.dataVencimento)}</td>
                  <td style={{ padding: "6px 8px", textAlign: "right", borderBottom: "1px solid #D7DBE0" }}>{b.contaBancaria}</td>
                  <td style={{ padding: "6px 8px", textAlign: "right", borderBottom: "1px solid #D7DBE0" }}>{b.dataPagamento ? fmtDate(b.dataPagamento) : "—"}</td>
                  <td style={{ padding: "6px 8px", textAlign: "right", borderBottom: "1px solid #D7DBE0" }}>{status}</td>
                  <td style={{ padding: "6px 8px", textAlign: "right", borderBottom: "1px solid #D7DBE0", fontWeight: 700 }}>{BRL(Number(b.valor) || 0)}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={7} style={{ padding: "8px", textAlign: "right", fontWeight: 700, borderTop: "2px solid #1B2430" }}>Pendente:</td>
              <td style={{ padding: "8px", textAlign: "right", fontWeight: 700, borderTop: "2px solid #1B2430" }}>{BRL(boletosReport.totals.pendente)}</td>
            </tr>
            <tr>
              <td colSpan={7} style={{ padding: "4px 8px", textAlign: "right", fontWeight: 700, color: "#B0402E" }}>Vencido:</td>
              <td style={{ padding: "4px 8px", textAlign: "right", fontWeight: 700, color: "#B0402E" }}>{BRL(boletosReport.totals.vencido)}</td>
            </tr>
            <tr>
              <td colSpan={7} style={{ padding: "4px 8px", textAlign: "right", fontWeight: 700, color: "#12503F" }}>Pago:</td>
              <td style={{ padding: "4px 8px", textAlign: "right", fontWeight: 700, color: "#12503F" }}>{BRL(boletosReport.totals.pago)}</td>
            </tr>
            <tr>
              <td colSpan={7} style={{ padding: "6px 8px", textAlign: "right", fontWeight: 700 }}>TOTAL:</td>
              <td style={{ padding: "6px 8px", textAlign: "right", fontWeight: 700 }}>{BRL(boletosReport.totals.total)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    )}

    {view === "abastecimentos" && (
      <div className="print-only" style={{ display: "none", padding: 24, fontFamily: "'Inter', sans-serif", color: "#1B2430", fontSize: 12 }}>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 24, marginBottom: 4 }}>
          Relatório de Abastecimentos
        </div>
        <div style={{ fontSize: 12, color: "#5A6472", marginBottom: 16 }}>
          Período: {fmtDate(abastecPeriodStart)} a {fmtDate(abastecPeriodEnd)}
          {abastecPostoFilter !== "all" && <> · Posto: {abastecPostoFilter}</>}
          {abastecPlacaFilter !== "all" && <> · Placa: {truckLabel(abastecPlacaFilter)}</>}
          {" "}· gerado em {new Date().toLocaleDateString("pt-BR")}
        </div>
        {abastecReport.porPosto.map((grupo) => (
          <div key={grupo.posto} style={{ marginBottom: 16, breakInside: "avoid" }}>
            <div style={{ background: "#2451A6", color: "#fff", padding: "6px 10px", fontWeight: 700, fontSize: 13, marginBottom: 4 }}>
              {grupo.posto} — {BRL(grupo.valor)} {(grupo.litragemDiesel > 0 || grupo.litragemArla > 0) && `(${grupo.litragemDiesel > 0 ? grupo.litragemDiesel + "L diesel" : ""}${grupo.litragemDiesel > 0 && grupo.litragemArla > 0 ? " · " : ""}${grupo.litragemArla > 0 ? grupo.litragemArla + "L arla" : ""})`}
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Data", "Caminhão", "Origem", "Litragem", "Cupom", "Valor"].map((h) => (
                    <th key={h} style={{ textAlign: "right", padding: "5px 8px", borderBottom: "2px solid #1B2430" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {grupo.items.map((a) => (
                  <tr key={a.id}>
                    <td style={{ padding: "4px 8px", textAlign: "left", borderBottom: "1px solid #D7DBE0" }}>{fmtDate(a.data)}</td>
                    <td style={{ padding: "4px 8px", textAlign: "left", borderBottom: "1px solid #D7DBE0" }}>{truckLabel(a.caminhaoId)}</td>
                    <td style={{ padding: "4px 8px", textAlign: "left", borderBottom: "1px solid #D7DBE0" }}>{a.origem}</td>
                    <td style={{ padding: "4px 8px", textAlign: "right", borderBottom: "1px solid #D7DBE0" }}>{a.litragem || ""}</td>
                    <td style={{ padding: "4px 8px", textAlign: "right", borderBottom: "1px solid #D7DBE0" }}>{a.numeroCupom || ""}</td>
                    <td style={{ padding: "4px 8px", textAlign: "right", borderBottom: "1px solid #D7DBE0", fontWeight: 700 }}>{BRL(a.valor)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 14, borderTop: "2px solid #1B2430", paddingTop: 8 }}>
          <span>TOTAL GERAL</span>
          <span>{BRL(abastecReport.totals.valor)} {(abastecReport.totals.litragemDiesel > 0 || abastecReport.totals.litragemArla > 0) && `(${abastecReport.totals.litragemDiesel > 0 ? abastecReport.totals.litragemDiesel + "L diesel" : ""}${abastecReport.totals.litragemDiesel > 0 && abastecReport.totals.litragemArla > 0 ? " · " : ""}${abastecReport.totals.litragemArla > 0 ? abastecReport.totals.litragemArla + "L arla" : ""})`}</span>
        </div>
      </div>
    )}
    </>
  );
}
