import Cookies from "js-cookie";

export const setAuthToken = (token) => {
  Cookies.set("jwt", token, {
    expires: 1,
    sameSite: "lax",
    path: "/",
  });
};

export const getAuthToken = () => {
  return Cookies.get("jwt");
};

export const removeAuthToken = () => {
  Cookies.remove("jwt");
};
