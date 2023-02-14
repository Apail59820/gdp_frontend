import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GlobalFilterActionType, GlobalFiltersModel } from '../../models/GlobalFiltersModel';
import { AppState } from '../store';

const initialState: GlobalFiltersModel = {
  projects: {
    list: [],
    queryParameters: {},
    action: GlobalFilterActionType.ADD,
  },
  affairs: {
    list: [],
    queryParameters: {},
    action: GlobalFilterActionType.ADD,
  },
  pythagore_affaires: {
    list: [],
    queryParameters: {},
    action: GlobalFilterActionType.ADD,
  },
  files: {
    list: [],
    queryParameters: {},
    action: GlobalFilterActionType.ADD,
  },
  satisfaction: {
    list: [],
    queryParameters: {},
    action: GlobalFilterActionType.ADD,
  },
  clients: {
    list: [],
    queryParameters: {},
    action: GlobalFilterActionType.ADD,
  },
  collaborators: {
    list: [],
    queryParameters: {},
    action: GlobalFilterActionType.ADD,
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
