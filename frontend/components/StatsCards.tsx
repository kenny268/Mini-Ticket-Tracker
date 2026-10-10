"use client"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { STATUS_LABELS, TICKET_STATUSES, type StatusFilter, type TicketStats, type TicketStatus } from "@/lib/types"

type StatsCardsProps = {
  stats: TicketStats
  active: StatusFilter
  onSelect: (status: TicketStatus) => void
}

export function StatsCards({ stats, active, onSelect }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-3 gap-2 md:gap-3">
      {TICKET_STATUSES.map((status) => {
        const selected = active === status
        return (
          <Card
            key={status}
            size="sm"
            role="button"
            tabIndex={0}
            aria-pressed={selected}
            onClick={() => onSelect(status)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault()
                onSelect(status)
              }
            }}
            className={cn(
              "cursor-pointer transition duration-200 hover:-translate-y-0.5",
              selected && "ring-2 ring-primary",
            )}
          >
            <CardContent className="grid gap-1 px-2 py-1 md:px-0">
              <p className="truncate text-[11px] text-muted-foreground md:text-xs">{STATUS_LABELS[status]}</p>
              <p className="text-xl font-semibold tabular-nums md:text-2xl">{stats[status]}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
