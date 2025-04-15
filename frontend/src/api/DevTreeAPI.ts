import api from "../config/axios";
import { ProfileForm, User } from "../types";
import { isAxiosError } from "axios";

export async function getUser() {
    try {
        const { data } = await api<User>(`/user`);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

export async function updateProfile(formData: ProfileForm) {
    try {
        const { data } = await api.patch<string>(`/user`, formData);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

export async function uploadImage(file: File) {
    let formData = new FormData(); //* Creamos un nuevo FormData para enviar el archivo
    formData.append("file", file); //^ Agregamos el archivo al FormData
    try {
        const { data } = await api.post("/user/image", formData);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}
