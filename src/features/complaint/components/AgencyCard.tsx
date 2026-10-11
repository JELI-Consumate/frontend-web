import { ChevronRight } from 'lucide-react';
import { AgencyLogo } from './AgencyLogo';
import type { ComplaintAgency } from '../model/complaintAgency';

export function AgencyCard({ agency, onTap }: { agency: ComplaintAgency; onTap: () => void }) {
  return (
    <button
      type="button"
      onClick={onTap}
      className="flex w-full items-center gap-md rounded-lg border border-border bg-white p-md text-left"
    >
      <AgencyLogo logoUrl={agency.logoUrl} size={56} />
      <div className="min-w-0 flex-1">
        <span className="inline-block rounded-pill bg-primary-soft px-sm py-[3px] text-label-md font-bold text-primary">
          {agency.shortName}
        </span>
        <p className="mt-xxs line-clamp-2 text-title-sm text-ink">{agency.fullName}</p>
        <p className="mt-xxs line-clamp-2 text-body-sm text-ink-muted">{agency.summary}</p>
      </div>
      <ChevronRight size={20} className="shrink-0 text-primary" />
    </button>
  );
}
