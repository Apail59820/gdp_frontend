import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GlobalFilterActionType, GlobalFiltersModel } from '../../models/GlobalFiltersModel';
import { AppState } from '../store';

const initialState: GlobalFiltersModel = {
  projects: {
    list: [],
    queryParameters: {},
    action: GlobalFilterActionType.REPLACE,
  },
  affairs: {
    list: [],
    queryParameters: {},
    action: GlobalFilterActionType.REPLACE,
  },
  pythagore_affaires: {
    list: [],
    queryParameters: {},
    action: GlobalFilterActionType.REPLACE,
  },
  files: {
    list: [],
    queryParameters: {},
    action: GlobalFilterActionType.REPLACE,
  },
  satisfaction: {
    list: [],
    queryParameters: {},
    action: GlobalFilterActionType.REPLACE,
  },
  clients: {
    list: [],
    queryParameters: {},
    action: GlobalFilterActionType.REPLACE,
  },
  collaborators: {
    list: [],
    queryParameters: {},
    action: GlobalFilterActionType.REPLACE,
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

export default globalFilterSlice.reducer;
