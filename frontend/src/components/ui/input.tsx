import * as React from "react"

import { cn } from "@/lib/utils"

interface InputProps extends React.ComponentProps<"input"> {
  startIcon?: React.ReactNode | null | undefined; // Añadimos la propiedad startIcon
  endIcon?: React.ReactNode | null | undefined; // Añadimos la propiedad startIcon
}


const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ( { className, type, startIcon, endIcon, ...props }, ref) => {
    return (
      !startIcon && !endIcon ?
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-base ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-gray-950 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:border-gray-800 dark:bg-gray-950 dark:ring-offset-gray-950 dark:file:text-gray-50 dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-300",
          className
        )}
        ref={ref}
        {...props}
      />
      :
      <div className="relative w-full">
        {
          startIcon && 
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 dark:text-gray-400">
            {startIcon} {/* Renderizamos el ícono al inicio */}
          </span>
        }        
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 pl-10 text-base ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-gray-950 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:border-gray-800 dark:bg-gray-950 dark:ring-offset-gray-950 dark:file:text-gray-50 dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-300",
            className
          )}
          ref={ref}
          {...props}
        />
        {
          endIcon && 
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 dark:text-gray-400">
            {endIcon} {/* Renderizamos el ícono al inicio */}
          </span>
        }        
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
