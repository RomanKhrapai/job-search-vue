import { defineStore } from "pinia";
import { useToast } from "vue-toastification";
import axiosInstance from "../services/axios";

import { ref, computed } from "vue";

const toast = useToast();

export const useEmploymentStore = defineStore("employment", () => {
    const employment = ref({
        isError: false,
        isLoading: false,
        companies: [],
        imageURL: "",
        fullImageURL: "",
        // areas: [],
        // types: [],
        // natures: [],
        // skills: [],
        // profesions: [],
    });

    const companies = computed(() => employment.value.companies);
    const isError = computed(() => employment.value.isError);
    const isLoading = computed(() => employment.value.isLoading);
    const imageURL = computed(() => employment.value.imageURL);
    const fullImageURL = computed(() => employment.value.fullImageURL);
    // const areas = computed(() => formParameters.value.areas);
    // const types = computed(() => formParameters.value.types);
    // const natures = computed(() => formParameters.value.natures);
    // const skills = computed(() => formParameters.value.skills);
    // const profesions = computed(() => formParameters.value.profesions);

    async function getCompanies(name, area) {
        employment.value.isLoading = true;

        axiosInstance
            .get(`/companies`, { params: { name, area } })
            .then((response) => {
                console.log(response.data);
                employment.value.companies = response.data.data;
                employment.value.isLoading = false;
            })
            .catch();
        employment.value.isLoading = false;
    }

    async function uploadAvatar(formData) {
        employment.value.isLoading = true;

        axiosInstance
            .post(`/uploadavatar`, formData)
            .then((response) => {
                console.log(response.data.fullUrl);
                employment.value.fullImageURL =
                    response.data.fullUrl +
                    "?" +
                    Math.random().toString(36).substring(7);
                employment.value.imageURL = response.data.url;

                employment.value.isLoading = false;
            })
            .catch();

        employment.value.isLoading = false;
    }

    async function storeVacancy({
        title,
        company,
        profession,
        area,
        salary,
        maxSalary,
        nature,
        type,
        skills,
        description,
    }) {
        employment.value.isLoading = true;

        axiosInstance
            .post(`/vacancies`, {
                title: title,
                company_id: company,
                profession: profession,
                area: area,
                salary: salary,
                max_salary: maxSalary,
                nature_id: nature,
                type_id: type,
                skills: skills,
                description: description,
            })
            .then((response) => {
                console.log(response);
                // employment.value.profesions = response.data;
                employment.value.isLoading = false;
            })
            .catch();
        employment.value.isLoading = false;
    }

    return {
        companies,
        isError,
        // areas,
        // types,
        // skills,
        // natures,
        // profesions,
        storeVacancy,
        getCompanies,
        uploadAvatar,
        imageURL,
        fullImageURL,
    };
});
