import { createRouter, createWebHistory } from "vue-router";
// import { useAuthStore } from "../store/authStore";
import NotFound from "../components/pages/NotFoundPage.vue";

const routes = [
    {
        path: "/",
        name: "home",
        component: () => import("../components/pages/HomePage.vue"),
        meta: { id: 1 },
    },

    {
        path: "/my-office",
        name: "office",
        component: () => import("../components/pages/Office.vue"),
        props: (route) => ({}),
        meta: { id: 1 },
    },
    {
        path: "/candidates",
        component: () => import("../components/pages/Candidates.vue"),
        meta: { role: "3", id: 3 },
        children: [
            {
                path: "",
                component: () => import("../components/Candidates/All.vue"),
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
                component: () => import("../components/Vacancies/All.vue"),
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
                component: () => import("../components/Companies/All.vue"),
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
        meta: { auth: "guest", id: 5 },
    },
    {
        path: "/auth/login",
        name: "login",
        component: () => import("../components/pages/LogInPage.vue"),
        meta: { auth: "guest", id: 6 },
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

router.beforeEach((to, from, next) => {
    if (to.path !== from.path) {
    }

    const authStatus = false;

    // if (!authStatus) {
    //     next();
    // } else if (to.path === "/library" || to.path === "/library/favorite") {
    //     auth.setPath(to.path);
    //     next({ name: "home" });
    // } else if (authStatus === "guest") {
    //     next();
    // } else if (authStatus === "user") {
    //     next();
    // } else next({ name: "NotFound" });
    next();
});

export default router;
