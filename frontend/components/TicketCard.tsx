"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import {
  PRIORITY_LABELS,
  STATUS_LABELS,
  TICKET_STATUSES,
  isTicketStatus,
  type Ticket,
  type TicketStatus,
} from "@/lib/types"

const statusClassName: Record<TicketStatus, string> = {
  open: "bg-sky-500/15 text-sky-800 dark:text-sky-200",
  in_progress: "bg-amber-500/15 text-amber-800 dark:text-amber-200",
  closed: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-200",
}

const priorityClassName = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-primary/10 text-foreground",
  high: "bg-rose-500/15 text-rose-800 dark:text-rose-200",
} as const

type TicketCardProps = {
  ticket: Ticket
  updating: boolean
  onStatusChange: (id: number, status: TicketStatus) => void
}

function formatCreatedAt(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value))
}

export function TicketCard({ ticket, updating, onStatusChange }: TicketCardProps) {
  return (
    <Card className="animate-in fade-in slide-in-from-bottom-2 duration-300 transition hover:-translate-y-0.5">
      <CardHeader>
        <CardTitle className="line-clamp-2">{ticket.title}</CardTitle>
        <div className="flex flex-wrap gap-2">
          <Badge className={statusClassName[ticket.status]}>{STATUS_LABELS[ticket.status]}</Badge>
          <Badge className={priorityClassName[ticket.priority]}>{PRIORITY_LABELS[ticket.priority]}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className={cn("text-sm", ticket.description ? "text-foreground" : "text-muted-foreground")}>
          {ticket.description || "No description"}
        </p>
      </CardContent>
      <CardFooter className="grid gap-3 bg-transparent">
        <p className="text-xs text-muted-foreground">{formatCreatedAt(ticket.created_at)}</p>
        <Select
          value={ticket.status}
          disabled={updating}
          onValueChange={(value) => {
            if (isTicketStatus(value) && value !== ticket.status) {
              onStatusChange(ticket.id, value)
            }
          }}
        >
          <SelectTrigger className="w-full" aria-label={`Status for ${ticket.title}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TICKET_STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {STATUS_LABELS[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardFooter>
    </Card>
  )
}
