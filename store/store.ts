import { configureStore } from '@reduxjs/toolkit';
import affairReducer from './reducers/affairsReducer';
import projectsReducer from './reducers/projectsReducer';
import globalFilterReducer from './reducers/globalFilterReducer';
import authReducer from './reducers/authReducer';
import pythagoreFacturesReducer from './reducers/pythagoreFacturesReducer';
import notificationsReducer from './reducers/notificationReducer';
import filesReducer from './reducers/filesReducer';
import usersReducer from './reducers/usersReducer';
import satisfactionReducer from './reducers/satisfactionReducer';

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
    globalFilters: globalFilterReducer,
    projects: projectsReducer,
    affairs: affairReducer,
    pythagoreFactures: pythagoreFacturesReducer,
    files: filesReducer,
    users: usersReducer,
    satisfaction: satisfactionReducer,
    notification: notificationsReducer,
  },
});
