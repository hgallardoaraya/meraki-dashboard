import { DataTable } from "../ui/data-table";
import { ColumnDef } from "@tanstack/react-table"
import { Locale, NewLocale } from "@/types/bills";
import { AlertCircle, ArrowUpDown, CheckCircleIcon, CheckSquare2, Edit, Trash2, X, XSquare } from "lucide-react"
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import useFetchLocales from "../bills/use-fetch-locales";
import { Input } from "../ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useEffect, useState } from "react";
import { Spinner } from "../common/spinner";
import { Alert, AlertTitle } from "../ui/alert";
import useLocale from "../maintainers/use-locale";


const FormSchema = z.object({
  name: z.string({
    required_error: "Debes ingresar un nombre",
  }),
  address: z.string({
    required_error: "Debes ingresar una dirección"
  }),
})

const defaultValues = {
  name: "",
  address: "",
}

const LocalesMaintainer = () => {
  const columns: ColumnDef<Locale>[] = [
    {
      accessorKey: "name",
      id: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="flex justify-start !p-0 w-full"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Local
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        if (row.original.id === rowToUpdate?.id) {
          return (
            <Input
              key={rowToUpdate?.id}
              className="h-9 w-full"
              value={rowToUpdate.name}
              autoFocus={focusedInput === "name"}
              onChange={(e) => handleRowChange("name", e.target.value)}
            />
          );
        }
        return row.original.name;
      },
      size: 200,
      maxSize: 200,
      minSize: 200,
      enableResizing: false,
    },
    {
      accessorKey: "address",
      id: "address",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="flex justify-start !p-0 w-full"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Dirección
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        if (row.original.id === rowToUpdate?.id) {
          return (
            <Input
              key={rowToUpdate?.id}
              size={1}
              value={rowToUpdate.address}
              autoFocus={focusedInput === "address"}
              onChange={(e) => handleRowChange("address", e.target.value)}
              className="h-9 w-full"
            />
          );
        }
        return row.original.address;
      },
      size: 200,
      maxSize: 200,
      minSize: 200,
      enableResizing: false,
    },
    {
      id: "action",
      header: () => (
        <div className="flex justify-center w-full">
          Acción
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex justify-center w-full gap-4">
          <Trash2 className="text-red-600 h-5 w-5 cursor-pointer hover:text-red-800" onClick={() => handleDeleteClick(row.original.id)} />
          {row.original.id === rowToUpdate?.id ? (
            <div className="flex justify-center items-center gap-2">
              {applyChangesInit ? (
                <Spinner size="icon" className="text-blue-700" />
              ) : (
                <>
                  <CheckSquare2 className="text-green-700 cursor-pointer hover:text-green-900" onClick={() => applyChanges()} />
                  <XSquare className="text-red-500 cursor-pointer hover:text-red-800" onClick={() => cancelChanges()} />
                </>
              )}
            </div>
          ) : (
            <Edit className="text-blue-600 h-5 w-5 cursor-pointer hover:text-blue-800" onClick={() => handleUpdateClick(row.original)} />
          )}
        </div>
      ),
      size: 50,
      maxSize: 50,
      minSize: 50,
    },
  ];
  

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues
  })

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {  
    const newLocale: NewLocale = {
      name: data.name,
      address: data.address,
    }
    await createLocale(newLocale)
    form.reset({
      ...defaultValues,      
    });    
    setLocaleLastOp("C");
    setSubmitted(true);
    setCloseAlert(false);
    await fetchLocales();
    setIsDialogOpen(false);
  };

  const onDeleteSubmit = async (id: number) => {    
    await deleteLocale(id);
    form.reset({
      ...defaultValues,      
    });    
    setLocaleLastOp("D");
    setSubmitted(true);
    setCloseAlert(false);
    await fetchLocales();    
    setIsDeleteDialogOpen(false);
  };

  const handleDeleteClick = (id: number) => {
    setIdToDelete(id);
    setIsDeleteDialogOpen(true);
  }

  const handleUpdateClick = (row: Locale) => {
    console.log("edit id: ", row.id)
    setRowToUpdate(row);  
    // setIsDeleteDialogOpen(true);
  }

  const handleRowChange = (key: string, value: any) => {
    setRowToUpdate((prev) =>
      prev ? { ...prev, [key]: value } : prev
    )
    if(key === "name" || key === "address" || key === "") {
      setFocusedInput(key)
    }
  }

  const applyChanges = async () => {
    if(rowToUpdate === undefined) return;
    setApplyChangesInit(true);    
  }

  const cancelChanges = () => {
    setRowToUpdate(undefined);
    setFocusedInput("")
  }

  const { createLocale, deleteLocale, updateLocale, loading: localeCrudLoading, error: localeCrudError } = useLocale();
  const [ idToDelete, setIdToDelete ] = useState<number>(0);
  const [ rowToUpdate, setRowToUpdate ] = useState<Locale | undefined>(undefined);
  const [ focusedInput, setFocusedInput ] = useState<"name" | "address" | "">("")
  const { locales, fetchLocales, loading: loadingFetchLocales } = useFetchLocales();
  const [ applyChangesInit, setApplyChangesInit ] = useState<boolean>(false);
  
  const [ isDialogOpen, setIsDialogOpen ] = useState(false);
  const [ isDeleteDialogOpen, setIsDeleteDialogOpen ] = useState<boolean>(false);

  const [ submitted, setSubmitted ] = useState<boolean>(false);
  const [ closeAlert, setCloseAlert ] = useState<boolean>(false);
  const [ localeLastOp, setLocaleLastOp ] = useState<string>("");

  const updateLocaleWrapper = async () => {
    if(rowToUpdate === undefined) return;
    await updateLocale(rowToUpdate);
    setLocaleLastOp("U");
    if(localeCrudError === null) {
      await fetchLocales();
    }
    setRowToUpdate(undefined);
    setSubmitted(true);
    setCloseAlert(false);
    setFocusedInput("");
    setApplyChangesInit(false);        
  }

  useEffect(() => {
    updateLocaleWrapper();
  }, [applyChangesInit])


  return (
    <div className="w-full">      
        { loadingFetchLocales && (
          <div className="flex justify-start items-center gap-2">
            <Spinner size="medium" className="text-blue-700"/>
            <span className="text-blue-700 font-medium">Cargando...</span>
          </div>
        )}
        { submitted && !closeAlert && ((localeCrudError === null) ? (
          <div className="border border-solid border-green-700 rounded-md flex mb-2 w-fit">
            <Alert variant="success">
              <CheckCircleIcon className="h-4 w-4" />
              {
                localeLastOp == "C"
                &&
                <AlertTitle>Local creado con éxito</AlertTitle>
              }
              {
                localeLastOp == "D"
                &&
                <AlertTitle>Local eliminado con éxito</AlertTitle>
              }
              {
                localeLastOp == "U"
                &&
                <AlertTitle>Local actualizado con éxito</AlertTitle>
              }
            </Alert>      
            <X className="h-6 w-6 text-green-700 cursor-pointer" onClick={() => setCloseAlert(true)}/>
          </div>
        ) : 
        (
          <div className="border border-solid border-red-500 rounded-md flex mb-2 w-fit">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              {
                localeLastOp == "C"
                &&
                <AlertTitle>Error al crear local</AlertTitle>
              }
              {
                localeLastOp == "D"
                &&
                <AlertTitle>Error al eliminar local</AlertTitle>
              }
              {
                localeLastOp == "U"
                &&
                <AlertTitle>Error al actualizar local</AlertTitle>
              }
            </Alert>      
            <X className="h-6 w-6 text-red-500 cursor-pointer" onClick={() => setCloseAlert(true)}/>
          </div>
        ))}

      <div className="w-full flex justify-start mb-2">
      {/* DIALOGO CREAR */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button size="sm" className="bg-white border border-solid rounded-md text-blue-600 border-blue-600 hover:text-white hover:bg-blue-600" onClick={() => setIsDialogOpen(true)}>Agregar local</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Agregar local</DialogTitle>         
            <DialogDescription className="hidden"></DialogDescription>   
          </DialogHeader>
          <Form {...form}>
            <form className="grid gap-4 py-4">                
              <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel className="text-right text-gray-900">Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="Ingresa un nombre" className="col-span-3" {...field} />
                      </FormControl>              
                      <FormMessage />
                    </FormItem>
                  )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right text-gray-900">Dirección</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingresa una dirección" className="col-span-3" {...field} />
                    </FormControl>              
                    <FormMessage />
                  </FormItem>
                )}
              />

            </form>
          </Form>
          <DialogFooter>
            <Button size="sm" onClick={() => setIsDialogOpen(false)} className="bg-gray-300 text-gray-800 hover:bg-gray-800 hover:text-white w-fit">Cancelar</Button>
            <Button size="sm" onClick={form.handleSubmit(onSubmit)} className="bg-blue-500 text-white hover:bg-blue-600 w-fit">Guardar</Button>
            {localeCrudLoading && <Spinner size="medium" className="text-blue-700"/>}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOGO ELIMINAR */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>        
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-gray-900">¿Está seguro que desea continuar?</DialogTitle>         
            <DialogDescription>Esta acción eliminará el local de la base de datos</DialogDescription>   
          </DialogHeader>
        
          <DialogFooter>
            <Button size="sm" onClick={() => setIsDeleteDialogOpen(false)} className="bg-gray-300 text-gray-800 hover:bg-gray-800 hover:text-white w-fit">Cancelar</Button>
            <Button size="sm" onClick={() => onDeleteSubmit(idToDelete)} className="bg-red-600 text-white hover:bg-red-800 w-fit">Eliminar</Button>
            {localeCrudLoading && <Spinner size="medium" className="text-blue-700"/>}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
      <DataTable columns={columns} data={locales}/>
    </div>
  );
};

export default LocalesMaintainer;
  