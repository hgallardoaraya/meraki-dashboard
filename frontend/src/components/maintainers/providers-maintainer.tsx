import { DataTable } from "../ui/data-table";
import { ColumnDef } from "@tanstack/react-table"
import { AlertCircle, ArrowUpDown, CheckCircleIcon, Trash2, X } from "lucide-react"
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
import { Input } from "../ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useState } from "react";
import { Spinner } from "../common/spinner";
import { Alert, AlertTitle } from "../ui/alert";
import { Provider, NewProvider } from "@/types/bills";
import useFetchProviders from "../bills/use-fetch-providers";
import { Textarea } from "../ui/textarea";
import useProvider from "./use-provider";

const FormSchema = z.object({
  name: z.string({
    required_error: "Debes ingresar un nombre",
  }),
  description: z.string({
    required_error: "Debes ingresar una descripción",
  }),
})

const defaultValues = {
  name: "",
}

const ProvidersMaintainer = () => {
  const columns: ColumnDef<Provider>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="flex justify-start !p-0 w-full"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Categoría
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "description",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="flex justify-start !p-0 w-full"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Descripción
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      id: "action",
      header: ({ column }) => {
        return (
          <div className="flex justify-center w-full">
            Acción
          </div>
        )
      },
      cell: ({row}) => {
        return (
          <div className="flex justify-center w-full">
            <Trash2 className="text-red-600 h-5 w-5 cursor-pointer hover:text-red-800" onClick={() => handleDeleteClick(row.original.id)} />
          </div>
        )
      }
    },
  ]

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues
  })

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const newProvider: NewProvider = {
      name: data.name,
      description: data.description,
    }

    await createProvider(newProvider)
    form.reset({
      ...defaultValues,      
    });    
    setCategoryLastOp("C");
    setSubmitted(true);
    setCloseAlert(false);
    await fetchProviders();
    setIsDialogOpen(false);
  };

  const onDeleteSubmit = async (id: number) => {    
    await deleteProvider(id);
    form.reset({
      ...defaultValues,      
    });    
    setCategoryLastOp("D");
    setSubmitted(true);
    setCloseAlert(false);
    await fetchProviders();    
    setIsDeleteDialogOpen(false);
  };

  const handleDeleteClick = async (id: number) => {
    setIdToDelete(id);
    setIsDeleteDialogOpen(true);
  }

  
  const { createProvider, deleteProvider, loading: providerCrudLoading, error: providerCrudError } = useProvider();
  const [ idToDelete, setIdToDelete ] = useState<number>(0);
  const { providers, fetchProviders, loading: loadingFetchProviders } = useFetchProviders();
  
  const [ isDialogOpen, setIsDialogOpen ] = useState(false);
  const [ isDeleteDialogOpen, setIsDeleteDialogOpen ] = useState<boolean>(false);

  const [ submitted, setSubmitted ] = useState<boolean>(false);
  const [ closeAlert, setCloseAlert ] = useState<boolean>(false);
  const [ categoryLastOp, setCategoryLastOp ] = useState<string>("");

  return (
    <div className="w-full">      
        { loadingFetchProviders && (
          <div className="flex justify-start items-center gap-2">
            <Spinner size="medium" className="text-blue-700"/>
            <span className="text-blue-700 font-medium">Cargando...</span>
          </div>
        )}
        { submitted && !closeAlert && ((providerCrudError === null) ? (
          <div className="border border-solid border-green-700 rounded-md flex mb-2 w-fit">
            <Alert variant="success">
              <CheckCircleIcon className="h-4 w-4" />
              {
                categoryLastOp == "C"
                &&
                <AlertTitle>Proveedor creado con éxito</AlertTitle>
              }
              {
                categoryLastOp == "D"
                &&
                <AlertTitle>Proveedor eliminado con éxito</AlertTitle>
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
                categoryLastOp == "C"
                &&
                <AlertTitle>Error al crear proveedor</AlertTitle>
              }
              {
                categoryLastOp == "D"
                &&
                <AlertTitle>Error al eliminar proveedor</AlertTitle>
              }
            </Alert>      
            <X className="h-6 w-6 text-red-500 cursor-pointer" onClick={() => setCloseAlert(true)}/>
          </div>
        ))}

      <div className="w-full flex justify-start mb-2">
      {/* DIALOGO CREAR */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button size="sm" className="bg-white border border-solid rounded-md text-blue-600 border-blue-600 hover:text-white hover:bg-blue-600" onClick={() => setIsDialogOpen(true)}>Agregar proveedor</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Agregar proveedor</DialogTitle>         
            <DialogDescription className="hidden"></DialogDescription>   
          </DialogHeader>
          <Form {...form}>
            <form>                
              <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="space-y-0 mb-2">
                      <FormLabel className="text-gray-900">Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="Ingresa un nombre" className="col-span-3" {...field} />
                      </FormControl>              
                      <FormMessage />
                    </FormItem>
                  )}
              />

              <FormField
                control={form.control}
                name="description"              
                render={({ field }) => (
                  <FormItem className="space-y-0 mb-2">
                    <FormLabel className="text-gray-900">Descripción</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Ingresa una descripción para el proveedor"
                        className="resize-none"                      
                        {...field}
                      />
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
            {providerCrudLoading && <Spinner size="medium" className="text-blue-700"/>}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOGO ELIMINAR */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>        
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-gray-900">¿Está seguro que desea continuar?</DialogTitle>         
            <DialogDescription>Esta acción eliminará la categoría de la base de datos</DialogDescription>   
          </DialogHeader>
        
          <DialogFooter>
            <Button size="sm" onClick={() => setIsDeleteDialogOpen(false)} className="bg-gray-300 text-gray-800 hover:bg-gray-800 hover:text-white w-fit">Cancelar</Button>
            <Button size="sm" onClick={() => onDeleteSubmit(idToDelete)} className="bg-red-600 text-white hover:bg-red-800 w-fit">Eliminar</Button>
            {providerCrudLoading && <Spinner size="medium" className="text-blue-700"/>}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
      <DataTable columns={columns} data={providers}/>
    </div>
  );
};

export default ProvidersMaintainer;
  