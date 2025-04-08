import { isAxiosError } from "axios";
import api from "../config/axios";

export async function getUser() {
    try {
        const { data } = await api.get(`/user`);
        console.log(data);
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            console.log(error.response.data.error);
        }
    }
}
