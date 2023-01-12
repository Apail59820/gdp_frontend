import { AffairModel } from './AffairModel';
import { UserModel } from './UserModels';

export enum PhaseStatusEnum {
  PENDING = 'pending',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
}

export type PhaseModel = {
  id?: string;
  user_created?: string | UserModel;
  date_created?: Date;
  user_updated?: string | UserModel;
  date_updated?: Date;
  affairs_id?: number | AffairModel;
  name?: string;
  status?: PhaseStatusEnum;
  order?: number;
  trigger_survey?: boolean;
  description?: string;
};

export type CreatePhaseModel = {
  name: string;
  affairs_id?: number | string;
  status?: PhaseStatusEnum;
  order?: number;
  description?: string;
  trigger_survey: boolean;
};

export type UpdatePhaseModel = {
  name?: string;
  status?: PhaseStatusEnum;
  order?: number;
  description?: string;
  trigger_survey?: boolean;
};
