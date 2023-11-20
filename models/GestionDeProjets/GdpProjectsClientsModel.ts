import { UsUserModel } from '../UserService/UsUserModel';
import { GdpActivitiesModel } from './GdpActivitiesModel';
import { GdpProjectsModel } from './GdpProjectsModel';
import {GdpAffairModel} from "./GdpAffairModel";

export type GdpProjectsClientsModel = {
  id: number;
  show_notifications: boolean;

  projects_id: number | GdpProjectsModel;
  directus_users_id: string | Partial<UsUserModel>;
  activities_id: number[] | GdpActivitiesModel[];
  affairs_id: number | GdpAffairModel;
};
