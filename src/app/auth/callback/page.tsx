'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth
      .getSession()
      .finally(() => {
        router.replace("/app");
      })
      .catch(() => {
        router.replace("/login");
      });
  }, [router]);

  return (
    <div className="mx-auto max-w-md rounded-xl bg-white p-6 text-center text-sm text-zinc-600 shadow-sm">
      Confirmando seu acesso...
    </div>
  );
}

