import Link from "next/link";
import type { ReactNode } from "react";

export const gradientButtonClassName =
  "inline-flex min-w-[194px] items-center justify-center rounded-full px-10 py-3.5 text-[1.02rem] font-black tracking-[-0.02em] text-white shadow-[0_14px_34px_rgba(95,106,255,0.22)] transition-all duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50";

export const gradientButtonStyle = {
  background: "linear-gradient(90deg, #8b46ff 0%, #2f9bff 100%)",
};

export function GradientLinkButton({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`${gradientButtonClassName} ${className}`.trim()}
      style={gradientButtonStyle}
    >
      {children}
    </Link>
  );
}
