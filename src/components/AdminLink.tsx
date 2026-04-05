'use client';

import Link from "next/link";
import { useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

function isLocalHostname(hostname: string) {
  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1"
  ) {
    return true;
  }

  if (/^192\.168\.\d{1,3}\.\d{1,3}$/.test(hostname)) {
    return true;
  }

  if (/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) {
    return true;
  }

  const private172Match = hostname.match(/^172\.(\d{1,3})\.\d{1,3}\.\d{1,3}$/);

  if (!private172Match) {
    return false;
  }

  const secondOctet = Number(private172Match[1]);
  return secondOctet >= 16 && secondOctet <= 31;
}

function getSnapshot() {
  if (typeof window === "undefined") {
    return false;
  }

  return isLocalHostname(window.location.hostname);
}

export function AdminLink() {
  const show = useSyncExternalStore(subscribe, getSnapshot, () => false);

  if (!show) return null;

  return (
    <Link
      href="/admin/planos"
      className="hidden rounded-full border border-[rgba(16,37,48,0.12)] bg-white/70 px-4 py-2 text-xs font-semibold text-[color:var(--foreground-muted)] backdrop-blur hover:text-[color:var(--km-blue)] md:inline-flex"
    >
      Admin
    </Link>
  );
}
