import axiosInstance from "../../services/axios.js";
import { useEmploymentStore } from "../employmentStore.js";
import { storeToRefs } from "pinia";

export async function getVacancies(name, area) {
    const { setVacancies, setIsLoading } = useEmploymentStore();
    setIsLoading(true);

    try {
        const response = await axiosInstance.get(`/vacancies`, {
            params: { name, area },
        });

        console.log(response.data.data);
        setVacancies(response.data.data);
    } catch (error) {
    } finally {
        setIsLoading(false);
    }
}

export async function getVacancy(id) {
    const { setVacancy, setIsLoading } = useEmploymentStore();
    const { vacancies } = storeToRefs(useEmploymentStore());
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
        console.log(error);
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
        return response.data.data.id;
    } catch (error) {
        console.log(error);
    } finally {
        setIsLoading(false);
    }
}

export async function deleteVacancy(id) {
    setIsLoading(true);
    const { setIsLoading } = useEmploymentStore();

    try {
        const response = await axiosInstance.delete(`/vacancies/${id}`);
    } catch (error) {
        console.log(error);
    } finally {
        setIsLoading(false);
    }
}
