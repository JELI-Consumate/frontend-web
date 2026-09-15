import { createSlice } from '@reduxjs/toolkit';

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
