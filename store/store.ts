import { configureStore } from '@reduxjs/toolkit';
import affairsReducer from './features/affairsReducer';
import userProfileReducer from './features/userProfileReducer';

export default configureStore({
  reducer: {
    affairs: affairsReducer,
    userProfile: userProfileReducer,
  },
});
