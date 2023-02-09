import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GdpProjectsModel } from '../../models/GestionDeProjets/GdpProjectsModel';
import { AppState } from '../store';

const initialState: Partial<GdpProjectsModel>[] = [];

const projectsUserSlice = createSlice({
  name: 'projects',
  initialState: initialState,
  reducers: {
    setProjects: (state, action: PayloadAction<Partial<GdpProjectsModel>[]>) => {
      return action.payload;
    },
  },
});

//Action

//Reducer
export const { setProjects } = projectsUserSlice.actions;

export const selectProjects = (state: AppState) => state.projects;

export default projectsUserSlice.reducer;
