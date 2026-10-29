import { listOrders } from "@/platform/dataverse/sendbox-store";

export const dynamic = "force-dynamic";

export default function OrdersPage() {
  const orders = listOrders();

  return (
    <div className="px-4 space-y-4">
      <h2 className="text-lg font-bold text-stone-800">Orders</h2>
      {orders.length === 0 ? (
        <div className="rounded-xl border border-stone-200 bg-white p-8 text-center">
          <p className="text-sm text-stone-500">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-stone-800">
                  Order #{order.id.slice(0, 8)}
                </span>
                <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold uppercase text-rose-700">
                  {order.status}
                </span>
              </div>
              <div className="mt-1 text-xs text-stone-500">
                Qty: {order.quantity} • {order.notes || "No notes"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}