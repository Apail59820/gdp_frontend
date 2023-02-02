import { UsUserModel } from "../UserService/UsUserModel";
import { GdpActivitiesModel } from "./GdpActivitiesModel";
import { GdpProjectModel } from "./GdpProjectModel";

export type GdpProjectsCollaboratorsModel = {
  id: string;
  show_notifications: boolean;

  projects_id: number | GdpProjectModel;
  directus_users_id: string | UsUserModel;
  activities_id: number[] | GdpActivitiesModel[];
};

