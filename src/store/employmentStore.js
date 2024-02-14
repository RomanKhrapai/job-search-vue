import { defineStore } from "pinia";
import axiosInstance from "../services/axios";
import { useChatsStore } from "./chatsStore";

import { ref, computed } from "vue";

export const useEmploymentStore = defineStore("employment", () => {
    const employment = ref({
        isError: false,
        isLoading: false,
        companies: [],
        imageURL: null,
        fullImageURL: "",
        errorImage: null,
        company: {},
        vacancies: [],
        vacancy: {},
        candidate: {},
        candidates: [],
        reviews: [],
        lastPage: 1,
    });
    const lastPage = computed(() => employment.value.lastPage);
    const reviews = computed(() => employment.value.reviews);
    const candidates = computed(() => employment.value.candidates);
    const candidate = computed(() => employment.value.candidate);
    const companies = computed(() => employment.value.companies);
    const company = computed(() => employment.value.company);
    const vacancies = computed(() => employment.value.vacancies);
    const vacancy = computed(() => employment.value.vacancy);
    const isError = computed(() => employment.value.isError);
    const isLoading = computed(() => employment.value.isLoading);
    const imageURL = computed(() => employment.value.imageURL);
    const fullImageURL = computed(() => employment.value.fullImageURL);
    const errorImage = computed(() => employment.value.errorImage);

    function setLastPage(data) {
        employment.value.lastPage = data;
    }

    function setReviews(data) {
        employment.value.reviews = data;
    }

    function setIsError(data) {
        employment.value.isError = data;
    }

    function setVacancies(data) {
        employment.value.vacancies = data;
    }

    function setVacancy(data) {
        employment.value.vacancy = data;
    }

    function setIsLoading(data) {
        employment.value.isLoading = data;
    }

    function setCompamies(data) {
        employment.value.companies = data;
    }

    function setCompany(data) {
        employment.value.company = data;
    }

    function setCandidate(data) {
        employment.value.candidate = data;
    }

    function setCandidates(data) {
        employment.value.candidates = data;
    }

    async function uploadAvatar(formData) {
        const { setErrorMessage} =
            useChatsStore();
        employment.value.fullImageURL = "";
        employment.value.isLoading = true;
        employment.value.errorImage = null;

        if (!formData) {
            employment.value.errorImage = true;
            return;
        }

        try {
            const response = await axiosInstance.post(
                `/uploadavatar`,
                formData
            );

            employment.value.fullImageURL =
                response.data.fullUrl +
                "?" +
                Math.random().toString(36).substring(7);
            employment.value.imageURL = response.data.url;
        } catch (error) {
            if (error?.response?.data?.errors?.file) {
                employment.value.errorImage =
                    error.response.data.errors.file[0];
                return;
            }
            employment.value.errorImage = "Error: select another file";
            if (error?.response?.status === 401)
                return setErrorMessage("Unauthenticated.");
            if (error?.response?.status === 422)
                return setErrorMessage("data is incorrect");
            if (error?.response?.status === 404)
                return setErrorMessage("connection error");
            setErrorMessage("error image");
        } finally {
            employment.value.isLoading = false;
        }
    }

    return {
        employment,

        isLoading,
        isError,
        errorImage,

        companies,
        company,
        vacancy,
        vacancies,
        candidates,
        candidate,
        reviews,
        lastPage,

        imageURL,
        fullImageURL,

        uploadAvatar,

        setIsLoading,
        setIsError,
        setVacancies,
        setVacancy,

        setCandidates,
        setCandidate,

        setCompamies,
        setCompany,

        setReviews,

        setLastPage,
    };
});
