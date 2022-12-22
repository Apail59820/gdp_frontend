import { AffairModel } from './AffairModel';
import { PhaseModel } from './PhaseModel';
import { UserModel } from './UserModel';

export enum AssetStatusEnum {
  Visible = 'visible',
  Hidden = 'hidden',
  Deleted = 'deleted',
}

export enum AssetDocumentEnum {
  Written = 'written',
  Graphic = 'graphic',
  Unknown = 'unknown',
}

export enum FileUsageEnum {
  affairImage = 'affair/image',
  affairFile = 'affair/file',
  userAvatar = 'user/avatar',
  bugReport = 'bugreport/image',
}

export type AssetModel = {
  id?: string;
  storage?: string;
  title?: string;
  filename_disk?: string;
  filename_download?: string;
  type?: string;
  folder?: string;
  uploaded_by?: string | UserModel;
  uploaded_on?: string;
  modified_by?: string | UserModel;
  modified_on?: string;
  filesize?: number;
  width?: number;
  height?: number;
  duration?: number;
  description?: string;
  location?: string;
  tags?: Array<string>;
  usage?: FileUsageEnum;
  affair_id?: number | AffairModel;
  phase_id?: number | PhaseModel;
  status?: AssetStatusEnum;
  document_type?: AssetDocumentEnum;
};

export type CreateAssetModel = {
  storage?: string;
  title?: string;
  filename_disk?: string;
  filename_download?: string;
  type?: string;
  folder?: string;
  filesize?: number;
  width?: number;
  height?: number;
  duration?: number;
  description?: string;
  location?: string;
  tags?: Array<string>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: any;
  usage: FileUsageEnum;
  affair_id?: number;
  phase_id?: number;
  status?: AssetStatusEnum;
  document_type?: AssetDocumentEnum;
};

export type UpdateAssetModel = {
  storage?: string;
  title?: string;
  filename_disk?: string;
  filename_download?: string;
  type?: string;
  folder?: string;
  uploaded_by?: string;
  uploaded_on?: string;
  modified_by?: string;
  modified_on?: string;
  filesize?: number;
  width?: number;
  height?: number;
  duration?: number;
  description?: string;
  location?: string;
  tags?: Array<string>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: any;
  usage?: FileUsageEnum;
  affair_id?: number;
  phase_id?: number;
  status?: AssetStatusEnum;
  document_type?: AssetDocumentEnum;
};

