import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GlobalFiltersModel } from '../../models/GlobalFiltersModel';
import { AppState } from '../store';

let initialState: GlobalFiltersModel = {
  projects: {
    list: [],
    queryParameters: {},
    listWithNames: [],
  },
  affairs: {
    list: [],
    queryParameters: {},
    listWithNames: [],
  },
  pythagore_affaires: {
    list: [],
    queryParameters: {},
    listWithNames: [],
  },
  files: {
    list: [],
    queryParameters: {},
  },
  satisfaction: {
    list: [],
    queryParameters: {},
  },
  clients: {
    list: [],
    queryParameters: {},
    listWithNames: [],
  },
  collaborators: {
    list: [],
    queryParameters: {},
    listWithNames: [],
  },
  company_entities: {
    list: [],
    queryParameters: {},
    listWithNames: [],
  },
  clients_company_entities: {
    list: [],
    queryParameters: {},
    listWithNames: [],
  },
};

//TODO: fix this
// (typeof window !== 'undefined') causes Hydratation error but sessionStorage cannot be used server side
// Error: Hydration failed because the initial UI does not match what was rendered on the server.
// This is a common problem when using server rendering and client side routing (for example, when doing code splitting).
// Make sure that your initial UI matches what the server rendered.
if (typeof window !== 'undefined') {
  const globalFiltersFromSessionString = sessionStorage.getItem('gestionDeProjets_globalFilters');
  if (globalFiltersFromSessionString) {
    try {
      const globalFiltersFromSession = JSON.parse(globalFiltersFromSessionString);
      if (globalFiltersFromSession) {
        initialState = globalFiltersFromSession as GlobalFiltersModel;
      }
    } catch (e) {
      console.error('Error while parsing global filters from session storage', e);
      sessionStorage.removeItem('gestionDeProjets_globalFilters');
      location.reload();
    }
  }
}
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
