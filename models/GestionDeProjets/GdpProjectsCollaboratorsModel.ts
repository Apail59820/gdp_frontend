import { UsUserModel } from '../UserService/UsUserModel';
import { GdpActivitiesModel } from './GdpActivitiesModel';
import { GdpProjectsModel } from './GdpProjectsModel';

export type GdpProjectsCollaboratorsModel = {
  id: number;
  show_notifications: boolean;
  project_manager: boolean;

  projects_id: number | GdpProjectsModel;
  project_manager: boolean;
  directus_users_id: string | Partial<UsUserModel>;
  activities_id: number[] | GdpActivitiesModel[];
  project_manager: boolean;
};
