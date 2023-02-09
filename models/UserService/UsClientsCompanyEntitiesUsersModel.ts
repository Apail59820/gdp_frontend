import { UsUserModel } from './UsUserModel';
import { UsActivitiesModel } from './UsActivitiesModel';
import { UsClientsCompanyEntitiesModel } from './UsClientsCompanyEntitiesModel';

export type UsClientsCompanyEntitiesUsersModel = {
  id: number;
  is_leader: boolean;
  is_current_job: boolean;
  job_title: string | null;
  start_date: Date | null;
  end_date: Date | null;

  user_created: string | UsUserModel;
  date_created: Date;
  user_updated: string | UsUserModel | null;
  date_updated: Date | null;

  clients_company_entities_id: number | UsClientsCompanyEntitiesModel;
  directus_users_id: number | UsUserModel;
  activities_id: number[] | UsActivitiesModel[];
};
