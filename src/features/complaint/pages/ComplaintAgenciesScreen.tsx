import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Headset } from 'lucide-react';
import { SegmentedTabs } from '@/core/components/SegmentedTabs';
import { Spinner } from '@/core/components/Spinner';
import { TopBar } from '@/core/components/TopBar';
import { useGetComplaintAgenciesQuery, useGetComplaintCategoriesQuery } from '../api/complaintApi';
import { AgencyCard } from '../components/AgencyCard';
import { CategoryGuide } from '../components/CategoryGuide';
import type { ComplaintAgency, ComplaintCategory } from '../model/complaintAgency';

const TAB_LABELS = ['Daftar Lembaga', 'Pilih Sesuai Masalah'];

export function ComplaintAgenciesScreen() {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const agencies = useGetComplaintAgenciesQuery();
  const categories = useGetComplaintCategoriesQuery();

  const openAgency = (slug: string) => navigate(`/complaint-agencies/${encodeURIComponent(slug)}`);

  return (
    <div className="flex min-h-full flex-col bg-background">
      <TopBar title="Layanan Pengaduan" onBack={() => navigate('/')} />

      <div className="px-screen pb-xl">
        <IntroCard />
        <div className="mt-lg">
          <SegmentedTabs labels={TAB_LABELS} activeIndex={tab} onChange={setTab} />
        </div>

        <div className="mt-lg">
          {tab === 0 ? (
            <AgencyList
              isLoading={agencies.isLoading}
              isError={agencies.isError}
              onRetry={() => void agencies.refetch()}
              items={agencies.data}
              onOpen={openAgency}
            />
          ) : (
            <CategoryList
              isLoading={categories.isLoading}
              isError={categories.isError}
              onRetry={() => void categories.refetch()}
              items={categories.data}
              onOpenAgency={openAgency}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function IntroCard() {
  return (
    <div className="flex items-center gap-md rounded-lg bg-primary p-md">
      <Headset size={36} className="shrink-0 text-white" />
      <div className="min-w-0 flex-1">
        <p className="text-title-md text-white">Butuh bantuan mengadu?</p>
        <p className="mt-xxs text-body-sm text-white/80">
          Hubungi lembaga resmi mitra Consumate yang sesuai dengan permasalahanmu.
        </p>
      </div>
    </div>
  );
}

function StateMessage({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center gap-sm pt-lg text-center">
      {onRetry ? <AlertCircle size={40} className="text-muted" /> : null}
      <p className="text-body-sm text-ink-muted">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="px-md py-xs text-label-md font-semibold text-primary"
        >
          Coba lagi
        </button>
      ) : null}
    </div>
  );
}

function Loading() {
  return (
    <div className="flex justify-center pt-xl">
      <Spinner />
    </div>
  );
}

function AgencyList({
  isLoading,
  isError,
  onRetry,
  items,
  onOpen,
}: {
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  items: readonly ComplaintAgency[] | undefined;
  onOpen: (slug: string) => void;
}) {
  if (isLoading) return <Loading />;
  if (isError) return <StateMessage message="Gagal memuat daftar lembaga." onRetry={onRetry} />;
  if (!items || items.length === 0) {
    return <StateMessage message="Belum ada lembaga pengaduan tersedia." />;
  }
  return (
    <div className="flex flex-col gap-sm">
      {items.map((agency) => (
        <AgencyCard key={agency.id} agency={agency} onTap={() => onOpen(agency.slug)} />
      ))}
    </div>
  );
}

function CategoryList({
  isLoading,
  isError,
  onRetry,
  items,
  onOpenAgency,
}: {
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  items: readonly ComplaintCategory[] | undefined;
  onOpenAgency: (slug: string) => void;
}) {
  if (isLoading) return <Loading />;
  if (isError) return <StateMessage message="Gagal memuat panduan." onRetry={onRetry} />;
  if (!items || items.length === 0) {
    return <StateMessage message="Belum ada panduan permasalahan tersedia." />;
  }
  return (
    <>
      <p className="mb-sm text-body-sm text-ink-muted">
        Bingung harus mengadu ke mana? Pilih jenis permasalahanmu untuk melihat lembaga yang
        relevan.
      </p>
      <CategoryGuide categories={items} onOpenAgency={onOpenAgency} />
    </>
  );
}
