from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken


class InvalidCredentials(Exception):
    pass


def issue_access_token(*, email: str, password: str) -> str:
    user = get_user_model().objects.filter(email__iexact=email).first()
    if user is None or not user.is_active or not user.check_password(password):
        raise InvalidCredentials()
    return str(RefreshToken.for_user(user).access_token)
