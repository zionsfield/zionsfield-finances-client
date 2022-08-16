const env = process.env.NODE_ENV;
export const API_URL =
  env === "production" ? "" : "http://localhost:9000/api/v1/";
console.log(API_URL);
