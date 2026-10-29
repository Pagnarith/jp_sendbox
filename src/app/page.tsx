import Link from "next/link";
import { listContacts, listProducts, listOrders } from "@/platform/dataverse/sendbox-store";
import { NetworkSimulator } from "./network-simulator";
import { ShoppingBag, Users, Package, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

export default function SendboxHomePage() {
  const contacts = listContacts();
  const products = listProducts();
  const orders = listOrders();

  return (
    <div className="space-y-6 px-4">
      {/* Stats grid matching production dashboard style */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="Contacts"
          value={contacts.length}
          href="/contacts"
          icon={Users}
          color="text-blue-600"
          bg="bg-blue-50"
        />
        <StatCard
          label="Products"
          value={products.length}
          href="/products?status=bought"
          icon={Package}
          color="text-emerald-600"
          bg="bg-emerald-50"
        />
        <StatCard
          label="Orders"
          value={orders.length}
          href="/orders"
          icon={ShoppingBag}
          color="text-rose-600"
          bg="bg-rose-50"
        />
        <StatCard
          label="Revenue"
          value="—"
          href="/reports"
          icon={TrendingUp}
          color="text-amber-600"
          bg="bg-amber-50"
        />
      </div>

      {/* Network Failover Simulator — sendbox-specific testing tool */}
      <NetworkSimulator />
    </div>
  );
}

function StatCard({
  label,
  value,
  href,
  icon: Icon,
  color,
  bg,
}: {
  label: string;
  value: string | number;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl border border-stone-200/80 bg-white p-4 shadow-sm transition-all hover:border-rose-200 hover:shadow-md active:scale-[0.98]"
    >
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${bg}`}>
        <Icon className={`h-5 w-5 ${color}`} />
      </div>
      <div className="min-w-0">
        <div className="text-xs font-medium text-stone-500">{label}</div>
        <div className="text-xl font-bold text-stone-800">{value}</div>
      </div>
    </Link>
  );
}