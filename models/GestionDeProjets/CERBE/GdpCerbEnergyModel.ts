import {UsUserModel} from "../../UserService/UsUserModel";
import {GdpAffairModel} from "../GdpAffairModel";

export type GdpCerbEnergyModel = {
    id: number;
    user_created: number | Partial<UsUserModel>;
    user_updated: number | Partial<UsUserModel>;
    date_created: string;
    date_updated: string;
    affairs_id: number | Partial<GdpAffairModel>;

    applicable_thermal_regulation: number;
    energy_savings: number;
    conventional_energy_consumption_ref: number;
    project_conventional_energy_consumption: number;
    renewable_cec_energy_amount: number;
    renewable_energy_amount: number;
}