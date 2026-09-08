import Axios from "./Axios";

// Auth API
export const authAPI = {
  login: (email, password) =>
    Axios({
      method: "POST",
      path: "/login",
      data: { email, password },
    }),

  logout: () =>
    Axios({
      method: "POST",
      path: "/logout",
    }),

  getCurrentUser: () =>
    Axios({
      method: "GET",
      path: "/me",
    }),
};
