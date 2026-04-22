import Link from "next/link";
import type { ReactNode } from "react";

interface BrandHeaderProps {
  action?: ReactNode;
  maxWidthClassName?: string;
}

export function BrandHeader({ action, maxWidthClassName = "max-w-6xl" }: BrandHeaderProps) {
  return (
    <header className="border-b border-[#ebeefe] bg-white/85 px-6 py-4 backdrop-blur-sm">
      <div className={`mx-auto flex items-center justify-between gap-4 ${maxWidthClassName}`}>
        <Link href="/" className="shrink-0 transition-opacity hover:opacity-85" aria-label="UI/UX AI診断 トップへ">
          <img src="/images/main.svg" alt="UI/UX AI診断" className="h-auto w-[172px]" />
        </Link>
        {action ? <div className="flex items-center gap-3">{action}</div> : null}
      </div>
    </header>
  );
}
