import { PythagoreAffaireModel } from './PythagoreAffaireModel';
import { PythagoreClientModel } from './PythagoreClientModel';
import { FactureEmailAlertModel } from './FactureEmailAlertModel';
import { AffairModel } from './AffairModel';

export type PythagoreFactureModel = {
  num_facture?: string;
  num_affaire?: string | PythagoreAffaireModel;
  libelle_affaire?: string;
  code_client?: string | PythagoreClientModel;
  date_echeance_facture?: string | Date;
  date_dernier_paiement_facture?: string | Date;
  montant_totalht_facture?: number;
  montant_totalttc_facture?: number;
  reglement_cumuleht_facture?: number;
  reglement_cumulettc_facture?: number;
  soldeht_facture?: number;
  soldettc_facture?: number;
  type_facture?: 'Avoir' | 'Facture';
  statut_facture?: 'Echue' | 'NonEchue';
  etatreglt_facture?: 'NonReglee' | 'Reglee' | 'RegltPartiel';
  nom_fichierpdf_facture?: string;
  emails_logs?: FactureEmailAlertModel[];
};

export type PythagoreAffairRelationModel = {
  id?: number;
  pythagore_id?: string | PythagoreFactureModel;
  affair_id?: number | AffairModel;
};
