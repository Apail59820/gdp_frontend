import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '../store';
import { UsUserModel } from '../../models/UsModels';
// import { AppState } from "./store";

// Type for our state
export interface AuthState {
  authState: boolean;
  userProfile: Partial<UsUserModel> | null;
}

// Initial state
const initialState: AuthState = {
  authState: false,
  userProfile: null,
};

// Actual Slice
const authReducer = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Action to set the authentication status
    setAuthState(state: AuthState, action: PayloadAction<boolean>) {
      state.authState = action.payload;
    },
    setUserProfile(state: AuthState, action: PayloadAction<Partial<UsUserModel>>) {
      state.userProfile = action.payload;
    },
  },
});

export const { setAuthState, setUserProfile } = authReducer.actions;

export const selectAuthState = (state: AppState) => state.auth.authState;
export const selectUserProfile = (state: AppState) => state.auth.userProfile;

export default authReducer.reducer;
