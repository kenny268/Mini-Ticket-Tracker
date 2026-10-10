from rest_framework import serializers

from tickets.models import Ticket


class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = ["id", "title", "description", "status", "priority", "created_at"]
        read_only_fields = fields


class TicketCreateSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=200)
    description = serializers.CharField(
        required=False,
        allow_blank=True,
        max_length=5000,
        default="",
    )
    priority = serializers.ChoiceField(
        choices=Ticket.Priority.choices,
        required=False,
        default=Ticket.Priority.MEDIUM,
    )

    def validate_title(self, value: str) -> str:
        trimmed = value.strip()
        if not trimmed:
            raise serializers.ValidationError("Title is required.")
        return trimmed

    def validate_description(self, value: str) -> str:
        return value.strip()


class TicketListQuerySerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=Ticket.Status.choices, required=False)
    page = serializers.IntegerField(required=False, min_value=1, default=1)
    limit = serializers.IntegerField(required=False, min_value=1, max_value=100, default=20)
