import { DataTable } from "../ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { AlertCircle, ArrowUpDown, CheckCircleIcon, Edit, Trash2, X } from "lucide-react";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useEffect, useState } from "react";
import { Spinner } from "../common/spinner";
import { Alert, AlertTitle } from "../ui/alert";
import { User, NewUser } from "@/types/user";
import useFetchUsers from "../bills/use-fetch-users";
import useUser from "./use-user";

const FormSchema = z.object({
    username: z.string({
        required_error: "Debes ingresar un nombre de usuario",
    }),
    password: z.string({
        required_error: "Debes ingresar una contraseña",
    }),
    name: z.string({
        required_error: "Debes ingresar un nombre",
    }),
    last_name: z.string({
        required_error: "Debes ingresar un apellido",
    }),
    second_last_name: z.string({
        required_error: "Debes ingresar un segundo apellido",
    }),
    rut: z.number({
        required_error: "Debes ingresar un rut",
    }),
    dv: z.string({
        required_error: "Debes ingresar un digito verificador",
    }),
    role_id: z.number({
        required_error: "Debes ingresar un role",
    }),
    locale_id: z.number({
        required_error: "Debes ingresar un local",
    }),
});

const defaultValues = {
    username: "",
    password: "",
    name: "",
    last_name: "",
};

const UsersMaintainer = () => {
    const columns: ColumnDef<User>[] = [
        {
            accessorKey: "username",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    className="flex justify-start !p-0 w-full"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Usuario
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => row.original.username,
        },
        {
            accessorKey: "name",
            header: "Nombre",
            cell: ({ row }) => row.original.name,
        },
        {
            accessorKey: "last_name",
            header: "Apellido",
            cell: ({ row }) => row.original.last_name,
        },
        {
            id: "action",
            header: () => <div className="flex justify-center w-full">Acción</div>,
            cell: ({ row }) => (
                <div className="flex justify-center gap-4">
                    <Trash2
                        className="text-red-600 h-5 w-5 cursor-pointer hover:text-red-800"
                        onClick={() => handleDeleteClick(row.original.id)}
                    />
                    <Edit
                        className="text-blue-600 h-5 w-5 cursor-pointer hover:text-blue-800"
                        onClick={() => handleUpdateClick(row.original)}
                    />
                </div>
            ),
        },
    ];

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues,
    });

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        const newUser: NewUser = {
            username: data.username,
            password: data.password,
            name: data.name,
            last_name: data.last_name,
            second_last_name: data.second_last_name,
            rut: data.rut,
            dv: data.dv,
            role_id: data.role_id,
            locale_id: data.locale_id
        };

        console.log(newUser);

        await register(newUser);
        form.reset(defaultValues);
        setUserLastOp("C");
        setSubmitted(true);
        setCloseAlert(false);
        await fetchUsers();
        setIsDialogOpen(false);
    };

    const onDeleteSubmit = async (id: number) => {
        await deleteUser(id);
        setUserLastOp("D");
        setSubmitted(true);
        setCloseAlert(false);
        await fetchUsers();
        setIsDeleteDialogOpen(false);
    };

    const handleDeleteClick = (id: number) => {
        setIdToDelete(id);
        setIsDeleteDialogOpen(true);
    };

    const handleUpdateClick = (user: User) => {
        setRowToUpdate(user);
        setIsDialogOpen(true);
    };

    const {
        register,
        deleteUser,
        updateUser,
        loading: userCrudLoading,
        error: userCrudError,
    } = useUser();
    const { users, fetchUsers, loading: loadingFetchUsers } = useFetchUsers();

    const [idToDelete, setIdToDelete] = useState<number>(0);
    const [rowToUpdate, setRowToUpdate] = useState<User | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [closeAlert, setCloseAlert] = useState(false);
    const [userLastOp, setUserLastOp] = useState<string>("");

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="w-full">
            {loadingFetchUsers && (
                <div className="flex justify-start items-center gap-2">
                    <Spinner size="medium" className="text-blue-700" />
                    <span className="text-blue-700 font-medium">Cargando...</span>
                </div>
            )}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button>Agregar Usuario</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{rowToUpdate ? "Actualizar Usuario" : "Agregar Usuario"}</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form>
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Usuario</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contraseña</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nombre</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="last_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Apellido</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="second_last_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Segundo Apellido</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="rut"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Rut</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="dv"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>DV</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="role_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Rol</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="locale_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Local</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
                                Guardar
                            </Button>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Eliminar Usuario</DialogTitle>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</Button>
                        <Button onClick={() => onDeleteSubmit(idToDelete)}>Eliminar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <DataTable columns={columns} data={users} />
        </div>
    );
};

export default UsersMaintainer;
