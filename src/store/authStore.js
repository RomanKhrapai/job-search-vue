import { defineStore } from "pinia";
import { useToast } from "vue-toastification";
import axiosInstance from "../services/axios";

import { ref, computed } from "vue";

const toast = useToast();

export const useAuthStore = defineStore("auth", () => {
    const auth = ref({
        isError: false,
        isAuthorized: false,
        oldPath: null,
        user: {
            uid: null,
            name: null,
            email: null,
            image: null,
        },
    });

    const name = computed(() => auth.value.user.name);
    const image = computed(
        () => "http://127.0.0.1:8080/" + auth.value.user.image
    );
    const path = computed(() => auth.value.oldPath);
    const isAuthorized = computed(() => auth.value.isAuthorized);

    function setPath(path) {
        auth.value.oldPath = path;
    }
    function clearPath() {
        auth.value.oldPath = null;
    }
    async function onAuth() {
        auth.value.isLoading = true;
        const token = localStorage.getItem("access_token");
        if (!token) {
            auth.value.isLoading = false;
            return;
        }
        axiosInstance.defaults.headers.common[
            "Authorization"
        ] = `Bearer ${token}`;
        axiosInstance
            .get(`user`)
            .then((response) => {
                console.log(response.data);
                auth.value.user.name = response.data.name;
                auth.value.user.email = response.data.email;
                auth.value.user.image = response.data.image;
                auth.value.isAuthorized = true;
                auth.value.isLoading = false;
            })
            .catch();
        auth.value.isLoading = false;
    }

    async function loginUser({ email, password }) {
        auth.value.isLoading = true;

        axiosInstance
            .post(`login`, { email, password })
            .then((response) => {
                auth.value.user.name = response.data.user.name;
                auth.value.user.email = response.data.user.email;
                auth.value.user.image = response.data.user.image;

                localStorage.access_token = response.data.access_token;
                axiosInstance.defaults.headers.common[
                    "Authorization"
                ] = `Bearer ${response.data.access_token}`;

                auth.value.isAuthorized = true;
                auth.value.isLoading = false;
            })
            .catch();
    }
    async function logOut() {
        auth.value.isLoading = true;
        axiosInstance
            .post(`logout`)
            .then((response) => {
                auth.value.user.name = "";
                auth.value.user.email = "";
                auth.value.user.image = "";
                localStorage.removeItem("access_token");
                auth.value.isAuthorized = false;
                auth.value.isLoading = false;
            })
            .catch();
    }
    async function registerUser(payload) {
        auth.value.isLoading = true;
        const { email, password, name } = payload;
        console.log(payload);
        axiosInstance
            .post(`register`, { email, password, name })
            .then((response) => {
                auth.value.user.name = response.data.user.name;
                auth.value.user.email = response.data.user.email;
                auth.value.user.image = response.data.user.image;

                localStorage.access_token = response.data.access_token;
                axiosInstance.defaults.headers.common[
                    "Authorization"
                ] = `Bearer ${response.data.access_token}`;

                auth.value.isAuthorized = true;
                auth.value.isLoading = false;
            })
            .catch();
        auth.value.isLoading = false;
    }
    return {
        auth,
        isAuthorized,
        name,
        path,
        setPath,
        clearPath,
        onAuth,
        image,
        loginUser,
        logOut,
        registerUser,
    };
});
