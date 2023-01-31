import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AffairModel, UserAccessModel } from '../../Models/AffairModel';
import { UserModel } from '../../Models/UserModel';
import { getMyProfile } from '../../services/profile';

export interface UserState {
  userProfile: UserModel[];
  loading: UserModel['loading'];
  error: string;
}

const initialState: UserState = {
  userProfile: <UserModel[]>[],
  loading: false,
  error: '',
};

export const userProfile = createAsyncThunk('userProfile/getMyProfile', () =>
  getMyProfile().then((res) => {
    console.log('data userProfile', res.data);
    console.log('status', res.status);
    return res.data!;
  })
);

const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(userProfile.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(userProfile.fulfilled, (state, action: PayloadAction<UserModel>) => {
      state.loading = false;
      state.userProfile = [action.payload];
      console.log('State UserProfile', state.userProfile);
      state.error = '';
    });
    builder.addCase(userProfile.rejected, (state, action) => {
      state.loading = false;
      state.userProfile = [];
      state.error = action.error.message || 'Données du profil utilisateur actuellement indisponibles';
    });
  },
});

//Action

//Reducer
const userProfileReducer = userProfileSlice.reducer;
export default userProfileReducer;
