"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { loginSchema, type LoginValues } from "@/lib/validators"

const DEMO_EMAIL = "demo@example.com"
const DEMO_PASSWORD = "demo-pass-123"

type LoginCardProps = {
  onSubmit: (values: LoginValues) => Promise<void>
}

export function LoginCard({ onSubmit }: LoginCardProps) {
  const [submitting, setSubmitting] = useState(false)
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: DEMO_EMAIL, password: DEMO_PASSWORD },
  })

  return (
    <Card className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <CardHeader>
        <CardTitle>Log in to make changes</CardTitle>
        <CardDescription>Reads stay open. Creating and updating a ticket needs the demo account.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="grid gap-4"
            onSubmit={form.handleSubmit(async (values) => {
              setSubmitting(true)
              try {
                await onSubmit(values)
              } finally {
                setSubmitting(false)
              }
            })}
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" autoComplete="username" className="w-full" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" autoComplete="current-password" className="w-full" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Demo account</p>
              <p>{DEMO_EMAIL}</p>
              <p>{DEMO_PASSWORD}</p>
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Logging in..." : "Log in"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
