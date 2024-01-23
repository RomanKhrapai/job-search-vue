import { defineStore } from "pinia";
import { useToast } from "vue-toastification";
import axiosInstance from "../services/axios";

import { ref, computed } from "vue";

const toast = useToast();

export const useEmploymentStore = defineStore("employment", () => {
    const employment = ref({
        isLoading: false,
        // companies: [],
        // areas: [],
        // types: [],
        // natures: [],
        // skills: [],
        // profesions: [],
    });

    // const companies = computed(() => formParameters.value.companies);
    // const areas = computed(() => formParameters.value.areas);
    // const types = computed(() => formParameters.value.types);
    // const natures = computed(() => formParameters.value.natures);
    // const skills = computed(() => formParameters.value.skills);
    // const profesions = computed(() => formParameters.value.profesions);

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
        // companies,
        // areas,
        // types,
        // skills,
        // natures,
        // profesions,
        storeVacancy,
    };
});
