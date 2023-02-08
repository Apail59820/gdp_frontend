import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UsUserModel } from '../../models/UserService/UsUserModel';
import { getMyUsProfile } from '../../services/userService/UsUsers';

export interface UserState {
  userProfile: UsUserModel[];
  loading: boolean;
  error: string;
}

const initialState: UserState = {
  userProfile: [],
  loading: false,
  error: '',
};

export const userProfile = createAsyncThunk('userProfile/getMyProfile', () =>
  getMyUsProfile().then((res) => {
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
    // builder.addCase(userProfile.fulfilled, (state, action: PayloadAction<UsUserModel>) => {
    //   state.loading = false;
    //   state.userProfile = [action.payload];
    //   // console.log('State UserProfile', state.userProfile);
    //   state.error = '';
    // });
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
