import { onCreated } from "pinia";
import { pusher } from "./pusher"; // assuming you exported the pusher instance from its file
export const useChatStore = defineStore({
    id: "chat",
    state: () => ({
        messages: [],
    }),
    actions: {
        addMessage(message) {
            this.messages.push(message);
        },
    },
    created() {
        const channel = pusher.subscribe("my-channel");
        channel.bind("new-message", (data) => {
            this.addMessage(data.message);
        });
    },
});
