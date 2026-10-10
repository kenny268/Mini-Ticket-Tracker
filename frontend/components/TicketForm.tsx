"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { priorityTone } from "@/components/ticket-tone"
import { cn } from "@/lib/utils"
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
    <Card className="shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
      <CardHeader>
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">New ticket</p>
        <CardTitle>File something for the queue</CardTitle>
        <CardDescription>It opens immediately. Priority is the only choice you make up front.</CardDescription>
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
                    <Textarea className="min-h-24 w-full resize-none" placeholder="What should the next person know?" {...field} />
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
                  <div className="grid grid-cols-3 gap-2">
                    {TICKET_PRIORITIES.map((priority) => {
                      const selected = field.value === priority
                      return (
                        <button
                          key={priority}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => {
                            if (isTicketPriority(priority)) {
                              field.onChange(priority)
                            }
                          }}
                          className={cn(
                            "h-9 rounded-lg border text-sm font-medium transition-colors",
                            selected ? priorityTone[priority] : "bg-background text-muted-foreground hover:bg-muted",
                            selected && "border-transparent",
                          )}
                        >
                          {PRIORITY_LABELS[priority]}
                        </button>
                      )
                    })}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" size="lg" className="w-full" disabled={submitting}>
              {submitting ? "Filing..." : "File ticket"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
