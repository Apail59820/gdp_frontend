import { UsUserModel } from '../UserService/UsUserModel';
import { GdpActivitiesModel } from './GdpActivitiesModel';
import { GdpProjectsModel } from './GdpProjectsModel';

export type GdpProjectsClientsModel = {
  id: string;
  show_notifications: boolean;

  projects_id: number | GdpProjectsModel;
  directus_users_id: string | Partial<UsUserModel>;
  activities_id: number[] | GdpActivitiesModel[];
};
