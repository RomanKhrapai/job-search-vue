import "./assets/main.css";
import "vuetify/styles";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import "vue3-toastify/dist/index.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import router from "./router/index.js";
import App from "./App.vue";

const vuetify = createVuetify({ components, directives });
const pinia = createPinia();
const app = createApp(App);

// axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

app.use(router)
    .use(pinia)
    .directive("tooltip", (el, param) => {
        const span = document.createElement("span");
        span.classList.add("tooltiptext");
        span.classList.add("tooltiptext-top");
        span.innerHTML = param.value;
        el.style.position = "relative";

        el.addEventListener(
            "mouseover",
            (e) => {
                let x = e.pageX,
                    y = e.pageY;
                span.style.top =
                    y -
                    el.getBoundingClientRect().top -
                    20 -
                    window.scrollY +
                    "px";
                span.style.left =
                    x -
                    el.getBoundingClientRect().left -
                    70 -
                    window.scrollX +
                    "px";
            },
            {
                capture: true,
            }
        );
        el.classList.add("tooltip");
        if (el.querySelector(".tooltiptext")) {
            return;
        }
        el.appendChild(span);
    })
    .use(vuetify, {
        iconfont: "mdi",
    })
    .mount("#app");
