import { configureStore } from '@reduxjs/toolkit';
import affairsReducer from './features/affairsReducer';

export default configureStore({
  reducer: {
    affairs: affairsReducer,
  },
});
