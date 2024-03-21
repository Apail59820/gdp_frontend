import {UsUserModel} from "../../UserService/UsUserModel";
import {GdpAffairModel} from "../GdpAffairModel";

export type GdpCerbCarbonModel = {
    id: number;
    user_created: number | Partial<UsUserModel>;
    user_updated: number | Partial<UsUserModel>;
    date_created: string;
    date_updated: string;
    affairs_id: number | Partial<GdpAffairModel>;

    baseline_carbon_footprint: number;
    project_carbon_footprint: number;
    biobased_materials_amount: number;
}