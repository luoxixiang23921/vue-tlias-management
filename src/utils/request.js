import axios from "axios";
import router from '@/router/index.js';
import { ElMessage } from 'element-plus';

const request = axios.create({
  // https://m1.apifoxmock.com/m1/6662221-6370631-default
  baseURL: '/api',
  timeout: 60000
});

request.interceptors.request.use(
  (config) => {
    // loginUser corresponds to the name set in the login function
    const loginUser = JSON.parse(localStorage.getItem("loginUser"));
    if (loginUser && loginUser.token){
      config.headers.token = loginUser.token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
)


request.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response.status === 401) {
      ElMessage.error("Login expired, please log in again");
      localStorage.removeItem("loginUser");
      router.push("/login");
    }
    return Promise.reject(error);
  }
)

export default request;