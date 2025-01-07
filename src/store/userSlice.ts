import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  age?: number;
  weight?: number;  // in kg
  height?: number;  // in cm
  sex?: 'male' | 'female' | 'other';
  profilePicture?: string;
  fitnessGoals?: {
    weeklyRunDistance?: number;
    caloriesBurnGoal?: number;
  };
  trainingLevel?: 'beginner' | 'intermediate' | 'advanced';
}

export interface UserState {
  profile: UserProfile;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  profile: {
    name: '',
    email: '',
    age: undefined,
    weight: undefined,
    height: undefined,
    sex: undefined,
    profilePicture: undefined,
    fitnessGoals: {},
    trainingLevel: 'beginner'
  },
  isAuthenticated: false
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserProfile>) => {
      state.profile = { ...state.profile, ...action.payload };
      state.isAuthenticated = true;
    },
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      state.profile = { ...state.profile, ...action.payload };
    },
    clearUser: (state) => {
      state.profile = initialState.profile;
      state.isAuthenticated = false;
    },
    setProfilePicture: (state, action: PayloadAction<string>) => {
      state.profile.profilePicture = action.payload;
    }
  }
});

export const { 
  setUser, 
  updateProfile, 
  clearUser, 
  setProfilePicture 
} = userSlice.actions;

export default userSlice.reducer;
