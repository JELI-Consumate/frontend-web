import { createSlice } from '@reduxjs/toolkit';

/**
 * Setara `_UnauthenticatedFlowState._onboardingDone` di frontend-android:
 * status per-sesi (tidak dipersist). Cold start selalu mulai dari onboarding.
 */
interface OnboardingState {
  done: boolean;
}

const initialState: OnboardingState = { done: false };

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    finishOnboarding(state) {
      state.done = true;
    },
  },
});

export const { finishOnboarding } = onboardingSlice.actions;
export const onboardingReducer = onboardingSlice.reducer;
