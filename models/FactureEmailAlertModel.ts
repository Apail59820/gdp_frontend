import { PythagoreFactureModel } from './PythagoreFactureModel';

export type DateEmailModel = {
  date_created: string;
};

export type FactureEmailAlertModel = {
  id: number;
  user_created: string;
  date_created: string;
  facture_id: string | PythagoreFactureModel;
  type: string;
};

export type CreateFactureEmailAlertModel = {
  facture_id: string | undefined;
  type: string;
};
