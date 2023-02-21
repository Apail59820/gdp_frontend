import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '../store';
import { UsCompanyEntityModel } from '../../models/UserService/UsCompanyEntityModel';

const initialState: Partial<UsCompanyEntityModel>[] = [];

const companyEntitiesSlice = createSlice({
  name: 'companyEntities',
  initialState: initialState,
  reducers: {
    setCompanyEntities: (state, action: PayloadAction<Partial<UsCompanyEntityModel>[]>) => {
      return action.payload;
    },
  },
});
//Reducer
export const { setCompanyEntities } = companyEntitiesSlice.actions;

export const selectCompanyEntities = (state: AppState) => state.companyEntities;

export default companyEntitiesSlice.reducer;
