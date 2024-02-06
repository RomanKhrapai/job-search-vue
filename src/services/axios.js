import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        Accept: "application/json",
    },
});
axiosInstance.defaults.headers.common = {};

// axiosInstance.interceptors.request.use(
//     (config) => {
//         config.withCredentials = true;
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );
export default axiosInstance;
//  accept:application/json
// `Content-Type:application/json`
