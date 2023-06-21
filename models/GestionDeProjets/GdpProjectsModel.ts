import { GdpAffairModel } from './GdpAffairModel';
import { UsUserModel } from '../UserService/UsUserModel';
import { UsCompanyEntityModel } from '../UserService/UsCompanyEntityModel';
import { GdpActivitiesModel } from './GdpActivitiesModel';
import { GdpProjectsCollaboratorsModel } from './GdpProjectsCollaboratorsModel';
import { GdpProjectsClientsModel } from './GdpProjectsClientsModel';

export enum GdpProjectTypesEnum {
  CO_TRAITANCE = 'co-traitance',
  SOUS_TRAITANCE = 'sous-traitance',
}

export enum GdpProjectStatusEnum {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  DELETED = 'deleted',
}

export type GdpProjectsModel = {
  id: number;
  name: string;
  client_company_name: string | null;
  client_info: string | null;
  address: string | null;
  zip_code: string | null;
  city: string | null;
  country: string | null;
  status: GdpProjectStatusEnum;
  project_type: GdpProjectTypesEnum;

  user_created: string | UsUserModel;
  date_created: Date;
  user_updated: string | UsUserModel | null;
  date_updated: Date | null;

  projects_directus_users_clients_ids: number[] | GdpProjectsClientsModel[];
  projects_directus_users_collaborators_ids: number[] | GdpProjectsCollaboratorsModel[];
  company_entity: number | UsCompanyEntityModel;
  files: string[] | GdpAffairModel[];
  affairs_ids: number[] | GdpAffairModel[];
  activities_id: number[] | GdpActivitiesModel[];
};
