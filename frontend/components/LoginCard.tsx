"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { loginSchema, type LoginValues } from "@/lib/validators"

type LoginCardProps = {
  onSubmit: (values: LoginValues) => Promise<void>
}

export function LoginCard({ onSubmit }: LoginCardProps) {
  const [submitting, setSubmitting] = useState(false)
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  return (
    <Card className="shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
      <CardHeader>
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Write access</p>
        <CardTitle>Sign in to update the queue</CardTitle>
        <CardDescription>The board is public. Sign in to file a ticket or change its status.</CardDescription>
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
            <Button type="submit" size="lg" className="w-full" disabled={submitting}>
              {submitting ? "Signing in..." : "Continue"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
