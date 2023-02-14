import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GdpAffairModel } from '../../models/GdPModels';
import { AppState, StateType } from '../store';

const initialState: StateType<Partial<GdpAffairModel>> = {
  data: [],
  loading: false,
};

const affairSlice = createSlice({
  name: 'affairs',
  initialState: initialState,
  reducers: {
    setAffairState: (state, action: PayloadAction<StateType<Partial<GdpAffairModel>>>) => {
      state.data = action.payload.data;
      state.loading = action.payload.loading;
      state.error = action.payload.error;
    },
  },
});
//Reducer
export const { setAffairState } = affairSlice.actions;

export const selectAffairsState = (state: AppState) => state.affairs;

export default affairSlice.reducer;
