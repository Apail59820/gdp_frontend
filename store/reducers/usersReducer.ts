import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '../store';
import { UsUserModel } from '../../models/UserService/UsUserModel';

const initialState: Partial<UsUserModel>[] = [];

const usersSlice = createSlice({
  name: 'users',
  initialState: initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<Partial<UsUserModel>[]>) => {
      return action.payload;
    },
  },
});

//Action

//Reducer
export const { setUsers } = usersSlice.actions;

export const selectUsers = (state: AppState) => state.projects;

export default usersSlice.reducer;
