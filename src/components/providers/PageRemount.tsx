"use client";

import { usePathname } from "next/navigation";

export default function PageRemount({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return <div key={pathname} className="flex-1 flex flex-col">{children}</div>;
}
