"use client"

import { useSyncExternalStore } from "react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { priorityTone, statusTone } from "@/components/ticket-tone"
import { cn } from "@/lib/utils"
import {
  PRIORITY_LABELS,
  STATUS_LABELS,
  TICKET_STATUSES,
  isTicketStatus,
  type Ticket,
  type TicketStatus,
} from "@/lib/types"

type TicketCardProps = {
  ticket: Ticket
  updating: boolean
  onStatusChange: (id: number, status: TicketStatus) => void
}

function useClientReady() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )
}

function formatCreatedAt(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value))
}

export function TicketCard({ ticket, updating, onStatusChange }: TicketCardProps) {
  const ready = useClientReady()
  const tone = statusTone[ticket.status]

  return (
    <Card
      className={cn(
        "relative overflow-hidden shadow-sm transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-md",
        updating && "opacity-70",
      )}
    >
      <span className={cn("absolute inset-y-0 left-0 w-1", tone.rail)} aria-hidden />
      <CardHeader className="pl-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-[11px] tracking-wide text-muted-foreground">
              #{String(ticket.id).padStart(3, "0")}
            </p>
            <CardTitle className="line-clamp-2 text-base">{ticket.title}</CardTitle>
          </div>
          <Badge className={cn("shrink-0", priorityTone[ticket.priority])}>
            {PRIORITY_LABELS[ticket.priority]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pl-5">
        <p className={cn("line-clamp-3 text-sm leading-6", ticket.description ? "text-foreground/80" : "text-muted-foreground")}>
          {ticket.description || "No extra detail was added."}
        </p>
      </CardContent>
      <CardFooter className="items-center justify-between gap-3 bg-muted/40 pl-5">
        <div className="min-w-0">
          <Badge className={tone.badge}>{STATUS_LABELS[ticket.status]}</Badge>
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {ready ? formatCreatedAt(ticket.created_at) : "Just filed"}
            {updating ? " · Saving" : ""}
          </p>
        </div>
        <Select
          value={ticket.status}
          disabled={updating}
          onValueChange={(value) => {
            if (isTicketStatus(value) && value !== ticket.status) {
              onStatusChange(ticket.id, value)
            }
          }}
        >
          <SelectTrigger className="w-[8.5rem] bg-background" aria-label={`Status for ${ticket.title}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TICKET_STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                <span className="flex items-center gap-2">
                  <span className={cn("size-1.5 rounded-full", statusTone[status].dot)} />
                  {STATUS_LABELS[status]}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardFooter>
    </Card>
  )
}
