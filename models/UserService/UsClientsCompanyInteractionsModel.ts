import { UsUserModel } from './UsUserModel';
import { UsCompanyEntityModel } from './UsCompanyEntityModel';

export type UsClientsCompanyInteractionsModel = {
  id: number;
  type: string;
  content: any | null;
  comment: string | null;

  user_created: string | UsUserModel;
  date_created: Date;
  user_updated: string | UsUserModel | null;
  date_updated: Date | null;

  entity_id: number | UsCompanyEntityModel;
};
