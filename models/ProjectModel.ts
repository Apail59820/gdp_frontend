import { AffairModel } from './AffairModel';
import { CompanyEnum } from './CompanyEnum';

export type ProjectModel = {
  id?: string;
  name?: string;
  client_company_name?: string;
  client_info?: string;
  address?: string;
  zip_code?: string;
  city?: string;
  country?: string;
  image?: string;
  status?: string;
  project_type?: string;
  company_entity?: CompanyEnum;
  affairs?: AffairModel[];
};
