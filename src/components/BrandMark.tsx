import Link from "next/link";

type BrandMarkProps = {
  compact?: boolean;
};

export function BrandMark({ compact = false }: BrandMarkProps) {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-3 text-[color:var(--foreground)]"
    >
      <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[20px] bg-[linear-gradient(160deg,#123f67_0%,#1d5d73_55%,#2b9f55_100%)] shadow-[0_18px_38px_-24px_rgba(15,37,48,0.9)]">
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.38),transparent_58%)]" />
        <span className="absolute left-2 top-2 h-2.5 w-2.5 rounded-full bg-[color:var(--km-yellow)] shadow-[0_0_20px_rgba(242,183,5,0.65)]" />
        <span className="absolute inset-x-2 bottom-3 h-[2px] rounded-full bg-white/70" />
        <span className="absolute right-1.5 top-1.5 h-5 w-5 rounded-full border border-white/20 bg-white/10" />
        <span className="relative text-[11px] font-black tracking-[0.34em] text-white">
          KM
        </span>
      </span>

      <span className="flex flex-col leading-none">
        <span className="text-sm font-semibold tracking-[0.16em] text-[color:var(--km-blue)]">
          KM DE LUCRO
        </span>
        {!compact && (
          <span className="mt-1 text-xs text-[color:var(--foreground-muted)]">
            Gestão enxuta de rentabilidade para fretes.
          </span>
        )}
      </span>
    </Link>
  );
}
