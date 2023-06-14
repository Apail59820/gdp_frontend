import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GdpAffairModel } from '../../models/GdPModels';
import { AppState } from '../store';

export type AffairsState = {
  items: Partial<GdpAffairModel>[];
  count: number | null;
};

const initialState: AffairsState = {
  items: [],
  count: null,
};

const affairSlice = createSlice({
  name: 'affairs',
  initialState: initialState,
  reducers: {
    setAffairs: (state, action: PayloadAction<Partial<GdpAffairModel>[]>) => {
      state.items = action.payload;
    },
    setAffairsCount: (state, action: PayloadAction<number | null>) => {
      state.count = action.payload;
    },
  },
});
//Reducer
export const { setAffairs, setAffairsCount } = affairSlice.actions;

export const selectAffairs = (state: AppState) => state.affairs.items;
export const selectAffairsCount = (state: AppState) => state.affairs.count;

export default affairSlice.reducer;
