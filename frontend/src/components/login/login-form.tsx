"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Swal from 'sweetalert2'

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
import { Input } from "../ui/input"
import { Eye, EyeClosed, EyeOff, Lock, User, User2, UserSquare2 } from "lucide-react"
import { Label } from "../ui/label"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { login } from "@/auth/authThunks"
import { useAppDispatch } from "@/store"
import { useNavigate } from "react-router-dom"

const defaultValues = {
  username: "",
  password: "",
}

const FormSchema = z.object({
  username: z.string({
    required_error: "Debes ingresar tu nombre de usuario",
  }),
  password: z.string({
    required_error: "Debes seleccionar un proveedor"
  }),
})

export function LoginForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues
  })


  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    if(rememberMe) {
      localStorage.setItem("username", data.username)
    }
    try{
      const resultAction = await dispatch(login({ username: data.username, password: data.password }));
      if (login.rejected.match(resultAction)) {
        // Manejar el error si la acción fue rechazada
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Credenciales inválidas", // Mostrar el mensaje de error
        });
      } else {
        navigate("/");
      }  
    } catch(error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Credenciales inválidas",        
      });
    }
  
  };

  const chooseEye = () => {
    if(passwordInputType == 'text') {
      return <Eye className="h-5 w-5 text-gray-800 cursor-pointer" onClick={() => setPasswordInputType('password')}/>
    } else {
      return <EyeClosed className="h-5 w-5 text-gray-800 cursor-pointer" onClick={() => setPasswordInputType('text')}/>
    }
  }

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [passwordInputType, setPasswordInputType] = useState<'text' | 'password'>('password');
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  useEffect(() => {
    const username = localStorage.getItem("username")
    if(username) {
      form.setValue("username", username);
    }
  }, [])

  return (
    <Form {...form}>
      <form className="flex flex-col w-full gap-6" onSubmit={form.handleSubmit(onSubmit)}>                
        <div className="flex flex-col gap-3">          
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="space-y-0 col-span-2">
                <FormLabel>Nombre de usuario</FormLabel>
                <FormControl>
                  <Input placeholder="Ingresa tu nombre de usuario " {...field} startIcon={<User2 className="h-5 w-5 text-blue-800"/>} />
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
                <FormLabel>Contraseña</FormLabel>
                <FormControl>                    
                  <Input type={passwordInputType} placeholder="Ingresa tu contraseña " autoComplete="on" {...field} startIcon={<Lock className="h-5 w-5 text-blue-800"/>} endIcon={chooseEye()}/>
                </FormControl>        
                <FormMessage />      
              </FormItem>
            )}
          />
          
          {/* Recuerdame con checkbox */}
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"                    
                className="h-4 w-4 text-red-500"
                onChange={() => setRememberMe((rememberMe) => !rememberMe)}                
              />
              <Label className="text-gray-600 font-medium ml-2" htmlFor="rememberMe">Recuérdame</Label>
            </div>          
            <div>
              <a className="text-sm text-normal text-blue-800 hover:font-semibold" href="#">¿Olvidaste tu contraseña?</a>
            </div>
          </div>
                  
          {/* todo: agregar DTE */}          
        </div>
        <Button type="submit" className="bg-blue-500 text-white hover:bg-blue-600 w-full">Iniciar sesión</Button>        
      </form>
    </Form>

  )
}