from dataclasses import dataclass

from django.db.models import Count

from tickets.models import Ticket


@dataclass(frozen=True)
class TicketPage:
    tickets: list[Ticket]
    page: int
    limit: int
    total: int


def list_tickets(*, status: str | None, page: int, limit: int) -> TicketPage:
    queryset = Ticket.objects.all()
    if status:
        queryset = queryset.filter(status=status)
    total = queryset.count()
    offset = (page - 1) * limit
    tickets = list(queryset.order_by("-created_at", "-id")[offset : offset + limit])
    return TicketPage(tickets=tickets, page=page, limit=limit, total=total)


def ticket_stats() -> dict[str, int]:
    grouped = Ticket.objects.values("status").annotate(count=Count("id"))
    counts = {row["status"]: row["count"] for row in grouped}
    return {status: counts.get(status, 0) for status in Ticket.Status.values}
