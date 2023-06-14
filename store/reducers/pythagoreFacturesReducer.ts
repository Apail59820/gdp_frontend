import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '../store';
import { GdpPythagoreAffaireModel, GdpPythagoreFactureModel } from '../../models/GdPModels';

export type PythagoreFacturesState = {
  items: Partial<GdpPythagoreFactureModel>[];
  count: number | null;
};

const initialState: PythagoreFacturesState = {
  items: [],
  count: null,
};

const pythagoreAffairesSlice = createSlice({
  name: 'pythagoreAffaires',
  initialState: initialState,
  reducers: {
    setPythagoreFactures: (state, action: PayloadAction<Partial<GdpPythagoreAffaireModel>[]>) => {
      state.items = action.payload;
    },
    setPythagoreFacturesCount: (state, action: PayloadAction<number | null>) => {
      state.count = action.payload;
    },
  },
});

//Action

//Reducer
export const { setPythagoreFactures, setPythagoreFacturesCount } = pythagoreAffairesSlice.actions;

export const selectPythagoreFactures = (state: AppState) => state.pythagoreFactures.items;
export const selectPythagoreFacturesCount = (state: AppState) => state.pythagoreFactures.count;

export default pythagoreAffairesSlice.reducer;
