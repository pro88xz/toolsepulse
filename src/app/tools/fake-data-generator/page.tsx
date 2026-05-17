"use client";

import { useState, useCallback } from "react";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";

const tool = getToolBySlug("fake-data-generator")!;

const FIELDS = [
  { key: "firstName", label: "First name" },
  { key: "lastName", label: "Last name" },
  { key: "fullName", label: "Full name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "username", label: "Username" },
  { key: "company", label: "Company" },
  { key: "jobTitle", label: "Job title" },
  { key: "streetAddress", label: "Street address" },
  { key: "city", label: "City" },
  { key: "country", label: "Country" },
  { key: "zipCode", label: "Zip / postal" },
  { key: "birthDate", label: "Date of birth" },
  { key: "creditCardNumber", label: "Credit card (test)" },
  { key: "website", label: "Website URL" },
  { key: "uuid", label: "UUID" },
] as const;

type FieldKey = typeof FIELDS[number]["key"];
type Format = "table" | "json" | "csv";

const DEFAULT_FIELDS: FieldKey[] = ["fullName", "email", "phone", "company", "city"];

export default function FakeDataGeneratorPage() {
  const [selected, setSelected] = useState<Set<FieldKey>>(new Set(DEFAULT_FIELDS));
  const [rowCount, setRowCount] = useState(10);
  const [format, setFormat] = useState<Format>("table");
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const toggle = (k: FieldKey) => {
    const next = new Set(selected);
    if (next.has(k)) next.delete(k); else next.add(k);
    setSelected(next);
  };

  const generate = useCallback(async () => {
    if (selected.size === 0) return;
    setLoading(true);
    try {
      const { faker } = await import("@faker-js/faker");
      const n = Math.max(1, Math.min(1000, rowCount));
      const out: Record<string, string>[] = [];
      for (let i = 0; i < n; i++) {
        const row: Record<string, string> = {};
        if (selected.has("firstName")) row.firstName = faker.person.firstName();
        if (selected.has("lastName")) row.lastName = faker.person.lastName();
        if (selected.has("fullName")) row.fullName = faker.person.fullName();
        if (selected.has("email")) row.email = faker.internet.email().toLowerCase();
        if (selected.has("phone")) row.phone = faker.phone.number();
        if (selected.has("username")) row.username = faker.internet.username().toLowerCase();
        if (selected.has("company")) row.company = faker.company.name();
        if (selected.has("jobTitle")) row.jobTitle = faker.person.jobTitle();
        if (selected.has("streetAddress")) row.streetAddress = faker.location.streetAddress();
        if (selected.has("city")) row.city = faker.location.city();
        if (selected.has("country")) row.country = faker.location.country();
        if (selected.has("zipCode")) row.zipCode = faker.location.zipCode();
        if (selected.has("birthDate")) row.birthDate = faker.date.birthdate().toISOString().split("T")[0];
        if (selected.has("creditCardNumber")) row.creditCardNumber = faker.finance.creditCardNumber();
        if (selected.has("website")) row.website = faker.internet.url();
        if (selected.has("uuid")) row.uuid = faker.string.uuid();
        out.push(row);
      }
      setRows(out);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [rowCount, selected]);

  const cols = FIELDS.filter((f) => selected.has(f.key));

  const formatted = (() => {
    if (rows.length === 0) return "";
    if (format === "json") return JSON.stringify(rows, null, 2);
    if (format === "csv") {
      const header = cols.map((c) => c.key).join(",");
      const body = rows
        .map((r) => cols.map((c) => {
          const v = r[c.key] ?? "";
          return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
        }).join(","))
        .join("\n");
      return header + "\n" + body;
    }
    return "";
  })();

  const copy = async () => {
    if (!formatted) return;
    await navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const download = () => {
    if (!formatted) return;
    const ext = format === "json" ? "json" : "csv";
    const mime = format === "json" ? "application/json" : "text/csv";
    const blob = new Blob([formatted], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fake-data.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolPageLayout tool={tool}>
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">Pick fields</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {FIELDS.map((f) => {
              const active = selected.has(f.key);
              return (
                <button
                  key={f.key}
                  onClick={() => toggle(f.key)}
                  className={`text-left rounded-lg px-3 py-2 text-sm transition-colors border ${active ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"}`}
                >
                  {active && <span className="mr-1">✓</span>}
                  {f.label}
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex flex-wrap items-end gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Rows</label>
              <input
                type="number"
                min={1}
                max={1000}
                value={rowCount}
                onChange={(e) => setRowCount(Math.max(1, Math.min(1000, Number(e.target.value) || 1)))}
                className="w-28 rounded-lg border-2 border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as Format)}
                className="rounded-lg border-2 border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-400"
              >
                <option value="table">Table</option>
                <option value="json">JSON</option>
                <option value="csv">CSV</option>
              </select>
            </div>
            <button
              onClick={generate}
              disabled={loading || selected.size === 0}
              className="ml-auto rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm hover:shadow-lg hover:scale-[1.02] active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all" style={{ backgroundImage: "linear-gradient(90deg, #1D4ED8 0%, #6D28D9 50%, #DB2777 100%)" }}
            >
              {loading ? "Generating..." : "Generate"}
            </button>
          </div>
        </div>

        {rows.length > 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{rows.length} rows generated</p>
              <div className="flex items-center gap-3">
                {format !== "table" && (
                  <button onClick={copy} className="text-xs font-medium text-blue-600 hover:text-blue-700">
                    {copied ? "Copied!" : "Copy"}
                  </button>
                )}
                <button onClick={download} className="text-xs font-medium text-blue-600 hover:text-blue-700">
                  Download
                </button>
              </div>
            </div>

            {format === "table" ? (
              <div className="overflow-x-auto -mx-2">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      {cols.map((c) => (
                        <th key={c.key} className="px-2 py-2 text-left font-medium text-gray-700">{c.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r, i) => (
                      <tr key={i} className="border-b border-gray-100">
                        {cols.map((c) => (
                          <td key={c.key} className="px-2 py-2 text-gray-700 align-top">{r[c.key]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <pre className="rounded-lg bg-gray-50 px-4 py-3 font-mono text-xs text-gray-800 overflow-x-auto max-h-96 overflow-y-auto whitespace-pre">{formatted}</pre>
            )}
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
