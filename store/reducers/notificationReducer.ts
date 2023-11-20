import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '../store';
import { UsUsersNotificationModel } from '../../models/UserService/UsUsersNotificationModel';
import { GdpUsersNotificationModel } from '../../models/GestionDeProjets/GdpUsersNotificationModel';

export type notificationsState = {
  userService: Partial<GdpUsersNotificationModel>[];
  gestionDeProjets: Partial<UsUsersNotificationModel>[];
};

const initialState: notificationsState = {
  userService: [],
  gestionDeProjets: [],
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: initialState,
  reducers: {
    setUsersNotifications: (state, action: PayloadAction<notificationsState>) => {
      return action.payload;
    },
  },
});

export const { setUsersNotifications } = notificationSlice.actions;

export const selectNotifications = (state: AppState) => state.notifications;

export default notificationSlice.reducer;
