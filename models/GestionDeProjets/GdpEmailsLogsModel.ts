import { GdpPythagoreFactureModel } from './GdpPythagoreFactureModel';
import { UsUserModel } from '../UserService/UsUserModel';

export type GdpEmailsLogsModel = {
  id: number;
  type: string;
  subject: string | null;
  content: string | null;
  status: string | null; //TODO Enum

  user_created: string;
  date_created: Date;

  recipients: string[] | UsUserModel[];
  facture_id: string | GdpPythagoreFactureModel | null;
};
