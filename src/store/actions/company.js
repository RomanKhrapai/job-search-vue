import axiosInstance from "../../services/axios.js";
import { useEmploymentStore } from "../employmentStore.js";
import { useChatsStore } from "../chatsStore";
import { useAuthStore } from "../authStore.js";
import { storeToRefs } from "pinia";

export async function getCompanies(name, address, isDesc, sort, page) {
    const { setCompamies, setIsLoading, setLastPage } = useEmploymentStore();
    const { setErrorMessage } = useChatsStore();

    setIsLoading(true);
    try {
        const response = await axiosInstance.get(`/companies`, {
            params: {
                name,
                address,
                is_desc: isDesc ? "desc" : "asc",
                sort,
                page,
            },
        });
        setLastPage(response.data.meta.last_page);
        setCompamies(response.data.data);
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

export async function getCompany(id) {
    const { setIsLoading, setCompany } = useEmploymentStore();
    const { companies } = storeToRefs(useEmploymentStore());
    const { setErrorMessage } = useChatsStore();
    setIsLoading(true);

    try {
        const company = companies.value.find((item) => item.id === +id);

        if (company) {
            setCompany(company);
            setIsLoading(false);
            return;
        }
        const response = await axiosInstance.get(`/companies/${id}`);

        setCompany(response.data.data);
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

export async function storeCompany({ name, address, description }) {
    const { setIsLoading, setCompamies } = useEmploymentStore();
    const { authData } = useAuthStore();
    const { imageURL } = storeToRefs(useEmploymentStore());
    const { setErrorMessage } = useChatsStore();
    setIsLoading(true);

    try {
        const response = await axiosInstance.post(`/companies`, {
            name: name,
            address: address,
            image: imageURL.value,
            description: description,
        });
        setCompamies([response.data.data]);
        authData();
        return response.data.data.id;
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

export async function deleteCompany(id) {
    const { setIsLoading } = useEmploymentStore();
    const { authData } = useAuthStore();
    const { setErrorMessage, setSuccessfulMessage } = useChatsStore();
    setIsLoading(true);

    try {
        const response = await axiosInstance.delete(`/companies/${id}`);
        getCompanies();
        authData();
        setSuccessfulMessage("Company delete");
    } catch (error) {
        if (error?.response?.status === 401)
            return setErrorMessage("Unauthenticated.");
        if (error?.response?.status === 404)
            return setErrorMessage("connection error");
        setErrorMessage("error delete");
    } finally {
        setIsLoading(false);
    }
}
