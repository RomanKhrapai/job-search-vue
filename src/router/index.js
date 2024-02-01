import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../store/authStore";
import { storeToRefs } from "pinia";
import NotFound from "../components/pages/NotFoundPage.vue";
import axiosInstance from "../services/axios";

const routes = [
    {
        path: "/",
        name: "home",
        component: () => import("../components/pages/HomePage.vue"),
        meta: { id: 1 },
    },

    {
        path: "/my-office",
        component: () => import("../components/pages/Office.vue"),
        meta: { id: 2, role: true },
        children: [
            {
                path: "",
                name: "office",
                component: () => import("../components/Office/Index.vue"),
                meta: {},
                alias: "sadd",
            },
            {
                path: "user-update",
                name: "user-update",
                component: () => import("../components/Office/UserUpdate.vue"),
                meta: { isAuthorized: true },
                alias: "sadd",
            },
        ],
    },
    {
        path: "/candidates",
        component: () => import("../components/pages/Candidates.vue"),
        meta: { role: "3", id: 3 },
        children: [
            {
                path: "",
                component: () => import("../components/Candidates/Index.vue"),
                alias: "sadd",
            },
            {
                path: "create",
                component: () => import("../components/Candidates/Store.vue"),
            },
            {
                path: ":id/edit",
                component: () => import("../components/Candidates/Edit.vue"),
                props: (route) => ({ id: route.params.id }),
            },
            {
                path: ":id",
                component: () => import("../components/Candidates/Show.vue"),
                props: (route) => ({ id: route.params.id }),
            },
        ],
    },
    {
        path: "/vacancies",
        component: () => import("../components/pages/Vacancies.vue"),
        meta: { role: "2", id: 4 },
        children: [
            {
                path: "",
                component: () => import("../components/Vacancies/Index.vue"),
                alias: "sadd",
            },
            {
                path: "create",
                component: () => import("../components/Vacancies/Store.vue"),
            },
            {
                path: ":id/edit",
                component: () => import("../components/Vacancies/Edit.vue"),
                props: (route) => ({ id: route.params.id }),
            },
            {
                path: ":id",
                component: () => import("../components/Vacancies/Show.vue"),
                props: (route) => ({ id: route.params.id }),
            },
        ],
    },
    {
        path: "/companies",
        component: () => import("../components/pages/Companies.vue"),
        meta: { role: "2", id: 5 },
        children: [
            {
                path: "",
                component: () => import("../components/Companies/Index.vue"),
                alias: "sadd",
            },
            {
                path: "create",
                component: () => import("../components/Companies/Store.vue"),
            },
            {
                path: ":id/edit",
                component: () => import("../components/Companies/Edit.vue"),
                props: (route) => ({ id: route.params.id }),
            },
            {
                path: ":id",
                component: () => import("../components/Companies/Show.vue"),
                props: (route) => ({ id: route.params.id }),
            },
        ],
    },

    {
        path: "/auth/registration",
        name: "registration",
        component: () => import("../components/pages/RegistrationPage.vue"),
        meta: { role: "guest", id: 5 },
    },
    {
        path: "/auth/login",
        name: "login",
        component: () => import("../components/pages/LogInPage.vue"),
        meta: { role: "guest", id: 6 },
    },
    {
        path: "/not-found",
        alias: "/:pathMatch(.*)*",
        name: "NotFound",
        component: NotFound,
        meta: { id: null },
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

function query(store, to, from) {
    if (to.query?.token) {
        localStorage.access_token = to.query.token;
        axiosInstance.defaults.headers.common[
            "Authorization"
        ] = `Bearer ${response.data.access_token}`;
    }

    if (
        to.path === from.path ||
        !from.meta?.id ||
        to.fullPath.includes("/?search")
    ) {
        const search = to.query?.search;

        store.setSearch(search ? search : null);
        store.setPage(to.query?.page ? to.query.page : 1);
    } else {
        store.setPage(1);
        store.setSearch(null);
    }
    setTimeout(store.startFetch, 1);
}

function googleRoute(to, from, next, onAuth) {
    if (to.query?.token) {
        localStorage.access_token = to.query.token;
        axiosInstance.defaults.headers.common[
            "Authorization"
        ] = `Bearer ${to.query.token}`;
        const url = new URL(window.location.href);
        url.search = "";
        window.history.replaceState({}, "", url.href);
        return next({ name: "home" });
        // onAuth();
    }

    if (to.query?.new) {
        return next({ name: "user-update" });
    }
}

router.beforeEach((to, from, next) => {
    console.log("to= ", to);
    console.log("from= ", from);

    const { onAuth, setPath } = useAuthStore();
    const { isAuthorized, role } = storeToRefs(useAuthStore());
    googleRoute(to, from, next, onAuth);

    if (to.path !== from.path) {
    }

    const isAuth = to.matched.find(
        (record) => record.meta.isAuthorized === true
    );
    const isAuthorizedRoute = to.matched.find((record) => record.meta.role);
    const isEmploer = to.matched.find((record) => record.meta.role == 2);
    const isWorker = to.matched.find((record) => record.meta.role == 3);

    console.log(to.matched.find((record) => record.meta.role));

    // if (!isAuth) {
    //     next();
    // } else
    if (!isAuthorized && isAuthorizedRoute) {
        setPath(to.path);
        next({ name: "login" });
    }
    // else if (authStatus === "guest") {
    //     next();
    // } else if (authStatus === "2"&&) {
    //     next();
    // } else if (authStatus === "3") {
    //     next();
    // } else next({ name: "NotFound" });
    next();
});

export default router;
