import {UsUserModel} from "../../UserService/UsUserModel";
import {GdpAffairModel} from "../GdpAffairModel";

export type GdbCerbBiodiversityModel = {
    id: number;
    user_created: number | Partial<UsUserModel>;
    user_updated: number | Partial<UsUserModel>;
    date_created: string;
    date_updated: string;
    affairs_id: number | Partial<GdpAffairModel>;

    initial_biotope_surface_coefficient: number;
    project_biotope_surface_coefficient: number;

    initial_surface_thermal_refreshment_coefficient: number;
    project_surface_thermal_refreshment_coefficient: number;
}