import { UserModel } from './UserModels';
import { AssetModel } from './AssetModel';
import { SatisfactionModel } from './SatisfactionModel';
import { PythagoreAffaireModel } from './PythagoreAffaireModel';

export enum AffairStatusEnum {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  DELETED = 'deleted',
}

export type AffairModel = {
  id?: string | number;
  user_created?: string | UserModel;
  date_created?: Date;
  user_updated?: string | UserModel;
  date_updated?: Date;
  name?: string;
  client_company_name?: string;
  client_info?: string;
  internal_company?: string;
  address?: string;
  zip_code?: string;
  city?: string;
  country?: string;
  image?: string | AssetModel;
  pythagore_ids?: (number | AffairsPythagoreAffairesModel)[];
  status?: AffairStatusEnum;
  user_access?: Array<UserAccessModel>;
  affairs_satisfaction?: string[] | number[] | SatisfactionModel[];
};

export type AffairsPythagoreAffairesModel = {
  id?: number;
  affairs_id?: number;
  pythagore_affaires_id?: string | PythagoreAffaireModel;
};

export type UserAccessModel = {
  id?: number;
  affairs_id?: number | AffairModel;
  directus_users_id?: string | UserModel;
  show_notifications?: boolean;
  project_manager?: boolean;
};

export type CreateAffairModel = {
  name: string;
  user_created?: string;
  client_company_name?: string;
  client_info?: string;
  internal_company?: string;
  address?: string;
  city?: string;
  zip_code?: string;
  country?: string;
  image?: string;
  pythagore_id?: string[] | null;
  user_access: Array<UserAccessModel>;
};

export type UpdateAffairModel = {
  user_created?: string;
  user_updated?: string;
  name?: string;
  client_company_name?: string;
  client_info?: string;
  internal_company?: string;
  address?: string;
  zip_code?: string;
  city?: string;
  country?: string;
  image?: string;
  pythagore_id?: string[] | null;
  status?: AffairStatusEnum;
  user_access?: Array<UserAccessModel>;
};
