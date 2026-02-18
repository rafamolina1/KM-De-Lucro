'use client';

import Link from "next/link";
import { useEffect, useState } from "react";

export function AdminLink() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(window.location.hostname === "localhost");
  }, []);

  if (!show) return null;

  return (
    <Link
      href="/admin/planos"
      className="hidden text-xs font-medium text-zinc-500 underline-offset-2 hover:underline md:inline-block"
    >
      Admin
    </Link>
  );
}

