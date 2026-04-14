import { Package } from 'lucide-react';
import { NavLink } from 'react-router-dom';

import { navigationItems } from '@/constants/navigation';

export function SidebarNav() {
  return (
    <aside className="hidden w-[250px] shrink-0 border-r border-[var(--color-border)] bg-white px-6 py-8 md:flex md:flex-col">
      <div>
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-[var(--color-primary-soft)] p-3 text-[var(--color-primary)]">
            <Package size={24} />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-[var(--color-ink)]">Gerenciamento de E-Commerce</h1>
          </div>
        </div>

        <p className="mt-6 text-sm leading-6 text-[var(--color-ink-soft)]">
          Dashboard e catalogo para gerir melhor o E-commerce
        </p>
      </div>

      <nav className="mt-10 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                [
                  'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition',
                  isActive
                    ? 'bg-[var(--color-primary-soft)] text-[var(--color-primary)]'
                    : 'text-[var(--color-ink-soft)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-ink)]',
                ].join(' ')
              }
            >
              <Icon size={18} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
