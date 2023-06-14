import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '../store';
import { GdpFilesModel } from '../../models/GestionDeProjets/GdpFilesModel';

export type FilesState = {
  items: Partial<GdpFilesModel>[];
  count: number | null;
};

const initialState: FilesState = {
  items: [],
  count: null,
};

const filesSlice = createSlice({
  name: 'files',
  initialState: initialState,
  reducers: {
    setFiles: (state, action: PayloadAction<Partial<GdpFilesModel>[]>) => {
      state.items = action.payload;
    },
    setFilesCount: (state, action: PayloadAction<number | null>) => {
      state.count = action.payload;
    },
  },
});

//Reducer
export const { setFiles, setFilesCount } = filesSlice.actions;

export const selectFiles = (state: AppState) => state.files.items;
export const selectFilesCount = (state: AppState) => state.files.count;

export default filesSlice.reducer;
