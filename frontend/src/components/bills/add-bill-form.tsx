"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { es } from "date-fns/locale"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { AlertCircle, CalendarIcon, Check, CheckCircleIcon, Terminal, X, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "../ui/calendar"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Separator } from "../ui/separator"
import useBills from "./use-bills"
import { NewBill } from "./types"
import { Spinner } from "../common/spinner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useEffect, useState } from "react"

// Tamaño máximo de archivo de 5 MB.
const MAX_FILE_SIZE = 5000000;

function checkFileType(file: File) {
  const fileType = file.name.split(".").pop();
  return fileType === "docx" || fileType === "pdf";
}

const defaultValues = {
  locale_id: 1,
  provider_id: 1,
  category_id: 1,
  type_id: 1,
  creation_date: undefined,
  contable_date: undefined,
  total_neto: 0,
  total_iva: 0,
  total_amount: 0,
  notes: "",
  documents: undefined,
}

const FormSchema = z.object({
  locale_id: z.coerce.number({
    required_error: "Debes seleccionar un local",
  }),
  provider_id: z.coerce.number({
    required_error: "Debes seleccionar un proveedor"
  }),
  category_id: z.coerce.number({
    required_error: "Debes seleccionar una categoría"
  }),
  type_id: z.coerce.number({
    required_error: "Debes seleccionar un tipo"
  }),
  creation_date: z.date({
    required_error: "Debes seleccionar la fecha del gasto"
  }),
  contable_date: z.date({
    required_error: "Debes seleccionar la fecha contable del gasto"
  }),
  total_neto: z.coerce.number({
    required_error: "Debes ingresar el monto neto del gasto"
  }),
  total_iva: z.coerce.number({
    required_error: "Debes ingresar el monto del gasto con IVA"
  }).min(0),
  total_amount: z.coerce.number({
    required_error: "Debes ingresar el monto total del gasto"
  }).min(0), 
  notes: z.string({
    required_error: "Debes ingresar una descripción para el gasto realizado"
  }).max(256)
  ,
  documents: z
  .any()
  .refine((files) => files && files.length > 0, {
    message: "Se requiere al menos un archivo",
  })
  .refine(
    (files: FileList) => Array.from(files).every((file) => file.size < MAX_FILE_SIZE),
    { message: "Cada archivo debe ser menor de 5MB." }
  )
  .refine(
    (files: FileList) => Array.from(files).every((file) => checkFileType(file)),
    { message: "Solo se admiten formatos .pdf y .docx." }
  )
  .optional()
})

