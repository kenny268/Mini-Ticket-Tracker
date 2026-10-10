"use client"

import { toast } from "sonner"

import { LoginCard } from "@/components/LoginCard"
import { StatsCards } from "@/components/StatsCards"
import { ThemeToggle } from "@/components/ThemeToggle"
import { TicketForm } from "@/components/TicketForm"
import { TicketList } from "@/components/TicketList"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useSession } from "@/hooks/useSession"
import { useTickets } from "@/hooks/useTickets"
import { STATUS_LABELS, TICKET_STATUSES, isTicketStatus, type StatusFilter } from "@/lib/types"

const FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "", label: "All" },
  ...TICKET_STATUSES.map((status) => ({ value: status, label: STATUS_LABELS[status] })),
]

export default function HomePage() {
  const session = useSession()
  const board = useTickets(session.token, session.logout)

  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-20 border-b bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium tracking-wide text-muted-foreground">Support desk</p>
            <h1 className="truncate text-lg font-semibold tracking-tight">Mini Ticket Tracker</h1>
          </div>
          <div className="hidden items-center gap-1 lg:flex">
            {FILTERS.map((item) => (
              <Button
                key={item.label}
                type="button"
                size="sm"
                variant={board.filter === item.value ? "default" : "outline"}
                onClick={() => board.setFilter(item.value)}
              >
                {item.label}
              </Button>
            ))}
          </div>
          {session.isAuthenticated ? (
            <Button type="button" variant="outline" onClick={session.logout}>
              Log out
            </Button>
          ) : null}
          <ThemeToggle />
        </div>
      </header>
      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start">
        <div className="order-1 lg:col-start-1 lg:row-start-2">
          <StatsCards stats={board.stats} active={board.filter} onSelect={board.setFilter} />
        </div>
        <div className="order-2 lg:sticky lg:top-24 lg:col-start-1 lg:row-start-1">
          {session.isAuthenticated ? (
            <TicketForm onSubmit={board.create} />
          ) : (
            <LoginCard
              onSubmit={async (values) => {
                try {
                  await session.login(values.email, values.password)
                  toast.success("Logged in")
                } catch (error) {
                  toast.error(error instanceof Error ? error.message : "Could not log in")
                  throw error
                }
              }}
            />
          )}
        </div>
        <section className="order-3 grid gap-4 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <div className="lg:hidden">
            <Select
              value={board.filter || "all"}
              onValueChange={(value) => {
                if (value === "all" || value == null) {
                  board.setFilter("")
                  return
                }
                if (isTicketStatus(value)) {
                  board.setFilter(value)
                }
              }}
            >
              <SelectTrigger className="w-full" aria-label="Filter by status">
                <SelectValue placeholder="All tickets" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All tickets</SelectItem>
                {TICKET_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {STATUS_LABELS[status]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <TicketList
            tickets={board.tickets}
            loading={board.loading}
            page={board.page}
            limit={board.limit}
            total={board.total}
            filter={board.filter}
            updatingId={board.updatingId}
            onStatusChange={(id, status) => {
              void board.changeStatus(id, status)
            }}
            onPageChange={board.setPage}
          />
        </section>
      </main>
    </div>
  )
}
