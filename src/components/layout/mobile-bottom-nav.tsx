"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Icon, type IconName } from "@/components/icons";

const navItems: { href: string; label: string; icon: IconName }[] = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/discover", label: "Discover", icon: "compass" },
  { href: "/library", label: "Library", icon: "bookmark" },
  { href: "/creators", label: "Creators", icon: "users" },
  { href: "/profile", label: "Profile", icon: "user" },
];

export function MobileBottomNav() {
  const pathname = usePathname() ?? "/";
  if (pathname.startsWith("/read/")) return null;

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed bottom-0 inset-x-0 z-30 md:hidden border-t border-[rgba(245,189,67,0.22)] bg-[rgba(5,7,10,0.92)] backdrop-blur-xl px-2 py-1.5"
    >
      <ul className="grid grid-cols-5 gap-1 m-0 p-0 list-none">
        {navItems.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={
                  "flex flex-col items-center justify-center min-h-[48px] rounded-[12px] text-[11px] font-medium transition-colors " +
                  (active
                    ? "text-[var(--gold-bright)] bg-[rgba(245,189,67,0.12)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-strong)]")
                }
              >
                <Icon name={item.icon} size={18} />
                <span className="mt-0.5">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
