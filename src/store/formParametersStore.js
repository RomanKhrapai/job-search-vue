import { defineStore } from "pinia";
import { useToast } from "vue-toastification";
import axiosInstance from "../services/axios";

import { ref, computed } from "vue";

const toast = useToast();

export const useFormParametersStore = defineStore("formParameters", () => {
    const formParameters = ref({
        isLoading: false,
        companies: [],
        areas: [],
        types: [],
        natures: [],
        skills: [],
        professions: [],
    });

    const companies = computed(() => formParameters.value.companies);
    const areas = computed(() => formParameters.value.areas);
    const types = computed(() => formParameters.value.types);
    const natures = computed(() => formParameters.value.natures);
    const skills = computed(() => formParameters.value.skills);
    const professions = computed(() => formParameters.value.professions);

    async function getProfessions(name, limit) {
        formParameters.value.isLoading = true;
        axiosInstance
            .get(`profession/search`, { params: { name: name, limit: limit } })
            .then((response) => {
                formParameters.value.professions = response.data;
                formParameters.value.isLoading = false;
            })
            .catch();
        formParameters.value.isLoading = false;
    }

    async function getAreas(name, limit) {
        formParameters.value.isLoading = true;
        axiosInstance
            .get(`area/search`, { params: { name: name, limit: limit } })
            .then((response) => {
                formParameters.value.areas = response.data;
                formParameters.value.isLoading = false;
            })
            .catch();
        formParameters.value.isLoading = false;
    }

    async function getSkills(id) {
        formParameters.value.isLoading = true;
        axiosInstance
            .get(`skillByProfesion`, { params: { id: id } })
            .then((response) => {
                formParameters.value.skills = response.data;
                formParameters.value.isLoading = false;
            })
            .catch();
        formParameters.value.isLoading = false;
    }

    async function getFormParameters() {
        formParameters.value.isLoading = true;

        axiosInstance
            .get(`parameters`)
            .then((response) => {
                formParameters.value.types = response.data.types;
                formParameters.value.natures = response.data.natures;
                formParameters.value.isLoading = false;
            })
            .catch();
        formParameters.value.isLoading = false;
    }

    return {
        companies,
        areas,
        types,
        skills,
        natures,
        professions,
        getProfessions,
        getFormParameters,
        getAreas,
        getSkills,
    };
});
