const API_URL = "http://127.0.0.1:8080";
const API_VERSION = "/api/v1";
const API_BASE_URL = `${API_URL}${API_VERSION}`;
const API_MASTER_DATA_URL = `${API_BASE_URL}/master`;
const API_REGISTER_URL = `${API_BASE_URL}/auth/register`;
const API_LOGIN_URL = `${API_BASE_URL}/auth/login`;
const API_BOOKING_URL = `${API_BASE_URL}/booking`;
const APP_NAME = 'FastEx'

export {
  API_URL,
  API_VERSION,
  API_LOGIN_URL,
  API_BASE_URL,
  API_MASTER_DATA_URL,
  API_REGISTER_URL,
  API_BOOKING_URL,
  APP_NAME
};