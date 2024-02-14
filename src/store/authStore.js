import { defineStore } from "pinia";
import { useToast } from "vue-toastification";
import { useChatsStore } from "./chatsStore";
import axiosInstance from "../services/axios";

import { ref, computed } from "vue";

const toast = useToast();

export const useAuthStore = defineStore("auth", () => {
    const auth = ref({
        isError: false,
        isAuthorized: false,
        user: {
            id: null,
            role: null,
            name: null,
            email: null,
            image: null,
            phone: null,
        },
        companies: [],
        candidates: [],
    });

    const userId = computed(() => auth.value.user.id);
    const role = computed(() => auth.value.user.role);
    const name = computed(() => auth.value.user.name);
    const email = computed(() => auth.value.user.email);
    const phone = computed(() => auth.value.user.phone);
    const companies = computed(() => auth.value.companies);
    const candidates = computed(() => auth.value.candidates);
    const imageMin = computed(() => auth.value.user.image);
    const image = computed(() => {
        return auth.value.user.image
            ? `${import.meta.env.VITE_SERVER_HOST}/storage/` +
                  auth.value.user.image
            : null;
    });

    const isAuthorized = computed(() => auth.value.isAuthorized);

    async function authData() {
        auth.value.isLoading = true;

        try {
            const response = await axiosInstance.get(`authdata`);
            auth.value.companies = response.data.companies;
            auth.value.candidates = response.data.candidates;
        } catch (error) {
        } finally {
            auth.value.isLoading = false;
        }
    }

    async function onAuth() {
        const { setErrorMessage } = useChatsStore();
        auth.value.isLoading = true;

        try {
            const token = localStorage.getItem("access_token");
            if (auth.value.role) {
                return;
            }
            if (!token) {
                auth.value.isLoading = false;
                return;
            }
            axiosInstance.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${token}`;

            const response = await axiosInstance.get(`user`);
            auth.value.user.id = response.data.user.id;
            auth.value.user.name = response.data.user.name;
            auth.value.user.email = response.data.user.email;
            auth.value.user.image = response.data.user.image;
            auth.value.user.role = response.data.user.role_id;
            auth.value.user.phone = response.data.user.telephone;

            auth.value.isAuthorized = true;
            authData();
            const { useChenel } = useChatsStore();
            useChenel();
        } catch (error) {
            auth.value.isAuthorized = false;
            localStorage.removeItem("access_token");
            if (error?.response?.status === 404)
                return setErrorMessage("connection error");
            setErrorMessage("error system");
        } finally {
            auth.value.isLoading = false;
        }
    }

    async function loginUser({ email, password }) {
        const { setErrorMessage } = useChatsStore();
        auth.value.isLoading = true;
        try {
            const response = await axiosInstance.post(`login`, {
                email,
                password,
            });
            auth.value.user.id = response.data.user.id;
            auth.value.user.name = response.data.user.name;
            auth.value.user.email = response.data.user.email;
            auth.value.user.image = response.data.user.image;
            auth.value.user.role = response.data.role_id;
            auth.value.user.phone = response.data.user.phone;

            localStorage.access_token = response.data.access_token;
            axiosInstance.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${response.data.access_token}`;

            auth.value.isAuthorized = true;
            onAuth();
        } catch (error) {
            if (error?.response?.status == 401)
                return setErrorMessage(
                    "Authentication email or password is not valid"
                );
            if (error?.response?.status == 422)
                return setErrorMessage("data is incorrect");
            if (error?.response?.status == 404)
                return setErrorMessage("connection error");
            setErrorMessage("error system");
        } finally {
            auth.value.isLoading = false;
        }
    }

    async function updateUser(name, phone, role_id, image) {
        const { setErrorMessage } = useChatsStore();
        auth.value.isLoading = true;
        try {
            const response = await axiosInstance.patch(
                `update/user/${auth.value.user.id}`,
                {
                    name,
                    telephone: phone,
                    role_id,
                    image,
                }
            );

            auth.value.user.id = response.data.user.id;
            auth.value.user.name = response.data.user.name;
            auth.value.user.image = response.data.user.image;
            auth.value.user.role = response.data.user.role;
            auth.value.user.phone = response.data.user.telephone;
            auth.value.isAuthorized = true;
            return true;
        } catch (error) {
            if (error?.response?.status === 401)
                return setErrorMessage("Unauthenticated.");
            if (error?.response?.status === 422)
                return setErrorMessage("data is incorrect");
            if (error?.response?.status === 404)
                return setErrorMessage("connection error");
            setErrorMessage("error system");
        } finally {
            auth.value.isLoading = false;
        }
    }

    async function updatePassword(password, oldPassword, role) {
        const { setErrorMessage } = useChatsStore();
        auth.value.isLoading = true;
        try {
            const response = await axiosInstance.patch(
                `update/password/${auth.value.user.id}`,
                {
                    password,
                    oldPassword,
                    role,
                }
            );

            localStorage.access_token = response.data.access_token;
            axiosInstance.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${response.data.access_token}`;
            auth.value.user.role = Number(role);
            auth.value.isAuthorized = true;
            return true;
        } catch (error) {
            if (error?.response?.status === 401)
                return setErrorMessage("Unauthenticated.");
            if (error?.response?.status === 422)
                return setErrorMessage("data is incorrect");
            if (error?.response?.status === 404)
                return setErrorMessage("connection error");
            setErrorMessage("error system");
        } finally {
            auth.value.isLoading = false;
        }
    }

    async function logOut() {
        const { setErrorMessage } = useChatsStore();
        auth.value.isLoading = true;
        try {
            const response = await axiosInstance.post(`logout`);
            auth.value.user.id = "";
            auth.value.user.name = "";
            auth.value.user.email = "";
            auth.value.user.image = "";
            auth.value.user.role = "";
            auth.value.user.phone = "";

            auth.value.isAuthorized = false;
        } catch (error) {
            if (error?.response?.status === 404)
                return setErrorMessage("connection error");
            setErrorMessage("error system");
        } finally {
            localStorage.removeItem("access_token");
            auth.value.isLoading = false;
        }
    }
    async function registerUser(payload) {
        const { setErrorMessage } = useChatsStore();
        auth.value.isLoading = true;
        try {
            const { email, password, name, role } = payload;

            const response = await axiosInstance.post(`register`, {
                email,
                password,
                name,
                role_id: role,
            });
            auth.value.user.id = response.data.user.id;
            auth.value.user.name = response.data.user.name;
            auth.value.user.email = response.data.user.email;
            auth.value.user.image = response.data.user.image;
            auth.value.user.role = response.data.role_id;
            auth.value.user.phone = response.data.user.phone;

            localStorage.access_token = response.data.access_token;
            axiosInstance.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${response.data.access_token}`;

            auth.value.isAuthorized = true;
            onAuth();
        } catch (error) {
            if (error?.response?.status === 422)
                return setErrorMessage("password or email is incorrect");
            if (error?.response?.status === 404)
                return setErrorMessage("connection error");
            setErrorMessage("error system");
        } finally {
            auth.value.isLoading = false;
        }
    }
    return {
        auth,
        isAuthorized,
        role,
        name,
        companies,
        candidates,
        image,
        email,
        phone,
        userId,
        imageMin,

        onAuth,
        loginUser,
        logOut,
        registerUser,
        updatePassword,
        updateUser,
        authData,
    };
});
