from django.contrib import admin
from django.urls import include, path

from config.views import EmailLoginView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/token/", EmailLoginView.as_view(), name="token_obtain"),
    path("", include("tickets.urls")),
]
