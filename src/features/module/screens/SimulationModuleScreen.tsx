import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  ArrowLeftRight,
  ArrowUpDown,
  Trophy,
  Check,
  X,
  GripVertical,
  CircleAlert,
  Lightbulb,
} from 'lucide-react';
import { isApiError } from '@/api/apiError';
import { useAlert } from '@/core/components/alert/useAlert';
import { cn } from '@/core/lib/cn';
import { PrimaryButton } from '@/core/components/PrimaryButton';
import { ModuleHeader } from '../components/ModuleHeader';
import { ModulePageScaffold } from '../components/ModulePageScaffold';
import {
  ModuleContinueButton,
  ModuleErrorScaffold,
  ModuleLoadingScaffold,
} from '../components/moduleChrome';
import {
  useCheckMatchingAnswerMutation,
  useCheckOrderingAnswerMutation,
  useStartSimulationAttemptMutation,
} from '../api/moduleApi';
import type {
  SimulationGameType,
  SimulationMatchingPair,
  SimulationOrderingStep,
} from '../model/content/simulationContent';
import type { SimulationAttempt } from '../model/simulationAttempt';
import type { ModuleDetail } from '../model/moduleDetail';
import type { ModulePage } from '../model/modulePage';
import type { ModulePageNav } from '../components/modulePageNav';

interface Props {
  module: ModuleDetail;
  page: ModulePage;
  nav: ModulePageNav;
}

