import { UsUserModel } from './UsUserModel';
import { UsActivitiesModel } from './UsActivitiesModel';

export type UsUsersNotificationModel = {
  id: number;
  seen: boolean;
  sent_mail: boolean;

  user_created: string | UsUserModel;
  date_created: Date;
  user_updated: string | UsUserModel | null;
  date_updated: Date | null;

  directus_users_id: string | UsUserModel;
  activity_id: number | UsActivitiesModel;
};
