import type { ComponentType } from 'react';
import { Home, BookOpenText, Award, User, type LucideProps } from 'lucide-react';
import { useAppDispatch, useAppSelector } from './hooks';
import { cn } from '@/core/lib/cn';
import { selectTab } from '@/features/main/state/mainTabSlice';
import { DashboardScreen } from '@/features/main/pages/DashboardScreen';
import { JourneysScreen } from '@/features/main/pages/JourneysScreen';
import { ProfileScreen } from '@/features/main/pages/ProfileScreen';
import { BadgesScreen } from '@/features/badges/pages/BadgesScreen';

interface NavItem {
  icon: ComponentType<LucideProps>;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { icon: Home, label: 'Beranda' },
  { icon: BookOpenText, label: 'Perjalanan' },
  { icon: Award, label: 'Pencapaian' },
  { icon: User, label: 'Profil' },
];

/** Padanan `main_shell.dart` (IndexedStack + bottom nav). */
export function MainShell() {
  const dispatch = useAppDispatch();
  const index = useAppSelector((s) => s.mainTab.index);

  return (
    <div className="flex min-h-full flex-col bg-background">
      {/* IndexedStack: keempat tab tetap terpasang, hanya yang aktif terlihat. */}
      <div className="flex-1 overflow-y-auto pb-xxxxl">
        <div className={cn(index !== 0 && 'hidden')}>
          <DashboardScreen />
        </div>
        <div className={cn(index !== 1 && 'hidden')}>
          <JourneysScreen />
        </div>
        <div className={cn(index !== 2 && 'hidden')}>
          <BadgesScreen />
        </div>
        <div className={cn(index !== 3 && 'hidden')}>
          <ProfileScreen />
        </div>
      </div>

      <nav className="fixed bottom-0 z-20 w-full max-w-app bg-white shadow-navbar">
        <div className="flex h-xxxxl items-stretch">
          {NAV_ITEMS.map((item, i) => {
            const selected = i === index;
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => dispatch(selectTab(i))}
                className="relative flex flex-1 flex-col items-center justify-center gap-xxs"
              >
                {selected ? (
                  <span className="absolute top-0 h-[4px] w-[32px] rounded-pill bg-primary" />
                ) : null}
                <Icon size={24} className={selected ? 'text-primary' : 'text-ink-muted'} />
                <span
                  className={cn(
                    'text-label-md',
                    selected ? 'font-bold text-primary' : 'font-medium text-ink-muted',
                  )}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
