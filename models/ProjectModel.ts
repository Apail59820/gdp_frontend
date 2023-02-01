import { AffairModel } from './AffairModel';
import { CompanyEnum } from './CompanyEnum';

export type ProjectModel = {
  id: string;
  name: string;
  client_company_name: string;
  client_info: string;
  address: string;
  zip_code: string;
  city: string;
  country: string;
  status: string;
  project_type: string;
  company_entity: string;
  user_created: string;
  user_updated: string;
  date_created: string;
  date_updated: string;
  affairs_ids: [];
  files: [];
  activities_id: [];
  projects_directus_users_clients_ids: [];
  projects_directus_users_collaborators_ids: [];
};
