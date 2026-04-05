import type { Metadata } from "next";
import Link from "next/link";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { LogoutButton } from "@/components/LogoutButton";
import { LoginButton } from "@/components/LoginButton";
import { AdminLink } from "@/components/AdminLink";
import { BrandMark } from "@/components/BrandMark";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://km-de-lucro.vercel.app",
  ),
  icons: {
    icon: [{ url: "/icon.svg?v=20260405", type: "image/svg+xml" }],
    shortcut: [{ url: "/icon.svg?v=20260405", type: "image/svg+xml" }],
  },
  title: {
    default: "KM de Lucro",
    template: "%s | KM de Lucro",
  },
  description:
    "Gestão financeira enxuta para motoristas autônomos: descubra lucro, margem e desempenho mensal de cada frete em segundos.",
  keywords: [
    "gestão financeira para motoristas",
    "lucro por frete",
    "calculadora de frete",
    "controle de custos de frete",
  ],
  openGraph: {
    title: "KM de Lucro",
    description:
      "Saia da planilha e veja margem, custos e lucro por viagem com uma interface feita para a rotina da estrada.",
    siteName: "KM de Lucro",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KM de Lucro",
    description:
      "Calculadora de rentabilidade e painel mensal para motoristas de carga.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${spaceGrotesk.variable} ${plexMono.variable} antialiased`}
      >
        <div className="min-h-screen">
          <header className="sticky top-0 z-40 border-b border-white/50 bg-[rgba(248,244,236,0.82)] backdrop-blur-xl">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
              <BrandMark compact />

              <nav className="hidden items-center gap-6 text-sm font-medium text-[color:var(--foreground-muted)] md:flex">
                <Link href="/" className="hover:text-[color:var(--km-blue)]">
                  Produto
                </Link>
                <Link
                  href="/planos"
                  className="hover:text-[color:var(--km-blue)]"
                >
                  Planos
                </Link>
                <Link href="/app" className="hover:text-[color:var(--km-blue)]">
                  Dashboard
                </Link>
              </nav>

              <div className="flex items-center gap-2">
                <LoginButton />
                <AdminLink />
                <LogoutButton />
              </div>
            </div>
          </header>
          <main className="mx-auto max-w-6xl px-4 py-8 md:py-10">{children}</main>
          <footer className="border-t border-white/50">
            <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-[color:var(--foreground-muted)] md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold text-[color:var(--km-blue)]">
                  KM de Lucro
                </p>
                <p>Gestão financeira feita para quem vive do frete.</p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <Link href="/" className="hover:text-[color:var(--km-blue)]">
                  Início
                </Link>
                <Link
                  href="/planos"
                  className="hover:text-[color:var(--km-blue)]"
                >
                  Planos
                </Link>
                <Link href="/login" className="hover:text-[color:var(--km-blue)]">
                  Login
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
