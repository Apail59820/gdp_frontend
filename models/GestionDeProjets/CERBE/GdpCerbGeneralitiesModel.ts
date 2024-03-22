import { UsUserModel } from "../../UserService/UsUserModel";
import { GdpAffairModel } from "../GdpAffairModel";

export type GdpCerbGeneralitiesModel = {
  id: number;
  user_created: number | Partial<UsUserModel>;
  user_updated: number | Partial<UsUserModel>;
  date_created: string;
  date_updated: string;
  affairs_id: number | Partial<GdpAffairModel>;
  affair_name: string;
  affair_contracting_authority: string;
  interlocutor: string;
  status: string;
  plot_area: number;
  floor_area: number;
  typology: string;
  certifications_labels: string;
};
