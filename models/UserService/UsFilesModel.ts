import { UsUserModel } from '../UserService/UsUserModel';
import { UsActivitiesModel } from "./UsActivitiesModel";

export type UsFilesModel = {
  id: string;
  storage: string;
  filename_disk: string | null;
  filename_download: string;
  title: string | null;
  type: string | null;
  folder: string | null;
  charset: string | null;
  filesize: number | null;
  width: number | null;
  height: number | null;
  duration: number | null;
  embed: string | null;
  description: string | null;
  location: string | null;
  tags: string[] | null;
  metadata: any | null;

  uploaded_by: string | UsUserModel;
  uploaded_on: Date;
  modified_by: string | UsUserModel | null;
  modified_on: Date | null;

  activities_id: number[] | UsActivitiesModel[];
};