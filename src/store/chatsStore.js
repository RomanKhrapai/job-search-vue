import { defineStore, storeToRefs } from "pinia";
import { useToast } from "vue-toastification";
import { pusher } from "../services/pusher";
import axiosInstance from "../services/axios";
import { useAuthStore } from "./authStore";

import { ref, computed } from "vue";

const toast = useToast();

export const useChatsStore = defineStore("chats", () => {
    const chats = ref({
        isError: false,
        isLoading: false,
        chatsList: [],
        currentChat: null,
        messages: [],
        successfulMessage: "",
    });
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
        const channel = pusher.subscribe(
            `private-send_message_${userId.value}`
        );
        // const channel = pusher.subscribe(`send_message_${userId.value}`);
        channel.bind("send_message", (data) => {
            setSuccessfulMessage("you have a new message");
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
    }

    function setSuccessfulMessage(data) {
        chats.value.successfulMessage = data;
        setTimeout(() => {
            chats.value.successfulMessage = null;
        }, 200);
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

    async function getChatsList() {
        setIsError(true);
        setIsLoading(true);

        try {
            const response = await axiosInstance.get(`/chats`);
            console.log(response.data);
            chats.value.chatsList = response.data.data;
            if (!chats.value.currentChat) {
                setCurrentChat(response.data.data[0]);
            }
        } catch (error) {
            console.log(error);
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
            console.log(error);
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
            console.log(error);
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
            console.log(error);
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

        setIsLoading,
        setIsError,
        setCurrentChat,
        setSuccessfulMessage,

        createChats,
        getChatsList,
        sendMessage,
        useChenel,
    };
});
