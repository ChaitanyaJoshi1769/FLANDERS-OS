'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { Bell, Settings } from 'lucide-react';

export default function DashboardNav() {
  const auth = useSelector((state: RootState) => state.auth);

  return (
    <nav className="border-b border-slate-800 bg-slate-900 px-8 py-4 flex items-center justify-between">
      <h2 className="text-lg font-semibold text-slate-100">
        {auth.user?.firstName} {auth.user?.lastName}
      </h2>
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-slate-800 rounded-lg transition">
          <Bell className="w-5 h-5 text-slate-400" />
        </button>
        <button className="p-2 hover:bg-slate-800 rounded-lg transition">
          <Settings className="w-5 h-5 text-slate-400" />
        </button>
      </div>
    </nav>
  );
}
