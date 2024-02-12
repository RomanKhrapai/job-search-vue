import axiosInstance from "../../services/axios.js";
import { useEmploymentStore } from "../employmentStore.js";
import { storeToRefs } from "pinia";

export async function getCompamyReviews(id) {
    const { setReviews, setIsLoading } = useEmploymentStore();
    setIsLoading(true);

    try {
        const response = await axiosInstance.get(`/reviews`, {
            params: { company_id: id },
        });

        setReviews(response.data.data);
    } catch (error) {
        console.log(error);
    } finally {
        setIsLoading(false);
    }
}
export async function getCandidateReviews(id) {
    const { setReviews, setIsLoading } = useEmploymentStore();
    setIsLoading(true);

    try {
        const response = await axiosInstance.get(`/reviews`, {
            params: { user_id: id },
        });

        setReviews(response.data.data);
    } catch (error) {
        console.log(error);
    } finally {
        setIsLoading(false);
    }
}

// export async function getVacancy(id) {
//     const { setVacancy, setIsLoading } = useEmploymentStore();
//     const { vacancies } = storeToRefs(useEmploymentStore());
//     setIsLoading(true);

//     try {
//         const vacancy = vacancies.value.find((item) => item.id === +id);

//         if (vacancy) {
//             setVacancy(vacancy);
//             setIsLoading(false);
//             return;
//         }

//         const response = await axiosInstance.get(`/vacancies/${id}`);

//         setVacancy(response.data.data);
//     } catch (error) {
//         console.log(error);
//     } finally {
//         setIsLoading(false);
//     }
// }

export async function storeReview(
    id,
    isUser,
    review,
    vote,
    reviewId,
    company_id
) {
    const parameters = { review };

    if (isUser) parameters.evaluated_user_id = id;
    else parameters.evaluated_company_id = id;

    if (reviewId) parameters.parent_id = reviewId;

    if (vote !== 0) parameters.vote = vote * 2;

    if (company_id) parameters.company_id = company_id;

    const { setIsLoading } = useEmploymentStore();
    setIsLoading(true);

    try {
        const response = await axiosInstance.post(`/reviews`, parameters);
        if (isUser) getCandidateReviews(id);
        else getCompamyReviews(id);
    } catch (error) {
        console.log(error);
    } finally {
        setIsLoading(false);
    }
}

export async function updateReview(id, isUser, reviewId, review, vote) {
    const parameters = { review };

    if (vote !== 0) parameters.vote = vote * 2;

    const { setIsLoading } = useEmploymentStore();
    setIsLoading(true);

    try {
        const response = await axiosInstance.patch(
            `/reviews/${reviewId}`,
            parameters
        );
        if (isUser) getCandidateReviews(id);
        else getCompamyReviews(id);
    } catch (error) {
        console.log(error);
    } finally {
        setIsLoading(false);
    }
}

export async function removeReview(reviewId, id, isUser) {
    const { setIsLoading } = useEmploymentStore();
    setIsLoading(true);

    try {
        const response = await axiosInstance.delete(`/reviews/${reviewId}`);
        if (isUser) getCandidateReviews(id);
        else getCompamyReviews(id);
    } catch (error) {
        console.log(error);
    } finally {
        setIsLoading(false);
    }
}
