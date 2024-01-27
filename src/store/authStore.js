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
            role: null,
            name: null,
            email: null,
            image: null,
        },
        companies: [],
    });

    const role = computed(() => auth.value.user.role);
    const name = computed(() => auth.value.user.name);
    const companies = computed(() => auth.value.companies);
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
        try {
            const token = localStorage.getItem("access_token");
            if (!token) {
                auth.value.isLoading = false;
                return;
            }
            axiosInstance.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${token}`;
            const response = await axiosInstance.get(`user`);

            auth.value.user.name = response.data.user.name;
            auth.value.user.email = response.data.user.email;
            auth.value.user.image = response.data.user.image;
            auth.value.user.role = response.data.user.role_id;
            auth.value.companies = response.data.companies;
            auth.value.isAuthorized = true;
        } catch (error) {
        } finally {
            auth.value.isLoading = false;
        }
    }

    async function loginUser({ email, password }) {
        auth.value.isLoading = true;
        try {
            const response = await axiosInstance.post(`login`, {
                email,
                password,
            });

            auth.value.user.name = response.data.user.name;
            auth.value.user.email = response.data.user.email;
            auth.value.user.image = response.data.user.image;
            auth.value.user.role = response.data.role_id;

            localStorage.access_token = response.data.access_token;
            axiosInstance.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${response.data.access_token}`;

            auth.value.isAuthorized = true;
        } catch (error) {
        } finally {
            auth.value.isLoading = false;
        }
    }
    async function logOut() {
        auth.value.isLoading = true;
        try {
            const response = await axiosInstance.post(`logout`);
            auth.value.user.name = "";
            auth.value.user.email = "";
            auth.value.user.image = "";
            auth.value.user.role = "";
            localStorage.removeItem("access_token");
            auth.value.isAuthorized = false;
        } catch (error) {
        } finally {
            auth.value.isLoading = false;
        }
    }
    async function registerUser(payload) {
        auth.value.isLoading = true;
        try {
            const { email, password, name, role } = payload;

            const response = await axiosInstance.post(`register`, {
                email,
                password,
                name,
                role_id: role,
            });

            auth.value.user.name = response.data.user.name;
            auth.value.user.email = response.data.user.email;
            auth.value.user.image = response.data.user.image;
            auth.value.user.role = response.data.role_id;

            localStorage.access_token = response.data.access_token;
            axiosInstance.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${response.data.access_token}`;

            auth.value.isAuthorized = true;
        } catch (error) {
        } finally {
            auth.value.isLoading = false;
        }
    }
    return {
        auth,
        isAuthorized,
        role,
        name,
        path,
        setPath,
        clearPath,
        onAuth,
        image,
        loginUser,
        logOut,
        registerUser,
        companies,
    };
});
