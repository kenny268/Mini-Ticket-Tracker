from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from config.auth import InvalidCredentials, issue_access_token
from config.serializers import EmailLoginSerializer


class EmailLoginView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = EmailLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            access = issue_access_token(
                email=serializer.validated_data["email"],
                password=serializer.validated_data["password"],
            )
        except InvalidCredentials:
            return Response(
                {"detail": "Invalid email or password."},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        return Response({"access": access})
