from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from tickets.models import TicketEvent


class TicketApiTests(APITestCase):
    def setUp(self):
        get_user_model().objects.create_user(
            username="demo@example.com",
            email="demo@example.com",
            password="demo-pass-123",
        )

    def access_token(self) -> str:
        response = self.client.post(
            "/api/auth/token/",
            {"email": "demo@example.com", "password": "demo-pass-123"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        return response.data["access"]

    def authenticate(self) -> None:
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access_token()}")

    def test_create_ticket_and_list_it(self):
        self.authenticate()
        created = self.client.post(
            "/tickets/",
            {"title": "  Printer jam  ", "description": "Tray 2", "priority": "high"},
            format="json",
        )
        self.assertEqual(created.status_code, status.HTTP_201_CREATED)
        self.assertEqual(created.data["status"], "open")
        self.assertEqual(created.data["title"], "Printer jam")
        self.assertEqual(created.data["priority"], "high")

        listed = self.client.get("/tickets/")
        self.assertEqual(listed.status_code, status.HTTP_200_OK)
        self.assertEqual(listed.data["total"], 1)
        self.assertEqual(listed.data["data"][0]["id"], created.data["id"])

    def test_stats_after_status_change_records_event(self):
        self.authenticate()
        created_ids = []
        for title in ("One", "Two", "Three"):
            response = self.client.post("/tickets/", {"title": title}, format="json")
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)
            created_ids.append(response.data["id"])

        patched = self.client.patch(
            f"/tickets/{created_ids[0]}/",
            {"status": "closed"},
            format="json",
        )
        self.assertEqual(patched.status_code, status.HTTP_200_OK)
        self.assertEqual(patched.data["status"], "closed")

        stats = self.client.get("/tickets/stats/")
        self.assertEqual(stats.status_code, status.HTTP_200_OK)
        self.assertEqual(stats.data, {"open": 2, "in_progress": 0, "closed": 1})
        self.assertTrue(
            TicketEvent.objects.filter(
                ticket_id=created_ids[0],
                from_status="open",
                to_status="closed",
            ).exists()
        )

    def test_list_filters_and_paginates(self):
        self.authenticate()
        for index in range(3):
            response = self.client.post("/tickets/", {"title": f"Open {index}"}, format="json")
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        closed = self.client.post("/tickets/", {"title": "Done"}, format="json")
        self.assertEqual(closed.status_code, status.HTTP_201_CREATED)
        self.client.patch(f"/tickets/{closed.data['id']}/", {"status": "closed"}, format="json")

        listed = self.client.get("/tickets/", {"status": "open", "page": 1, "limit": 2})
        self.assertEqual(listed.status_code, status.HTTP_200_OK)
        self.assertEqual(len(listed.data["data"]), 2)
        self.assertEqual(listed.data["total"], 3)
        self.assertEqual(listed.data["page"], 1)
        self.assertEqual(listed.data["limit"], 2)
        self.assertTrue(all(ticket["status"] == "open" for ticket in listed.data["data"]))

    def test_auth_and_validation_failures(self):
        unauthenticated = self.client.patch("/tickets/9999/", {"status": "closed"}, format="json")
        self.assertEqual(unauthenticated.status_code, status.HTTP_401_UNAUTHORIZED)

        self.authenticate()
        missing = self.client.patch("/tickets/9999/", {"status": "closed"}, format="json")
        self.assertEqual(missing.status_code, status.HTTP_404_NOT_FOUND)

        blank = self.client.post("/tickets/", {"description": "no title"}, format="json")
        self.assertEqual(blank.status_code, status.HTTP_400_BAD_REQUEST)
