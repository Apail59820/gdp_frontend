import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '../store';
import { GdpSatisfactionModel } from '../../models/GdPModels';

const initialState: Partial<GdpSatisfactionModel>[] = [];

const usersSlice = createSlice({
  name: 'satisfactions',
  initialState: initialState,
  reducers: {
    setSatisfactions: (state, action: PayloadAction<Partial<GdpSatisfactionModel>[]>) => {
      return action.payload;
    },
  },
});

//Action

//Reducer
export const { setSatisfactions } = usersSlice.actions;

export const selectSatisfactions = (state: AppState) => state.satisfactions;

export default usersSlice.reducer;
