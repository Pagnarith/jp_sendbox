"use client";

import { Gem } from "lucide-react";
import { useSendboxAuth } from "./SendboxAuthProvider";
import { SENDBOX_TEST_USERS, type SendboxRole } from "@/platform/auth/sendbox-mock-auth";

export function SendboxLoginScreen() {
  const { login } = useSendboxAuth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-rose-50 to-white p-6">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100">
          <Gem className="h-8 w-8 text-rose-500" />
        </div>
        <h1 className="text-xl font-bold text-stone-800">JP Sendbox</h1>
        <p className="mt-1 text-sm text-stone-500">
          Mock testing environment — select a test role to continue
        </p>

        <div className="mt-8 space-y-2">
          {SENDBOX_TEST_USERS.map((u) => (
            <button
              key={u.role}
              onClick={() => login(u.role as SendboxRole)}
              className="flex w-full items-center gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3 text-left transition-all hover:border-rose-300 hover:bg-rose-50 active:scale-[0.98]"
            >
              <RoleBadge role={u.role} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-stone-800">
                  {u.name}
                </div>
                <div className="truncate text-xs text-stone-500">
                  ID: {u.telegramId}
                </div>
              </div>
            </button>
          ))}
        </div>

        <p className="mt-6 text-[11px] text-stone-400">
          Browser-based auth • No Telegram required
        </p>
      </div>
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  const colors: Record<string, string> = {
    super_admin: "bg-purple-100 text-purple-700",
    admin: "bg-rose-100 text-rose-700",
    editor: "bg-blue-100 text-blue-700",
    creator: "bg-emerald-100 text-emerald-700",
    reader: "bg-stone-100 text-stone-600",
  };
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${colors[role] ?? "bg-stone-100 text-stone-600"}`}
    >
      {role.replace("_", " ")}
    </span>
  );
}