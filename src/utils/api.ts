import axios, { AxiosResponse } from "axios";
import { API_URL } from "./constants";

export const http = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});
//password password
export const post = (endpoint: string, data?: any): Promise<AxiosResponse> =>
  new Promise((resolve, reject) =>
    http
      .post(endpoint, data, {
        withCredentials: true,
      })
      .then(resolve)
      .catch((e) => reject(e.response.data))
  );

export const put = (endpoint: string, data?: any): Promise<AxiosResponse> =>
  new Promise((resolve, reject) =>
    http
      .put(endpoint, data, {
        withCredentials: true,
      })
      .then(resolve)
      .catch((e) => reject(e.response.data))
  );

export const get = (endpoint: string): Promise<AxiosResponse> =>
  new Promise((resolve, reject) =>
    http
      .get(endpoint)
      .then(resolve)
      .catch((e) => reject(e.response.data))
  );

export const getWithQuery = (
  endpoint: string,
  obj: any
): Promise<AxiosResponse> => {
  let query = "";
  Object.entries(obj).forEach((value: any) => {
    if (!value[1] && value[1] !== false && value[1] !== 0) return;
    query = query.concat(`${value[0]}=${value[1]} `);
  });
  query = query.trim().split(" ").join("&");
  console.log(query);
  return new Promise((resolve, reject) =>
    http
      .get(`${endpoint}?${query}`)
      .then(resolve)
      .catch((e) => reject(e.response.data))
  );
};
