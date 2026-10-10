export const TICKET_STATUSES = ["open", "in_progress", "closed"] as const
export const TICKET_PRIORITIES = ["low", "medium", "high"] as const

export type TicketStatus = (typeof TICKET_STATUSES)[number]
export type TicketPriority = (typeof TICKET_PRIORITIES)[number]
export type StatusFilter = TicketStatus | ""

export type Ticket = {
  id: number
  title: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  created_at: string
}

export type TicketStats = Record<TicketStatus, number>

export type TicketPage = {
  data: Ticket[]
  page: number
  limit: number
  total: number
}

export type TicketCreateInput = {
  title: string
  description: string
  priority: TicketPriority
}

export const STATUS_LABELS: Record<TicketStatus, string> = {
  open: "Open",
  in_progress: "In progress",
  closed: "Closed",
}

export const PRIORITY_LABELS: Record<TicketPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
}

export function isTicketStatus(value: string | null): value is TicketStatus {
  return value === "open" || value === "in_progress" || value === "closed"
}

export function isTicketPriority(value: string | null): value is TicketPriority {
  return value === "low" || value === "medium" || value === "high"
}
