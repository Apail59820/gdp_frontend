import { UserModel } from './UserModel';
import { AffairModel } from './AffairModel';
import { PhaseModel } from './PhaseModel';

export type SatisfactionModel = {
  id?: string | number;
  user_created?: string | UserModel;
  date_created?: Date;
  user_updated?: string | UserModel;
  date_updated?: Date;
  affairs_id?: string | number | AffairModel;
  affairs_phases_id?: string | PhaseModel;
  score_soft_skills?: number;
  score_hard_skills?: number;
  comment?: string;
};

export type CreateSatisfactionModel = {
  affairs_id: string | number | AffairModel;
  affairs_phases_id: string | PhaseModel;
  score_soft_skills: number;
  score_hard_skills: number;
  comment?: string;
};

export type UpdateSatisfactionModel = {
  affairs_id?: string | number | AffairModel;
  affairs_phases_id?: string | PhaseModel;
  score_soft_skills?: number;
  score_hard_skills?: number;
  comment?: string;
};

