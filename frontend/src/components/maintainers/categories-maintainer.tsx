import { DataTable } from "../ui/data-table";
import { ColumnDef } from "@tanstack/react-table"
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
import { Input } from "../ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useEffect, useState } from "react";
import { Spinner } from "../common/spinner";
import { Alert, AlertTitle } from "../ui/alert";
import { Category, NewCategory } from "@/types/bills";
import useFetchCategories from "../bills/use-fetch-categories";
import useCategory from "./use-category";

const FormSchema = z.object({
  name: z.string({
    required_error: "Debes ingresar un nombre",
  }),
})

const defaultValues = {
  name: "",
}

const CategoriesMaintainer = () => {
  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: "name",
      id: "name",
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
  ]

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues
  })

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const newCategory: NewCategory = {
      name: data.name,
    }

    await createCategory(newCategory)
    form.reset({
      ...defaultValues,      
    });    
    setCategoryLastOp("C");
    setSubmitted(true);
    setCloseAlert(false);
    await fetchCategories();
    setIsDialogOpen(false);
  };

  const onDeleteSubmit = async (id: number) => {    
    await deleteCategory(id);
    form.reset({
      ...defaultValues,      
    });    
    setCategoryLastOp("D");
    setSubmitted(true);
    setCloseAlert(false);
    await fetchCategories();    
    setIsDeleteDialogOpen(false);
  };

  const handleDeleteClick = async (id: number) => {
    setIdToDelete(id);
    setIsDeleteDialogOpen(true);
  }

  const handleUpdateClick = (row: Category) => {
    console.log("edit id: ", row.id)
    setRowToUpdate(row);  
    // setIsDeleteDialogOpen(true);
  }

  const handleRowChange = (key: string, value: any) => {
    setRowToUpdate((prev) =>
      prev ? { ...prev, [key]: value } : prev
    )
    if(key === "name" || key === "") {
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
  
  const { createCategory, deleteCategory, updateCategory, loading: categoryCrudLoading, error: categoryCrudError } = useCategory();
  const [ idToDelete, setIdToDelete ] = useState<number>(0);
  const [ rowToUpdate, setRowToUpdate ] = useState<Category | undefined>(undefined);
  const [ focusedInput, setFocusedInput ] = useState<"name" | "">("")
  const [ applyChangesInit, setApplyChangesInit ] = useState<boolean>(false);
  const { categories, fetchCategories, loading: loadingFetchCategories } = useFetchCategories();

  const [ isDialogOpen, setIsDialogOpen ] = useState(false);
  const [ isDeleteDialogOpen, setIsDeleteDialogOpen ] = useState<boolean>(false);

  const [ submitted, setSubmitted ] = useState<boolean>(false);
  const [ closeAlert, setCloseAlert ] = useState<boolean>(false);
  const [ categoryLastOp, setCategoryLastOp ] = useState<string>("");

  const updateCategoryWrapper = async () => {
    if(rowToUpdate === undefined) return;
    await updateCategory(rowToUpdate);
    setCategoryLastOp("U");
    if(categoryCrudError === null) {
      await fetchCategories();
    }
    setRowToUpdate(undefined);
    setSubmitted(true);
    setCloseAlert(false);
    setFocusedInput("");
    setApplyChangesInit(false);        
  }

  useEffect(() => {
    updateCategoryWrapper();
  }, [applyChangesInit])


  return (
    <div className="w-full">      
        { loadingFetchCategories && (
          <div className="flex justify-start items-center gap-2">
            <Spinner size="medium" className="text-blue-700"/>
            <span className="text-blue-700 font-medium">Cargando...</span>
          </div>
        )}
        { submitted && !closeAlert && ((categoryCrudError === null) ? (
          <div className="border border-solid border-green-700 rounded-md flex mb-2 w-fit">
            <Alert variant="success">
              <CheckCircleIcon className="h-4 w-4" />
              {
                categoryLastOp == "C"
                &&
                <AlertTitle>Categoría creada con éxito</AlertTitle>
              }
              {
                categoryLastOp == "D"
                &&
                <AlertTitle>Categoría eliminada con éxito</AlertTitle>
              }
              {
                categoryLastOp == "U"
                &&
                <AlertTitle>Categoría actualizada con éxito</AlertTitle>
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
                <AlertTitle>Error al crear categoría</AlertTitle>
              }
              {
                categoryLastOp == "D"
                &&
                <AlertTitle>Error al eliminar categoría</AlertTitle>
              }
              {
                categoryLastOp == "U"
                &&
                <AlertTitle>Error al actualizar categoría</AlertTitle>
              }
            </Alert>      
            <X className="h-6 w-6 text-red-500 cursor-pointer" onClick={() => setCloseAlert(true)}/>
          </div>
        ))}

      <div className="w-full flex justify-start mb-2">
      {/* DIALOGO CREAR */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button size="sm" className="bg-white border border-solid rounded-md text-blue-600 border-blue-600 hover:text-white hover:bg-blue-600" onClick={() => setIsDialogOpen(true)}>Agregar categoría</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Agregar categoría</DialogTitle>         
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

            </form>
          </Form>
          <DialogFooter>
            <Button size="sm" onClick={() => setIsDialogOpen(false)} className="bg-gray-300 text-gray-800 hover:bg-gray-800 hover:text-white w-fit">Cancelar</Button>
            <Button size="sm" onClick={form.handleSubmit(onSubmit)} className="bg-blue-500 text-white hover:bg-blue-600 w-fit">Guardar</Button>
            {categoryCrudLoading && <Spinner size="medium" className="text-blue-700"/>}
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
            {categoryCrudLoading && <Spinner size="medium" className="text-blue-700"/>}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
      <DataTable columns={columns} data={categories}/>
    </div>
  );
};

export default CategoriesMaintainer;
  