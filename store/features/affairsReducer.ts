import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AffairModel } from '../../models/AffairModel';
import { current } from '@reduxjs/toolkit';
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
    console.log('data', data.data);
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
    searchByAffairName(state, action: PayloadAction<string>) {
      const filtered = [...state.affairs].filter((e) => e?.name?.toLowerCase().includes(action.payload.toLowerCase()));
      state.filteredAffairsByName = filtered;
      console.log('state.filteredAffairsByName', state.filteredAffairsByName);
    },
    // searchByAffairName: (state, action) => {
    //   const filteredAffairsByName = [...state.affairs].filter((e) =>
    //     e.name?.toLowerCase().includes(action.payload.toLowerCase())
    //   );
    //   return {
    //     ...state,
    //     filteredAffairsByName: action.payload.length > 0 ? filteredAffairsByName : [...state.affairs],
    //   };
    // },
  },
  extraReducers: (builder) => {
    builder.addCase(affairs.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(affairs.fulfilled, (state, action: PayloadAction<AffairModel[]>) => {
      state.loading = false;
      state.affairs = action.payload;
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
