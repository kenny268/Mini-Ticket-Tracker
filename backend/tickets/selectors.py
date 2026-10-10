from dataclasses import dataclass

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
