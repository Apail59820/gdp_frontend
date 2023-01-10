import { AffairModel } from './AffairModel';

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
  company_entity?: CompanyEntity;
  affairs?: AffairModel[];
};

export enum CompanyEntity {
  AMEXIA = 'amexia',
  DIAGOBAT = 'diagobat',
  IMPERIUM = 'imperium',
  PROBIM = 'probim',
  PROJEX = 'projex',
}
