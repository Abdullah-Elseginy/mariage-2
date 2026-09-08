import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { invitationAPI } from '../utils/api';
import { extractApiData, extractApiError } from '../utils/apiHelpers';

export const fetchInvitationByPath = createAsyncThunk(
  'invitation/fetchByPath',
  async (publicPath, { rejectWithValue }) => {
    if (!publicPath) return rejectWithValue('Invitation route is missing.');

    try {
      const response = await invitationAPI.getByPath(publicPath);
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error, 'Invitation not found.'));
    }
  }
);

export const submitInvitationRsvp = createAsyncThunk(
  'invitation/submitRsvp',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await invitationAPI.submitRsvp(payload);
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error, 'Unable to submit RSVP.'));
    }
  }
);

const invitationSlice = createSlice({
  name: 'invitation',
  initialState: {
    data: null,
    status: 'idle',
    error: '',
    rsvpStatus: 'idle',
    rsvpError: '',
  },
  reducers: {
    clearInvitation: (state) => {
      state.data = null;
      state.status = 'idle';
      state.error = '';
      state.rsvpStatus = 'idle';
      state.rsvpError = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvitationByPath.pending, (state) => {
        state.status = 'loading';
        state.error = '';
        state.data = null;
      })
      .addCase(fetchInvitationByPath.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchInvitationByPath.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(submitInvitationRsvp.pending, (state) => {
        state.rsvpStatus = 'loading';
        state.rsvpError = '';
      })
      .addCase(submitInvitationRsvp.fulfilled, (state) => {
        state.rsvpStatus = 'succeeded';
      })
      .addCase(submitInvitationRsvp.rejected, (state, action) => {
        state.rsvpStatus = 'failed';
        state.rsvpError = action.payload || action.error.message;
      });
  },
});

export const { clearInvitation } = invitationSlice.actions;
export default invitationSlice.reducer;
