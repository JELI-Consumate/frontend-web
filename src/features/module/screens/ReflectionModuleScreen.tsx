import { useEffect, useMemo, useState } from 'react';
import { ListChecks, PencilLine } from 'lucide-react';
import { isApiError } from '@/api/apiError';
import { useAlert } from '@/core/components/alert/useAlert';
import { cn } from '@/core/lib/cn';
import { PrimaryButton } from '@/core/components/PrimaryButton';
import { ModulePageScaffold } from '../components/ModulePageScaffold';
import { ModuleErrorScaffold, ModuleLoadingScaffold } from '../components/moduleChrome';
import { useGetReflectionQuery, useSaveReflectionEntriesMutation } from '../api/moduleApi';
import {
  reflectionOpenQuestions,
  type ReflectionContent,
  type ReflectionQuestion,
  type ReflectionSection,
} from '../model/content/reflectionContent';
import type { ModuleDetail } from '../model/moduleDetail';
import type { ModulePage } from '../model/modulePage';
import type { ModulePageNav } from '../components/modulePageNav';

interface Props {
  module: ModuleDetail;
  page: ModulePage;
  nav: ModulePageNav;
}

/** Padanan `reflection_module_screen.dart`. */
export function ReflectionModuleScreen({ module, page, nav }: Props) {
  const reflectionId = page.content.kind === 'reflection' ? page.content.content.id : '';
  const { data: content, isLoading, isError, error } = useGetReflectionQuery(reflectionId);

  if (isLoading) return <ModuleLoadingScaffold />;
  if (isError || !content) {
    return (
      <ModuleErrorScaffold
        title={module.title}
        message={isApiError(error) ? error.message : undefined}
      />
    );
  }
  return <ReflectionBody content={content} page={page} nav={nav} />;
}

function ReflectionBody({
  content,
  page,
  nav,
}: {
  content: ReflectionContent;
  page: ModulePage;
  nav: ModulePageNav;
}) {
  const showAlert = useAlert();
  const [saveEntries, { isLoading: saving }] = useSaveReflectionEntriesMutation();

  const [current, setCurrent] = useState<ReflectionContent>(content);
  const [savedComplete, setSavedComplete] = useState(page.status === 'completed');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});

  // Hidrasi awal dari konten (setara `_hydrate`).
  useEffect(() => {
    const a: Record<string, string> = {};
    const c: Record<string, boolean> = {};
    for (const section of content.sections) {
      for (const q of section.questions) {
        if (q.questionType === 'open_question') a[q.id] = q.answerText ?? '';
        for (const item of q.checklistItems) c[item.id] = item.isChecked;
      }
    }
    setAnswers(a);
    setChecklist(c);
    setCurrent(content);
  }, [content]);

  const openQuestions = useMemo(() => reflectionOpenQuestions(current), [current]);
  const answeredCount = openQuestions.filter(
    (q) => (answers[q.id] ?? '').trim().length > 0,
  ).length;
  const isComplete = openQuestions.length === 0 || answeredCount === openQuestions.length;

  // `silent` menekan alert sukses -- dipakai saat menyimpan sekalian lanjut
  // (`proceed`), supaya tidak muncul toast "Jawaban tersimpan." tiap kali
  // menekan "Selesai"/"Selanjutnya" (paritas dengan `_save(silent:)` di
  // reflection_module_screen.dart).
  async function save({ silent = false }: { silent?: boolean } = {}): Promise<boolean> {
    try {
      const updated = await saveEntries({
        reflectionContentId: current.id,
        answers: Object.fromEntries(
          Object.entries(answers).map(([k, v]) => [k, v.trim()]),
        ),
        checklistAnswers: { ...checklist },
      }).unwrap();
      setCurrent(updated);
      if (isComplete) setSavedComplete(true);
      if (!silent) {
        void showAlert({ type: 'success', title: 'Berhasil', message: 'Jawaban tersimpan.' });
      }
      return true;
    } catch (err) {
      if (isApiError(err)) {
        void showAlert({ type: 'error', title: 'Gagal Menyimpan', message: err.message });
      }
      return false;
    }
  }

  async function proceed() {
    if (await save({ silent: true })) nav.onAdvance();
  }

  const sortedSections = [...current.sections].sort((a, b) => a.order - b.order);

  return (
    <ModulePageScaffold
      nav={nav}
      body={
        <div className="p-screen">
          {sortedSections.map((section) => (
            <div key={section.id} className="mb-lg">
              <SectionCard
                section={section}
                answers={answers}
                checklist={checklist}
                onAnswer={(id, v) => setAnswers((prev) => ({ ...prev, [id]: v }))}
                onToggle={(id, v) => setChecklist((prev) => ({ ...prev, [id]: v }))}
              />
            </div>
          ))}
          {isComplete && current.closingMessage ? (
            <>
              <h2 className="text-display-sm text-black">
                {current.closingTitle ?? 'Kata Penutup'}
              </h2>
              <p className="mt-sm whitespace-pre-line text-justify text-body-md text-ink">
                {current.closingMessage}
              </p>
            </>
          ) : null}
        </div>
      }
      footer={
        <div className="flex flex-col items-stretch gap-sm">
          {!savedComplete && openQuestions.length > 0 ? (
            <p className="text-center text-body-sm text-ink-muted">
              {answeredCount}/{openQuestions.length} pertanyaan terisi
            </p>
          ) : null}
          <PrimaryButton
            label={savedComplete ? (nav.hasNext ? 'Selanjutnya' : 'Selesai') : 'Simpan Jawaban'}
            isLoading={saving}
            onPressed={savedComplete ? () => void proceed() : () => void save()}
          />
        </div>
      }
    />
  );
}

