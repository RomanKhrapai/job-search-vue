import Pusher from "pusher-js";

const token = `Bearer ${localStorage.getItem("access_token")}`;

export const pusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    encrypted: true,

    channelAuthorization: {
        endpoint: `${import.meta.env.VITE_SERVER_HOST}broadcasting/auth`,
        headers: {
            Authorization: token,
            Accept: "application/json",
        },
    },
});
