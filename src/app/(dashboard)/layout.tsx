import { AppStateProvider } from "@/context/AppStateContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { ToastHost } from "@/components/ui/ToastHost";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppStateProvider>
      <div className="flex h-screen min-h-0 overflow-hidden">
        <Sidebar />
        <main className="flex min-h-0 min-w-0 flex-1 flex-col">{children}</main>
        <ToastHost />
      </div>
    </AppStateProvider>
  );
}
