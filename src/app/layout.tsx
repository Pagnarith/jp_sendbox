import type { Metadata, Viewport } from "next";
import { SendboxAuthProvider } from "@/components/SendboxAuthProvider";
import { SendboxAppShell } from "@/components/SendboxAppShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "JP Sendbox",
  description: "Mock testing environment for JP Cloud soft-switch failover",
  applicationName: "JP Sendbox",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#f43f5e",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-rose-50 text-stone-800">
        <SendboxAuthProvider>
          <SendboxAppShell>{children}</SendboxAppShell>
        </SendboxAuthProvider>
      </body>
    </html>
  );
}