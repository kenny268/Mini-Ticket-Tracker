"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { PRIORITY_LABELS, TICKET_PRIORITIES, isTicketPriority } from "@/lib/types"
import { ticketCreateSchema, type TicketCreateValues } from "@/lib/validators"

type TicketFormProps = {
  onSubmit: (values: TicketCreateValues) => Promise<void>
}

export function TicketForm({ onSubmit }: TicketFormProps) {
  const [submitting, setSubmitting] = useState(false)
  const form = useForm<TicketCreateValues>({
    resolver: zodResolver(ticketCreateSchema),
    defaultValues: { title: "", description: "", priority: "medium" },
  })

  return (
    <Card className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <CardHeader>
        <CardTitle>New ticket</CardTitle>
        <CardDescription>New tickets start as open. Choose a priority before you save.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="grid gap-4"
            onSubmit={form.handleSubmit(async (values) => {
              setSubmitting(true)
              try {
                await onSubmit(values)
                form.reset({ title: "", description: "", priority: "medium" })
              } finally {
                setSubmitting(false)
              }
            })}
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input className="w-full" placeholder="Printer jam on floor 2" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea className="min-h-24 w-full" placeholder="Optional details" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      if (isTicketPriority(value)) {
                        field.onChange(value)
                      }
                    }}
                  >
                    <SelectTrigger className="w-full" aria-invalid={Boolean(form.formState.errors.priority)}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TICKET_PRIORITIES.map((priority) => (
                        <SelectItem key={priority} value={priority}>
                          {PRIORITY_LABELS[priority]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Creating..." : "Create ticket"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
