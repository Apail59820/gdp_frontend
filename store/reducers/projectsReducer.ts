import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GdpProjectModel } from '../../models/GestionDeProjets/GdpProjectModel';
import { AppState } from '../store';

const initialState: Partial<GdpProjectModel>[] = [];

const projectsUserSlice = createSlice({
  name: 'projects',
  initialState: initialState,
  reducers: {
    setProjects: (state, action: PayloadAction<Partial<GdpProjectModel>[]>) => {
      return action.payload;
    },
  },
});

//Action

//Reducer
export const { setProjects } = projectsUserSlice.actions;

export const selectProjects = (state: AppState) => state.projects;

export default projectsUserSlice.reducer;
