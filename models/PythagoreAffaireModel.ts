import { PythagoreClientModel } from './PythagoreClientModel';

export type PythagoreAffaireModel = {
  numero_affaire?: string;
  libelle_affaire?: string;
  code_client?: string | PythagoreClientModel;
  nom_client?: string;
  date_derniere_valid_facture?: Date;
  affairs_id: number[];
};
