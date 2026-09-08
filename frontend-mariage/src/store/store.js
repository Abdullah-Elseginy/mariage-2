import { configureStore } from '@reduxjs/toolkit';
import invitationReducer from './invitationSlice';

export const store = configureStore({
  reducer: {
    invitation: invitationReducer,
  },
});
