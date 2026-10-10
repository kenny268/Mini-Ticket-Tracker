from tickets.models import Ticket


def create_ticket(*, title: str, description: str = "", priority: str = Ticket.Priority.MEDIUM) -> Ticket:
    return Ticket.objects.create(
        title=title,
        description=description,
        priority=priority,
        status=Ticket.Status.OPEN,
    )
