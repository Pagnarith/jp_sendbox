import { SENDBOX_TEST_USERS } from "@/platform/auth/sendbox-mock-auth";

export default function SettingsPage() {
  return (
    <div className="px-4 space-y-4">
      <h2 className="text-lg font-bold text-stone-800">Settings</h2>

      <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-stone-800 mb-3">Test Credentials</h3>
        <div className="space-y-2">
          {SENDBOX_TEST_USERS.map((u) => (
            <div key={u.telegramId} className="flex items-center justify-between text-xs">
              <span className="font-medium text-stone-700">{u.name}</span>
              <span className="rounded bg-stone-100 px-1.5 py-0.5 font-mono text-[10px] text-stone-500">
                {u.role}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-stone-800 mb-2">About Sendbox</h3>
        <p className="text-xs text-stone-500 leading-relaxed">
          JP Sendbox is a mock testing environment that mirrors the production JP Jewelry app.
          It uses browser-based authentication instead of Telegram Mini App SDK and includes
          a network failover simulator for testing Cloud soft-switch behavior.
        </p>
      </div>
    </div>
  );
}