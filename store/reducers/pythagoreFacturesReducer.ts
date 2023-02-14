import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '../store';
import { GdpPythagoreFactureModel } from '../../models/GestionDeProjets/GdpPythagoreFactureModel';

const initialState: Partial<GdpPythagoreFactureModel>[] = [];

const pythagoreFacturesSlice = createSlice({
  name: 'pythagoreFactures',
  initialState: initialState,
  reducers: {
    setPythagoreFactures: (state, action: PayloadAction<Partial<GdpPythagoreFactureModel>[]>) => {
      return action.payload;
    },
  },
});

//Action

//Reducer
export const { setPythagoreFactures } = pythagoreFacturesSlice.actions;

export const selectPythagoreFactures = (state: AppState) => state.pythagoreFactures;

export default pythagoreFacturesSlice.reducer;
