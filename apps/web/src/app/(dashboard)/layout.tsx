import DashboardNav from '@/components/layout/DashboardNav';
import Sidebar from '@/components/layout/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-950">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <DashboardNav />
        <div className="flex-1 overflow-auto p-8">{children}</div>
      </main>
    </div>
  );
}
