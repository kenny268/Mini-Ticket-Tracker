import type {
  StatusFilter,
  Ticket,
  TicketCreateInput,
  TicketPage,
  TicketStats,
  TicketStatus,
} from "@/lib/types"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"

export class ApiError extends Error {
  readonly status: number
  readonly fields?: Record<string, string>

  constructor(message: string, status: number, fields?: Record<string, string>) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.fields = fields
  }
}

async function request<T>(path: string, init?: RequestInit, token?: string | null): Promise<T> {
  const headers = new Headers(init?.headers)
  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  const response = await fetch(`${API_URL}${path}`, { ...init, headers })
  if (response.ok) {
    return (await response.json()) as T
  }

  let message = response.statusText || "Request failed"
  let fields: Record<string, string> | undefined
  try {
    const body: unknown = await response.json()
    if (body && typeof body === "object") {
      const record = body as Record<string, unknown>
      if (typeof record.detail === "string") {
        message = record.detail
      } else if (Array.isArray(record.non_field_errors)) {
        message = record.non_field_errors.map(String).join(" ")
      }
      const collected: Record<string, string> = {}
      for (const [key, value] of Object.entries(record)) {
        if (key === "detail") {
          continue
        }
        if (Array.isArray(value)) {
          collected[key] = value.map(String).join(" ")
        } else if (typeof value === "string") {
          collected[key] = value
        }
      }
      if (Object.keys(collected).length > 0) {
        fields = collected
        message = Object.values(collected).join(" ")
      }
    }
  } catch {
    // The body was not JSON. Keep the status text.
  }

  throw new ApiError(message, response.status, fields)
}

export function loginRequest(email: string, password: string) {
  return request<{ access: string }>("/api/auth/token/", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })
}

export function fetchTickets(params: { status: StatusFilter; page: number; limit: number }) {
  const query = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  })
  if (params.status) {
    query.set("status", params.status)
  }
  return request<TicketPage>(`/tickets/?${query.toString()}`)
}

export function fetchStats() {
  return request<TicketStats>("/tickets/stats/")
}

export function createTicket(input: TicketCreateInput, token: string) {
  return request<Ticket>(
    "/tickets/",
    { method: "POST", body: JSON.stringify(input) },
    token,
  )
}

export function updateTicketStatus(id: number, status: TicketStatus, token: string) {
  return request<Ticket>(
    `/tickets/${id}/`,
    { method: "PATCH", body: JSON.stringify({ status }) },
    token,
  )
}
