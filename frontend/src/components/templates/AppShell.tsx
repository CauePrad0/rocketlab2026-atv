import type { ReactNode } from 'react';

import { SidebarNav } from '@/components/organisms/SidebarNav';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[var(--color-page)] text-[var(--color-ink)]">
      <div className="flex min-h-screen">
        <SidebarNav />
        <main className="flex-1">
          <div className="min-h-screen px-5 py-6 md:px-10 md:py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
