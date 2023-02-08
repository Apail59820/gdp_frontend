import { UsUserModel } from './UsUserModel';

export type UsClientsInteractionsModel = {
  id: number;
  type: string;
  content: any | null;
  comment: string | null;

  user_created: string | UsUserModel;
  date_created: Date;
  user_updated: string | UsUserModel | null;
  date_updated: Date | null;

  directus_users_id: number | UsUserModel;
};
