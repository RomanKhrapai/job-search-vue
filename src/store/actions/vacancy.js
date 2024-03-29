import axiosInstance from "../../services/axios.js";
import { useEmploymentStore } from "../employmentStore.js";
import { useChatsStore } from "../chatsStore.js";
import { useAuthStore } from "../authStore.js";
import { storeToRefs } from "pinia";

export async function getVacancyOffer(vacancyId, deep) {
    const { setCandidates, setIsLoading, setLastPage } = useEmploymentStore();
    const { setErrorMessage } =
        useChatsStore();
    setIsLoading(true);
    setLastPage(1);
    try {
        const response = await axiosInstance.get(
            `/vacancies/offers/${vacancyId}`,
            {
                params: { deep },
            }
        );
        console.log(response);
        setLastPage(response.data.meta.last_page);
        setCandidates(response.data.data);
    } catch (error) {
        if (error?.response?.status === 401)
            return setErrorMessage("Unauthenticated.");
        if (error?.response?.status === 422)
            return setErrorMessage("the query parameters are not valid");
        if (error?.response?.status === 404)
            return setErrorMessage("connection error");
        setErrorMessage("error delete ");
    } finally {
        setIsLoading(false);
    }
}

export async function getVacancies(
    title,
    profession_id,
    area_id,
    page,
    sort,
    isDesc
) {
    const { setVacancies, setIsLoading, setLastPage } = useEmploymentStore();
    const { setErrorMessage } =
        useChatsStore();
    setIsLoading(true);
    setLastPage(1);
    setVacancies([]);
    try {
        const response = await axiosInstance.get(`/vacancies`, {
            params: {
                title,
                area_id,
                profession_id,
                page,
                sort,
                is_desc: isDesc ? "desc" : "asc",
            },
        });
        setLastPage(response.data.meta.last_page);
        setVacancies(response.data.data);
    } catch (error) {
        if (error?.response?.status === 401)
            return setErrorMessage("Unauthenticated.");
        if (error?.response?.status === 422)
            return setErrorMessage("the query parameters are not valid");
        if (error?.response?.status === 404)
            return setErrorMessage("connection error");
        setErrorMessage("error delete ");
    } finally {
        setIsLoading(false);
    }
}

export async function getVacancy(id) {
    const { setVacancy, setIsLoading } = useEmploymentStore();
    const { vacancies } = storeToRefs(useEmploymentStore());
    const { setErrorMessage } =
        useChatsStore();
    setIsLoading(true);

    try {
        const vacancy = vacancies.value.find((item) => item.id === +id);

        if (vacancy) {
            setVacancy(vacancy);
            setIsLoading(false);
            return;
        }

        const response = await axiosInstance.get(`/vacancies/${id}`);

        setVacancy(response.data.data);
    } catch (error) {
        if (error?.response?.status === 401)
            return setErrorMessage("Unauthenticated.");
        if (error?.response?.status === 422)
            return setErrorMessage("data is incorrect");
        if (error?.response?.status === 404)
            return setErrorMessage("connection error");
        setErrorMessage("error system");
    } finally {
        setIsLoading(false);
    }
}

export async function storeVacancy({
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
    const { setVacancy, setIsLoading } = useEmploymentStore();
    const { company } = storeToRefs(useEmploymentStore());
    const { authData } = useAuthStore();
    const { setErrorMessage } =
        useChatsStore();
    setIsLoading(true);

    try {
        const response = await axiosInstance.post(`/vacancies`, {
            title: title,
            company_id: company.value.id,
            profession: profession,
            area: area,
            salary: salary,
            max_salary: maxSalary,
            nature_id: nature,
            type_id: type,
            skills: skills,
            description: description,
        });

        setVacancy(response.data.data);
        authData();
    } catch (error) {
        if (error?.response?.status === 401)
            return setErrorMessage("Unauthenticated.");
        if (error?.response?.status === 422)
            return setErrorMessage("data is incorrect");
        if (error?.response?.status === 404)
            return setErrorMessage("connection error");
        setErrorMessage("error system store Vacancy");
    } finally {
        setIsLoading(false);
    }
}

export async function updateVacancyStatus(isClosed) {
    const { setVacancy, setIsLoading } = useEmploymentStore();
    const { authData } = useAuthStore();
    const { vacancy } = storeToRefs(useEmploymentStore());
    const { setErrorMessage, setSuccessfulMessage } =
        useChatsStore();
    setIsLoading(true);

    try {
        const response = await axiosInstance.patch(
            `/vacancies/${vacancy.value.id}`,
            { closed: isClosed }
        );
        authData();
        setVacancy(response.data.data);
        setSuccessfulMessage(" status changed");
    } catch (error) {
        if (error?.response?.status === 401)
            return setErrorMessage("Unauthenticated.");
        if (error?.response?.status === 422)
            return setErrorMessage("data is incorrect");
        if (error?.response?.status === 404)
            return setErrorMessage("connection error");
        setErrorMessage("error system update Status Vacancy ");
    } finally {
        setIsLoading(false);
    }
}

export async function deleteVacancy(id) {
    const { authData } = useAuthStore();
    const { setIsLoading } = useEmploymentStore();
    const { setErrorMessage, setSuccessfulMessagee } =
        useChatsStore();
    setIsLoading(true);

    try {
        const response = await axiosInstance.delete(`/vacancies/${id}`);
        authData();
        setSuccessfulMessage("Vacancy deleted");
    } catch (error) {
        if (error?.response?.status === 401)
            return setErrorMessage("Unauthenticated.");
        if (error?.response?.status === 404)
            return setErrorMessage("connection error");
        setErrorMessage("error delete vacancy ");
    } finally {
        setIsLoading(false);
    }
}
