"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "../ui/calendar"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Label } from "../ui/label"
import { Separator } from "../ui/separator"

// Tamaño máximo de archivo de 5 MB.
const MAX_FILE_SIZE = 5000000;

function checkFileType(file: File) {
  const fileType = file.name.split(".").pop();
  return fileType === "docx" || fileType === "pdf";
}

const FormSchema = z.object({
  locale: z.string({
    required_error: "Debes seleccionar un local",
  }),
  provider: z.string({
    required_error: "Debes seleccionar un proveedor"
  }),
  category: z.string({
    required_error: "Debes seleccionar una categoría"
  }),
  type: z.string({
    required_error: "Debes seleccionar un tipo"
  }),
  creationDate: z.date({
    required_error: "Debes seleccionar la fecha del gasto"
  }),
  accountingDate: z.date({
    required_error: "Debes seleccionar la fecha contable del gasto"
  }),
  netAmount: z.number({
    required_error: "Debes ingresar el monto neto del gasto"
  }),
  ivaAmount: z.number({
    required_error: "Debes ingresar el monto del gasto con IVA"
  }).min(0),
  totalAmount: z.number({
    required_error: "Debes ingresar el monto total del gasto"
  }).min(0), 
  description: z.string({
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

export function BillsForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  return (
    <Form {...form}>
      <form className="flex flex-col">                
        <div className="flex flex-col">
          <h3 className="font-medium text-base text-gray-600">Información general</h3>          
          {/* Wrapper para las columnas responsive */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
            <FormField
              control={form.control}
              name="locale"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel className="text-gray-900">Local</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl> 
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un local" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0">NO APLICA</SelectItem>
                      <SelectItem value="1">MAIPÚ</SelectItem>
                      <SelectItem value="2">DUOC UC 1</SelectItem>
                      <SelectItem value="3">DUOC UC 2</SelectItem>
                    </SelectContent>
                  </Select>                            
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="provider"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel className="text-gray-900">Proveedor</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un proveedor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="m@support.com">LO VALLEDOR</SelectItem>
                      <SelectItem value="m@example.com">LA VEGA</SelectItem>
                      <SelectItem value="m@google.com">CENTRAL MAYORISTA</SelectItem>
                    </SelectContent>
                  </Select>                            
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel className="text-gray-900">Categoría</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="cat1">INGREDIENTES</SelectItem>
                      <SelectItem value="cat2">SUELDOS</SelectItem>
                      <SelectItem value="cat3">ARREGLOS</SelectItem>
                      <SelectItem value="cat4">OTROS</SelectItem>
                    </SelectContent>
                  </Select>                            
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel className="text-gray-900">Tipo</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el tipo de gasto" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="type1">EFECTIVO</SelectItem>
                      <SelectItem value="type2">TRANSFERENCIA</SelectItem>
                      <SelectItem value="type3">CHEQUE</SelectItem>
                    </SelectContent>
                  </Select>                            
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
              name="creationDate"
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
                            format(field.value, "PPP")
                          ) : (
                            <span>Seleciona una fecha...</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
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
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="accountingDate"
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
                            format(field.value, "PPP")
                          ) : (
                            <span>Seleciona una fecha...</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
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
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="netAmount"
              render={({ field }) => (
                <FormItem className="space-y-0 col-span-2">
                  <FormLabel className="text-gray-900">Monto Neto</FormLabel>
                  <FormControl>
                    <Input placeholder="Ingresa el monto total" {...field} />
                  </FormControl>              
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ivaAmount"
              render={({ field }) => (
                <FormItem className="space-y-0 col-span-2">
                  <FormLabel className="text-gray-900">Monto IVA</FormLabel>
                  <FormControl>
                    <Input placeholder="Ingresa el monto con IVA" {...field} />
                  </FormControl>              
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="totalAmount"
              render={({ field }) => (
                <FormItem className="space-y-0 col-span-2">
                  <FormLabel className="text-gray-900">Monto total</FormLabel>
                  <FormControl>
                    <Input placeholder="Ingresa el monto total " {...field} />
                  </FormControl>              
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
              name="description"
              render={({ field }) => (
                <FormItem className="space-y-0 mb-2">
                  <FormLabel className="text-gray-900">Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ingresa una descripción para el gasto"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>              
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
              </FormItem>
            )}
          />
        </div>        
        {/* todo: agregar DTE */}
        <div className="flex w-full justify-end">
          <Button type="submit" className="bg-blue-500 text-white hover:bg-blue-600 w-fit">Guardar</Button>
        </div>
      </form>
    </Form>
  )
}
