import { configureStore } from '@reduxjs/toolkit';
import affairReducer from './features/affairsReducer';
import projectsUserReducer from './features/projectsUserReducer';
import userProfileReducer from './features/userProfileReducer';
import globalFilterReducer from './features/globalFilterReducer';
import authReducer from './authSlice';

export type StateType<T> = {
  data: T[];
  loading: boolean;
  error?: string;
};

export type StoreStatesType = any;
export type AppState = any; //TODO

export default configureStore({
  reducer: {
    auth: authReducer,
    affairs: affairReducer,
    userProfile: userProfileReducer,
    projectsUser: projectsUserReducer,
    globalFilters: globalFilterReducer,
  },
});
