import { Sidebar } from "@/components/sidebar";
import { MobileSidebar } from "@/components/mobile-sidebar";
import { NotificationProvider } from "@/contexts/notification-context";
import { NotificationBell } from "@/components/notification-bell";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <NotificationProvider>
      <div className="flex h-full">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-white px-4 md:px-6">
            <MobileSidebar />
            <NotificationBell />
          </header>
          <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
        </div>
      </div>
    </NotificationProvider>
  );
}
