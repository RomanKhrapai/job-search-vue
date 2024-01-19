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
        path: "/film/:id",
        name: "filmById",
        component: () => import("../components/OneFilm.vue"),
        props: (route) => ({ id: route.params.id }),
        meta: { id: 1 },
    },

    {
        path: "/films",
        component: () => import("../components/pages/FilmsPage.vue"),
        meta: { id: 2 },
        children: [
            {
                path: "",
                component: () => import("../components/PopularFilms.vue"),
                alias: "",
            },
            {
                path: "serials",
                component: () => import("../components/PopularSerials.vue"),
            },
        ],
    },
    {
        path: "/addresume",
        component: () => import("../components/pages/AddResume.vue"),
        meta: { role: "3", id: 3 },
    },
    {
        path: "/addvacancy",
        component: () => import("../components/pages/AddVacancy.vue"),
        meta: { role: "2", id: 4 },
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
