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
  activity_id: number | GdpActivitiesModel;
};

// TODO: notifications: { messages : [], ids: []} // notifications: { ids: [{elemnts : [id, message_id]}]}
export type TopBarNotificationProp = {
  messages: string[];
  ids: number[];
  amount: number;
  page?: string;
  onMarkAsRead: (id: number) => void;
}
