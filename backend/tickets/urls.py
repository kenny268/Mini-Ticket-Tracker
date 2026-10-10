from django.urls import path

from tickets.views import TicketCollectionView

urlpatterns = [
    path("tickets/", TicketCollectionView.as_view(), name="ticket-list"),
]
