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
        errorImage: null,
        company: {},
        vacancies: [],
        vacancy: {},
    });

    const companies = computed(() => employment.value.companies);
    const company = computed(() => employment.value.company);
    const vacancies = computed(() => employment.value.vacancies);
    const vacancy = computed(() => employment.value.vacancy);
    const isError = computed(() => employment.value.isError);
    const isLoading = computed(() => employment.value.isLoading);
    const imageURL = computed(() => employment.value.imageURL);
    const fullImageURL = computed(() => employment.value.fullImageURL);
    const errorImage = computed(() => employment.value.errorImage);

    async function getCompanies(name, area) {
        employment.value.isLoading = true;

        axiosInstance
            .get(`/companies`, { params: { name, area } })
            .then((response) => {
                console.log(response.data.data);
                employment.value.companies = response.data.data;
                employment.value.isLoading = false;
            })
            .catch();
        employment.value.isLoading = false;
    }

    async function getCompany(id) {
        employment.value.isLoading = true;
        const company = employment.value.companies.find(
            (item) => item.id === +id
        );

        if (company) {
            employment.value.company = company;
            employment.value.isLoading = false;
            return;
        }
        axiosInstance
            .get(`/companies/${id}`)
            .then((response) => {
                console.log(response.data);
                employment.value.company = response.data.data;
                employment.value.isLoading = false;
            })
            .catch();
        employment.value.isLoading = false;
    }

    async function storeCompany({ name, address, description }) {
        employment.value.isLoading = true;
        axiosInstance
            .post(`/companies`, {
                name: name,
                address: address,
                image: employment.value.imageURL,
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

    async function deleteCompany(id) {
        employment.value.isLoading = true;
        console.log(id);
        axiosInstance
            .delete(`/companies/${id}`)
            .then((response) => {
                console.log(response);
                getCompanies();
                employment.value.isLoading = false;
            })
            .catch();
        employment.value.isLoading = false;
    }

    async function uploadAvatar(formData) {
        employment.value.fullImageURL = "";
        if (!formData) {
            employment.value.errorImage = true;
            return;
        }
        employment.value.isLoading = true;
        employment.value.errorImage = null;
        axiosInstance
            .post(`/uploadavatar`, formData)
            .then((response) => {
                employment.value.fullImageURL =
                    response.data.fullUrl +
                    "?" +
                    Math.random().toString(36).substring(7);
                employment.value.imageURL = response.data.url;

                employment.value.isLoading = false;
            })
            .catch((error) => {
                if (error?.response?.data?.errors?.file) {
                    employment.value.errorImage =
                        error.response.data.errors.file[0];
                    return;
                }
                employment.value.errorImage = "Error: select another file";
            });

        employment.value.isLoading = false;
    }

    async function getVacancies(name, area) {
        employment.value.isLoading = true;

        axiosInstance
            .get(`/vacancies`, { params: { name, area } })
            .then((response) => {
                console.log(response.data.data);
                employment.value.vacancies = response.data.data;
                employment.value.isLoading = false;
            })
            .catch();
        employment.value.isLoading = false;
    }

    async function getVacancy(id) {
        employment.value.isLoading = true;
        const vacancy = employment.value.vacancies.find(
            (item) => item.id === +id
        );

        if (vacancy) {
            employment.value.vacancy = vacancy;
            employment.value.isLoading = false;
            return;
        }
        axiosInstance
            .get(`/vacancies/${id}`)
            .then((response) => {
                console.log(response.data);
                employment.value.vacancy = response.data.data;
                employment.value.isLoading = false;
            })
            .catch();
        employment.value.isLoading = false;
    }

    async function storeVacancy({
        title,
        profession,
        area,
        salary,
        maxSalary,
        nature,
        type,
        skills,
        description,
    }) {
        try {
            employment.value.isLoading = true;

            const response = await axiosInstance.post(`/vacancies`, {
                title: title,
                company_id: employment.value.company.id,
                profession: profession,
                area: area,
                salary: salary,
                max_salary: maxSalary,
                nature_id: nature,
                type_id: type,
                skills: skills,
                description: description,
            });

            console.log(response);
            employment.value.vacancy = response.data.data;
            employment.value.isLoading = false;
            return response.data.data.id;
        } catch (error) {
            console.log(error);
            employment.value.isLoading = false;
        }
    }

    return {
        companies,
        isError,
        errorImage,
        company,
        isLoading,
        vacancy,
        vacancies,

        storeVacancy,
        getCompanies,
        uploadAvatar,
        imageURL,
        fullImageURL,
        storeCompany,
        deleteCompany,
        getCompany,
        getVacancy,
        getVacancies,
    };
});
