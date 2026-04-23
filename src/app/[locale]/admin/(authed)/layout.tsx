import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const auth = await isAdminAuthenticated();
  if (!auth) redirect(`/${locale}/admin/login`);

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar locale={locale} />
      <main className="flex-1 min-w-0 p-6 lg:p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
