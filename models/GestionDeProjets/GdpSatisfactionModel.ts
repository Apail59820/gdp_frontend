import { UsUserModel } from '../UserService/UsUserModel';
import { GdpAffairModel } from './GdpAffairModel';
import { GdpPhaseModel } from './GdpPhaseModel';
import { GdpActivitiesModel } from './GdpActivitiesModel';

export type GdpSatisfactionModel = {
  id: number;
  score_soft_skills: number;
  score_hard_skills: number;
  comment: string | null;

  user_created: string | UsUserModel;
  date_created: string;
  user_updated: string | UsUserModel | null;
  date_updated: string | null;

  affairs_id: number | GdpAffairModel;
  affairs_phases_id: number | GdpPhaseModel;
  activities_id?: number[] | GdpActivitiesModel[];
};

export type CreateGdpSatisfactionModel = {
  affairs_id: number | GdpAffairModel;
  affairs_phases_id: number | GdpPhaseModel;
  score_soft_skills: number;
  score_hard_skills: number;
  comment: string | null;
};
