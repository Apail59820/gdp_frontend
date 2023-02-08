import { GdpPythagoreClientModel } from './GdpPythagoreClientModel';
import { GdpAffairsPythagoreAffairesModel } from './GdpAffairsPythagoreAffairesModel';

export type GdpPythagoreAffaireModel = {
  numero_affaire: string;
  libelle_affaire: string | null;
  nom_client: string | null;
  date_derniere_valid_facture: Date | null;

  code_client: string | GdpPythagoreClientModel | null;
  affairs_id: number[] | GdpAffairsPythagoreAffairesModel[];
};
