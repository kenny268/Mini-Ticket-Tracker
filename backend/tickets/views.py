from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from tickets.exceptions import TicketNotFound
from tickets.selectors import list_tickets, ticket_stats
from tickets.serializers import (
    TicketCreateSerializer,
    TicketListQuerySerializer,
    TicketSerializer,
    TicketUpdateSerializer,
)
from tickets.services import create_ticket, update_ticket


class TicketCollectionView(APIView):
    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated()]
        return [AllowAny()]

    def get(self, request):
        query = TicketListQuerySerializer(data=request.query_params)
        query.is_valid(raise_exception=True)
        data = query.validated_data
        page = list_tickets(
            status=data.get("status"),
            page=data["page"],
            limit=data["limit"],
        )
        return Response(
            {
                "data": TicketSerializer(page.tickets, many=True).data,
                "page": page.page,
                "limit": page.limit,
                "total": page.total,
            }
        )

    def post(self, request):
        body = TicketCreateSerializer(data=request.data)
        body.is_valid(raise_exception=True)
        ticket = create_ticket(**body.validated_data)
        return Response(TicketSerializer(ticket).data, status=status.HTTP_201_CREATED)


class TicketDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, ticket_id: int):
        body = TicketUpdateSerializer(data=request.data)
        body.is_valid(raise_exception=True)
        try:
            ticket = update_ticket(ticket_id=ticket_id, **body.validated_data)
        except TicketNotFound:
            return Response({"detail": "Ticket not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response(TicketSerializer(ticket).data)


class TicketStatsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response(ticket_stats())
