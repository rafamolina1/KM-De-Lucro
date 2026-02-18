import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LogoutButton } from "@/components/LogoutButton";
import { AdminLink } from "@/components/AdminLink";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KM de Lucro",
  description: "Calculadora simples de lucro por frete para motoristas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[color:var(--background)] text-[color:var(--foreground)]`}
      >
        <div className="min-h-screen">
          <header className="border-b bg-white/95 shadow-sm backdrop-blur">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--km-green)] text-white text-xs font-semibold">
                  KM
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-semibold tracking-tight text-[color:var(--km-blue)]">
                    KM de LUCRO
                  </span>
                  <span className="text-xs text-zinc-500">
                    Descubra quanto você realmente lucra
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/planos"
                  className="hidden text-xs font-medium text-[color:var(--km-blue)] underline-offset-2 hover:underline md:inline-block"
                >
                  Ver planos
                </Link>
                <AdminLink />
                <LogoutButton />
              </div>
            </div>
          </header>
          <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
        </div>
      </body>
    </html>
  );
}

