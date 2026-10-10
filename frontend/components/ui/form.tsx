"use client"

import * as React from "react"
import {
  Controller,
  FormProvider,
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"

import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const Form = FormProvider

const FormFieldContext = React.createContext<{ name: string } | null>(null)

function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ ...props }: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

function useFormField() {
  const fieldContext = React.useContext(FormFieldContext)
  const { getFieldState, formState } = useFormContext()
  if (!fieldContext) {
    throw new Error("useFormField must be used inside FormField")
  }
  const fieldState = getFieldState(fieldContext.name, formState)
  return { name: fieldContext.name, ...fieldState }
}

function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="form-item" className={cn("grid gap-2", className)} {...props} />
}

function FormLabel({ className, ...props }: React.ComponentProps<typeof Label>) {
  const { error, name } = useFormField()
  return (
    <Label
      htmlFor={name}
      className={cn(error && "text-destructive", className)}
      {...props}
    />
  )
}

function FormControl({ children }: { children: React.ReactElement<Record<string, unknown>> }) {
  const { error, name } = useFormField()
  return React.cloneElement(children, {
    id: name,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${name}-message` : undefined,
  })
}

function FormMessage({ className, ...props }: React.ComponentProps<"p">) {
  const { error, name } = useFormField()
  const message = error ? String(error.message ?? "") : null
  if (!message) {
    return null
  }
  return (
    <p
      id={`${name}-message`}
      className={cn("text-sm text-destructive", className)}
      {...props}
    >
      {message}
    </p>
  )
}

export { Form, FormControl, FormField, FormItem, FormLabel, FormMessage }
