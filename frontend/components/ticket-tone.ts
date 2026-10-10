import type { TicketPriority, TicketStatus } from "@/lib/types"

export const statusTone: Record<
  TicketStatus,
  { dot: string; rail: string; badge: string; tile: string }
> = {
  open: {
    dot: "bg-sky-500",
    rail: "bg-sky-500",
    badge: "bg-sky-500/12 text-sky-900 dark:text-sky-100",
    tile: "border-sky-500/35 bg-sky-500/10 shadow-sky-500/10",
  },
  in_progress: {
    dot: "bg-amber-500",
    rail: "bg-amber-500",
    badge: "bg-amber-500/15 text-amber-950 dark:text-amber-100",
    tile: "border-amber-500/35 bg-amber-500/10 shadow-amber-500/10",
  },
  closed: {
    dot: "bg-emerald-500",
    rail: "bg-emerald-500",
    badge: "bg-emerald-500/12 text-emerald-950 dark:text-emerald-100",
    tile: "border-emerald-500/35 bg-emerald-500/10 shadow-emerald-500/10",
  },
}

export const priorityTone: Record<TicketPriority, string> = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-foreground/10 text-foreground",
  high: "bg-rose-500/12 text-rose-900 dark:text-rose-100",
}
