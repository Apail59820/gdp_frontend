import { GdpPythagoreAffaireModel } from './GdpPythagoreAffairModel';
import { GdpPythagoreClientModel } from './GdpPythagoreClientModel';
import { GdpEmailsLogsModel } from './GdpEmailsLogsModel';

export type GdpPythagoreFactureModel = {
  num_facture: string;
  libelle_affaire: string | null;
  date_echeance_facture: string | null;
  date_dernier_paiement_facture: string | Date | null;
  montant_totalht_facture: number | null;
  montant_totalttc_facture: number | null;
  reglement_cumuleht_facture: number | null;
  reglement_cumulettc_facture: number | null;
  soldeht_facture: number | null;
  soldettc_facture: number | null;
  type_facture: 'Avoir' | 'Facture' | null;
  statut_facture: 'Echue' | 'NonEchue' | null;
  etatreglt_facture: 'NonReglee' | 'Reglee' | 'RegltPartiel' | null;
  nom_fichierpdf_facture: string | null;

  emails_logs?: number[] | GdpEmailsLogsModel[];
  code_client: string | GdpPythagoreClientModel | null;
  num_affaire: string | GdpPythagoreAffaireModel | null;
};
