import { UsUserModel } from '../UserService/UsUserModel';
import { GdpActivitiesModel } from './GdpActivitiesModel';
import { GdpProjectsModel } from './GdpProjectsModel';

export type GdpProjectsCollaboratorsModel = {
  id: string;
  show_notifications: boolean;
  project_manager: boolean;

  projects_id: number | GdpProjectsModel;
  directus_users_id: string | UsUserModel;
  activities_id: number[] | GdpActivitiesModel[];
};
