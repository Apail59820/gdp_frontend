import { configureStore } from '@reduxjs/toolkit';
import affairsReducer from './features/affairsReducer';
import projectsUserReducer from './features/projectsUserReducer';
import userProfileReducer from './features/userProfileReducer';

export default configureStore({
  reducer: {
    affairs: affairsReducer,
    userProfile: userProfileReducer,
    projectsUser: projectsUserReducer,
  },
});
