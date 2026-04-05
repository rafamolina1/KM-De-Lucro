'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import FreightsDashboard from "./ui/FreightsDashboard";

export default function AppPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace("/login");
      } else {
        setChecking(false);
      }
    });
  }, [router]);

  if (checking) {
    return (
      <div className="mx-auto flex min-h-[40vh] max-w-2xl items-center justify-center">
        <div className="km-panel-strong w-full rounded-[30px] px-6 py-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--km-green)]">
            Dashboard
          </p>
          <p className="mt-3 text-lg font-semibold text-[color:var(--km-blue-strong)]">
            Carregando suas informações...
          </p>
        </div>
      </div>
    );
  }

  return <FreightsDashboard />;
}
