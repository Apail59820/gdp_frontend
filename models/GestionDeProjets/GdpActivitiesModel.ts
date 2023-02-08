import { UsUserModel } from '../UserService/UsUserModel';
import { GdpUsersNotificationModel } from './GdpUsersNotificationModel';

export enum NotificationActionEnum {
  Create = 'create',
  Delete = 'delete',
  Update = 'update',
}

export type GdpActivitiesModel = {
  id: number;
  action: NotificationActionEnum;
  collection: string | null;
  content: any | null;

  user_created: string | UsUserModel;
  date_created: Date;

  projects_id: number | null;
  affairs_id: number | null;
  affairs_phases_id: number | null;
  affairs_satisfaction_id: number | null;
  directus_files_id: string | null;
  affairs_pythagore_affaires_id: number | null;
  affairs_directus_users_id: number | null;
  projects_directus_users_clients_id: number | null;
  projects_directus_users_collaborators_id: number | null;
  notifications_id: number[] | GdpUsersNotificationModel[];
};
