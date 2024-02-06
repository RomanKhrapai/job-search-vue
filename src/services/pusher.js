import Pusher from "pusher-js";

const token = `Bearer ${localStorage.getItem("access_token")}`;
console.log(token);
export const pusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    encrypted: true,

    channelAuthorization: {
        // transport: "jsonp",
        endpoint: "http://localhost:8080/broadcasting/auth",
        headers: {
            // Authorization: token,
            Accept: "application/json",
        },
    },
});
