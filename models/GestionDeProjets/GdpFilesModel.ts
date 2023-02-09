import { GdpAffairModel } from './GdpAffairModel';
import { GdpPhaseModel } from './GdpPhaseModel';
import { UsUserModel } from '../UserService/UsUserModel';
import { GdpProjectsModel } from './GdpProjectsModel';
import { GdpActivitiesModel } from './GdpActivitiesModel';

export enum GdpFilesStatusEnum {
  VISIBLE = 'visible',
  HIDDEN = 'hidden',
  DELETED = 'deleted',
}

export enum GdpAssetDocumentEnum {
  WRITTEN = 'written',
  GRAPHIC = 'graphic',
  UNKNOWN = 'unknown',
}

export enum GdpFileUsageEnum {
  PROJECTS_IMAGE = 'projects/image',
  PROJECTS_FILE = 'projects/file',
  AFFAIR_IMAGE = 'affairs/image',
  AFFAIR_FILE = 'affairs/file',
  PHASES_IMAGE = 'phases/image',
  PHASES_FILE = 'phases/file',
}

export type GdpFilesModel = {
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
  usage: GdpFileUsageEnum;
  is_cover: boolean | null;
  status: GdpFilesStatusEnum;
  document_type: GdpAssetDocumentEnum | null;

  uploaded_by: string | UsUserModel;
  uploaded_on: Date;
  modified_by: string | UsUserModel | null;
  modified_on: Date | null;

  projects_id: number | GdpProjectsModel;
  affair_id: number | GdpAffairModel | null;
  phase_id: number | GdpPhaseModel | null;
  activities_id: number[] | GdpActivitiesModel[];
};
