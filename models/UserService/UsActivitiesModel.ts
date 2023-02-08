import { UsUserModel } from './UsUserModel';

export enum UsActivitiesActionEnum {
  Create = 'create',
  Delete = 'delete',
  Update = 'update',
}

export type UsActivitiesModel = {
  id: number;
  action: UsActivitiesActionEnum;
  collection: string | null;
  content: any | null;

  user_created: string | UsUserModel;
  date_created: Date;

  company_entities_id: number | null;
  company_entities_directus_users_id: number | null;
  clients_company_entities_id: number | null;
  clients_company_entities_directus_users_id: number | null;
  // notifications_id: number[] | UsNotificationModel[];
};
