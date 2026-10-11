import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/core/lib/cn';
import type { ComplaintCategory } from '../model/complaintAgency';

interface CategoryGuideProps {
  categories: readonly ComplaintCategory[];
  onOpenAgency: (slug: string) => void;
}

/** "Bingung harus mengadu ke mana?" — pilih masalah, tampilkan lembaga relevan. */
export function CategoryGuide({ categories, onOpenAgency }: CategoryGuideProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-sm">
      {categories.map((category) => {
        const open = openId === category.id;
        return (
          <div
            key={category.id}
            className="overflow-hidden rounded-lg border border-border bg-white"
          >
            <button
              type="button"
              aria-expanded={open}
              onClick={() => setOpenId(open ? null : category.id)}
              className="flex w-full items-center gap-sm p-md text-left"
            >
              <span className={cn('flex-1 text-title-sm', open ? 'text-primary' : 'text-ink')}>
                {category.problem}
              </span>
              <ChevronDown
                size={20}
                className={cn(
                  'shrink-0 text-primary transition-transform duration-fast',
                  open && 'rotate-180',
                )}
              />
            </button>
            {open ? (
              <div className="border-t border-border px-md pb-md pt-sm">
                <p className="text-label-sm uppercase text-ink-muted">Lembaga yang relevan</p>
                <div className="mt-xs flex flex-wrap gap-xs">
                  {category.agencies.map((agency) => (
                    <button
                      key={agency.slug}
                      type="button"
                      onClick={() => onOpenAgency(agency.slug)}
                      className="rounded-pill bg-primary-soft px-sm py-xs text-label-md font-bold text-primary"
                    >
                      {agency.shortName}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
