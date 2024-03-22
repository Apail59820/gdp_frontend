import { UsUserModel } from "../../UserService/UsUserModel";
import { GdpAffairModel } from "../GdpAffairModel";

export type GdpCerbRessourcesModel = {
  id: number;
  user_created: number | Partial<UsUserModel>;
  user_updated: number | Partial<UsUserModel>;
  date_created: string;
  date_updated: string;
  affairs_id: number | Partial<GdpAffairModel>;
  rainwater_harvesting_tank_capacity: number;
  initial_plot_permeability_coefficient: number;
  project_plot_permeability_coefficient: number;
};
