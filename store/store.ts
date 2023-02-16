import { configureStore } from '@reduxjs/toolkit';
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
import { GdpFilesModel } from '../models/GestionDeProjets/GdpFilesModel';
import { UsUserModel } from '../models/UserService/UsUserModel';
import { GdpSatisfactionModel } from '../models/GestionDeProjets/GdpSatisfactionModel';
import { GdpPythagoreAffaireModel } from '../models/GdPModels';

export type AppState = {
  auth: AuthState;
  globalFilters: GlobalFiltersModel;
  projects: Partial<GdpProjectsModel>[];
  affairs: Partial<GdpAffairModel>[];
  pythagoreAffaires: Partial<GdpPythagoreAffaireModel>[];
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
    pythagoreAffaires: pythagoreFacturesReducer,
    files: filesReducer,
    users: usersReducer,
    satisfactions: satisfactionReducer,
    notifications: notificationsReducer,
  },
});
