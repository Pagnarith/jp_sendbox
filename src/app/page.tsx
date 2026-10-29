import Link from "next/link";
import { listContacts, listProducts, listOrders } from "@/platform/dataverse/sendbox-store";
import { SENDBOX_TEST_USERS } from "@/platform/auth/sendbox-mock-auth";

export const dynamic = "force-dynamic";

export default function SendboxHomePage() {
  const contacts = listContacts();
  const products = listProducts();
  const orders = listOrders();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 p-6">
      <header className="max-w-4xl mx-auto mb-8">
        <h1 className="text-3xl font-bold tracking-tight">JP Sendbox</h1>
        <p className="text-slate-600 mt-2">
          Mock testing environment for JP Cloud soft-switch failover debugging.
        </p>
      </header>

      <section className="max-w-4xl mx-auto grid gap-6 md:grid-cols-3 mb-10">
        <StatCard label="Contacts" value={contacts.length} href="/contacts" />
        <StatCard label="Products" value={products.length} href="/products" />
        <StatCard label="Orders" value={orders.length} href="/orders" />
      </section>

      <section className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-10">
        <h2 className="text-xl font-semibold mb-4">Test Credentials</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr>
                <th className="py-2 pr-4">Role</th>
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Telegram ID</th>
                <th className="py-2">Header Value</th>
              </tr>
            </thead>
            <tbody>
              {SENDBOX_TEST_USERS.map((u) => (
                <tr key={u.telegramId} className="border-b border-slate-100 last:border-0">
                  <td className="py-2 pr-4 font-medium">{u.role}</td>
                  <td className="py-2 pr-4">{u.name}</td>
                  <td className="py-2 pr-4 font-mono text-xs">{u.telegramId}</td>
                  <td className="py-2 font-mono text-xs text-slate-500">
                    x-sendbox-test-user: {u.role}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Network Failover Simulator</h2>
        <p className="text-slate-600 text-sm mb-6">
          Toggle Live and Cloud states independently to visually verify soft-switch failover behavior.
          The active API base indicator below updates in real time as you toggle states.
        </p>

        {/* Visual Network Topology */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <NetworkNode
            label="Live Mini Server"
            states={[
              { id: "healthy", label: "ON", color: "bg-emerald-500" },
              { id: "updating", label: "UPDATING", color: "bg-amber-500" },
              { id: "live-down", label: "OFF", color: "bg-red-500" },
            ]}
            endpoint="/api/sendbox/health-control"
          />
          <NetworkNode
            label="Cloud VPS"
            states={[
              { id: "healthy", label: "ON", color: "bg-emerald-500" },
              { id: "cloud-down", label: "OFF", color: "bg-red-500" },
              { id: "version-mismatch", label: "VERSION LAG", color: "bg-orange-500" },
            ]}
            endpoint="/api/sendbox/health-control"
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
                onClick={() =>
                  fetch("/api/sendbox/health-control", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ state: scenario.state }),
                  }).then(() => window.location.reload())
                }
                className="px-3 py-1.5 text-xs font-medium rounded-md border border-slate-300 hover:bg-slate-100 hover:border-slate-400 transition-all"
              >
                {scenario.label}
              </button>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function StatCard({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link
      href={href}
      className="block bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
    >
      <div className="text-slate-500 text-sm font-medium">{label}</div>
      <div className="text-3xl font-bold mt-1">{value}</div>
    </Link>
  );
}

function NetworkNode({
  label,
  states,
  endpoint,
}: {
  label: string;
  states: { id: string; label: string; color: string }[];
  endpoint: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <div className="text-sm font-semibold text-slate-700 mb-3">{label}</div>
      <div className="flex gap-2">
        {states.map((s) => (
          <button
            key={s.id}
            onClick={() =>
              fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ state: s.id }),
              }).then(() => window.location.reload())
            }
            className={`flex-1 py-2 text-xs font-bold text-white rounded-md ${s.color} hover:opacity-90 transition-opacity`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}