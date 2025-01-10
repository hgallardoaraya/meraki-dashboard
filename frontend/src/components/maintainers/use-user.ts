import { useState } from "react";
import axios from "axios";
import { User, NewUser } from "@/types/user";

interface UseUserReturn {
    register: (newUser: NewUser) => Promise<void>;
    getUsers: () => Promise<User[]>;
    updateUser: (user: User) => Promise<void>;
    deleteUser: (id: number) => Promise<void>;
    loading: boolean;
    error: string | null;
}

const useUser = (): UseUserReturn => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const register = async (newUser: NewUser): Promise<void> => {
        try {
            setLoading(true);
            setError(null);
            await axios.post("http://localhost:8080/api/auth/register/", newUser);
        } catch (error: any) {
            const message = error.response?.data?.message || "Error al registrar usuario";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const getUsers = async (): Promise<User[]> => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get("http://localhost:8080/api/users/");
            return response.data;
        } catch (error: any) {
            const message = error.response?.data?.message || "Error al obtener usuarios";
            setError(message);
            return [];
        } finally {
            setLoading(false);
        }
    };

    const updateUser = async (user: User): Promise<void> => {
        try {
            setLoading(true);
            setError(null);
            await axios.put(`http://localhost:8080/api/users/${user.id}`, user);
        } catch (error: any) {
            const message = error.response?.data?.message || "Error al actualizar usuario";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (id: number): Promise<void> => {
        try {
            setLoading(true);
            setError(null);
            await axios.delete(`http://localhost:8080/api/users/${id}`);
        } catch (error: any) {
            const message = error.response?.data?.message || "Error al eliminar usuario";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return { register, getUsers, updateUser, deleteUser, loading, error };
};

export default useUser;
