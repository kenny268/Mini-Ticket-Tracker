from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from tickets.selectors import list_tickets
from tickets.serializers import TicketCreateSerializer, TicketListQuerySerializer, TicketSerializer
from tickets.services import create_ticket


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
