import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Check, X, CheckCircle2, XCircle, Trophy, RotateCcw } from 'lucide-react';
import { isApiError } from '@/api/apiError';
import { useAlert } from '@/core/components/alert/useAlert';
import { cn } from '@/core/lib/cn';
import { PrimaryButton } from '@/core/components/PrimaryButton';
import { ModulePageScaffold } from '../components/ModulePageScaffold';
import {
  ModuleContinueButton,
  ModuleErrorScaffold,
  ModuleLoadingScaffold,
} from '../components/moduleChrome';
import { useCheckQuizAnswerMutation, useStartQuizAttemptMutation } from '../api/moduleApi';
import type {
  LikertScaleOption,
  QuizChoiceOption,
  QuizContent,
  QuizQuestion,
  QuizSegment,
} from '../model/content/quizContent';
import type { QuizAnswerCheckResult, QuizAttempt, QuizReviewItem } from '../model/quizAttempt';
import type { ModulePage } from '../model/modulePage';
import type { ModulePageNav } from '../components/modulePageNav';

interface Props {
  page: ModulePage;
  nav: ModulePageNav;
  moduleTitle: string;
}

/** Padanan `quiz_module_screen.dart`. */
export function QuizModuleScreen({ page, nav, moduleTitle }: Props) {
  const quiz = page.content.kind === 'quiz' ? page.content.content : null;
  const [startAttempt] = useStartQuizAttemptMutation();
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [startError, setStartError] = useState<string | null>(null);

  useEffect(() => {
    if (!quiz) return;
    let cancelled = false;
    startAttempt(quiz.id)
      .unwrap()
      .then((id) => {
        if (!cancelled) setAttemptId(id);
      })
      .catch((err) => {
        if (!cancelled && isApiError(err)) setStartError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, [quiz, startAttempt]);

  if (!quiz) return null;
  if (startError) return <ModuleErrorScaffold title={moduleTitle} message={startError} />;
  if (attemptId == null) return <ModuleLoadingScaffold />;

  return <QuizRunner quiz={quiz} attemptId={attemptId} nav={nav} />;
}

function flattenQuestions(quiz: QuizContent): Array<[QuizSegment, QuizQuestion]> {
  const out: Array<[QuizSegment, QuizQuestion]> = [];
  for (const segment of [...quiz.segments].sort((a, b) => a.order - b.order)) {
    for (const question of [...segment.questions].sort((a, b) => a.order - b.order)) {
      out.push([segment, question]);
    }
  }
  return out;
}

function QuizRunner({
  quiz,
  attemptId,
  nav,
}: {
  quiz: QuizContent;
  attemptId: string;
  nav: ModulePageNav;
}) {
  const showAlert = useAlert();
  const [checkAnswer, { isLoading: checking }] = useCheckQuizAnswerMutation();

  const flat = useMemo(() => flattenQuestions(quiz), [quiz]);
  const [choiceAnswers, setChoiceAnswers] = useState<Record<string, string>>({});
  const [likertAnswers, setLikertAnswers] = useState<Record<string, string>>({});
  const [checkedResults, setCheckedResults] = useState<Record<string, QuizAnswerCheckResult>>({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [result, setResult] = useState<QuizAttempt | null>(null);

  const idx = Math.min(questionIndex, flat.length - 1);
  const entry = flat[idx]!;
  const [segment, question] = entry;
  const isLast = idx === flat.length - 1;
  const checked = checkedResults[question.id];
  const isLikert = segment.segmentType === 'likert';
  const selected = isLikert ? likertAnswers[question.id] : choiceAnswers[question.id];

  function advance(latest: QuizAttempt) {
    if (idx < flat.length - 1) setQuestionIndex((i) => i + 1);
    else setResult(latest);
  }

  async function checkCurrent(): Promise<QuizAnswerCheckResult | null> {
    try {
      const res = await checkAnswer({
        attemptId,
        questionId: question.id,
        type: segment.segmentType,
        choiceOptionId: choiceAnswers[question.id],
        likertOptionId: likertAnswers[question.id],
      }).unwrap();
      setCheckedResults((prev) => ({ ...prev, [question.id]: res }));
      return res;
    } catch (err) {
      if (isApiError(err)) {
        void showAlert({
          type: 'error',
          title: 'Gagal Mengecek Jawaban',
          message: err.message,
        });
      }
      return null;
    }
  }

  async function onPrimary() {
    const existing = checkedResults[question.id];
    if (!existing) {
      const justChecked = await checkCurrent();
      if (justChecked && isLikert) advance(justChecked.attempt);
      return;
    }
    advance(existing.attempt);
  }

  if (result) {
    return (
      <ModulePageScaffold
        nav={nav}
        backgroundClassName="bg-white"
        body={<QuizResultView result={result} />}
        footer={
          <ModuleContinueButton hasNext={nav.hasNext} busy={false} onPressed={nav.onAdvance} />
        }
      />
    );
  }

  const sortedOptions = [...question.choiceOptions].sort((a, b) => a.order - b.order);

  return (
    <ModulePageScaffold
      nav={nav}
      backgroundClassName="bg-white"
      scrollResetKey={question.id}
      body={
        <div className="p-screen">
          <QuestionProgress current={idx + 1} total={flat.length} />
          <div className="h-lg" />
          <p className="whitespace-pre-line text-justify text-body-lg text-ink">
            {question.question}
          </p>
          {segment.instruction ? (
            <p className="mt-sm whitespace-pre-line text-body-sm text-ink-muted">
              {segment.instruction}
            </p>
          ) : null}
          <div className="h-md" />
          {checked && !isLikert ? (
            <AnswerFeedback result={checked} question={question} />
          ) : isLikert ? (
            <LikertRow
              options={segment.likertScaleOptions}
              selectedOptionId={selected}
              onSelected={(id) => setLikertAnswers((p) => ({ ...p, [question.id]: id }))}
            />
          ) : (
            sortedOptions.map((option, i) => (
              <div key={option.id} className="mb-sm">
                <ChoiceOptionTile
                  letter={String.fromCharCode(65 + i)}
                  option={option}
                  selected={selected === option.id}
                  onTap={() => setChoiceAnswers((p) => ({ ...p, [question.id]: option.id }))}
                />
              </div>
            ))
          )}
        </div>
      }
      footer={
        <div className="flex flex-col items-stretch gap-xs">
          <PrimaryButton
            label={checked && isLast ? 'Lihat Hasil' : 'Lanjut ke Pertanyaan Berikutnya'}
            trailingIcon={ArrowRight}
            isLoading={checking}
            onPressed={selected == null ? null : () => void onPrimary()}
          />
          {selected == null ? (
            <p className="text-center text-body-sm text-ink-muted">
              Pilih salah satu jawaban dulu sebelum lanjut.
            </p>
          ) : null}
        </div>
      }
    />
  );
}

function QuestionProgress({ current, total }: { current: number; total: number }) {
  const percent = total === 0 ? 0 : Math.round((current / total) * 100);
  return (
    <div className="flex flex-col items-stretch">
      <div className="flex items-center">
        <span className="flex-1 text-label-sm font-bold uppercase tracking-[0.4px] text-ink-muted">
          Pertanyaan {current} dari {total}
        </span>
        <span className="text-label-sm font-bold text-primary">{percent}%</span>
      </div>
      <div className="mt-xxs h-[6px] overflow-hidden rounded-pill bg-primary-soft">
        <div className="h-full rounded-pill bg-primary" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function ChoiceOptionTile({
  letter,
  option,
  selected,
  onTap,
}: {
  letter: string;
  option: QuizChoiceOption;
  selected: boolean;
  onTap: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onTap}
      className={cn(
        'flex w-full items-center gap-sm rounded-lg border p-sm text-left',
        selected ? 'border-[1.6px] border-primary bg-white' : 'border-border bg-background',
      )}
    >
      <span
        className={cn(
          'flex h-28 w-28 shrink-0 items-center justify-center rounded-full border text-label-md font-bold',
          selected ? 'border-primary bg-primary text-white' : 'border-border bg-white text-ink',
        )}
      >
        {letter}
      </span>
      {/* Tanpa line-clamp -- opsi jawaban tidak boleh terpotong. */}
      <span
        className={cn('flex-1 text-body-md', selected ? 'font-semibold text-primary' : 'text-ink')}
      >
        {option.optionText}
      </span>
    </button>
  );
}

function AnswerFeedback({
  result,
  question,
}: {
  result: QuizAnswerCheckResult;
  question: QuizQuestion;
}) {
  const correct = result.correct ?? false;
  const sorted = [...question.choiceOptions].sort((a, b) => a.order - b.order);
  const correctIndex = sorted.findIndex((o) => o.id === result.correctOptionId);
  const correctOption = correctIndex === -1 ? null : sorted[correctIndex]!;
  const correctLetter = correctIndex === -1 ? null : String.fromCharCode(65 + correctIndex);

  return (
    <div className="flex flex-col items-stretch">
      <div
        className={cn(
          'flex flex-col items-center rounded-lg p-lg',
          correct ? 'bg-success-soft' : 'bg-danger-soft',
        )}
      >
        <span
          className={cn(
            'flex h-56 w-56 items-center justify-center rounded-full text-white',
            correct ? 'bg-success' : 'bg-danger',
          )}
        >
          {correct ? <Check size={28} /> : <X size={28} />}
        </span>
        <p
          className={cn(
            'mt-sm text-center text-title-lg font-bold',
            correct ? 'text-success' : 'text-danger',
          )}
        >
          {correct ? 'Jawabanmu benar!' : 'Jawabanmu belum tepat.'}
        </p>
        {!correct && correctLetter && correctOption ? (
          <p
            className={cn(
              'mt-xs text-justify text-body-md',
              correct ? 'text-success' : 'text-danger',
            )}
          >
            Jawaban yang benar adalah {correctLetter}. {correctOption.optionText}
          </p>
        ) : null}
      </div>
      {result.explanation && result.explanation.length > 0 ? (
        <>
          <p className="mt-lg text-label-md font-bold uppercase tracking-[0.4px] text-primary">
            Pembahasan
          </p>
          <div className="mt-xs rounded-md bg-primary-soft p-md">
            <p className="whitespace-pre-line text-justify text-body-md text-ink">
              {result.explanation}
            </p>
          </div>
        </>
      ) : null}
    </div>
  );
}

function LikertRow({
  options,
  selectedOptionId,
  onSelected,
}: {
  options: LikertScaleOption[];
  selectedOptionId?: string;
  onSelected: (id: string) => void;
}) {
  const sorted = [...options].sort((a, b) => a.order - b.order);
  return (
    <div className="flex gap-[4px]">
      {sorted.map((option) => {
        const selected = selectedOptionId === option.id;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelected(option.id)}
            className={cn(
              'flex flex-1 flex-col items-center rounded-sm py-xs',
              selected ? 'bg-primary' : 'bg-background',
            )}
          >
            <span className={cn('text-title-md', selected ? 'text-white' : 'text-ink')}>
              {option.value}
            </span>
            <span
              className={cn(
                'mt-[2px] line-clamp-2 text-center text-label-sm',
                selected ? 'text-white/85' : 'text-ink-muted',
              )}
            >
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function QuizResultView({ result }: { result: QuizAttempt }) {
  const passed = result.passed ?? false;
  return (
    <div className="p-screen">
      <div className={cn('rounded-lg p-lg text-center', passed ? 'bg-success' : 'bg-danger')}>
        <div className="flex justify-center text-white">
          {passed ? <Trophy size={40} /> : <RotateCcw size={40} />}
        </div>
        <p className="mt-sm text-title-lg text-white">
          {passed ? 'Selamat, kamu lulus!' : 'Belum lulus, coba lagi ya'}
        </p>
        {result.percentage != null ? (
          <p className="mt-xxs text-body-md text-white/90">
            {result.percentage}% benar ({result.choiceScore}/{result.choiceMaxScore})
          </p>
        ) : null}
      </div>
      {result.review.length > 0 ? (
        <>
          <p className="mt-lg text-title-md text-ink">Pembahasan</p>
          <div className="mt-sm flex flex-col gap-sm">
            {result.review.map((item, i) => (
              <ReviewCard key={i} item={item} />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

function ReviewCard({ item }: { item: QuizReviewItem }) {
  return (
    <div
      className={cn(
        'rounded-md border bg-white p-md',
        item.isCorrect ? 'border-success/40' : 'border-danger/40',
      )}
    >
      <div className="flex items-start gap-xs">
        {item.isCorrect ? (
          <CheckCircle2 size={18} className="shrink-0 text-success" />
        ) : (
          <XCircle size={18} className="shrink-0 text-danger" />
        )}
        <p className="flex-1 whitespace-pre-line text-body-lg font-semibold text-ink">
          {item.question}
        </p>
      </div>
      {item.explanation ? (
        <p className="mt-xs whitespace-pre-line text-body-sm text-ink-muted">{item.explanation}</p>
      ) : null}
    </div>
  );
}
