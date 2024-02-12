import axiosInstance from "../../services/axios.js";
import { useEmploymentStore } from "../employmentStore.js";
import { useAuthStore } from "../authStore.js";
import { getCandidateReviews } from "./review";
import { useChatsStore } from "../chatsStore";
import { storeToRefs } from "pinia";

export async function getCandidateOffer(candidateId, deep) {
    const { setVacancies, setIsLoading, setLastPage } = useEmploymentStore();
    setIsLoading(true);
    setLastPage(1);
    try {
        const response = await axiosInstance.get(
            `/candidates/offers/${candidateId}`,
            {
                params: { deep },
            }
        );
        setLastPage(response.data.meta.last_page);
        setVacancies(response.data.data);
    } catch (error) {
    } finally {
        setIsLoading(false);
    }
}

export async function getCandidates(title, profession_id, area_id, page) {
    const { setCandidates, setIsLoading, setLastPage } = useEmploymentStore();
    const { setErrorMessage } = useChatsStore();
    setIsLoading(true);
    setLastPage(1);
    setCandidates([]);
    try {
        const response = await axiosInstance.get(`/candidates`, {
            params: { title, area_id, profession_id, page },
        });
        setLastPage(response.data.meta.last_page);
        setCandidates(response.data.data);
    } catch (error) {
        if (error?.response?.status === 422) {
            setErrorMessage("the query parameters are not valid");
        }
        console.log(error);
    } finally {
        setIsLoading(false);
    }
}

export async function getCandidate(id) {
    const { setCandidate, setIsLoading } = useEmploymentStore();
    const { candidates } = storeToRefs(useEmploymentStore());
    setIsLoading(true);

    try {
        const candidate = candidates.value.find((item) => item.id === +id);

        if (candidate) {
            setCandidate(candidate);
            setIsLoading(false);
            return;
        }
        const response = await axiosInstance.get(`/candidates/${id}`);
        getCandidateReviews(response.data.data.user.id);
        setCandidate(response.data.data);
    } catch (error) {
    } finally {
        setIsLoading(false);
    }
}

export async function storeCandidate({
    title,
    profession,
    experience,
    area,
    salary,
    nature,
    type,
    skills,
    description,
}) {
    const { setCandidate, setIsLoading } = useEmploymentStore();
    const { authData } = useAuthStore();
    setIsLoading(true);

    try {
        const response = await axiosInstance.post(`/candidates`, {
            title: title,
            profession: profession,
            experience_months: experience,
            area: area,
            salary: salary,
            nature_id: nature,
            type_id: type,
            skills: skills,
            description: description,
        });
        authData();
        setCandidate(response.data.data);
        return response.data.data.id;
    } catch (error) {
        console.log(error);
    } finally {
        setIsLoading(false);
    }
}

export async function deleteCandidate(id) {
    const { setIsLoading } = useEmploymentStore();
    const { authData } = useAuthStore();

    setIsLoading(true);
    try {
        const response = await axiosInstance.delete(`/candidates/${id}`);
        authData();
    } catch (error) {
        console.log(error);
    } finally {
        setIsLoading(false);
    }
}
