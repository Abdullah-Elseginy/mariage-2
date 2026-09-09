import Axios from './Axios';

export const invitationAPI = {
  getByPath: (publicPath) => Axios({
    method: 'GET',
    path: '/invitations/',
    pathParams: publicPath,
  }),
  submitRsvp: (payload) => Axios({
    method: 'POST',
    path: '/rsvps',
    data: payload,
  }),
  uploadGuestPhoto: (publicPath, formData, onUploadProgress) => Axios({
    method: 'POST',
    path: `/invitations/${publicPath}/guest-photos`,
    data: formData,
    isFormData: true,
    onUploadProgress,
  }),
  getGuestUploadStatus: (publicPath, uploaderId) => Axios({
    method: 'GET',
    path: `/invitations/${publicPath}/guest-upload-status`,
    params: { uploader_id: uploaderId },
  }),
  getOrganizerData: (publicPath, credentials) => Axios({
    method: 'GET',
    path: `/invitations/${publicPath}/organizer`,
    header: credentials ? {
      'X-Organizer-Username': credentials.username,
      'X-Organizer-Password': credentials.password,
    } : {},
  }),
  deleteRsvp: (publicPath, rsvpId, credentials) => Axios({
    method: 'DELETE',
    path: `/invitations/${publicPath}/rsvps/${rsvpId}`,
    header: credentials ? {
      'X-Organizer-Username': credentials.username,
      'X-Organizer-Password': credentials.password,
    } : {},
  }),
  deleteAllRsvps: (publicPath, credentials) => Axios({
    method: 'DELETE',
    path: `/invitations/${publicPath}/rsvps`,
    header: credentials ? {
      'X-Organizer-Username': credentials.username,
      'X-Organizer-Password': credentials.password,
    } : {},
  }),
  deletePhoto: (publicPath, photoId, credentials) => Axios({
    method: 'DELETE',
    path: `/invitations/${publicPath}/guest-photos/${photoId}`,
    header: credentials ? {
      'X-Organizer-Username': credentials.username,
      'X-Organizer-Password': credentials.password,
    } : {},
  }),
  deleteAllPhotos: (publicPath, credentials) => Axios({
    method: 'DELETE',
    path: `/invitations/${publicPath}/guest-photos`,
    header: credentials ? {
      'X-Organizer-Username': credentials.username,
      'X-Organizer-Password': credentials.password,
    } : {},
  }),
  downloadGuestPhoto: (publicPath, photoId, credentials) => Axios({
    method: 'GET',
    path: `/invitations/${publicPath}/guest-photos/${photoId}/download`,
    responseType: 'blob',
    header: credentials ? {
      'X-Organizer-Username': credentials.username,
      'X-Organizer-Password': credentials.password,
    } : {},
  }),
};


export const eidGreetingAPI = {
  getByPath: (publicPath) => Axios({
    method: 'GET',
    path: '/eid-greetings/',
    pathParams: publicPath,
  }),
};

export const birthdayGreetingAPI = {
  getByPath: (publicPath) => Axios({
    method: 'GET',
    path: '/birthday-greetings/',
    pathParams: publicPath,
  }),
};

export const loveMessageAPI = {
  getByPath: (publicPath) => Axios({
    method: 'GET',
    path: '/love-messages/',
    pathParams: publicPath,
  }),
};
