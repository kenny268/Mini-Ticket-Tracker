"use client"

import { ChevronLeft, ChevronRight, Inbox } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { TicketCard } from "@/components/TicketCard"
import { STATUS_LABELS, type StatusFilter, type Ticket, type TicketStatus } from "@/lib/types"

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
          <Card key={item} className="overflow-hidden">
            <CardHeader className="gap-3">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-5 w-3/4" />
            </CardHeader>
            <CardContent className="grid gap-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (tickets.length === 0) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed bg-card/60 px-6 py-12 text-center animate-in fade-in duration-500">
        <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <Inbox className="size-5" />
        </div>
        <h2 className="text-base font-semibold">
          {filter ? `No ${STATUS_LABELS[filter].toLowerCase()} tickets` : "The queue is clear"}
        </h2>
        <p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">
          {filter
            ? "Nothing in this status right now. Clear the filter or file a new ticket."
            : "File the first ticket from the panel and it will land here as open."}
        </p>
      </div>
    )
  }

  const pageCount = Math.max(1, Math.ceil(total / limit))

  return (
    <div className="grid gap-4">
      <div className="grid gap-3 md:grid-cols-2">
        {tickets.map((ticket, index) => (
          <div
            key={ticket.id}
            className="animate-in fade-in slide-in-from-bottom-2 fill-mode-backwards duration-500"
            style={{ animationDelay: `${Math.min(index, 6) * 55}ms` }}
          >
            <TicketCard
              ticket={ticket}
              updating={updatingId === ticket.id}
              onStatusChange={onStatusChange}
            />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between gap-3 rounded-xl border bg-card/70 px-3 py-2">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground tabular-nums">{total}</span>
          {total === 1 ? " ticket" : " tickets"}
          <span className="hidden sm:inline"> · page {page} of {pageCount}</span>
        </p>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Previous page"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft />
          </Button>
          <span className="w-12 text-center text-sm tabular-nums sm:hidden">
            {page}/{pageCount}
          </span>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Next page"
            disabled={page >= pageCount}
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  )
}
