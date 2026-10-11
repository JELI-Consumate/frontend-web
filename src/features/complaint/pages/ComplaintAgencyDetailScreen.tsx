import { useNavigate, useParams } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, ListChecks } from 'lucide-react';
import { Spinner } from '@/core/components/Spinner';
import { TopBar } from '@/core/components/TopBar';
import { isApiError } from '@/api/apiError';
import { useGetComplaintAgencyDetailQuery } from '../api/complaintApi';
import { AgencyLogo } from '../components/AgencyLogo';
import { ChannelCard } from '../components/ChannelCard';
import type { ComplaintAgencyDetail } from '../model/complaintAgency';

export function ComplaintAgencyDetailScreen() {
  const { slug = '' } = useParams();
  const navigate = useNavigate();
  const query = useGetComplaintAgencyDetailQuery(slug);

  const notFound = query.isError && isApiError(query.error) && query.error.statusCode === 404;

  return (
    <div className="flex min-h-full flex-col bg-background">
      <TopBar title={query.data?.shortName ?? 'Detail Lembaga'} onBack={() => navigate(-1)} />
      {query.isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <Spinner />
        </div>
      ) : query.isError || !query.data ? (
        <div className="p-screen pt-xxl text-center">
          <p className="text-body-sm text-ink-muted">
            {notFound
              ? 'Lembaga ini tidak ditemukan atau sudah tidak tersedia.'
              : 'Gagal memuat detail lembaga. Coba lagi nanti.'}
          </p>
          {notFound ? null : (
            <button
              type="button"
              onClick={() => void query.refetch()}
              className="mt-sm px-md py-xs text-label-md font-semibold text-primary"
            >
              Coba lagi
            </button>
          )}
        </div>
      ) : (
        <AgencyDetailBody agency={query.data} />
      )}
    </div>
  );
}

function SectionTitle({ children }: { children: string }) {
  return <h2 className="text-title-md text-ink">{children}</h2>;
}

function AgencyDetailBody({ agency }: { agency: ComplaintAgencyDetail }) {
  return (
    <div className="px-screen pb-xl pt-0">
      <div className="flex items-center gap-md">
        <AgencyLogo logoUrl={agency.logoUrl} size={72} />
        <div className="min-w-0 flex-1">
          <span className="inline-block rounded-pill bg-primary px-sm py-xxs text-label-md text-white">
            {agency.shortName}
          </span>
          <h1 className="mt-xs text-title-lg leading-snug text-primary">{agency.fullName}</h1>
        </div>
      </div>
      {agency.summary ? (
        <p className="mt-md text-body-sm text-ink-muted">{agency.summary}</p>
      ) : null}

      {agency.description ? (
        <section className="mt-lg">
          <SectionTitle>Tentang Lembaga</SectionTitle>
          <p className="mt-xs text-justify text-body-md text-ink">{agency.description}</p>
        </section>
      ) : null}

      {agency.whenToContact.length > 0 ? (
        <section className="mt-lg">
          <SectionTitle>Kapan Perlu Menghubungi?</SectionTitle>
          <ul className="mt-xs flex flex-col gap-xs">
            {agency.whenToContact.map((item) => (
              <li key={item} className="flex items-start gap-xs">
                <CheckCircle2 size={18} className="mt-[3px] shrink-0 text-success" />
                <span className="text-body-md text-ink">{item}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {agency.howToAccess ? (
        <section className="mt-lg rounded-lg border border-primary/20 bg-primary-soft p-md">
          <div className="flex items-center gap-xs">
            <ListChecks size={20} className="text-primary" />
            <span className="text-title-md text-primary">Cara Mengakses</span>
          </div>
          <p className="mt-xs text-justify text-body-sm text-ink">{agency.howToAccess}</p>
        </section>
      ) : null}

      <section className="mt-lg">
        <SectionTitle>Kanal Pengaduan</SectionTitle>
        {agency.channels.length > 0 ? (
          <div className="mt-sm flex flex-col gap-sm">
            {agency.channels.map((channel, index) => (
              <ChannelCard key={`${channel.type}-${channel.value}-${index}`} channel={channel} />
            ))}
          </div>
        ) : (
          <p className="mt-xs rounded-lg border border-border bg-white p-md text-body-sm text-ink-muted">
            Kontak resmi lembaga ini belum tersedia di aplikasi. Silakan cari kanal resmi lembaga
            melalui situs atau kantor perwakilan terdekat.
          </p>
        )}
      </section>

      {agency.notes ? (
        <div className="mt-lg flex items-start gap-xs rounded-lg bg-warning-soft p-md">
          <AlertTriangle size={18} className="mt-[2px] shrink-0 text-warning" />
          <p className="text-body-sm text-ink">{agency.notes}</p>
        </div>
      ) : null}
    </div>
  );
}
