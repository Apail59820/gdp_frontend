import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GlobalFiltersModel } from '../../models/GlobalFiltersModel';
import { AppState } from '../store';

const initialState: GlobalFiltersModel = {
  projects: {
    list: [],
    filter: { filter: {} },
  },
  affairs: {
    list: [],
    filter: { limit: '50' },
  },
  pythagore_affaires: {
    list: [],
    filter: {},
  },
  files: {
    list: [],
    filter: {},
  },
  satisfaction: {
    list: [],
    filter: {},
  },
  clients: {
    list: [],
    filter: {},
  },
  collaborators: {
    list: [],
    filter: {},
  },
};

const globalFilterSlice = createSlice({
  name: 'globalFilterReducer',
  initialState: initialState,
  reducers: {
    setGlobalFilters(state, action: PayloadAction<GlobalFiltersModel>) {
      return action.payload;
    },
  },
});

//Reducer
export const { setGlobalFilters } = globalFilterSlice.actions;

export const selectGlobalFilters = (state: AppState) => state.globalFilters;

const globalFilterReducer = globalFilterSlice.reducer;
export default globalFilterReducer;
