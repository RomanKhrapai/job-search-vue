import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        Accept: "application/json",
    },
});
axiosInstance.defaults.headers.common = {};

export default axiosInstance;
//  accept:application/json
// `Content-Type:application/json`
