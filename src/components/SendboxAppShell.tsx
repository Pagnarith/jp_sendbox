"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  ChartColumn,
  Gem,
  Home,
  LogOut,
  Package,
  Settings2,
  ShoppingBag,
  Users,
} from "lucide-react";
import { useSendboxAuth } from "./SendboxAuthProvider";
import { SendboxLoginScreen } from "./SendboxLoginScreen";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/orders", label: "Orders", icon: ShoppingBag },
  { href: "/contacts", label: "Contacts", icon: Users },
  { href: "/products?status=bought", label: "Products", icon: Package },
  { href: "/charts", label: "Charts", icon: ChartColumn },
  { href: "/reports", label: "Reports", icon: BarChart3 },
];

export function SendboxAppShell({ children }: { children: React.ReactNode }) {
  const { isReady, isAuthorized, user, logout, isReadOnly } = useSendboxAuth();
  const pathname = usePathname();

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-rose-50 to-white">
        <Gem className="h-10 w-10 animate-pulse text-rose-400" />
      </div>
    );
  }

  if (!isAuthorized) {
    return <SendboxLoginScreen />;
  }

  return (
    <div className="min-h-screen bg-rose-50 text-stone-800">
      {/* Header matching production MiniAppChromeHeader */}
      <header className="sticky top-0 z-40 border-b border-rose-200/60 bg-white/95 backdrop-blur-md safe-top">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100">
              <Gem className="h-4.5 w-4.5 text-rose-600" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-bold text-stone-800">JP Jewelry</h1>
                <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-1.5 py-px text-[9px] font-bold uppercase tracking-wide text-amber-700">
                  Sendbox
                </span>
              </div>
              <p className="text-[11px] text-stone-500">
                {user.name} • {user.role.replace("_", " ")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {isReadOnly && (
              <span className="inline-flex items-center gap-0.5 truncate rounded-full border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[9px] font-semibold text-amber-900">
                Read Only
              </span>
            )}
            <Link
              href="/settings"
              className={`rounded-lg border p-1.5 transition-colors ${
                pathname === "/settings"
                  ? "border-rose-300 bg-rose-50 text-rose-700"
                  : "border-rose-200/80 bg-white text-rose-600 hover:bg-rose-50"
              }`}
            >
              <Settings2 className="h-3.5 w-3.5" />
            </Link>
            <button
              onClick={logout}
              className="rounded-lg border border-rose-200/80 bg-white p-1.5 text-rose-600 transition-colors hover:bg-rose-50"
              title="Sign out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Page content with bottom padding for nav */}
      <main className="mx-auto max-w-lg pb-24 pt-4">{children}</main>

      {/* Bottom navigation matching production BottomNav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-rose-200/60 bg-white/95 backdrop-blur-md safe-bottom">
        <div className="mx-auto flex max-w-lg items-center justify-around px-1 py-2">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/products?status=bought"
                ? pathname === "/products"
                : pathname === href;
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-1 py-2 text-[11px] transition-colors ${
                  active
                    ? "text-rose-600"
                    : "text-stone-500 hover:text-rose-500"
                }`}
              >
                <Icon className={`h-5 w-5 ${active ? "fill-rose-100" : ""}`} />
                <span className="truncate font-medium">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}