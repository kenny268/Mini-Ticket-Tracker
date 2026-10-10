import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Create the demo user when that email does not exist yet."

    def handle(self, *args, **options):
        email = os.environ.get("DEMO_USER_EMAIL", "demo@example.com")
        password = os.environ.get("DEMO_USER_PASSWORD", "demo-pass-123")
        user_model = get_user_model()
        if user_model.objects.filter(email__iexact=email).exists():
            self.stdout.write(self.style.SUCCESS(f"Demo user already exists: {email}"))
            return
        user_model.objects.create_user(username=email, email=email, password=password)
        self.stdout.write(self.style.SUCCESS(f"Created demo user: {email}"))
