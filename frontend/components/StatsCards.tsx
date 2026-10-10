"use client"

import { Card, CardContent } from "@/components/ui/card"
import { statusTone } from "@/components/ticket-tone"
import { cn } from "@/lib/utils"
import { STATUS_LABELS, TICKET_STATUSES, type StatusFilter, type TicketStats } from "@/lib/types"

type StatsCardsProps = {
  stats: TicketStats
  active: StatusFilter
  onSelect: (status: StatusFilter) => void
}

export function StatsCards({ stats, active, onSelect }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      {TICKET_STATUSES.map((status, index) => {
        const selected = active === status
        const tone = statusTone[status]
        return (
          <Card
            key={status}
            size="sm"
            role="button"
            tabIndex={0}
            aria-pressed={selected}
            onClick={() => onSelect(selected ? "" : status)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault()
                onSelect(selected ? "" : status)
              }
            }}
            style={{ animationDelay: `${index * 60}ms` }}
            className={cn(
              "cursor-pointer border shadow-sm animate-in fade-in slide-in-from-bottom-1 fill-mode-backwards duration-500",
              "transition-[transform,box-shadow,background-color,border-color] duration-200 hover:-translate-y-0.5 hover:shadow-md",
              selected ? tone.tile : "hover:bg-card/80",
            )}
          >
            <CardContent className="grid gap-2">
              <div className="flex items-center gap-2">
                <span className={cn("size-2 shrink-0 rounded-full", tone.dot)} />
                <p className="truncate text-[11px] font-medium tracking-wide text-muted-foreground uppercase sm:text-xs">
                  {STATUS_LABELS[status]}
                </p>
              </div>
              <p className="text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl">{stats[status]}</p>
              <p className="hidden text-xs text-muted-foreground sm:block">
                {selected ? "Showing this queue" : status === "open" ? "Waiting" : status === "in_progress" ? "Being handled" : "Resolved"}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
