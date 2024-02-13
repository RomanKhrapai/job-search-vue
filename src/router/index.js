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
        meta: { id: 2, user: true },
        children: [
            {
                path: "",
                name: "office",
                component: () => import("../components/Office/Index.vue"),
                meta: {},
            },
            {
                path: "chat",
                name: "chat",
                component: () => import("../components/chat/Chat.vue"),
                meta: {},
            },
            {
                path: "user-update",
                name: "user-update",
                component: () => import("../components/Office/UserUpdate.vue"),
                meta: { isAuthorized: true },
            },
        ],
    },
    {
        path: "/candidates",
        component: () => import("../components/pages/Candidates.vue"),
        meta: { user: true, id: 3 },
        children: [
            {
                path: "",
                component: () => import("../components/Candidates/Index.vue"),
                alias: "sadd",
            },
            {
                path: "create",
                component: () => import("../components/Candidates/Store.vue"),
                meta: { role: "3" },
            },
            {
                path: ":id/edit",
                component: () => import("../components/Candidates/Edit.vue"),
                props: (route) => ({ id: route.params.id }),
                meta: { role: "3" },
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
        meta: { id: 4 },
        children: [
            {
                path: "",
                component: () => import("../components/Vacancies/Index.vue"),
                alias: "sadd",
            },
            {
                path: "create",
                component: () => import("../components/Vacancies/Store.vue"),
                meta: { role: "2" },
            },
            {
                path: ":id/edit",
                component: () => import("../components/Vacancies/Edit.vue"),
                props: (route) => ({ id: route.params.id }),
                meta: { role: "2" },
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
        meta: { id: 5 },
        children: [
            {
                path: "",
                component: () => import("../components/Companies/Index.vue"),
                alias: "sadd",
            },
            {
                path: "create",
                component: () => import("../components/Companies/Store.vue"),
                meta: { role: "2" },
            },
            {
                path: ":id/edit",
                component: () => import("../components/Companies/Edit.vue"),
                props: (route) => ({ id: route.params.id }),
                meta: { role: "2" },
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
        meta: { guest: true, id: 5 },
    },
    {
        path: "/auth/login",
        name: "login",
        component: () => import("../components/pages/LogInPage.vue"),
        meta: { guest: true, id: 6 },
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

function googleRoute(to) {
    if (!to.query?.token) return;
    localStorage.access_token = to.query.token;
    axiosInstance.defaults.headers.common[
        "Authorization"
    ] = `Bearer ${to.query.token}`;

    const url = new URL(window.location.href);
    url.search = "";
    window.history.replaceState({}, "", url.href);

    if (to.query?.new) {
        return "user-update";
    }

    return "home";
}

router.beforeEach(async (to, from, next) => {
    const { onAuth, setPath, setIsAuthorized } = useAuthStore();
    const { isAuthorized, role } = storeToRefs(useAuthStore());
    const isRedirect = googleRoute(to);
    const isStart = !from.matched[0];

    if (isStart) {
        await onAuth();
    }
    const isAuth = isAuthorized.value;

    if (to.path !== from.path) {
    }

    const routeRole = to.matched.find((record) => record.meta.role)?.meta?.role;
    const isRole = Boolean(to.matched.find((record) => record.meta?.role));
    const isUser = Boolean(to.matched.find((record) => record.meta?.user));
    const isGuest = Boolean(to.matched.find((record) => record.meta?.guest));

    if (isRedirect) {
        next({ name: isRedirect });
    } else if (
        (!isAuth && isGuest) ||
        (!isRole && !isGuest && !isUser) ||
        (isAuth && isUser && !routeRole)
    ) {
        next();
    } else if (!isAuth && isRole) {
        next({ name: "login" });
    } else if (isAuth && (routeRole != role.value || (isStart && routeRole))) {
        next({ name: "office" });
    } else if ((isAuth && isUser) || (isAuth && routeRole == role.value)) {
        next();
    } else {
        next({ name: "NotFound" });
    }
});

export default router;
