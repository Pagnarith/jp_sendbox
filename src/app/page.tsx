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
        <h2 className="text-xl font-semibold mb-4">Health Simulator</h2>
        <p className="text-slate-600 text-sm mb-4">
          Control what <code className="bg-slate-100 px-1 rounded">/api/health/live</code> returns to test failover scenarios.
        </p>
        <div className="flex flex-wrap gap-2">
          {["healthy", "updating", "live-down", "prefer-cloud", "cloud-down", "version-mismatch"].map(
            (state) => (
              <button
                key={state}
                onClick={() =>
                  fetch("/api/sendbox/health-control", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ state }),
                  }).then(() => window.location.reload())
                }
                className="px-3 py-1.5 text-sm rounded-md border border-slate-300 hover:bg-slate-100 transition-colors"
              >
                {state}
              </button>
            )
          )}
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