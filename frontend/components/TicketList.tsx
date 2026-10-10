"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { TicketCard } from "@/components/TicketCard"
import type { StatusFilter, Ticket, TicketStatus } from "@/lib/types"

type TicketListProps = {
  tickets: Ticket[]
  loading: boolean
  page: number
  limit: number
  total: number
  filter: StatusFilter
  updatingId: number | null
  onStatusChange: (id: number, status: TicketStatus) => void
  onPageChange: (page: number) => void
}

export function TicketList({
  tickets,
  loading,
  page,
  limit,
  total,
  filter,
  updatingId,
  onStatusChange,
  onPageChange,
}: TicketListProps) {
  if (loading) {
    return (
      <div className="grid gap-3 md:grid-cols-2">
        {[0, 1, 2].map((item) => (
          <Skeleton key={item} className="h-44 w-full rounded-xl" />
        ))}
      </div>
    )
  }

  if (tickets.length === 0) {
    return (
      <Card className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        <CardHeader>
          <CardTitle>{filter ? "Nothing in this view" : "No tickets yet"}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {filter
            ? "No tickets match this filter. Choose another status or create a new ticket."
            : "Create the first ticket to start the board."}
        </CardContent>
      </Card>
    )
  }

  const pageCount = Math.max(1, Math.ceil(total / limit))

  return (
    <div className="grid gap-4">
      <div className="grid gap-3 md:grid-cols-2">
        {tickets.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            updating={updatingId === ticket.id}
            onStatusChange={onStatusChange}
          />
        ))}
      </div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Page {page} of {pageCount} · {total} tickets
        </p>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            Previous
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={page >= pageCount}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
