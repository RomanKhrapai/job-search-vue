import { defineStore } from "pinia";
import axiosInstance from "../services/axios";
import { ref, computed } from "vue";

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
        experience: null,
    });
    const isLoading = computed(() => formParameters.value.isLoading);
    const companies = computed(() => formParameters.value.companies);
    const areas = computed(() => formParameters.value.areas);
    const types = computed(() => formParameters.value.types);
    const natures = computed(() => formParameters.value.natures);
    const skills = computed(() => formParameters.value.skills);
    const professions = computed(() => formParameters.value.professions);
    const profession = computed(() => formParameters.value.profession);
    const experience = computed(() => formParameters.value.experience);

    function setProfesion(data) {
        formParameters.value.profession = data;
        if (data.id) {
            getSkills(data.id);
        }
    }

    function setExperience(data) {
        try {
            formParameters.value.experience = Number(data);
        } catch {
            formParameters.value.experience = 0;
        }
    }

    async function getProfessions(name, limit) {
        formParameters.value.isLoading = true;
        try {
            const response = await axiosInstance.get(`professions/search`, {
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
            const response = await axiosInstance.get(`areas/search`, {
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
        experience,
        isLoading,

        setProfesion,
        setExperience,

        getProfessions,
        getFormParameters,
        getAreas,
        getSkills,
    };
});
