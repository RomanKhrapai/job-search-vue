import axiosInstance from "../../services/axios.js";
import { useEmploymentStore } from "../employmentStore.js";
import { getCandidateReviews } from "./review";
import { storeToRefs } from "pinia";

export async function getCandidates(name, area) {
    const { setCandidates, setIsLoading } = useEmploymentStore();
    setIsLoading(true);

    try {
        const response = await axiosInstance.get(`/candidates`, {
            params: { name, area },
        });

        setCandidates(response.data.data);
    } catch (error) {
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
    setIsLoading(true);
    try {
        const response = await axiosInstance.delete(`/candidates/${id}`);
    } catch (error) {
        console.log(error);
    } finally {
        setIsLoading(false);
    }
}
