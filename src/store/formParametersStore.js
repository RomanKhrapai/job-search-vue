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
        profession: null,
    });
    const isLoading = computed(() => formParameters.value.isLoading);
    const companies = computed(() => formParameters.value.companies);
    const areas = computed(() => formParameters.value.areas);
    const types = computed(() => formParameters.value.types);
    const natures = computed(() => formParameters.value.natures);
    const skills = computed(() => formParameters.value.skills);
    const professions = computed(() => formParameters.value.professions);
    const profession = computed(() => formParameters.value.profession);

    function setProfesion(data) {
        formParameters.value.profession = data;
        console.log(data.id);
        if (data.id) {
            getSkills(data.id);
        }
    }

    async function getProfessions(name, limit) {
        formParameters.value.isLoading = true;
        try {
            const response = await axiosInstance.get(`profession/search`, {
                params: { name: name, limit: limit },
            });
            formParameters.value.professions = response.data;
        } catch (error) {
        } finally {
            formParameters.value.isLoading = false;
        }
    }

    async function getAreas(name, limit) {
        formParameters.value.isLoading = true;
        try {
            const response = await axiosInstance.get(`area/search`, {
                params: { name: name, limit: limit },
            });

            formParameters.value.areas = response.data;
        } catch (error) {
        } finally {
            formParameters.value.isLoading = false;
        }
    }

    async function getSkills(id) {
        formParameters.value.isLoading = true;
        try {
            const response = await axiosInstance.get(`skillByProfesion`, {
                params: { id: id },
            });

            formParameters.value.skills = response.data;
        } catch (error) {
        } finally {
            formParameters.value.isLoading = false;
        }
    }

    async function getFormParameters() {
        formParameters.value.isLoading = true;
        try {
            const response = await axiosInstance.get(`parameters`);

            formParameters.value.types = response.data.types;
            formParameters.value.natures = response.data.natures;
        } catch (error) {
        } finally {
            formParameters.value.isLoading = false;
        }
    }

    return {
        companies,
        areas,
        types,
        skills,
        natures,
        professions,
        profession,
        isLoading,

        setProfesion,

        getProfessions,
        getFormParameters,
        getAreas,
        getSkills,
    };
});
