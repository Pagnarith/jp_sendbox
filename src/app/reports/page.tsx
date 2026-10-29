export default function ReportsPage() {
  return (
    <div className="px-4 space-y-4">
      <h2 className="text-lg font-bold text-stone-800">Reports</h2>
      <div className="space-y-3">
        {[
          { label: "Sale Revenue", desc: "Bought + Unpaid sales by seller or invoice type" },
          { label: "Returned & Changed", desc: "Return/changed totals with share allocation" },
          { label: "By Contact", desc: "Yearly bought report including changed products" },
        ].map((report) => (
          <div
            key={report.label}
            className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm"
          >
            <div className="text-sm font-semibold text-stone-800">{report.label}</div>
            <div className="mt-1 text-xs text-stone-500">{report.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}