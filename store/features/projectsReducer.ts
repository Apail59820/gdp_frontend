import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProjectModel } from '../../Models/ProjectModel';
// import { getAffairs } from '../../services/affairs.service';

export interface ProjectState {
    projects: ProjectModel[]
}


const initialState: ProjectState = {
    projects: []
}

const projectSlice = createSlice({
    name: 'projects',
    initialState: initialState,
    reducers: {
        getAllProjects(state: ProjectState) {
            const vals = {
                id : 2,
                project_manager: "Zinedine",
                project_name: "Ajouter des joueurs"
            }
            state.projects = [...state.projects]
            console.log('getallproject', state.projects)         
        },
        addProject(state: ProjectState, action: PayloadAction<ProjectModel>) {
            state.projects =  [...state.projects, action.payload]
        }
    }
})


//Reducer
export const { getAllProjects, addProject } = projectSlice.actions;

const projectsReducers = projectSlice.reducer;
export default projectsReducers;