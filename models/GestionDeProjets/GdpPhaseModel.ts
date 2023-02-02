import { GdpAffairModel } from './GdpAffairModel';
import { UsUserModel } from '../UserService/UsUserModel';
import { GdpActivitiesModel } from "./GdpActivitiesModel";

export enum GdpPhaseStatusEnum {
  PENDING = 'pending',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
}

export type GdpPhaseModel = {
  id: string;

  user_created: string | UsUserModel;
  date_created: Date;
  user_updated: string | UsUserModel | null;
  date_updated: Date | null;

  name: string;
  order: number;
  status: GdpPhaseStatusEnum;
  trigger_survey: boolean;
  description: string | null;

  affairs_id: number | GdpAffairModel;
  activities_id: number[] | GdpActivitiesModel[];
};