function SectionCard({
  section,
  answers,
  checklist,
  onAnswer,
  onToggle,
}: {
  section: ReflectionSection;
  answers: Record<string, string>;
  checklist: Record<string, boolean>;
  onAnswer: (id: string, value: string) => void;
  onToggle: (id: string, value: boolean) => void;
}) {
  const isChecklistSection = section.questions.some((q) => q.questionType === 'checklist');
  return (
    <div className="rounded-lg bg-white p-lg shadow-card">
      <div className="flex items-start gap-sm">
        <span
          className={cn(
            'flex h-40 w-40 shrink-0 items-center justify-center rounded-sm',
            isChecklistSection ? 'bg-background text-ink' : 'bg-primary text-white',
          )}
        >
          {isChecklistSection ? <ListChecks size={22} /> : <PencilLine size={22} />}
        </span>
        <h3 className="pt-[6px] text-title-lg text-black">{section.title}</h3>
      </div>
      {section.instruction ? (
        <p className="mt-sm whitespace-pre-line text-body-sm text-ink-muted">
          {section.instruction}
        </p>
      ) : null}
      <div className="mt-md flex flex-col gap-md">
        {[...section.questions]
          .sort((a, b) => a.order - b.order)
          .map((q) => (
            <QuestionView
              key={q.id}
              question={q}
              answers={answers}
              checklist={checklist}
              onAnswer={onAnswer}
              onToggle={onToggle}
            />
          ))}
      </div>
    </div>
  );
}

function QuestionView({
  question,
  answers,
  checklist,
  onAnswer,
  onToggle,
}: {
  question: ReflectionQuestion;
  answers: Record<string, string>;
  checklist: Record<string, boolean>;
  onAnswer: (id: string, value: string) => void;
  onToggle: (id: string, value: boolean) => void;
}) {
  return (
    <div className="flex flex-col items-stretch">
      <p className="whitespace-pre-line text-justify text-body-lg text-ink">
        {question.questionText}
      </p>
      <div className="h-sm" />
      {question.questionType === 'checklist' ? (
        [...question.checklistItems]
          .sort((a, b) => a.order - b.order)
          .map((item) => (
            <label
              key={item.id}
              className="mb-sm flex items-start gap-sm rounded-md bg-background p-sm"
            >
              <input
                type="checkbox"
                checked={checklist[item.id] ?? false}
                onChange={(e) => onToggle(item.id, e.target.checked)}
                className="mt-[2px] h-20 w-20 accent-primary"
              />
              <span className="flex-1 text-body-md text-ink">{item.label}</span>
            </label>
          ))
      ) : (
        <textarea
          value={answers[question.id] ?? ''}
          onChange={(e) => onAnswer(question.id, e.target.value)}
          rows={3}
          placeholder="Tulis pendapatmu di sini..."
          className="w-full resize-y rounded-md bg-background p-sm text-body-md text-ink outline-none focus:ring-[1.6px] focus:ring-primary"
        />
      )}
    </div>
  );
}
