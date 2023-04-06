import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '../store';
import { GdpPythagoreAffaireModel } from '../../models/GdPModels';

export type PythagoreAffairesState = {
  items: Partial<GdpPythagoreAffaireModel>[];
  count: number | null;
};

const initialState: PythagoreAffairesState = {
  items: [],
  count: null,
};

const pythagoreAffairesSlice = createSlice({
  name: 'pythagoreAffaires',
  initialState: initialState,
  reducers: {
    setPythagoreAffaires: (state, action: PayloadAction<Partial<GdpPythagoreAffaireModel>[]>) => {
      state.items = action.payload;
    },
    setPythagoreAffairesCount: (state, action: PayloadAction<number | null>) => {
      state.count = action.payload;
    },
  },
});

//Action

//Reducer
export const { setPythagoreAffaires, setPythagoreAffairesCount } = pythagoreAffairesSlice.actions;

export const selectPythagoreAffaires = (state: AppState) => state.pythagoreAffaires.items;
export const selectPythagoreAffairesCount = (state: AppState) => state.pythagoreAffaires.count;

export default pythagoreAffairesSlice.reducer;
