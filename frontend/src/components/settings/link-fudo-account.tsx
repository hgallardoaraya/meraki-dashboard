"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { useState } from "react";
import { linkFudoAccount } from "../statistics/fudo-service";
import Swal from "sweetalert2";

const FormSchema = z.object({
  username: z
    .string({
      required_error: "El nombre de usuario es obligatorio",
    }),
  password: z
    .string({
      required_error: "La contraseña es obligatoria",
    })
});

export function LinkFudoAccount() {
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    console.log("Datos enviados:", data);
    try {
      await linkFudoAccount(data.username, data.password);
      Swal.fire({
        title: "Cuenta vinculada con éxito",
        icon: "success",
        color: "#3b82f6"
      })
    } catch(error:any) {
      alert("Error al vincular cuenta");
      Swal.fire({
        title: "Error al vincular cuenta, intente nuevamente",
        icon: "error",        
      })
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 w-full">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="space-y-0 col-span-2">
              <FormLabel>Usuario Fudo</FormLabel>
              <FormControl>
                <Input placeholder="Ingrese su usuario de Fudo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="space-y-0 col-span-2">
              <FormLabel>Contraseña Fudo</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Ingrese su contraseña de Fudo"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-fit">
          Vincular
        </Button>
      </form>
    </Form>
  );
}
