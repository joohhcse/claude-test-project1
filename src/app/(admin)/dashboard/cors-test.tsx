"use client";

import { useState } from "react";

interface CorsResult {
  status: "idle" | "loading" | "success" | "error";
  statusCode?: number;
  data?: unknown;
  error?: string;
  headers?: Record<string, string>;
}

const API_BASE = "http://localhost:8080/api/cors-test";

export function CorsTest() {
  const [url, setUrl] = useState(API_BASE);
  const [method, setMethod] = useState<"GET" | "POST">("GET");
  const [result, setResult] = useState<CorsResult>({ status: "idle" });

  async function handleTest() {
    setResult({ status: "loading" });

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        ...(method === "POST" ? { body: JSON.stringify({ test: true }) } : {}),
      });

      const corsHeaders: Record<string, string> = {};
      for (const key of [
        "access-control-allow-origin",
        "access-control-allow-methods",
        "access-control-allow-headers",
        "access-control-allow-credentials",
      ]) {
        const value = res.headers.get(key);
        if (value) corsHeaders[key] = value;
      }

      let data: unknown;
      const contentType = res.headers.get("content-type") ?? "";
      if (contentType.includes("application/json")) {
        data = await res.json();
      } else {
        data = await res.text();
      }

      setResult({
        status: "success",
        statusCode: res.status,
        data,
        headers: corsHeaders,
      });
    } catch (err) {
      setResult({
        status: "error",
        error:
          err instanceof TypeError
            ? `CORS error or network failure: ${err.message}`
            : String(err),
      });
    }
  }

  return (
    <div className="rounded-lg border border-border bg-white p-6 space-y-4">
      <h2 className="font-semibold">CORS Test (localhost:8080)</h2>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-1">
          <label className="text-xs font-medium text-muted-foreground">URL</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>
        <div className="w-full sm:w-24 space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Method</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as "GET" | "POST")}
            className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
          </select>
        </div>
        <button
          type="button"
          onClick={handleTest}
          disabled={result.status === "loading"}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {result.status === "loading" ? "Testing..." : "Send"}
        </button>
      </div>

      {result.status !== "idle" && result.status !== "loading" && (
        <div className="space-y-2">
          {/* Status */}
          <div className="flex items-center gap-2">
            <span
              className={`inline-block h-2 w-2 rounded-full ${
                result.status === "success" ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span className="text-sm font-medium">
              {result.status === "success"
                ? `${result.statusCode} OK`
                : "Failed"}
            </span>
          </div>

          {/* Error */}
          {result.error && (
            <pre className="overflow-x-auto rounded-md bg-red-50 p-3 text-xs text-red-700">
              {result.error}
            </pre>
          )}

          {/* CORS Headers */}
          {result.headers && Object.keys(result.headers).length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">CORS Headers</p>
              <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs">
                {Object.entries(result.headers)
                  .map(([k, v]) => `${k}: ${v}`)
                  .join("\n")}
              </pre>
            </div>
          )}

          {/* Response Data */}
          {result.data !== undefined && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Response</p>
              <pre className="max-h-40 overflow-auto rounded-md bg-muted p-3 text-xs">
                {typeof result.data === "string"
                  ? result.data
                  : JSON.stringify(result.data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
