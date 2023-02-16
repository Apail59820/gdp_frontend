import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '../store';
import { GdpPythagoreAffaireModel } from '../../models/GdPModels';

const initialState: Partial<GdpPythagoreAffaireModel>[] = [];

const pythagoreAffairesSlice = createSlice({
  name: 'pythagoreAffaires',
  initialState: initialState,
  reducers: {
    setPythagoreAffaires: (state, action: PayloadAction<Partial<GdpPythagoreAffaireModel>[]>) => {
      return action.payload;
    },
  },
});

//Action

//Reducer
export const { setPythagoreAffaires } = pythagoreAffairesSlice.actions;

export const selectPythagoreAffaires = (state: AppState) => state.pythagoreAffaires;

export default pythagoreAffairesSlice.reducer;
