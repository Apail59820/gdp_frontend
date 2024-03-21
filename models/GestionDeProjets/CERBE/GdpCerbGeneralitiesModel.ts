import { UsUserModel } from "../../UserService/UsUserModel";
import { GdpAffairModel } from "../GdpAffairModel";

export type GdpCerbGeneralitiesModel = {
  id: number;
  user_created: number | Partial<UsUserModel>;
  user_updated: number | Partial<UsUserModel>;
  date_created: string;
  date_updated: string;
  affairs_id: number | Partial<GdpAffairModel>;
  contracting_authority: string;
  project_name: string;
  interlocutor: string;
  status: string;
  plot_area: number;
  floor_area: number;
  typology: string;
  certifications_labels: string;
};
