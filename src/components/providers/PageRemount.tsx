"use client";

import { usePathname } from "next/navigation";

export default function PageRemount({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return <div key={pathname}>{children}</div>;
}