function shuffled<T>(list: readonly T[]): T[] {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

/** Padanan `simulation_module_screen.dart`. */
export function SimulationModuleScreen({ module, page, nav }: Props) {
  const content = page.content.kind === 'simulation' ? page.content.content : null;
  const [startAttempt] = useStartSimulationAttemptMutation();
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [startError, setStartError] = useState<string | null>(null);
  const [latestAttempt, setLatestAttempt] = useState<SimulationAttempt | null>(null);

  useEffect(() => {
    if (!content) return;
    let cancelled = false;
    startAttempt(content.id)
      .unwrap()
      .then((id) => !cancelled && setAttemptId(id))
      .catch((err) => !cancelled && isApiError(err) && setStartError(err.message));
    return () => {
      cancelled = true;
    };
  }, [content, startAttempt]);

  if (!content) return null;
  if (startError) return <ModuleErrorScaffold title={module.title} message={startError} />;
  if (attemptId == null) return <ModuleLoadingScaffold />;

  const isCompleted = latestAttempt?.isCompleted ?? false;

  return (
    <ModulePageScaffold
      nav={nav}
      body={
        isCompleted && latestAttempt ? (
          <CompletionView attempt={latestAttempt} />
        ) : (
          <div className="p-screen">
            {content.simulationType === 'matching' ? (
              <h1 className="text-title-lg text-black">{content.title}</h1>
            ) : (
              <>
                <ModuleHeader module={module} />
                <div className="h-lg" />
                <ScenarioHeader type={content.simulationType} scenario={content.scenario} />
              </>
            )}
            <div className="h-lg" />
            {content.simulationType === 'matching' ? (
              <MatchingGame
                attemptId={attemptId}
                pairs={content.matchingPairs}
                onChecked={setLatestAttempt}
              />
            ) : content.simulationType === 'ordering' ? (
              <OrderingGame
                attemptId={attemptId}
                steps={content.orderingSteps}
                onChecked={setLatestAttempt}
              />
            ) : (
              <p className="text-body-sm text-ink-muted">Tipe simulasi ini belum didukung.</p>
            )}
          </div>
        )
      }
      footer={
        isCompleted ? (
          <ModuleContinueButton hasNext={nav.hasNext} busy={false} onPressed={nav.onAdvance} />
        ) : undefined
      }
    />
  );
}

/* ---------------- scenario header ---------------- */

const TYPE_LABEL: Record<SimulationGameType, string> = {
  matching: 'Pilah Cepat',
  ordering: 'Susun Jalur Solusi',
  unknown: 'Simulasi',
};

function ScenarioHeader({ type, scenario }: { type: SimulationGameType; scenario: string }) {
  return (
    <div className="flex flex-col items-center gap-sm">
      <span className="inline-flex items-center gap-xxs rounded-pill bg-primary-soft px-md py-6 text-label-md font-bold text-primary">
        {type === 'matching' ? <ArrowLeftRight size={15} /> : <ArrowUpDown size={15} />}
        {TYPE_LABEL[type]}
      </span>
      <p className="text-center text-body-md text-ink">{scenario}</p>
    </div>
  );
}

function CompletionView({ attempt }: { attempt: SimulationAttempt }) {
  return (
    <div className="p-screen">
      <div className="rounded-lg bg-success p-lg text-center">
        <div className="flex justify-center text-white">
          <Trophy size={40} />
        </div>
        <p className="mt-sm text-title-lg text-white">Simulasi selesai!</p>
        {attempt.score != null && attempt.maxScore != null ? (
          <p className="mt-xxs text-body-md text-white/90">
            Skor {attempt.score}/{attempt.maxScore}
          </p>
        ) : null}
      </div>
    </div>
  );
}

/* ---------------- matching ---------------- */

function MatchingGame({
  attemptId,
  pairs,
  onChecked,
}: {
  attemptId: string;
  pairs: SimulationMatchingPair[];
  onChecked: (attempt: SimulationAttempt) => void;
}) {
  const showAlert = useAlert();
  const [checkMatching] = useCheckMatchingAnswerMutation();
  const rightItems = useMemo(() => shuffled(pairs), [pairs]);
  const [solved, setSolved] = useState<Set<string>>(new Set());
  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  async function tryMatch(rightPairId: string) {
    if (!selectedLeftId || checking) return;
    const leftId = selectedLeftId;
    setChecking(true);
    try {
      const res = await checkMatching({
        attemptId,
        pairId: leftId,
        submittedRightPairId: rightPairId,
      }).unwrap();
      onChecked(res.attempt);
      if (res.correct) {
        setSolved((prev) => new Set(prev).add(leftId));
        setSelectedLeftId(null);
      } else {
        setSelectedLeftId(null);
        void showAlert({
          type: 'warning',
          title: 'Coba Lagi',
          message: 'Belum pas, coba pasangan lain.',
        });
      }
    } catch (err) {
      if (isApiError(err)) {
        void showAlert({
          type: 'error',
          title: 'Gagal Mengecek Jawaban',
          message: err.message,
        });
      }
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className="flex flex-col items-stretch">
      <p className="text-title-md text-ink">
        {solved.size}/{pairs.length} pasangan benar
      </p>
      <div className="h-sm" />
      {pairs.map((left, i) => {
        const right = rightItems[i]!;
        const backgroundColor = matchPairColor(i);
        return (
          <div key={left.id} className="mb-sm flex items-stretch gap-sm">
            <MatchCard
              label={left.leftLabel}
              description={left.leftDescription}
              imageUrl={left.leftImageUrl}
              backgroundColor={backgroundColor}
              side="situation"
              solved={solved.has(left.id)}
              selected={selectedLeftId === left.id}
              onTap={
                solved.has(left.id) || checking
                  ? undefined
                  : () => setSelectedLeftId((cur) => (cur === left.id ? null : left.id))
              }
            />
            <MatchCard
              label={right.rightLabel}
              description={right.rightDescription}
              imageUrl={right.rightImageUrl}
              backgroundColor={backgroundColor}
              side="solution"
              solved={solved.has(right.id)}
              selected={false}
              onTap={solved.has(right.id) || checking ? undefined : () => void tryMatch(right.id)}
            />
          </div>
        );
      })}
    </div>
  );
}

/**
 * Warna latar kartu per pasangan, diulang jika pasangan lebih banyak dari
 * jumlah warna. Kedua kartu (situasi & solusi) dalam satu baris berbagi
 * warna yang sama supaya terasa sepasang, seperti pada mockup desain.
 */
const MATCH_PAIR_BACKGROUNDS = [
  'bg-primary-soft',
  'bg-warning-soft',
  'bg-danger-soft',
  'bg-success-soft',
];

function matchPairColor(index: number): string {
  return MATCH_PAIR_BACKGROUNDS[index % MATCH_PAIR_BACKGROUNDS.length]!;
}

type MatchCardSide = 'situation' | 'solution';

function MatchCard({
  label,
  description,
  imageUrl,
  backgroundColor,
  side,
  solved,
  selected,
  onTap,
}: {
  label: string;
  description: string | null;
  imageUrl: string | null;
  backgroundColor: string;
  side: MatchCardSide;
  solved: boolean;
  selected: boolean;
  onTap?: () => void;
}) {
  const isSituation = side === 'situation';
  const thumbnail = imageUrl ? (
    <StepThumbnail imageUrl={imageUrl} size={48} />
  ) : (
    <MatchThumbnailPlaceholder isSituation={isSituation} />
  );
  const content = (
    <div className="flex min-w-0 flex-1 flex-col items-start text-left">
      <MatchBadge label={label} isSituation={isSituation} />
      {description ? (
        <span className="mt-xxs line-clamp-4 text-body-sm text-ink-muted">{description}</span>
      ) : null}
    </div>
  );

  return (
    <button
      type="button"
      onClick={onTap}
      disabled={!onTap}
      className={cn(
        'relative flex flex-1 items-start gap-sm rounded-lg border p-sm',
        backgroundColor,
        solved
          ? 'border-success opacity-60'
          : selected
            ? 'border-[1.6px] border-primary'
            : 'border-border',
      )}
    >
      {isSituation ? (
        <>
          {thumbnail}
          {content}
        </>
      ) : (
        <>
          {content}
          {thumbnail}
        </>
      )}
      {solved ? <Check size={18} className="-right-0.5 -top-0.5 absolute text-success" /> : null}
    </button>
  );
}

/**
 * Badge kecil untuk label singkat ("Situasi 1", "Solusi A") -- merah untuk
 * situasi (meniru chip "Skenario N" di mockup), biru untuk solusi.
 */
function MatchBadge({ label, isSituation }: { label: string; isSituation: boolean }) {
  const Icon = isSituation ? CircleAlert : Lightbulb;
  return (
    <span
      className={cn(
        'gap-1 py-0.5 inline-flex max-w-full items-center rounded-pill px-xs text-label-sm font-bold',
        isSituation ? 'bg-danger-soft text-danger' : 'bg-primary-soft text-primary',
      )}
    >
      <Icon size={12} className="shrink-0" />
      <span className="truncate">{label}</span>
    </span>
  );
}

/** Placeholder saat pasangan belum punya foto. */
function MatchThumbnailPlaceholder({ isSituation }: { isSituation: boolean }) {
  const Icon = isSituation ? CircleAlert : Lightbulb;
  return (
    <span className="flex h-48 w-48 shrink-0 items-center justify-center rounded-sm bg-white/60">
      <Icon size={22} className="text-ink-muted" />
    </span>
  );
}

/* ---------------- ordering ---------------- */

function OrderingGame({
  attemptId,
  steps,
  onChecked,
}: {
  attemptId: string;
  steps: SimulationOrderingStep[];
  onChecked: (attempt: SimulationAttempt) => void;
}) {
  const showAlert = useAlert();
  const [checkOrdering] = useCheckOrderingAnswerMutation();
  const [pool, setPool] = useState<SimulationOrderingStep[]>(() => shuffled(steps));
  const [placed, setPlaced] = useState<Array<SimulationOrderingStep | null>>(() =>
    Array<SimulationOrderingStep | null>(steps.length).fill(null),
  );
  const [checking, setChecking] = useState(false);

  const allSlotsFilled = placed.every((s) => s != null);

  function placeInSlot(step: SimulationOrderingStep, slotIndex: number) {
    if (checking) return;
    setPlaced((prevPlaced) => {
      const displaced = prevPlaced[slotIndex] ?? null;
      const next = [...prevPlaced];
      next[slotIndex] = step;
      setPool((prevPool) => {
        const withoutStep = prevPool.filter((s) => s.id !== step.id);
        return displaced ? [...withoutStep, displaced] : withoutStep;
      });
      return next;
    });
  }

  function placeInNextSlot(step: SimulationOrderingStep) {
    if (checking) return;
    const nextIndex = placed.findIndex((s) => s == null);
    if (nextIndex === -1) return;
    placeInSlot(step, nextIndex);
  }

  function returnToPool(slotIndex: number) {
    if (checking) return;
    const step = placed[slotIndex];
    if (!step) return;
    setPlaced((prev) => {
      const next = [...prev];
      next[slotIndex] = null;
      return next;
    });
    setPool((prev) => [...prev, step]);
  }

  async function checkPath() {
    if (!allSlotsFilled || checking) return;
    setChecking(true);

    const wrongSteps: SimulationOrderingStep[] = [];
    let latestAttempt: SimulationAttempt | null = null;

    for (let i = 0; i < placed.length; i += 1) {
      const step = placed[i]!;
      try {
        const res = await checkOrdering({
          attemptId,
          stepId: step.id,
          submittedPosition: i + 1,
        }).unwrap();
        latestAttempt = res.attempt;
        if (!res.correct) wrongSteps.push(step);
        if (res.attempt.isCompleted) {
          onChecked(res.attempt);
          setChecking(false);
          return;
        }
      } catch (err) {
        if (isApiError(err)) {
          void showAlert({
            type: 'error',
            title: 'Gagal Mengecek Jawaban',
            message: err.message,
          });
        }
        setChecking(false);
        return;
      }
    }

    if (latestAttempt) onChecked(latestAttempt);

    const wrongIds = new Set(wrongSteps.map((s) => s.id));
    setPlaced((prev) => prev.map((s) => (s && wrongIds.has(s.id) ? null : s)));
    setPool((prev) => [...prev, ...wrongSteps]);
    setChecking(false);

    if (wrongSteps.length > 0) {
      void showAlert({
        type: 'warning',
        title: 'Belum Tepat',
        message: 'Ada langkah yang belum tepat, susun ulang ya.',
      });
    }
  }

  return (
    <div className="flex flex-col items-stretch">
      {placed.map((step, i) => (
        <div key={i}>
          {i > 0 ? (
            <div className="mx-auto my-xs h-md w-0 border-l-2 border-dashed border-border" />
          ) : null}
          <OrderingSlot
            position={i + 1}
            step={step}
            onRemove={step == null || checking ? undefined : () => returnToPool(i)}
            onAccept={checking ? undefined : (s) => placeInSlot(s, i)}
          />
        </div>
      ))}

      {pool.length > 0 ? (
        <>
          <div className="h-lg" />
          <p className="text-title-sm text-ink">Langkah Tersedia:</p>
          <p className="mt-xxs text-body-sm text-ink-muted">
            Seret ke kotak yang dituju, atau ketuk untuk taruh otomatis.
          </p>
          <div className="h-sm" />
          {pool.map((step) => (
            <div key={step.id} className="mb-sm">
              <PoolCard step={step} onTap={checking ? undefined : () => placeInNextSlot(step)} />
            </div>
          ))}
        </>
      ) : null}

      <div className="h-lg" />
      <PrimaryButton
        label="Cek Jalur"
        trailingIcon={ArrowRight}
        isLoading={checking}
        onPressed={allSlotsFilled ? () => void checkPath() : null}
      />
    </div>
  );
}

function OrderingSlot({
  position,
  step,
  onRemove,
  onAccept,
}: {
  position: number;
  step: SimulationOrderingStep | null;
  onRemove?: () => void;
  onAccept?: (step: SimulationOrderingStep) => void;
}) {
  const [hovering, setHovering] = useState(false);
  const filled = step != null;

  return (
    <div
      onDragOver={onAccept ? (e) => e.preventDefault() : undefined}
      onDragEnter={onAccept ? () => setHovering(true) : undefined}
      onDragLeave={() => setHovering(false)}
      onDrop={
        onAccept
          ? (e) => {
              e.preventDefault();
              setHovering(false);
              const raw = e.dataTransfer.getData('application/json');
              if (raw) onAccept(JSON.parse(raw) as SimulationOrderingStep);
            }
          : undefined
      }
      className={cn(
        'flex min-h-[52px] items-center gap-sm rounded-sm border px-sm py-xs transition-colors duration-fast',
        hovering
          ? 'border-[1.6px] border-primary bg-primary-soft'
          : filled
            ? 'border-success bg-success-soft'
            : 'border-border bg-background',
      )}
    >
      <span
        className={cn(
          'h-24 w-24 flex shrink-0 items-center justify-center rounded-full text-label-sm font-bold text-white',
          filled ? 'bg-success' : 'bg-muted',
        )}
      >
        {position}
      </span>
      {step?.imageUrl ? <StepThumbnail imageUrl={step.imageUrl} size={36} /> : null}
      <span
        className={cn(
          'line-clamp-2 flex-1 text-body-md',
          filled ? 'text-ink' : 'italic text-ink-muted',
        )}
      >
        {step?.label ?? 'Seret atau ketuk salah satu langkah di bawah'}
      </span>
      {onRemove ? (
        <button type="button" onClick={onRemove} aria-label="Keluarkan" className="text-ink-muted">
          <X size={16} />
        </button>
      ) : null}
    </div>
  );
}

function PoolCard({ step, onTap }: { step: SimulationOrderingStep; onTap?: () => void }) {
  return (
    <button
      type="button"
      draggable={onTap != null}
      onDragStart={(e) => e.dataTransfer.setData('application/json', JSON.stringify(step))}
      onClick={onTap}
      disabled={!onTap}
      className={cn(
        'flex w-full items-start gap-sm rounded-sm border border-border bg-white p-sm text-left',
        onTap ? 'cursor-grab active:cursor-grabbing' : 'opacity-50',
      )}
    >
      {step.imageUrl ? (
        <StepThumbnail imageUrl={step.imageUrl} size={48} />
      ) : (
        <span className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
          <GripVertical size={15} />
        </span>
      )}
      <span className="flex-1 text-body-md font-semibold text-ink">{step.label}</span>
      <GripVertical size={18} className="shrink-0 text-ink-muted" />
    </button>
  );
}

/** Foto langkah dari backend, dipakai di kartu pool dan slot yang sudah terisi. */
function StepThumbnail({ imageUrl, size }: { imageUrl: string; size: 36 | 48 }) {
  const dimension = size === 36 ? 'h-36 w-36' : 'h-48 w-48';
  return (
    <span className={cn('shrink-0 overflow-hidden rounded-sm bg-background', dimension)}>
      <img
        src={imageUrl}
        alt=""
        className="h-full w-full object-cover"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = 'none';
        }}
      />
    </span>
  );
}
