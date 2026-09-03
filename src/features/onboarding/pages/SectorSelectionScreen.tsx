import { useState } from 'react';
import { Trophy, Check, ShieldCheck } from 'lucide-react';
import { useAppDispatch } from '@/app/hooks';
import { Spinner } from '@/core/components/Spinner';
import { PrimaryButton } from '@/core/components/PrimaryButton';
import { cn } from '@/core/lib/cn';
import { useGetSectorsQuery } from '@/features/learning/api/learningApi';
import type { Sector } from '@/features/learning/model/sector';
import { selectSector } from '../state/activeSectorSlice';
import { sectorColor, sectorIcon } from '../lib/sectorVisual';

/** Padanan `sector_selection_screen.dart`. */
export function SectorSelectionScreen() {
  const dispatch = useAppDispatch();
  const { data: sectors, isError, refetch, isLoading } = useGetSectorsQuery();

  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function confirm(slug: string) {
    if (saving) return;
    setSaving(true);
    // AppRoot rebuild ke MainShell -> layar ini dibuang, tak perlu reset saving.
    dispatch(selectSector(slug));
  }

  return (
    <div className="flex min-h-full flex-col bg-background">
      <div className="px-screen pb-lg pt-md">
        <Header />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        {isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <Spinner />
          </div>
        ) : isError ? (
          <ErrorState onRetry={() => void refetch()} />
        ) : !sectors || sectors.length === 0 ? (
          <EmptyState />
        ) : (
          <Content
            sectors={sectors}
            selectedSlug={selectedSlug ?? sectors[0]!.slug}
            saving={saving}
            onSelect={setSelectedSlug}
            onConfirm={confirm}
          />
        )}
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="flex items-start gap-md">
      <div className="flex-1">
        <h1 className="text-display-md text-primary">Pilih sektor yang akan kamu pelajari</h1>
        <p className="mt-xs text-body-sm text-ink-muted">
          Pilih satu sektor pembelajaran. Seluruh materi, simulasi, dan evaluasi akan
          disesuaikan dengan sektor yang kamu pilih.
        </p>
      </div>
      <div className="flex h-48 w-48 shrink-0 items-center justify-center rounded-full bg-primary-soft">
        <Trophy size={24} className="text-primary" />
      </div>
    </div>
  );
}

function Content({
  sectors,
  selectedSlug,
  saving,
  onSelect,
  onConfirm,
}: {
  sectors: Sector[];
  selectedSlug: string;
  saving: boolean;
  onSelect: (slug: string) => void;
  onConfirm: (slug: string) => void;
}) {
  const selected = sectors.find((s) => s.slug === selectedSlug) ?? sectors[0]!;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 overflow-y-auto px-screen pb-lg">
        <div className="grid grid-cols-2 gap-sm">
          {sectors.map((sector) => (
            <SectorCard
              key={sector.slug}
              sector={sector}
              selected={sector.slug === selectedSlug}
              onTap={saving ? undefined : () => onSelect(sector.slug)}
            />
          ))}
        </div>
      </div>
      <SelectionPanel
        sector={selected}
        saving={saving}
        onConfirm={() => onConfirm(selected.slug)}
      />
    </div>
  );
}

function SectorCard({
  sector,
  selected,
  onTap,
}: {
  sector: Sector;
  selected: boolean;
  onTap?: () => void;
}) {
  const tint = sectorColor(sector.color);

  return (
    <button
      type="button"
      onClick={onTap}
      disabled={!onTap}
      className={cn(
        'flex min-h-[208px] flex-col items-center rounded-lg border bg-white p-md text-center transition',
        selected ? 'border-[1.6px] border-primary shadow-card' : 'border-border',
      )}
    >
      <SectorIconBubble sector={sector} tint={tint} checked={selected} size={56} />
      <div className="h-sm" />
      <span className="line-clamp-2 text-title-sm text-ink">{sector.name}</span>
      {sector.description ? (
        <span className="mt-xs line-clamp-3 text-label-sm text-ink-muted">
          {sector.description}
        </span>
      ) : null}
    </button>
  );
}

function SectorIconBubble({
  sector,
  tint,
  checked,
  size,
}: {
  sector: Sector;
  tint: string;
  checked: boolean;
  size: number;
}) {
  const Icon = sectorIcon(sector.name);
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <div
        className="flex h-full w-full items-center justify-center rounded-full"
        style={{ backgroundColor: `color-mix(in srgb, ${tint} 12%, transparent)` }}
      >
        <Icon size={Math.round(size * 0.46)} style={{ color: tint }} />
      </div>
      {checked ? (
        <span className="absolute -left-[2px] -top-[2px] flex h-20 w-20 items-center justify-center rounded-full bg-primary">
          <Check size={13} className="text-white" />
        </span>
      ) : null}
    </div>
  );
}

function SelectionPanel({
  sector,
  saving,
  onConfirm,
}: {
  sector: Sector;
  saving: boolean;
  onConfirm: () => void;
}) {
  const tint = sectorColor(sector.color);

  return (
    <div className="rounded-t-xl bg-background shadow-navbar">
      <div className="px-screen pb-md pt-sm">
        <div className="mx-auto h-[4px] w-36 rounded-pill bg-muted" />
        <div className="h-md" />
        <div className="max-h-[36vh] overflow-y-auto">
          <div className="flex items-center gap-md">
            <SectorIconBubble sector={sector} tint={tint} checked size={48} />
            <div className="min-w-0 flex-1">
              <p className="text-body-sm text-ink-muted">Kamu memilih</p>
              <p className="line-clamp-2 text-display-md" style={{ color: tint }}>
                {sector.name}
              </p>
            </div>
          </div>
          {sector.description ? (
            <>
              <div className="h-md" />
              <p className="text-title-sm text-ink">Di sektor ini kamu akan belajar tentang:</p>
              <div className="h-xs" />
              <p className="line-clamp-3 text-body-sm text-ink-muted">{sector.description}</p>
            </>
          ) : null}
          <div className="h-md" />
          <div className="flex items-start gap-xs rounded-md bg-primary-soft p-sm">
            <ShieldCheck size={18} className="shrink-0 text-primary" />
            <p className="text-label-sm text-ink-muted">
              Pilihan sektor ini akan menjadi jalur pembelajaranmu selama proses belajar.
            </p>
          </div>
        </div>
        <div className="h-md" />
        <PrimaryButton
          label="Mulai Belajar"
          isLoading={saving}
          onPressed={saving ? null : onConfirm}
        />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-1 items-center justify-center p-lg">
      <p className="text-center text-body-sm text-ink-muted">
        Belum ada sektor pembelajaran tersedia. Coba lagi nanti.
      </p>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-1 items-center justify-center p-lg">
      <div className="flex flex-col items-center">
        <p className="text-center text-body-sm text-ink-muted">Gagal memuat daftar sektor.</p>
        <div className="h-sm" />
        <button
          type="button"
          onClick={onRetry}
          className="px-md py-xs text-label-md font-semibold text-primary"
        >
          Coba lagi
        </button>
      </div>
    </div>
  );
}
