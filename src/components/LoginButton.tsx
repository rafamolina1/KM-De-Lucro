'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function LoginButton() {
  const [visible, setVisible] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;

    void supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        setVisible(!data.session);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setVisible(!session);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <Link
      href="/login"
      className="hidden rounded-full border border-[rgba(16,37,48,0.12)] bg-white/70 px-4 py-2 text-xs font-semibold text-[color:var(--foreground)] backdrop-blur md:inline-flex"
    >
      Entrar
    </Link>
  );
}
