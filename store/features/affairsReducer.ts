import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GdpAffairModel } from '../../models/GestionDeProjets/GdpAffairModel';

import { getAffairs } from '../../services/affairs';

export interface AffairState {
  affairs: GdpAffairModel[];
  loading: boolean;
  error: string;
  filteredAffairsByName: GdpAffairModel[];
}

const initialState: AffairState = {
  affairs: <GdpAffairModel[]>[],
  loading: false,
  error: '',
  filteredAffairsByName: <GdpAffairModel[]>[],
};

export const affairs = createAsyncThunk('affairs/getAffairs', () =>
  getAffairs().then((data) => {
    return data.data!;
  })
);

const affairSlice = createSlice({
  name: 'affairs',
  initialState: initialState,
  reducers: {
    // addAffair(state, action: PayloadAction<AffairModel[]>) {
    //   console.log('state addAffair', state.affairs);
    //   state.affairs = action.payload;
    // },
    searchByAffairName: (state, action: PayloadAction<string>) => {
      state.filteredAffairsByName = state.affairs.filter((e) =>
        e?.name?.toLowerCase().includes(action.payload.toLowerCase())
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(affairs.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(affairs.fulfilled, (state, action: PayloadAction<GdpAffairModel[]>) => {
      state.loading = false;
      state.affairs = action.payload;
      state.filteredAffairsByName = action.payload;
      state.error = '';
    });
    builder.addCase(affairs.rejected, (state, action) => {
      state.loading = false;
      state.affairs = [];
      state.error = action.error.message || 'Données actuellement indisponibles';
    });
  },
});

//Action

//Reducer
export const { searchByAffairName } = affairSlice.actions;

const affairReducers = affairSlice.reducer;
export default affairReducers;
