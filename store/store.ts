import { configureStore } from '@reduxjs/toolkit';
import affairsReducer from './features/affairsReducer';
import projectsUserReducer from './features/projectsUserReducer';
import userProfileReducer from './features/userProfileReducer';
import globalFilterReducer from "./features/globalFilterReducer";

export type StateType<T> = {
  data: T[],
  loading: boolean,
  error?: string,
}

export type StoreStatesType = any;

export default configureStore({
  reducer: {
    affairs: affairsReducer,
    userProfile: userProfileReducer,
    projectsUser: projectsUserReducer,
    globalFilters: globalFilterReducer,
  },
});
