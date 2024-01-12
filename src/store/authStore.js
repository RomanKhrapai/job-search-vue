import { defineStore } from "pinia";
import { useToast } from "vue-toastification";
import axiosInstance from "../services/axios";

import { ref, computed } from "vue";

const toast = useToast();

export const useAuthStore = defineStore("auth", () => {
    const auth = ref({
        isError: false,
        isAuthorized: false,
        oldPath: null,
        user: {
            uid: null,
            name: null,
            email: null,
            library: [],
        },
    });

    const uid = computed(() => auth.value.user.uid);
    const name = computed(() => auth.value.user.name);
    const path = computed(() => auth.value.oldPath);
    const isAuthorized = computed(() => auth.value.isAuthorized);
    const plannedFilms = computed(() => {
        return auth.value.user.library.filter((film) => !film.isWatched);
    });
    const favoriteFilms = computed(() =>
        auth.value.user.library.filter((film) => film.isWatched)
    );
    function setPath(path) {
        auth.value.oldPath = path;
    }
    function clearPath() {
        auth.value.oldPath = null;
    }
    async function onAuth() {}
    async function delfilm(idDoc) {
        await deleteDoc(doc(db, `users/user/${uid.value}`, idDoc));
        toast.success("Видалено з бібліотеки");
        getLibrari();
    }

    async function getLibrari() {
        const querySnapshot = await getDocs(
            collection(db, `users/user/${uid.value}`)
        );
        auth.value.user.library = [];
        querySnapshot.forEach((doc) => {
            const film = doc.data();
            film.idDoc = doc.id;
            auth.value.user.library.push(film);
        });
    }

    async function addFilmToLibrary(data, isWatched) {
        try {
            if (
                auth.value.user.library.find(
                    (film) =>
                        film.id === data.id && film.isWatched === isWatched
                )
            ) {
                return;
            }
            const film = { ...data };
            film.genres = film.genres.split(", ");
            film.isWatched = isWatched;
            await addDoc(collection(db, `users/user/${uid.value}`), film);
            toast.success(
                `додано до  ${!isWatched ? "запланованих" : "улюблених"}`
            );
            getLibrari();
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }
    async function loginUser({ email, password }) {
        auth.value.isLoading = true;

        axiosInstance
            .post(`login`, { email, password })
            .then((response) => {
                console.log("Отримана відповідь:", response.data);
                film.value.totalPages =
                    data.total_pages <= 500 ? data.total_pages : 500;
                film.value.filmsState = data.results;
                film.value.isLoading = false;
            })
            .catch(setError);
        // try {
        //     const res = await (email, password);
        //     console.log(res);
        //     const user = res.user;
        // } catch (error) {
        //     const errorCode = error.code;
        //     let atherError = true;
        //     if (errorCode) {
        //         toast.error("Пароль або пошта не вірний!");
        //         atherError = false;
        //     }
        //     auth.value.isLoading = false;
        // }
    }
    async function logOut() {
        auth.value.isLoading = true;
        try {
            await signOut(authFB);
            auth.value.user.library = [];
            auth.value.user.name = null;
            auth.value.isAuthorized = false;
            auth.value.isLoading = false;
        } catch (error) {
            auth.value.isLoading = false;
        }
    }
    async function registerUser(payload) {
        auth.value.isLoading = true;
        const { email, password, name } = payload;

        axiosInstance
            .post(`register`, { email, password, name })
            .then((response) => {
                console.log("Отримана відповідь:", response.data);
                film.value.totalPages =
                    data.total_pages <= 500 ? data.total_pages : 500;
                film.value.filmsState = data.results;
                film.value.isLoading = false;
            })
            .catch(setError);
        auth.value.isLoading = false;
    }
    return {
        auth,
        isAuthorized,
        uid,
        name,
        path,
        plannedFilms,
        favoriteFilms,
        setPath,
        clearPath,
        onAuth,
        delfilm,
        getLibrari,
        addFilmToLibrary,
        loginUser,
        logOut,
        registerUser,
    };
});
