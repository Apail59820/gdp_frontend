import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '../store';
import { GdpFilesModel } from '../../models/GestionDeProjets/GdpFilesModel';

const initialState: Partial<GdpFilesModel>[] = [];

const filesSlice = createSlice({
  name: 'files',
  initialState: initialState,
  reducers: {
    setFiles: (state, action: PayloadAction<Partial<GdpFilesModel>[]>) => {
      return action.payload;
    },
  },
});

//Action

//Reducer
export const { setFiles } = filesSlice.actions;

export const selectFiles = (state: AppState) => state.projects;

export default filesSlice.reducer;
