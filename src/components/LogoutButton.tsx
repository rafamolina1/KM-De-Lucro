'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let mounted = true;

    void supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        setVisible(Boolean(data.session));
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setVisible(Boolean(session));
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
    router.replace("/");
  };

  if (!visible) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="rounded-full border border-[rgba(16,37,48,0.12)] bg-[color:var(--km-blue)] px-4 py-2 text-xs font-semibold text-white shadow-[0_18px_34px_-26px_rgba(18,63,103,0.9)] hover:bg-[color:var(--km-blue-strong)] disabled:opacity-60"
    >
      {loading ? "Saindo..." : "Sair"}
    </button>
  );
}
