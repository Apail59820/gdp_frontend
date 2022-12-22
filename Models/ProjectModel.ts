import { UserAccessModel } from "./AffairModel";
import { AssetModel } from "./AssetModel";
import { UserModel } from "./UserModel";

export type ProjectModel = {
    id?: string | number;
    user_created?: string | UserModel;
    date_created?: Date;
    user_updated?: string | UserModel;
    date_updated?: Date;
    project_name?: string;
    project_manager?: string;
    total_affairs?: number;
    client_company_name?: string;
    client_info?: string;
    internal_company?: string;
    address?: string;
    zip_code?: string;
    city?: string;
    country?: string;
    image?: string | AssetModel;
    // pythagore_ids?: (number | AffairsPythagoreAffairesModel)[];
    // status?: AffairStatusEnum;
    user_access?: Array<UserAccessModel>;
    // affairs_satisfaction?: string[] | number[] | SatisfactionModel[];
  };