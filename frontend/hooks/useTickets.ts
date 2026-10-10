"use client"

import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"

import {
  ApiError,
  createTicket,
  fetchStats,
  fetchTickets,
  updateTicketStatus,
} from "@/lib/api"
import type {
  StatusFilter,
  Ticket,
  TicketCreateInput,
  TicketStats,
  TicketStatus,
} from "@/lib/types"

const EMPTY_STATS: TicketStats = { open: 0, in_progress: 0, closed: 0 }

export function useTickets(token: string | null, onUnauthorized: () => void) {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [filter, setFilterState] = useState<StatusFilter>("")
  const [stats, setStats] = useState<TicketStats>(EMPTY_STATS)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  const load = useCallback(async () => {
    try {
      const [list, nextStats] = await Promise.all([
        fetchTickets({ status: filter, page, limit }),
        fetchStats(),
      ])
      setTickets(list.data)
      setTotal(list.total)
      setStats(nextStats)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not load tickets")
    } finally {
      setLoading(false)
    }
  }, [filter, page, limit])

  useEffect(() => {
    let cancelled = false
    Promise.all([fetchTickets({ status: filter, page, limit }), fetchStats()])
      .then(([list, nextStats]) => {
        if (cancelled) {
          return
        }
        setTickets(list.data)
        setTotal(list.total)
        setStats(nextStats)
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          toast.error(error instanceof Error ? error.message : "Could not load tickets")
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })
    return () => {
      cancelled = true
    }
  }, [filter, page, limit])

  const rejectUnauthorized = useCallback(
    (error: unknown) => {
      if (error instanceof ApiError && error.status === 401) {
        onUnauthorized()
        toast.error("Log in to change tickets.")
        return true
      }
      return false
    },
    [onUnauthorized],
  )

  const create = useCallback(
    async (input: TicketCreateInput) => {
      if (!token) {
        toast.error("Log in to change tickets.")
        throw new ApiError("Log in to change tickets.", 401)
      }
      try {
        await createTicket(input, token)
        toast.success("Ticket created")
        if (page === 1) {
          await load()
        } else {
          setLoading(true)
          setPage(1)
        }
      } catch (error) {
        if (!rejectUnauthorized(error)) {
          toast.error(error instanceof Error ? error.message : "Could not create the ticket")
        }
        throw error
      }
    },
    [token, page, load, rejectUnauthorized],
  )

  const changeStatus = useCallback(
    async (id: number, status: TicketStatus) => {
      if (!token) {
        toast.error("Log in to change tickets.")
        return
      }
      setUpdatingId(id)
      try {
        await updateTicketStatus(id, status, token)
        toast.success("Status updated")
        await load()
      } catch (error) {
        if (!rejectUnauthorized(error)) {
          toast.error(error instanceof Error ? error.message : "Could not update the ticket")
        }
      } finally {
        setUpdatingId(null)
      }
    },
    [token, load, rejectUnauthorized],
  )

  const setFilter = useCallback((status: StatusFilter) => {
    setLoading(true)
    setPage(1)
    setFilterState(status)
  }, [])

  const changePage = useCallback((nextPage: number) => {
    setLoading(true)
    setPage(nextPage)
  }, [])

  return {
    tickets,
    page,
    limit,
    total,
    filter,
    stats,
    loading,
    updatingId,
    setFilter,
    setPage: changePage,
    create,
    changeStatus,
  }
}
