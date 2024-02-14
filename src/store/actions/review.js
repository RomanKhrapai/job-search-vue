import axiosInstance from "../../services/axios.js";
import { useEmploymentStore } from "../employmentStore.js";
import { useChatsStore } from "../chatsStore";

export async function getCompamyReviews(id) {
    const { setReviews, setIsLoading } = useEmploymentStore();
    const { setErrorMessage } =
        useChatsStore();
    setIsLoading(true);

    try {
        const response = await axiosInstance.get(`/reviews`, {
            params: { company_id: id },
        });

        setReviews(response.data.data);
    } catch (error) {
        if (error?.response?.status === 401)
            return setErrorMessage("Unauthenticated.");
        if (error?.response?.status === 422)
            return setErrorMessage("data is incorrect");
        if (error?.response?.status === 404)
            return setErrorMessage("connection error");
        setErrorMessage("error system  ");
    } finally {
        setIsLoading(false);
    }
}
export async function getCandidateReviews(id) {
    const { setReviews, setIsLoading } = useEmploymentStore();
    const { setErrorMessage} =
        useChatsStore();
    setIsLoading(true);

    try {
        const response = await axiosInstance.get(`/reviews`, {
            params: { user_id: id },
        });

        setReviews(response.data.data);
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

export async function storeReview(
    id,
    isUser,
    review,
    vote,
    reviewId,
    company_id
) {
    const parameters = { review };
    const { setErrorMessage } =
        useChatsStore();

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
        if (error?.response?.status === 401)
            return setErrorMessage("Unauthenticated.");
        if (error?.response?.status === 422)
            return setErrorMessage("data is incorrect");
        if (error?.response?.status === 404)
            return setErrorMessage("connection error");
        setErrorMessage("error system ");
    } finally {
        setIsLoading(false);
    }
}

export async function updateReview(id, isUser, reviewId, review, vote) {
    const parameters = { review };
    const { setErrorMessage } =
        useChatsStore();

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
        if (error?.response?.status === 401)
            return setErrorMessage("Unauthenticated.");
        if (error?.response?.status === 422)
            return setErrorMessage("data is incorrect");
        if (error?.response?.status === 404)
            return setErrorMessage("connection error");
        setErrorMessage("error system ");
    } finally {
        setIsLoading(false);
    }
}

export async function removeReview(reviewId, id, isUser) {
    const { setIsLoading } = useEmploymentStore();
    const { setErrorMessage, setSuccessfulMessage } =
        useChatsStore();
    setIsLoading(true);

    try {
        const response = await axiosInstance.delete(`/reviews/${reviewId}`);
        if (isUser) getCandidateReviews(id);
        else getCompamyReviews(id);
        setSuccessfulMessage("Review removed");
    } catch (error) {
        if (error?.response?.status === 401)
            return setErrorMessage("Unauthenticated.");
        if (error?.response?.status === 422)
            return setErrorMessage("data is incorrect");
        if (error?.response?.status === 404)
            return setErrorMessage("connection error");
        setErrorMessage("error delete ");
    } finally {
        setIsLoading(false);
    }
}