export function AddBillForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues
  })
  
  useEffect(() => {
    console.log("Current form values:", form.getValues());
  }, [form.watch()]);
  

  const { createBill, createLoading, createError } = useBills();
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [closeAlert, setCloseAlert] = useState<boolean>(true);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const newBill:NewBill = {
      provider_id: data.provider_id,
      locale_id: data.locale_id,
      category_id: data.category_id,
      type_id: data.type_id,
      total_iva: data.total_iva,
      total_amount: data.total_amount,
      total_neto: data.total_neto,
      notes: data.notes,
      creation_date: data.creation_date,
      contable_date: data.contable_date,
      dte_id: 1,
      user_id: 1,
      image: "image.png",
    }

    await createBill(newBill);
    
    form.reset({
      ...defaultValues,
      creation_date: undefined,
      contable_date: undefined,
    });    

    setSubmitted(true);
    setCloseAlert(false);
  };

  return (
    <>
      { createLoading && (
        <div className="flex justify-start items-center gap-2">
          <Spinner size="medium" className="text-blue-700"/>
          <span className="text-blue-700 font-medium">Cargando...</span>
        </div>
      )}
      { submitted && !closeAlert && ((createError == null) ? (
        <div className="border border-solid border-green-700 rounded-md flex">
          <Alert variant="success">
            <CheckCircleIcon className="h-4 w-4" />
            <AlertTitle>Gasto guardado con éxito</AlertTitle>                      
          </Alert>      
          <X className="h-6 w-6 text-green-700 cursor-pointer" onClick={() => setCloseAlert(true)}/>
        </div>
      ) : 
      (
        <div className="border border-solid border-red-500 rounded-md flex">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error al guardar gasto, intente nuevamente</AlertTitle>                    
          </Alert>      
          <X className="h-6 w-6 text-red-500 cursor-pointer" onClick={() => setCloseAlert(true)}/>
        </div>
      ))}
      <Form {...form}>
        <form className="flex flex-col w-full" onSubmit={form.handleSubmit(onSubmit)}>                
          <div className="flex flex-col">
            <h3 className="font-medium text-base text-gray-600">Información general</h3>          
            
            {/* Wrapper para las columnas responsive */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
              <FormField
                control={form.control}
                name="locale_id"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel className="text-gray-900">Local</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value.toString()} defaultValue={field.value.toString()}>
                      <FormControl> 
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un local" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">NO APLICA</SelectItem>
                        <SelectItem value="2">MAIPÚ</SelectItem>
                        <SelectItem value="3">DUOC UC 1</SelectItem>
                        <SelectItem value="4">DUOC UC 2</SelectItem>
                      </SelectContent>
                    </Select>                            
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="provider_id"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel className="text-gray-900">Proveedor</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value.toString()} defaultValue={field.value.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un proveedor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">LO VALLEDOR</SelectItem>
                        <SelectItem value="2">LA VEGA</SelectItem>
                        <SelectItem value="3">CENTRAL MAYORISTA</SelectItem>
                      </SelectContent>
                    </Select>      
                    <FormMessage />                      
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel className="text-gray-900">Categoría</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value.toString()} defaultValue={field.value.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">MANTENCIÓN</SelectItem>
                        <SelectItem value="2">SUELDOS</SelectItem>
                        <SelectItem value="3">PROVEEDORES</SelectItem>
                        <SelectItem value="4">OTROS</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />                            
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type_id"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel className="text-gray-900">Tipo</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value.toString()} defaultValue={field.value.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el tipo de gasto" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">FIJO</SelectItem>
                        <SelectItem value="2">VARIABLE</SelectItem>
                        <SelectItem value="3">OCASIONAL</SelectItem>
                        <SelectItem value="4">OTROS</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />                            
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator className="mt-5 mb-3"/>

          <div className="flex flex-col">
            <h3 className="font-medium text-base text-gray-600">Detalles del gasto</h3>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-y-2 gap-x-4">
              <FormField            
                control={form.control}
                name="creation_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1 space-y-0 col-span-3">
                    <FormLabel className="text-gray-900 mt-2">Fecha creación</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (                            
                              format(field.value, "PPP", {locale: es})
                            ) : (
                              <span>Seleciona una fecha...</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          locale={es}
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date:Date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>              
                    </Popover>              
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contable_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1 space-y-0 col-span-3">
                    <FormLabel className="text-gray-900 mt-2">Fecha contable</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", {locale: es})
                            ) : (
                              <span>Seleciona una fecha...</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          locale={es}
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date:Date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>              
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="total_neto"
                render={({ field }) => (
                  <FormItem className="space-y-0 col-span-2">
                    <FormLabel className="text-gray-900">Monto neto</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingresa el monto total" {...field} value={field.value} defaultValue={field.value} />
                    </FormControl>              
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="total_iva"
                render={({ field }) => (
                  <FormItem className="space-y-0 col-span-2">
                    <FormLabel className="text-gray-900">Monto IVA</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingresa el monto con IVA" {...field} value={field.value} defaultValue={field.value} />
                    </FormControl>     
                    <FormMessage />         
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="total_amount"
                render={({ field }) => (
                  <FormItem className="space-y-0 col-span-2">
                    <FormLabel className="text-gray-900">Monto total</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingresa el monto total " {...field} value={field.value} defaultValue={field.value} />
                    </FormControl>        
                    <FormMessage />      
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator className="mt-5 mb-3"/>

          <div className="mb-5">
            <h3 className="font-medium text-base text-gray-600">Documentación</h3>        
            <FormField
              control={form.control}
              name="notes"              
              render={({ field }) => (
                <FormItem className="space-y-0 mb-2">
                  <FormLabel className="text-gray-900">Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      defaultValue={field.value}                      
                      placeholder="Ingresa una descripción para el gasto"
                      className="resize-none"                      
                      {...field}
                    />
                  </FormControl>           
                  <FormMessage />   
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="documents"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel className="text-gray-900">Documentos</FormLabel>
                  <FormControl>
                    <Input type="file" multiple {...field}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>        
          {/* todo: agregar DTE */}
            <Button type="submit" className="bg-blue-500 text-white hover:bg-blue-600 w-fit">Guardar</Button>
          <div className="flex w-full justify-end">
          </div>
        </form>
      </Form>
    </>
  )
}
