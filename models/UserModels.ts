import { UserAccessModel } from './AffairModel';

export type UserModel = {
  id?: string;
  user_created?: string | UserModel;
  date_created?: Date;
  user_updated?: string | UserModel;
  date_updated?: Date;
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  avatar?: string;
  location?: string;
  title?: string;
  description?: string;
  preferences_divider?: string;
  language?: string;
  theme?: string;
  tfa_secret?: string;
  admin_divider?: string;
  status?: string;
  role?: string;
  token?: string;
  last_page?: string;
  last_access?: string;
  company?: string;
  number?: string;
  affairs?: Array<UserAccessModel>;
  web_link?: string;
  cgu?: boolean;
  email_notifications?: boolean;
  showDocumentation?: boolean;
  directus_files_avatar_id?: string[];
};

export type UpdateUserModel = {
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  avatar?: string;
  location?: string;
  title?: string;
  role?: string;
  description?: string;
  preferences_divider?: string;
  language?: string;
  theme?: string;
  tfa_secret?: string;
  admin_divider?: string;
  status?: string;
  company?: string;
  number?: string;
  web_link?: string;
  cgu?: boolean;
  email_notifications?: boolean;
  showDocumentation?: boolean;
  directus_files_avatar_id?: string[];
};

//TODO A recuperer depuis le .ENV
export enum RoleEnum {
  CLIENTS = 'aaa',
  COLLABORATEUR = 'bb',
  ADMIN = 'cc',
}
