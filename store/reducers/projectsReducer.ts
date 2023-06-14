import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GdpProjectsModel } from '../../models/GestionDeProjets/GdpProjectsModel';
import { AppState } from '../store';

export type ProjectsState = {
  items: Partial<GdpProjectsModel>[];
  count: number | null;
};

const initialState: ProjectsState = {
  items: [],
  count: null,
};

const projectsUserSlice = createSlice({
  name: 'projects',
  initialState: initialState,
  reducers: {
    setProjects: (state, action: PayloadAction<Partial<GdpProjectsModel>[]>) => {
      state.items = action.payload;
    },
    setProjectsCount: (state, action: PayloadAction<number | null>) => {
      state.count = action.payload;
    },
  },
});

//Action

//Reducer
export const { setProjects, setProjectsCount } = projectsUserSlice.actions;

export const selectProjects = (state: AppState) => state.projects.items;
export const selectProjectsCount = (state: AppState) => state.projects.count;

export default projectsUserSlice.reducer;
