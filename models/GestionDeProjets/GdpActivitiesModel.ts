import { UsUserModel } from '../UserService/UsUserModel';
import { GdpUsersNotificationModel } from './GdpUsersNotificationModel';

export enum ActivitiesCollectionEnum {
  Affair = 'affair',
  AffairUser = 'affair_user',
  AffairSatisfaction = 'affair_satisfaction',
  AffairFile = 'affair_file',
  AffairPhase = 'affair_phase',
  Project = 'project',
  ProjectDirectusUsersClient = 'projects_directus_users_clients',
  ProjectDirectusUsersCollaborator = 'projects_directus_users_collaborators',
}
export enum ActivitiesActionEnum {
  Create = 'create',
  Delete = 'delete',
  Update = 'update',
}

export type GdpActivitiesModel = {
  id: number;
  action: ActivitiesActionEnum;
  collection: ActivitiesCollectionEnum | null;
  content: any | null;

  user_created: string | UsUserModel;
  date_created: string;

  projects_id: number | null;
  affairs_id: number | null;
  affairs_phases_id: number | null;
  affairs_satisfaction_id: number | null;
  directus_files_id: string | null;
  affairs_pythagore_affaires_id: number | null;
  affairs_directus_users_id: number | null;
  projects_directus_users_clients_id: number | null;
  projects_directus_users_collaborators_id: number | null;
  notifications_id: number[] | GdpUsersNotificationModel[];
};
