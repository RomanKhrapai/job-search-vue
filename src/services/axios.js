import axios from "axios";

const axiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_SERVER_HOST}api`,
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
