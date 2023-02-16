import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GdpAffairModel } from '../../models/GdPModels';
import { AppState } from '../store';

const initialState: Partial<GdpAffairModel>[] = [];

const affairSlice = createSlice({
  name: 'affairs',
  initialState: initialState,
  reducers: {
    setAffairs: (state, action: PayloadAction<Partial<GdpAffairModel>[]>) => {
      return action.payload;
    },
  },
});
//Reducer
export const { setAffairs } = affairSlice.actions;

export const selectAffairs = (state: AppState) => state.affairs;

export default affairSlice.reducer;
