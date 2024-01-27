import axiosInstance from "../../services/axios.js";
import { useEmploymentStore } from "../employmentStore.js";
import { storeToRefs } from "pinia";

export async function getCompanies(name, area) {
    const { setCompamies, setIsLoading } = useEmploymentStore();

    setIsLoading(true);
    try {
        const response = await axiosInstance.get(`/companies`, {
            params: { name, area },
        });

        setCompamies(response.data.data);
        setIsLoading(false);
    } catch (error) {
    } finally {
        setIsLoading(false);
    }
}

export async function getCompany(id) {
    const { setIsLoading, setCompany } = useEmploymentStore();
    const { companies } = storeToRefs(useEmploymentStore());
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
        setIsLoading(false);
    } catch (error) {
    } finally {
        setIsLoading(false);
    }
}

export async function storeCompany({ name, address, description }) {
    const { setIsLoading } = useEmploymentStore();
    const { imageURL } = storeToRefs(useEmploymentStore());
    setIsLoading(true);

    try {
        const response = await axiosInstance.post(`/companies`, {
            name: name,
            address: address,
            image: imageURL.value,
            description: description,
        });
        // employment.value.profesions = response.data;
        setIsLoading(false);
    } catch (error) {
    } finally {
        setIsLoading(false);
    }
}

export async function deleteCompany(id) {
    const { setIsLoading } = useEmploymentStore();
    setIsLoading(true);

    try {
        const response = await axiosInstance.delete(`/companies/${id}`);
        getCompanies();
        setIsLoading(false);
    } catch (error) {
    } finally {
        setIsLoading(false);
    }
}
