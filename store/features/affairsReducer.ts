import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AffairModel } from '../../models/AffairModel';
// import { getAffairs } from '../../services/affairs.service';

export interface AffairState {
  dataAffairs: AffairModel[];
}

const initialState: AffairState = {
  dataAffairs: [
    {
      id: 1,
      name: 'Affaire spéciale',
      city: 'Wasquehal',
    },
  ],
};

const affairSlice = createSlice({
  name: 'affair',
  initialState: initialState,
  reducers: {
    addAffair(state) {
      // const testAffaireToAdd = {id: 3, name: "Affaire très particulière", city:"Lille"}
      state.dataAffairs = [...state.dataAffairs];
      console.log('addaffair', state.dataAffairs);
    },
  },
});

//Action

//Reducer
export const { addAffair } = affairSlice.actions;

const affairReducers = affairSlice.reducer;
export default affairReducers;
