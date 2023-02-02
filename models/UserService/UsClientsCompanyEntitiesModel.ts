import { UsUserModel } from "./UsUserModel";
import { UsActivitiesModel } from "./UsActivitiesModel";
import { UsFilesModel } from "./UsFilesModel";
import { UsClientsCompanyInteractionsModel } from "./UsClientsCompanyInteractionsModel";
import { UsClientsCompanyEntitiesUsersModel } from "./UsClientsCompanyEntitiesUsersModel";

export type UsClientsCompanyEntitiesModel = {
  id: number;
  name: string | null;
  parameters: any | null;
  siren: string | null;
  phone: string | null;
  address: string | null;
  zip_code: string | null;
  city: string | null;
  country: string | null;

  user_created: string | UsUserModel;
  date_created: Date;
  user_updated: string | UsUserModel | null;
  date_updated: Date | null;

  image: string | UsFilesModel | null;
  activities_id: number[] | UsActivitiesModel[]

  clients_company_interactions_ids: number[] | UsClientsCompanyInteractionsModel[];
  users: number[] | UsClientsCompanyEntitiesUsersModel[];
}