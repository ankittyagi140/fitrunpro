import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FitnessGoal {
  id: string;
  type: 'distance' | 'duration' | 'calories';
  target: number;
  progress: number;
  startDate: string;
  endDate?: string;
}

interface GoalsState {
  activeGoals: FitnessGoal[];
  completedGoals: FitnessGoal[];
}

const initialState: GoalsState = {
  activeGoals: [],
  completedGoals: [],
};

const goalsSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {
    addGoal: (state, action: PayloadAction<FitnessGoal>) => {
      state.activeGoals.push(action.payload);
    },
    updateGoalProgress: (state, action: PayloadAction<{
      goalId: string;
      progress: number;
    }>) => {
      const goal = state.activeGoals.find(g => g.id === action.payload.goalId);
      if (goal) {
        goal.progress = action.payload.progress;
        
        // Check if goal is completed
        if (goal.progress >= goal.target) {
          state.completedGoals.push({
            ...goal,
            endDate: new Date().toISOString()
          });
          state.activeGoals = state.activeGoals.filter(g => g.id !== goal.id);
        }
      }
    },
    removeGoal: (state, action: PayloadAction<string>) => {
      state.activeGoals = state.activeGoals.filter(goal => goal.id !== action.payload);
    }
  }
});

export const { addGoal, updateGoalProgress, removeGoal } = goalsSlice.actions;
export default goalsSlice.reducer;
