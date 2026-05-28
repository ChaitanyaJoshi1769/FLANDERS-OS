'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Zap, Cog, AlertTriangle, Home } from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/fleets', label: 'Fleets', icon: BarChart3 },
  { href: '/electrification', label: 'Electrification', icon: Zap },
  { href: '/automation', label: 'Automation', icon: Cog },
  { href: '/safety', label: 'Safety', icon: AlertTriangle },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-blue-400">FLANDERS</h1>
        <p className="text-xs text-slate-400 mt-1">Industrial OS</p>
      </div>

      <nav className="space-y-2 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-800 pt-4">
        <button className="w-full px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded-lg transition">
          Logout
        </button>
      </div>
    </aside>
  );
}
