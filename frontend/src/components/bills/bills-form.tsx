"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { format } from "date-fns"
import { toast } from "@/hooks/use-toast"
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
  })
})

export function BillsForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })


  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="locale"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Local</FormLabel>
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
          name="locale"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Proveedor</FormLabel>
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
            <FormItem>
              <FormLabel>Categoría</FormLabel>
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
            <FormItem>
              <FormLabel>Tipo</FormLabel>
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
        <FormField
          control={form.control}
          name="creationDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Fecha creación</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
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
            <FormItem className="flex flex-col">
              <FormLabel>Fecha contable</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
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
            <FormItem>
              <FormLabel>Monto neto</FormLabel>
              <FormControl>
                <Input placeholder="Ingresa el monto neto" {...field} />
              </FormControl>              
            </FormItem>
          )}
        />

        {/* todo: agregar DTE */}
        <Button type="submit" className="bg-blue-500 text-white hover:bg-blue-600">Guardar</Button>
      </form>
    </Form>
  )
}
