"use client";

import { useState, useEffect } from "react";

interface HealthState {
  state: string;
  version: string;
  preferCloud: boolean;
  updating: boolean;
  simulateLatencyMs: number;
}

export function NetworkSimulator() {
  const [health, setHealth] = useState<HealthState | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/sendbox/health-control")
      .then((r) => r.json())
      .then(setHealth)
      .catch(console.error);
  }, []);

  async function setState(state: string) {
    setLoading(true);
    try {
      await fetch("/api/sendbox/health-control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state }),
      });
      const res = await fetch("/api/sendbox/health-control");
      setHealth(await res.json());
    } finally {
      setLoading(false);
    }
  }

  const currentState = health?.state ?? "unknown";

  return (
    <section className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-xl font-semibold mb-4">Network Failover Simulator</h2>
      <p className="text-slate-600 text-sm mb-6">
        Toggle Live and Cloud states independently to visually verify soft-switch failover behavior.
        Current state: <span className="font-mono font-bold text-slate-800">{currentState}</span>
        {health?.version && (
          <span className="ml-2 text-xs text-slate-500">(v{health.version})</span>
        )}
      </p>

      {/* Visual Network Topology */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <NetworkNode
          label="Live Mini Server"
          active={currentState === "healthy" || currentState === "updating"}
          states={[
            { id: "healthy", label: "ON", color: "bg-emerald-500" },
            { id: "updating", label: "UPDATING", color: "bg-amber-500" },
            { id: "live-down", label: "OFF", color: "bg-red-500" },
          ]}
          onToggle={setState}
          disabled={loading}
        />
        <NetworkNode
          label="Cloud VPS"
          active={currentState !== "cloud-down"}
          states={[
            { id: "healthy", label: "ON", color: "bg-emerald-500" },
            { id: "cloud-down", label: "OFF", color: "bg-red-500" },
            { id: "version-mismatch", label: "VERSION LAG", color: "bg-orange-500" },
          ]}
          onToggle={setState}
          disabled={loading}
        />
      </div>

      {/* Quick Scenario Buttons */}
      <div className="border-t border-slate-100 pt-4">
        <h3 className="text-sm font-medium text-slate-500 mb-3">Quick Scenarios</h3>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "All Healthy", state: "healthy" },
            { label: "Live Down → Cloud Failover", state: "live-down" },
            { label: "Prefer Cloud (Drain)", state: "prefer-cloud" },
            { label: "Fast Ship (Updating)", state: "updating" },
            { label: "Cloud Unreachable", state: "cloud-down" },
            { label: "Version Mismatch", state: "version-mismatch" },
          ].map((scenario) => (
            <button
              key={scenario.label}
              onClick={() => setState(scenario.state)}
              disabled={loading}
              className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-all ${
                currentState === scenario.state
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-slate-300 hover:bg-slate-100 hover:border-slate-400"
              } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {scenario.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function NetworkNode({
  label,
  active,
  states,
  onToggle,
  disabled,
}: {
  label: string;
  active: boolean;
  states: { id: string; label: string; color: string }[];
  onToggle: (state: string) => void;
  disabled: boolean;
}) {
  return (
    <div className={`rounded-lg border p-4 transition-colors ${active ? "border-emerald-300 bg-emerald-50/50" : "border-slate-200"}`}>
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-2.5 h-2.5 rounded-full ${active ? "bg-emerald-500 animate-pulse" : "bg-red-400"}`} />
        <span className="text-sm font-semibold text-slate-700">{label}</span>
      </div>
      <div className="flex gap-2">
        {states.map((s) => (
          <button
            key={s.id}
            onClick={() => onToggle(s.id)}
            disabled={disabled}
            className={`flex-1 py-2 text-xs font-bold text-white rounded-md ${s.color} hover:opacity-90 transition-opacity ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}