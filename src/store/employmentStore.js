import { defineStore } from "pinia";
import { useToast } from "vue-toastification";
import axiosInstance from "../services/axios";
import {
    storeVacancy,
    getVacancies,
    getVacancy,
    deleteVacancy,
} from "./actions/vacancy.js";

import { ref, computed } from "vue";

const toast = useToast();

export const useEmploymentStore = defineStore("employment", () => {
    const employment = ref({
        isError: false,
        isLoading: false,
        companies: [],
        imageURL: "",
        fullImageURL: "",
        errorImage: null,
        company: {},
        vacancies: [],
        vacancy: {},
        candidate: {},
        candidates: [],
    });

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
    };
});
