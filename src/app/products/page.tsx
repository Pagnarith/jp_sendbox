import { listProducts } from "@/platform/dataverse/sendbox-store";

export const dynamic = "force-dynamic";

export default function ProductsPage() {
  const products = listProducts();

  return (
    <div className="px-4 space-y-4">
      <h2 className="text-lg font-bold text-stone-800">Products</h2>
      {products.length === 0 ? (
        <div className="rounded-xl border border-stone-200 bg-white p-8 text-center">
          <p className="text-sm text-stone-500">No products yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {products.map((product) => (
            <div
              key={product.id}
              className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-stone-800">
                  {product.name}
                </span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-700">
                  {product.status}
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between text-xs text-stone-500">
                <span>{product.category}</span>
                <span className="font-medium text-stone-700">
                  ${product.price.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}