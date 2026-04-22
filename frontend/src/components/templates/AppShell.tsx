import type { ReactNode } from 'react';
import { Package } from 'lucide-react';
import { NavLink } from 'react-router-dom';

import { SidebarNav } from '@/components/organisms/SidebarNav';
import { navigationItems } from '@/constants/navigation';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[var(--color-page)] text-[var(--color-ink)]">
      <div className="flex min-h-screen">
        <SidebarNav />
        <main className="flex-1">
          <div className="border-b border-[var(--color-border)] bg-white px-5 py-4 md:hidden">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[var(--color-primary-soft)] p-3 text-[var(--color-primary)]">
                <Package size={20} />
              </div>
              <div>
                <h1 className="text-base font-semibold text-[var(--color-ink)]">Gerenciamento de E-Commerce</h1>
                <p className="text-xs text-[var(--color-ink-soft)]">Catalogo, dashboard e analista</p>
              </div>
            </div>

            <nav className="mt-4 grid grid-cols-3 gap-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      [
                        'flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-xs font-semibold transition',
                        isActive
                          ? 'bg-[var(--color-primary-soft)] text-[var(--color-primary)]'
                          : 'bg-[var(--color-surface-muted)] text-[var(--color-ink-soft)]',
                      ].join(' ')
                    }
                  >
                    <Icon size={16} />
                    {item.label}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          <div className="min-h-screen px-5 py-6 md:px-10 md:py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
