import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import runReducer from './runSlice';
import goalsReducer from './goalsSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    run: runReducer,
    goals: goalsReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false, // Allows non-serializable values
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
