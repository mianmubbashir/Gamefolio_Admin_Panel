import { ERRORS } from "../../labels/error";
import { APIOption, APIParams } from "../../types/Api";
import { getFromLocal } from "../../utils/localStorage";

export const BASE_URL = "http://localhost:4000/api";
export const BASE_URL2 = "http://localhost:4000";

export const API = async (params: APIParams) => {
  let {
    method,
    endpoint = "",
    baseURL = "",
    payload = null,
    isToken = true,
    isFormData = false,
    file = "",
    headers = {},
    toJSON = true,
  } = params;

  method = method.toUpperCase();
  let body = null;
  let URL = `${BASE_URL}/${endpoint}`;

  if (baseURL) {
    URL = baseURL;
  }

  if (isFormData) {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      formData.append(key, value as any);
    });
    body = formData;
  } else if (file) {
    const req = new Request(file);
    const resp = await fetch(req);
    body = await resp.blob();
  } else {
    body = JSON.stringify(payload);
  }

  if (isToken) {
    const token = getFromLocal("@token");
    headers = { ...headers, Authorization: `${token}` };
  }

  let options: APIOption = {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...headers,
    },

    credentials: "include",
    body,
  };

  if (method === "GET") {
    delete options.body;
  }

  if (!navigator.onLine) {
    throw new Error(ERRORS.noInternet);
  }

  // console.log(options, "options", URL);

  try {
    let response: Response | any = await fetch(URL, options);
    // console.log(response);
    const ok = response.ok;
    const headers = response.headers;

    if (toJSON === false) {
      return [ok, {}];
    }
    // Unauthorised 401 so redirect to login
    if (response?.status === 401) {
      window.location.href = "http://localhost:5173/authentication/sign-in";
      return [false, {}];
    }

    if (response?.status !== 500) {
      response = await response.text();
      response = response ? JSON.parse(response) : {};
    } else {
      console.log(`❌ API ERR1 [${endpoint}] =====> `, response);
      response = {};
    }

    if (!ok) {
      console.log(
        `❌ API ERR2 [${endpoint}] =====> `,
        JSON.stringify(response)
      );
    }

    return [ok, response, headers];
  } catch (error) {
    console.log(`❌ API ERR3 [${endpoint}] =====> `, error);
    throw error;
  }
};
