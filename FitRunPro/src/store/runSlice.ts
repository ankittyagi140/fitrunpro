import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface RunStats {
  distance: number;
  duration: number;
  pace: number;
  calories?: number;
  type?: string;
}

export interface RunState {
  currentRun: RunStats | null;
  pastRuns: RunStats[];
}

const initialState: RunState = {
  currentRun: null,
  pastRuns: []
};

const runSlice = createSlice({
  name: 'run',
  initialState,
  reducers: {
    startRun: (state) => {
      state.currentRun = {
        distance: 0,
        duration: 0,
        pace: 0
      };
    },
    updateRunStats: (state, action: PayloadAction<Partial<RunStats>>) => {
      if (state.currentRun) {
        state.currentRun = {
          ...state.currentRun,
          ...action.payload
        };
      }
    },
    finishRun: (state, action: PayloadAction<RunStats>) => {
      if (state.currentRun) {
        state.pastRuns.unshift({
          ...state.currentRun,
          ...action.payload
        });
        state.currentRun = null;
      }
    },
    clearRuns: (state) => {
      state.currentRun = null;
      state.pastRuns = [];
    }
  }
});

export const { 
  startRun, 
  updateRunStats, 
  finishRun,
  clearRuns 
} = runSlice.actions;

export default runSlice.reducer;
