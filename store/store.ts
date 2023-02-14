import { AnyAction, configureStore, Reducer } from '@reduxjs/toolkit';
import affairReducer from './reducers/affairsReducer';
import projectsReducer from './reducers/projectsReducer';
import globalFilterReducer from './reducers/globalFilterReducer';
import authReducer, { AuthState } from './reducers/authReducer';
import pythagoreFacturesReducer from './reducers/pythagoreFacturesReducer';
import notificationsReducer, { notificationsState } from './reducers/notificationReducer';
import filesReducer from './reducers/filesReducer';
import usersReducer from './reducers/usersReducer';
import satisfactionReducer from './reducers/satisfactionReducer';
import { GlobalFiltersModel } from '../models/GlobalFiltersModel';
import { GdpProjectsModel } from '../models/GestionDeProjets/GdpProjectsModel';
import { GdpAffairModel } from '../models/GestionDeProjets/GdpAffairModel';
import { GdpPythagoreFactureModel } from '../models/GestionDeProjets/GdpPythagoreFactureModel';
import { GdpFilesModel } from '../models/GestionDeProjets/GdpFilesModel';
import { UsUserModel } from '../models/UserService/UsUserModel';
import { GdpSatisfactionModel } from '../models/GestionDeProjets/GdpSatisfactionModel';

export type StateType<T> = {
  data: T[];
  loading: boolean;
  error?: string;
};

export type AppState = {
  auth: AuthState;
  globalFilters: GlobalFiltersModel;
  projects: Partial<GdpProjectsModel>[];
  affairs: Partial<GdpAffairModel>[];
  pythagoreFactures: Partial<GdpPythagoreFactureModel>[];
  files: Partial<GdpFilesModel>[];
  users: Partial<UsUserModel>[];
  satisfactions: Partial<GdpSatisfactionModel>[];
  notifications: notificationsState;
};

export default configureStore({
  reducer: {
    auth: authReducer,
    globalFilters: globalFilterReducer,
    projects: projectsReducer,
    affairs: affairReducer,
    pythagoreFactures: pythagoreFacturesReducer,
    files: filesReducer,
    users: usersReducer,
    satisfactions: satisfactionReducer,
    notifications: notificationsReducer,
  },
});
