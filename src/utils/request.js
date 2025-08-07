import axios from "axios";

const request = axios.create({
  // https://m1.apifoxmock.com/m1/6662221-6370631-default
  baseURL: '/api',
  timeout: 60000
});

request.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
)

export default request;