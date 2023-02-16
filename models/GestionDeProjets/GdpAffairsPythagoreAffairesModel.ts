import { GdpPythagoreAffaireModel } from './GdpPythagoreAffaireModel';
import { GdpAffairModel } from './GdpAffairModel';
import { GdpActivitiesModel } from './GdpActivitiesModel';

export type GdpAffairsPythagoreAffairesModel = {
  id: number;

  affairs_id: number | GdpAffairModel;
  pythagore_affaires_id: string | GdpPythagoreAffaireModel;
  activities_id: number[] | GdpActivitiesModel[];
};
