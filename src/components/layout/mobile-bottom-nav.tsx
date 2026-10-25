"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Compass, Feather, Flame, Home } from "lucide-react";

const navItems = [
  { href: "/?explore=1", match: "/", label: "Hub", Icon: Home },
  { href: "/discover", match: "/discover", label: "Discover", Icon: Compass },
  {
    href: "/books",
    match: "/books",
    label: "Books",
    Icon: BookOpen,
  },
  { href: "/mature", match: "/mature", label: "18+", Icon: Flame },
  { href: "/welcome", match: "/welcome", label: "Founder", Icon: Feather },
];

export function MobileBottomNav() {
  const pathname = usePathname() ?? "/";

  if (pathname.startsWith("/read/")) {
    return null;
  }

  return (
    <nav
      aria-label="Mobile bottom navigation"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-white/10 bg-[#05080c]/90 backdrop-blur-2xl"
    >
      <ul className="grid grid-cols-5 m-0 p-1.5 list-none">
        {navItems.map(({ href, match, label, Icon }) => {
          const active =
            match === "/"
              ? pathname === "/"
              : pathname === match || pathname.startsWith(match + "/");
          return (
            <li key={label}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={
                  "flex flex-col items-center justify-center gap-1 min-h-[52px] rounded-xl text-[11px] font-bold transition-colors " +
                  (active
                    ? "text-[var(--gold-bright)] bg-[rgba(245,189,67,0.12)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-strong)]")
                }
              >
                <Icon className="w-[18px] h-[18px]" />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
