export interface User {
    id: number;
    username: string;
    password: string;
    name: string;
    last_name: string;
    second_last_name: string;
    rut: number;
    dv: string;
    role_id: number;
    locale_id: number;
}

export interface NewUser {
    username: string;
    password: string; // Campo necesario para el registro
    name: string;
    last_name: string;
    second_last_name: string;
    rut: number;
    dv: string;
    role_id: number;
    locale_id: number;
}
