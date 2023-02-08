import { UsActivitiesModel } from './UsActivitiesModel';
import { UsClientsInteractionsModel } from './UsClientsInteractionsModel';
import { UsClientsCompanyEntitiesUsersModel } from './UsClientsCompanyEntitiesUsersModel';
import { UsCompanyEntitiesUsersModel } from './UsCompanyEntitiesUsersModel';

export type UsUserModel = {
  id: string;
  email: string;
  password: string;
  first_name: string | null;
  last_name: string | null;
  title: string | null;
  description: string | null;
  number: string | null;
  status: string;
  role: string;
  last_page: string | null;
  last_access: string | null;
  provider: string;
  external_identifier: string | null;
  cgu: boolean | null;
  email_notifications: boolean | null;
  show_notifications: boolean | null;
  show_documentation: boolean | null;

  activities_id: number[] | UsActivitiesModel[];
  clients_interactions_id: number[] | UsClientsInteractionsModel[];
  clients_company_entities: number[] | UsClientsCompanyEntitiesUsersModel[];
  company_entities: number[] | UsCompanyEntitiesUsersModel[];

  web_link: string | null;
  company: string | null;
};
