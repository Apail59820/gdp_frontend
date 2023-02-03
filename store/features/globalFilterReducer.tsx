import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GlobalFiltersModel } from "../../models/GlobalFiltersModel";

const initialState: GlobalFiltersModel = {
  projects: {
    list: [],
    filter: {},
  },
  affairs: {
    list: [],
    filter: {},
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
      return action.payload
    }
  },
});

//Action

//Reducer
export const { setGlobalFilters } = globalFilterSlice.actions;

const globalFilterReducer = globalFilterSlice.reducer;
export default globalFilterReducer;
