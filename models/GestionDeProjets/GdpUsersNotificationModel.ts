import { GdpActivitiesModel } from './GdpActivitiesModel';
import { UsUserModel } from '../UserService/UsUserModel';

export type GdpUsersNotificationModel = {
  id: number;
  seen: boolean;
  sent_mail: boolean;

  user_created: string | UsUserModel;
  date_created: Date;
  user_updated: string | UsUserModel | null;
  date_updated: Date | null;

  directus_users_id: string | UsUserModel;
  activities_id: number | GdpActivitiesModel;
};
