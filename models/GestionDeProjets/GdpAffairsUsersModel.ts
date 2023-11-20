import { UsUserModel } from '../UserService/UsUserModel';
import { GdpAffairModel } from './GdpAffairModel';
import { GdpActivitiesModel } from './GdpActivitiesModel';

export type GdpAffairsUsersModel = {
  id: number;
  show_notifications: boolean;
  project_manager: boolean;

  affairs_id: number | GdpAffairModel;
  directus_users_id: string | Partial<UsUserModel>;
  activities_id: number[] | GdpActivitiesModel[];
};
