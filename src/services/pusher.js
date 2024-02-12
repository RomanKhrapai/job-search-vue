import Pusher from "pusher-js";

import Echo from "laravel-echo";

const token = `Bearer ${localStorage.getItem("access_token")}`;

export const pusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    encrypted: true,

    channelAuthorization: {
        // transport: "jsonp",
        endpoint: `${import.meta.env.VITE_SERVER_HOST}broadcasting/auth`,
        headers: {
            // Authorization: token,
            Accept: "application/json",
        },
    },
});

// window.Pusher = Pusher;

// export const pusher = new Echo({
//     broadcaster: "pusher",
//     key: import.meta.env.VITE_PUSHER_APP_KEY,
//     cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER ?? "mt1",
//     encrypted: true,
//     auth: {
//         headers: {
//             Authorization: token,
//         },
//     },
//     // wsHost:
//     //     import.meta.env.VITE_PUSHER_HOST ??
//     //     `ws-${import.meta.env.VITE_PUSHER_APP_CLUSTER}.pusher.com`,
//     // wsPort: import.meta.env.VITE_PUSHER_PORT ?? 80,
//     // wssPort: import.meta.env.VITE_PUSHER_PORT ?? 443,
//     // forceTLS:
//     //     (import.meta.env.VITE_PUSHER_SCHEME ?? "https") === "https",
//     // enabledTransports: ["ws", "wss"],
// });
