"use client";

import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CalendarDays,
  Star,
  Image as ImageIcon,
  BookOpen,
  LogOut,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "" },
  { label: "Bookings", icon: BookOpen, path: "/bookings" },
  { label: "Calendar", icon: CalendarDays, path: "/calendar" },
  { label: "Reviews", icon: Star, path: "/reviews" },
  { label: "Portfolio", icon: ImageIcon, path: "/portfolio" },
];

export default function AdminSidebar({ locale }: { locale: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const base = `/${locale}/admin`;

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push(`/${locale}/admin/login`);
  }

  return (
    <aside className="w-56 shrink-0 bg-secondary flex flex-col h-screen sticky top-0">
      {/* Brand */}
      <div className="px-5 py-6 border-b border-white/10">
        <p className="font-accent text-accent text-xl">BraidedByMae</p>
        <p className="text-xs text-white/40 mt-0.5">Admin Dashboard</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const href = `${base}${item.path}`;
          const isActive = item.path === ""
            ? pathname === base || pathname === `${base}/`
            : pathname.startsWith(href);

          return (
            <a
              key={item.path}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/15 text-primary"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </a>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Logout
        </button>
      </div>
    </aside>
  );
}
