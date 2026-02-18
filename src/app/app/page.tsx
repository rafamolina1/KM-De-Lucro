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
      <p className="text-sm text-zinc-600">Carregando suas informações...</p>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-zinc-900">Seus fretes</h1>
      <FreightsDashboard />
    </div>
  );
}

