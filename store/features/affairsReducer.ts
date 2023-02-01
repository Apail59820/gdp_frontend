import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AffairModel } from '../../models/AffairModel';

import { getAffairs } from '../../services/affairs';

export interface AffairState {
  affairs: AffairModel[];
  loading: AffairModel['loading'];
  error: string;
  filteredAffairsByName: AffairModel[];
}

const initialState: AffairState = {
  affairs: <AffairModel[]>[],
  loading: false,
  error: '',
  filteredAffairsByName: <AffairModel[]>[],
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
    builder.addCase(affairs.fulfilled, (state, action: PayloadAction<AffairModel[]>) => {
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
