from django.urls import path

from tickets.views import TicketCollectionView, TicketDetailView, TicketStatsView

urlpatterns = [
    path("tickets/stats/", TicketStatsView.as_view(), name="ticket-stats"),
    path("tickets/", TicketCollectionView.as_view(), name="ticket-list"),
    path("tickets/<int:ticket_id>/", TicketDetailView.as_view(), name="ticket-detail"),
]
