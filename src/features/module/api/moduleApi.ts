import { baseApi } from '@/api/baseApi';
import { requireData } from '@/api/apiEnvelope';
import { parseModuleDetail, type ModuleDetail } from '../model/moduleDetail';
import {
  parseQuizAnswerCheckResult,
  type QuizAnswerCheckResult,
} from '../model/quizAttempt';
import {
  parseSimulationCheckResult,
  type SimulationCheckResult,
} from '../model/simulationAttempt';
import {
  parseReflectionContent,
  type ReflectionContent,
} from '../model/content/reflectionContent';
import type { QuizSegmentType } from '../model/content/quizContent';

export interface CheckQuizAnswerInput {
  attemptId: string;
  questionId: string;
  type: QuizSegmentType;
  choiceOptionId?: string;
  likertOptionId?: string;
}

export interface SaveReflectionInput {
  reflectionContentId: string;
  answers: Record<string, string>;
  checklistAnswers: Record<string, boolean>;
}

/** Padanan `ModuleRepository` di frontend-android. */
export const moduleApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getModule: build.query<ModuleDetail, string>({
      query: (moduleId) => ({ url: `/modules/${moduleId}` }),
      transformResponse: (raw) => parseModuleDetail(requireData(raw)),
    }),

    completeModulePage: build.mutation<void, string>({
      query: (modulePageId) => ({
        url: `/module-pages/${modulePageId}/complete`,
        method: 'POST',
      }),
      transformResponse: () => undefined,
      // Progres journey/sektor berubah setelah halaman selesai.
      invalidatesTags: ['JourneyDetail', 'SectorDetail'],
    }),

    startQuizAttempt: build.mutation<string, string>({
      query: (quizContentId) => ({
        url: `/quizzes/${quizContentId}/attempts`,
        method: 'POST',
      }),
      transformResponse: (raw) => requireData(raw)['attempt_id'] as string,
    }),

    checkQuizAnswer: build.mutation<QuizAnswerCheckResult, CheckQuizAnswerInput>({
      query: ({ attemptId, questionId, type, choiceOptionId, likertOptionId }) => ({
        url: `/quiz-attempts/${attemptId}/check`,
        method: 'POST',
        data: {
          type: type === 'likert' ? 'likert' : 'multiple_choice',
          quiz_question_id: questionId,
          ...(choiceOptionId != null ? { quiz_choice_option_id: choiceOptionId } : {}),
          ...(likertOptionId != null ? { likert_scale_option_id: likertOptionId } : {}),
        },
      }),
      transformResponse: (raw) => parseQuizAnswerCheckResult(requireData(raw)),
      invalidatesTags: ['JourneyDetail', 'SectorDetail'],
    }),

    startSimulationAttempt: build.mutation<string, string>({
      query: (simulationContentId) => ({
        url: `/simulations/${simulationContentId}/attempts`,
        method: 'POST',
      }),
      transformResponse: (raw) => requireData(raw)['attempt_id'] as string,
    }),

    checkMatchingAnswer: build.mutation<
      SimulationCheckResult,
      { attemptId: string; pairId: string; submittedRightPairId: string }
    >({
      query: ({ attemptId, pairId, submittedRightPairId }) => ({
        url: `/simulation-attempts/${attemptId}/check`,
        method: 'POST',
        data: {
          type: 'matching',
          simulation_matching_pair_id: pairId,
          submitted_right_pair_id: submittedRightPairId,
        },
      }),
      transformResponse: (raw) => parseSimulationCheckResult(requireData(raw)),
      invalidatesTags: ['JourneyDetail', 'SectorDetail'],
    }),

    checkOrderingAnswer: build.mutation<
      SimulationCheckResult,
      { attemptId: string; stepId: string; submittedPosition: number }
    >({
      query: ({ attemptId, stepId, submittedPosition }) => ({
        url: `/simulation-attempts/${attemptId}/check`,
        method: 'POST',
        data: {
          type: 'ordering',
          simulation_ordering_step_id: stepId,
          submitted_position: submittedPosition,
        },
      }),
      transformResponse: (raw) => parseSimulationCheckResult(requireData(raw)),
      invalidatesTags: ['JourneyDetail', 'SectorDetail'],
    }),

    getReflection: build.query<ReflectionContent, string>({
      query: (reflectionContentId) => ({ url: `/reflections/${reflectionContentId}` }),
      transformResponse: (raw) => parseReflectionContent(requireData(raw)),
    }),

    saveReflectionEntries: build.mutation<ReflectionContent, SaveReflectionInput>({
      query: ({ reflectionContentId, answers, checklistAnswers }) => ({
        url: `/reflections/${reflectionContentId}/entries`,
        method: 'PUT',
        data: {
          entries: Object.entries(answers).map(([id, text]) => ({
            reflection_question_id: id,
            answer_text: text,
          })),
          checklist_answers: Object.entries(checklistAnswers).map(([id, checked]) => ({
            reflection_checklist_item_id: id,
            is_checked: checked,
          })),
        },
      }),
      transformResponse: (raw) => parseReflectionContent(requireData(raw)),
      invalidatesTags: ['JourneyDetail', 'SectorDetail'],
    }),
  }),
});

export const {
  useGetModuleQuery,
  useCompleteModulePageMutation,
  useStartQuizAttemptMutation,
  useCheckQuizAnswerMutation,
  useStartSimulationAttemptMutation,
  useCheckMatchingAnswerMutation,
  useCheckOrderingAnswerMutation,
  useGetReflectionQuery,
  useSaveReflectionEntriesMutation,
} = moduleApi;
