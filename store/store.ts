import { configureStore } from '@reduxjs/toolkit';
import affairReducer, { AffairsState } from './reducers/affairsReducer';
import projectsReducer, { ProjectsState } from './reducers/projectsReducer';
import globalFilterReducer from './reducers/globalFilterReducer';
import authReducer, { AuthState } from './reducers/authReducer';
import pythagoreFacturesReducer, { PythagoreAffairesState } from './reducers/pythagoreFacturesReducer';
import notificationsReducer, { notificationsState } from './reducers/notificationReducer';
import filesReducer, { FilesState } from './reducers/filesReducer';
import usersReducer from './reducers/usersReducer';
import satisfactionReducer from './reducers/satisfactionReducer';
import { GlobalFiltersModel } from '../models/GlobalFiltersModel';
import { UsUserModel } from '../models/UserService/UsUserModel';
import { GdpSatisfactionModel } from '../models/GestionDeProjets/GdpSatisfactionModel';
import { UsCompanyEntityModel } from '../models/UserService/UsCompanyEntityModel';
import companyEntitiesReducer from './reducers/companyEntitiesReducer';
import { UsClientsCompanyEntitiesModel } from '../models/UserService/UsClientsCompanyEntitiesModel';
import clientsCompanyEntitiesReducer from './reducers/clientsCompanyEntitiesReducer';

export type AppState = {
  auth: AuthState;
  globalFilters: GlobalFiltersModel;
  projects: ProjectsState;
  affairs: AffairsState;
  pythagoreAffaires: PythagoreAffairesState;
  files: FilesState;
  users: Partial<UsUserModel>[];
  satisfactions: Partial<GdpSatisfactionModel>[];
  notifications: notificationsState;
  companyEntities: Partial<UsCompanyEntityModel>[];
  clients_company_entities: Partial<UsClientsCompanyEntitiesModel>[];
};

export default configureStore({
  reducer: {
    auth: authReducer,
    globalFilters: globalFilterReducer,
    projects: projectsReducer,
    affairs: affairReducer,
    pythagoreAffaires: pythagoreFacturesReducer, //TODO Get Factures but with PythagoreAffaires in globalFilters
    files: filesReducer,
    users: usersReducer,
    satisfactions: satisfactionReducer,
    notifications: notificationsReducer,
    companyEntities: companyEntitiesReducer,
    clients_company_entities: clientsCompanyEntitiesReducer,
  },
});
