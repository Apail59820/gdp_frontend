import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '../store';
import { UsClientsCompanyEntitiesModel } from '../../models/UserService/UsClientsCompanyEntitiesModel';

const initialState: Partial<UsClientsCompanyEntitiesModel>[] = [];

const clientsCompanyEntitiesSlice = createSlice({
  name: 'clientsCompanyEntities',
  initialState: initialState,
  reducers: {
    setClientsCompanyEntities: (state, action: PayloadAction<Partial<UsClientsCompanyEntitiesModel>[]>) => {
      return action.payload;
    },
  },
});
//Reducer
export const { setClientsCompanyEntities } = clientsCompanyEntitiesSlice.actions;

export const selectClientsCompanyEntities = (state: AppState) => state.clients_company_entities;

export default clientsCompanyEntitiesSlice.reducer;
