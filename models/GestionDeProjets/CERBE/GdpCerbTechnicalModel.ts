import {UsUserModel} from "../../UserService/UsUserModel";
import {GdpAffairModel} from "../GdpAffairModel";

export type GdpCerbTechnicalModel = {
    id: number;
    user_created: number | Partial<UsUserModel>;
    user_updated: number | Partial<UsUserModel>;
    date_created: string;
    date_updated: string;
    affairs_id: number | Partial<GdpAffairModel>;
    hvac: string;
    electricity: string;
    structure: string;
    envelope: string;
    interior_finishes: string;
    other: string;
}