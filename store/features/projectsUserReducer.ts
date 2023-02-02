import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AffairModel } from '../../models/AffairModel';
import { ProjectModel } from '../../models/ProjectModel';

import projects from '../mocks/projects.json';

type Range = {
  offSet: number;
  limit: number;
};

export interface ProjectsUserState {
  projectsUser: any;
  range: Range;
}

const initialState: ProjectsUserState = {
  projectsUser: [],
  range: {
    offSet: 0,
    limit: 0,
  },
};

export const getProjects = createAsyncThunk('projectsUser/getProjectsUser', () => {
  return projects;
});

//initialisation du state avec les 2 derniers projets de l'utilisateur

const projectsUserSlice = createSlice({
  name: 'projectsUser',
  initialState: initialState,
  reducers: {
    getProjects(state) {
      state.projectsUser = projects;
    },
    rangeDataSelection: (state, action: PayloadAction<Range>) => {
      state.range = action.payload;
    },
    projectsUserByRange: (state) => {
      // Data by range, use rangeDataSelection in your components to determine a range offSet and a range limit
      state.projectsUser = state.projectsUser.slice(state.range.offSet, state.range.limit);
    },

    // searchByAffairName: (state, action: PayloadAction<string>) => {
    //   state.filteredAffairsByName = state.affairs.filter((e) =>
    //     e?.name?.toLowerCase().includes(action.payload.toLowerCase())
    //   );
    // },
  },
  extraReducers: (builder) => {
    // builder.addCase(affairs.pending, (state) => {
    //   state.loading = true;
    // });
    builder.addCase(getProjects.fulfilled, (state, action: PayloadAction<any>) => {
      state.projectsUser = action.payload;
    });
    // builder.addCase(affairs.rejected, (state, action) => {
    //   state.loading = false;
    //   state.affairs = [];
    //   state.error = action.error.message || 'Données actuellement indisponibles';
    // });
  },
});

//Action

//Reducer
export const { rangeDataSelection, projectsUserByRange } = projectsUserSlice.actions;

const projectsUserReducer = projectsUserSlice.reducer;
export default projectsUserReducer;
