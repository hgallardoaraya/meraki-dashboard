import { useEffect, useState } from "react";
import axios from "axios";
import { User } from "@/types/user";

interface UseFetchUsersReturn {
    fetchUsers: () => Promise<void>;
    loading: boolean;
    error: string | null;
    users: User[];
}

interface AxiosGetUsers {
    users: User[];
}

const useFetchUsers = (): UseFetchUsersReturn => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [users, setUsers] = useState<User[]>([]);

    const fetchUsers = async (): Promise<void> => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get<AxiosGetUsers>("http://localhost:8080/api/users/");
            setUsers(response.data.users || []);
        } catch (err) {
            setError((err as Error).message || "Error al obtener los usuarios");
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const getUsers = async () => {
        await fetchUsers();
    };

    useEffect(() => {
        getUsers();
    }, []);

    return {
        fetchUsers,
        users,
        loading,
        error,
    };
};

export default useFetchUsers;
