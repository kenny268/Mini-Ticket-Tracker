"use client"

import { Inbox, LogOut } from "lucide-react"
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
  { value: "", label: "All tickets" },
  ...TICKET_STATUSES.map((status) => ({ value: status, label: STATUS_LABELS[status] })),
]

export default function HomePage() {
  const session = useSession()
  const board = useTickets(session.token, session.logout)
  const queueTotal = board.stats.open + board.stats.in_progress + board.stats.closed
  const summary =
    queueTotal === 0
      ? "Nothing waiting"
      : `${board.stats.open} open · ${board.stats.in_progress} in progress · ${board.stats.closed} closed`
  const viewTitle = board.filter ? STATUS_LABELS[board.filter] : "All tickets"

  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-30 border-b border-border/80 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-foreground text-background">
            <Inbox className="size-4" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-base font-semibold tracking-tight">Ticket desk</h1>
            <p className="truncate text-xs text-muted-foreground">{summary}</p>
          </div>
          <div className="flex items-center gap-2">
            {session.isAuthenticated ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="sm:hidden"
                  aria-label="Log out"
                  onClick={session.logout}
                >
                  <LogOut />
                </Button>
                <Button type="button" variant="outline" size="sm" className="hidden sm:inline-flex" onClick={session.logout}>
                  Log out
                </Button>
              </>
            ) : null}
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[22rem_minmax(0,1fr)] lg:items-start">
        <div className="lg:col-span-2">
          <StatsCards stats={board.stats} active={board.filter} onSelect={board.setFilter} />
        </div>

        <div className="order-1 lg:sticky lg:top-20 lg:order-none">
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

        <section className="order-2 grid content-start gap-4 lg:order-none">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">{viewTitle}</h2>
              <p className="text-sm text-muted-foreground">
                {board.loading ? "Loading the queue" : `${board.total} in this view`}
              </p>
            </div>
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
                <SelectTrigger className="w-full bg-card sm:w-48" aria-label="Filter by status">
                  <SelectValue>{viewTitle}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {FILTERS.map((item) => (
                    <SelectItem key={item.label} value={item.value || "all"}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
