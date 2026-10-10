from django.db import transaction

from tickets.exceptions import TicketNotFound
from tickets.models import Ticket, TicketEvent


def create_ticket(*, title: str, description: str = "", priority: str = Ticket.Priority.MEDIUM) -> Ticket:
    return Ticket.objects.create(
        title=title,
        description=description,
        priority=priority,
        status=Ticket.Status.OPEN,
    )


@transaction.atomic
def update_ticket(
    *,
    ticket_id: int,
    status: str | None = None,
    priority: str | None = None,
) -> Ticket:
    try:
        ticket = Ticket.objects.select_for_update().get(pk=ticket_id)
    except Ticket.DoesNotExist as exc:
        raise TicketNotFound from exc

    previous_status = ticket.status
    update_fields: list[str] = []
    if priority is not None and ticket.priority != priority:
        ticket.priority = priority
        update_fields.append("priority")
    if status is not None and ticket.status != status:
        ticket.status = status
        update_fields.append("status")
    if update_fields:
        ticket.save(update_fields=update_fields)
    if status is not None and status != previous_status:
        TicketEvent.objects.create(
            ticket=ticket,
            from_status=previous_status,
            to_status=status,
        )
    return ticket
