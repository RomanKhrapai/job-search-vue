import axiosInstance from "../../services/axios.js";

export async function getProfesionById(id) {
    try {
        if (id) {
            const response = await axiosInstance.get(`/profession/${id}`);
            return response.data;
        }

        return { id: "", name: "" };
    } catch (error) {
        return { id: "", name: "" };
    }
}
export async function getAreaById(id) {
    try {
        if (id) {
            const response = await axiosInstance.get(`/area/${id}`);
            return response.data;
        }

        return { id: "", name: "" };
    } catch (error) {
        return { id: "", name: "" };
    }
}
