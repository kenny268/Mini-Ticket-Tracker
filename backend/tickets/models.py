from django.db import models


class Ticket(models.Model):
    class Status(models.TextChoices):
        OPEN = "open", "Open"
        IN_PROGRESS = "in_progress", "In progress"
        CLOSED = "closed", "Closed"

    class Priority(models.TextChoices):
        LOW = "low", "Low"
        MEDIUM = "medium", "Medium"
        HIGH = "high", "High"

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, default="")
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.OPEN,
    )
    priority = models.CharField(
        max_length=20,
        choices=Priority.choices,
        default=Priority.MEDIUM,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at", "-id"]
        constraints = [
            models.CheckConstraint(
                condition=models.Q(status__in=["open", "in_progress", "closed"]),
                name="ticket_status_valid",
            ),
            models.CheckConstraint(
                condition=models.Q(priority__in=["low", "medium", "high"]),
                name="ticket_priority_valid",
            ),
        ]
        indexes = [
            models.Index(
                fields=["status", "-created_at", "-id"],
                name="tickets_status_created_idx",
            ),
        ]

    def __str__(self) -> str:
        return self.title


class TicketEvent(models.Model):
    ticket = models.ForeignKey(
        Ticket,
        on_delete=models.CASCADE,
        related_name="events",
    )
    from_status = models.CharField(max_length=20, choices=Ticket.Status.choices)
    to_status = models.CharField(max_length=20, choices=Ticket.Status.choices)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at", "id"]
        constraints = [
            models.CheckConstraint(
                condition=models.Q(from_status__in=["open", "in_progress", "closed"]),
                name="ticket_event_from_status_valid",
            ),
            models.CheckConstraint(
                condition=models.Q(to_status__in=["open", "in_progress", "closed"]),
                name="ticket_event_to_status_valid",
            ),
        ]

    def __str__(self) -> str:
        return f"{self.from_status} -> {self.to_status}"
