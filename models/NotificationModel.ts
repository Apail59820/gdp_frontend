export enum NotificationTargetEnum {
  Affair = 'affair',
  AffairUser = 'affair_user',
  AffairSatisfaction = 'affair_satisfaction',
  AffairFile = 'affair_file',
  AffairPhase = 'affair_phase',
}

export enum NotificationActionEnum {
  Create = 'create',
  Delete = 'delete',
  Update = 'update',
}

export type NotificationModel = {
  date_created: string;
  date_updated: string;
  id: number;
  seen: boolean;
  sent_mail: boolean;
  target_affair: number;
  target_file?: string;
  target_phase?: string;
  target_satisfaction?: number;
  target_user_access?: number;
  target: NotificationTargetEnum;
  action: NotificationActionEnum;
  user_created: string;
  user_id: number;
  user_update: number;
  data: any;
};
