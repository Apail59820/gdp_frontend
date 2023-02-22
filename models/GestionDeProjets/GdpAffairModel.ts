import { GdpFilesModel } from './GdpFilesModel';
import { GdpSatisfactionModel } from './GdpSatisfactionModel';
import { UsUserModel } from '../UserService/UsUserModel';
import { GdpProjectsModel } from './GdpProjectsModel';
import { GdpAffairsPythagoreAffairesModel } from './GdpAffairsPythagoreAffairesModel';
import { UsCompanyEntityModel } from '../UserService/UsCompanyEntityModel';
import { GdpActivitiesModel } from './GdpActivitiesModel';
import { GdpAffairsUsersModel } from './GdpAffairsUsersModel';
import { GdpPhaseModel } from './GdpPhaseModel';

export type GdpAffairModel = {
  id: number;
  name: string;

  user_created: string | UsUserModel;
  date_created: Date;
  user_updated: string | UsUserModel | null;
  date_updated: Date | null;

  company_entity: number | UsCompanyEntityModel;
  projects_id: number | GdpProjectsModel;
  affairs_phases: number[] | GdpPhaseModel[];
  pythagore_ids: number[] | GdpAffairsPythagoreAffairesModel[];
  affairs_satisfaction: string[] | number[] | GdpSatisfactionModel[];
  affairs_directus_users_ids: number[] | GdpAffairsUsersModel[];
  files: string[] | GdpFilesModel[];
  activities_id: number[] | GdpActivitiesModel[];
};
