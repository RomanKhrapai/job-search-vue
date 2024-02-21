import { defineStore, storeToRefs } from "pinia";
import { pusher, echoOptions } from "../services/pusher";

import axiosInstance from "../services/axios";
import { useAuthStore } from "./authStore";
import { ref, computed } from "vue";
import { debounce } from "../utils/debounce";

const token = `Bearer ${localStorage.getItem("access_token")}`;
import Echo from "laravel-echo";

export const useChatsStore = defineStore("chats", () => {
    const chats = ref({
        isError: false,
        isLoading: false,
        chatsList: [],
        currentChat: null,
        messages: [],
        successfulMessage: null,
        errorMessage: null,
        infoMessage: null,
    });

    const errorMessage = computed(() => chats.value.errorMessage);
    const infoMessage = computed(() => chats.value.infoMessage);
    const successfulMessage = computed(() => chats.value.successfulMessage);
    const messages = computed(() => chats.value.messages);
    const chatsList = computed(() => chats.value.chatsList);
    const currentChat = computed(() => chats.value.currentChat);
    const isError = computed(() => chats.value.isError);
    const isLoading = computed(() => chats.value.isLoading);

    function useChenel() {
        const { userId } = storeToRefs(useAuthStore());
        if (!userId.value) {
            console.log("error");
        }

        const channel = pusher.subscribe(`private-users_${userId.value}`);

        channel.bind("send_message", (data) => {
            setInfoMessage("you have a new message");
            const chatId = data.message.chatId;
            chats.value.chatsList = chats.value.chatsList.map((item) => {
                if (item.id === chatId && currentChat.value.id !== chatId) {
                    item.read = true;
                }
                return item;
            });

            if (currentChat.value.id === chatId) {
                chats.value.messages = [
                    data.message,
                    ...chats.value.messages.map((item) => {
                        item.read = false;
                        return item;
                    }),
                ];
            }
        });
        channel.bind("send-pdf", (data) => {
            window.open(
                data.pdf + "?" + Math.random().toString(36).substring(7),
                "_blank"
            );
        });
        channel.bind("send-error", (data) => {
            setErrorMessage(data.error);
        });
    }

    function setSuccessfulMessage(data) {
        debounce(
            () => {
                chats.value.successfulMessage = data;
                setTimeout(() => {
                    chats.value.successfulMessage = null;
                }, 200);
            },
            1000,
            "Successful"
        );
    }
    function setInfoMessage(data) {
        debounce(
            () => {
                chats.value.infoMessage = data;
                setTimeout(() => {
                    chats.value.infoMessage = null;
                }, 200);
            },
            1000,
            "Info"
        );
    }
    function setErrorMessage(data) {
        debounce(
            () => {
                chats.value.errorMessage = data;
                setTimeout(() => {
                    chats.value.errorMessage = null;
                }, 200);
            },
            1000,
            "Error"
        );
    }

    function setIsError(data) {
        chats.value.isError = data;
    }

    function setCurrentChat(data) {
        getMessagesList(data.id);
        data.read = false;
        chats.value.currentChat = data;
    }

    function setIsLoading(data) {
        chats.value.isLoading = data;
    }

    async function generatePDF() {
        setIsError(true);
        setIsLoading(true);

        try {
            const response = await axiosInstance.get(`/reports/feedback`);
            setInfoMessage(response.data.message);
        } catch (error) {
            if (error?.response?.status === 401)
                return setErrorMessage("Unauthenticated.");
            if (error?.response?.status === 404)
                return setErrorMessage("connection error");
            setErrorMessage("error system generate PDF");
        } finally {
            chats.value.isLoading = false;
        }
    }

    async function getChatsList() {
        setIsError(true);
        setIsLoading(true);

        try {
            const response = await axiosInstance.get(`/chats`);
            chats.value.chatsList = response.data.data;
            if (!chats.value.currentChat && response.data.data[0]) {
                setCurrentChat(response.data.data[0]);
            }
        } catch (error) {
            if (error?.response?.status === 401)
                return setErrorMessage("Unauthenticated.");
            if (error?.response?.status === 422)
                return setErrorMessage("data is incorrect");
            if (error?.response?.status === 404)
                return setErrorMessage("connection error");
            setErrorMessage("error system get Chats");
        } finally {
            chats.value.isLoading = false;
        }
    }

    async function getMessagesList(chatId) {
        setIsError(true);
        setIsLoading(true);

        try {
            const response = await axiosInstance.get(`/chats/${chatId}`);

            chats.value.messages = response.data.data;
        } catch (error) {
            if (error?.response?.status === 401)
                return setErrorMessage("Unauthenticated.");
            if (error?.response?.status === 422)
                return setErrorMessage("data is incorrect");
            if (error?.response?.status === 404)
                return setErrorMessage("connection error");
            setErrorMessage("error system get Messages List");
        } finally {
            chats.value.isLoading = false;
        }
    }

    async function createChats(companyId, userId) {
        setIsError(true);
        setIsLoading(true);
        const params = {};
        if (companyId) params.company_id = companyId;
        if (userId) params.user_id = userId;

        try {
            const response = await axiosInstance.post(`/chats`, params);
            chats.value.chatsList = [
                ...chats.value.chatsList,
                response.data.data,
            ];
            setCurrentChat(response.data.data);
        } catch (error) {
            if (error?.response?.status === 401)
                return setErrorMessage("Unauthenticated.");
            if (error?.response?.status === 422)
                return setErrorMessage("data is incorrect");
            if (error?.response?.status === 404)
                return setErrorMessage("connection error");
            setErrorMessage("error system");
        } finally {
            setIsLoading(false);
        }
    }

    async function sendMessage(content) {
        setIsError(true);
        setIsLoading(true);

        const chatId = chats.value.currentChat?.id;
        if (!chatId) return;
        try {
            const response = await axiosInstance.post(`/chats/${chatId}`, {
                content,
            });
            chats.value.messages = [
                response.data.data,
                ...chats.value.messages.map((item) => {
                    item.read = false;
                    return item;
                }),
            ];
        } catch (error) {
            if (error?.response?.status === 401)
                return setErrorMessage("Unauthenticated.");
            if (error?.response?.status === 422)
                return setErrorMessage("data is incorrect");
            if (error?.response?.status === 404)
                return setErrorMessage("connection error");
            setErrorMessage("error system send Message");
        } finally {
            setIsLoading(false);
        }
    }

    async function sendOffer(content, company, candidate) {
        const { userId } = storeToRefs(useAuthStore());
        setIsError(true);
        setIsLoading(true);

        let chatId = chats.value.chatsList.find(
            (chat) =>
                chat.userId == candidate.user.id && chat.companyId == company.id
        )?.id;
        if (!chatId) {
            await createChats(company.id, candidate.user.id);
            chatId = chats.value.chatsList.find(
                (chat) =>
                    chat.userId == candidate.user.id &&
                    chat.companyId == company.id
            )?.id;
        }

        const message = `<<<<sending resume>>>> 
        Company 
         <a href="/companies/${company.id} " target="_blank">
         ${company.name}
         </a>
        has reviewed your profile
        <a href="/candidates/${candidate.id}" target="_blank">
         ${candidate.title}
         </a>
          and would like to offer you one of the open positions.
         <br>                          
         ${content}`;

        if (!chatId) return;
        try {
            const response = await axiosInstance.post(`/chats/${chatId}`, {
                content: message,
            });
            chats.value.messages = [
                response.data.data,
                ...chats.value.messages.map((item) => {
                    item.read = false;
                    return item;
                }),
            ];
        } catch (error) {
            if (error?.response?.status === 401)
                return setErrorMessage("Unauthenticated.");
            if (error?.response?.status === 422)
                return setErrorMessage("data is incorrect");
            if (error?.response?.status === 404)
                return setErrorMessage("connection error");
            setErrorMessage("error system send Offer");
        } finally {
            setIsLoading(false);
        }
    }

    async function sendApplyVacancy(content, resume, vacancy) {
        const { userId } = storeToRefs(useAuthStore());
        setIsError(true);
        setIsLoading(true);

        let chatId = chats.value.chatsList.find(
            (chat) => chat.companyId === vacancy.company.id
        )?.id;

        if (!chatId) {
            await createChats(vacancy.company.id, userId.value);
            chatId = chats.value.chatsList.find(
                (chat) => chat.companyId === vacancy.company.id
            )?.id;
        }

        const message = `<<<<sending resume>>>> 
        I would like to submit my resume
         <a href="/candidates/${resume.id} " target="_blank">
         ${resume.name}
         </a> 
         for the vacancy
         <a href="/vacancies/${vacancy.id}" target="_blank">
         ${vacancy.title}
         </a><br>
         ${content}`;

        if (!chatId) return;
        try {
            const response = await axiosInstance.post(`/chats/${chatId}`, {
                content: message,
            });
            chats.value.messages = [
                response.data.data,
                ...chats.value.messages.map((item) => {
                    item.read = false;
                    return item;
                }),
            ];
        } catch (error) {
            if (error?.response?.status === 401)
                return setErrorMessage("Unauthenticated.");
            if (error?.response?.status === 422)
                return setErrorMessage("data is incorrect");
            if (error?.response?.status === 404)
                return setErrorMessage("connection error");
            setErrorMessage("error system send Apply Vacancy");
        } finally {
            setIsLoading(false);
        }
    }

    return {
        chats,

        isLoading,
        isError,
        chatsList,
        messages,
        currentChat,
        successfulMessage,
        infoMessage,
        errorMessage,

        setIsLoading,
        setIsError,
        setCurrentChat,
        setSuccessfulMessage,
        setErrorMessage,
        setInfoMessage,

        createChats,
        getChatsList,
        sendMessage,
        useChenel,
        sendApplyVacancy,
        generatePDF,
        sendOffer,
    };
});
