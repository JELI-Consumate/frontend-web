import { useState } from 'react';
import { ExternalLink, Play, Lightbulb } from 'lucide-react';
import { useAlert } from '@/core/components/alert/useAlert';
import { PrimaryButton } from '@/core/components/PrimaryButton';
import { ModuleHeader } from '../components/ModuleHeader';
import { ModulePageScaffold } from '../components/ModulePageScaffold';
import { ModuleContinueButton } from '../components/moduleChrome';
import { useModulePageAdvance } from '../hooks/useModulePageAdvance';
import type { ModuleDetail } from '../model/moduleDetail';
import type { ModulePage } from '../model/modulePage';
import type { ModulePageNav } from '../components/modulePageNav';

interface Props {
  module: ModuleDetail;
  page: ModulePage;
  nav: ModulePageNav;
}

/** Padanan `video_module_screen.dart`. Di web, video di-embed via iframe YouTube. */
export function VideoModuleScreen({ module, page, nav }: Props) {
  const content = page.content.kind === 'video' ? page.content.content : null;
  const showAlert = useAlert();
  const { isAdvancing, completeAndAdvance } = useModulePageAdvance();
  const [completed, setCompleted] = useState(page.status === 'completed');
  const [playing, setPlaying] = useState(false);

  if (!content) return null;

  const canEmbed = content.youtubeVideoId != null;

  function openVideo() {
    if (!content) return;
    const win = content.youtubeUrl
      ? window.open(content.youtubeUrl, '_blank', 'noopener,noreferrer')
      : null;
    if (!win) {
      void showAlert({
        type: 'error',
        title: 'Gagal Membuka Video',
        message: 'Tidak bisa membuka video. Coba lagi.',
      });
    }
  }

  return (
    <ModulePageScaffold
      nav={nav}
      body={
        <div className="p-screen">
          <ModuleHeader module={module} />
          {content.description ? (
            <p className="mt-sm whitespace-pre-line text-justify text-body-md text-ink">
              {content.description}
            </p>
          ) : null}
          <div className="h-lg" />

          {playing && canEmbed ? (
            <div className="aspect-video overflow-hidden rounded-lg bg-black">
              <iframe
                title={content.title}
                src={`https://www.youtube.com/embed/${content.youtubeVideoId}?autoplay=1`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full border-0"
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={canEmbed ? () => setPlaying(true) : openVideo}
              className="relative block aspect-video w-full overflow-hidden rounded-lg bg-ink"
            >
              {content.youtubeVideoId ? (
                <img
                  src={`https://img.youtube.com/vi/${content.youtubeVideoId}/hqdefault.jpg`}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : null}
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-60 w-60 items-center justify-center rounded-full bg-white">
                  <Play size={34} className="text-primary" fill="currentColor" />
                </span>
              </span>
            </button>
          )}

          <div className="h-xs" />
          {canEmbed ? (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={openVideo}
                className="inline-flex items-center gap-xxs px-xs py-xs text-label-md font-semibold text-primary"
              >
                <ExternalLink size={16} />
                Buka di YouTube
              </button>
            </div>
          ) : (
            <PrimaryButton label="Tonton di YouTube" trailingIcon={ExternalLink} onPressed={openVideo} />
          )}

          {content.promptQuestion ? (
            <>
              <div className="h-lg" />
              <div className="flex items-start gap-sm rounded-md bg-primary-soft p-md">
                <Lightbulb className="shrink-0 text-primary" />
                <div>
                  <p className="text-label-md font-bold text-primary">Pertanyaan Pemantik</p>
                  <p className="mt-xxs whitespace-pre-line text-justify text-body-md text-ink">
                    {content.promptQuestion}
                  </p>
                </div>
              </div>
            </>
          ) : null}
        </div>
      }
      footer={
        <ModuleContinueButton
          hasNext={nav.hasNext}
          busy={isAdvancing}
          onPressed={() =>
            void completeAndAdvance({
              pageId: page.id,
              alreadyComplete: completed,
              nav,
              onCompleted: () => setCompleted(true),
            })
          }
        />
      }
    />
  );
}
