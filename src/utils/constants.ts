const env = process.env.NODE_ENV;
export const API_URL =
  env === "production"
    ? "https://zionsfield-finances-server.herokuapp.com/api/v1/"
    : "http://localhost:9000/api/v1/";
console.log(API_URL);
