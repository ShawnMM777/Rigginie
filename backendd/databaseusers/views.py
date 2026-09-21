import random
import os
from django.conf import settings
from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import BasePermission
from .models import EmailVerificationCode
from .serializers import RegisterSerializer,LoginSerializer,  ChangePasswordSerializer, UserSerializer, ForgotPassword, PasswordResetEmailConfirm

User = get_user_model()

class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "password_reset"

    def post(self, request):
        serializer = ForgotPassword(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]

        user = User.objects.filter(email__iexact=email).first()
        if user is not None:
            usid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            reset_link = f"{settings.FRONT_URL}/forgot-password/reset/{usid}/{token}"
            send_mail(
                subject="Reset Password for Rigginie PH",
                message=f"Use this link to reset your password: {reset_link}",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=True,
            )
        return Response(
            {"detail": "If an account exists with that email, a reset link has been sent."},
            status=status.HTTP_200_OK,
        )

class PasswordResetEmailConfirmView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "password_reset"

    def post(self, request):
        serializer = PasswordResetEmailConfirm(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user"]
        user.set_password(serializer.validated_data["new_password"])
        user.save(update_fields=["password"])

        return Response({"detail": "Password has done reset."}, status=HTTP_200_OK)

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            code = str(random.randint(100000, 999999))
            EmailVerificationCode.objects.create(user=user, code=code)
            send_mail(
                'Email Verification Code',
                f'Your verification code is: {code}\n\n This is Code is Expired In 15 Minutes and Resend Code Again',
                'noreply@rigginie.com',
                [user.email],
                fail_silently=True,
            )
            return Response(
                {'detail': 'Registered. Check your email for a verification code.'},
                status=status.HTTP_201_CREATED
            )
        print("Register errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VerifyEmailView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        code  = request.data.get('code')

        user = User.objects.filter(email=email).first()
        if not user:
            return Response({'message': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        record = EmailVerificationCode.objects.filter(
            user=user, code=code
        ).order_by('-created_at').first()

        if not record:
            return Response({'message': 'Invalid code.'}, status=status.HTTP_400_BAD_REQUEST)

        user.is_verified = True
        user.save()

        refresh = RefreshToken.for_user(user)
        return Response({
            'access':  str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': user.id,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'email': user.email,
                'picture': request.build_absolute_uri(user.picture.url) if user.picture else None,
                'user_type': user.user_type,
                'role': user.role,
                'branch': user.branch,
            }
        })


class ResendVerificationCodeView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        user  = User.objects.filter(email=email).first()
        if not user:
            return Response({'message': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        code = str(random.randint(100000, 999999))
        EmailVerificationCode.objects.create(user=user, code=code)
        send_mail(
            'Your new Rigginie verification code', 
            f'Your verification code is: {code}\n\nThis code expires in 15 minutes.',
            'noreply@rigginie.com',
            [user.email],
            fail_silently=True,
        )
        return Response({'message': 'Code resent.'})

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email    = request.data.get('email')
        password = request.data.get('password')

        print(f"Login attempt: {email}")

        if not email or not password:
            return Response(
                {'message': 'Email and password are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user_exists = User.objects.filter(email=email).first()
        print(f"User exists: {user_exists}")
        print(f"Is verified: {user_exists.is_verified if user_exists else 'N/A'}")
        print(f"Is active:   {user_exists.is_active if user_exists else 'N/A'}")

        user = authenticate(request, username=email, password=password)
        print(f"Authenticate result: {user}")

        if user is None:
            return Response(
                {'message': 'Invalid email or password.'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not user.is_verified:
            return Response(
                {'message': 'Please verify your email first.'},
                status=status.HTTP_403_FORBIDDEN
            )

        refresh = RefreshToken.for_user(user)
        return Response({
            'access':  str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': user.id,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'email': user.email,
                'picture': request.build_absolute_uri(user.picture.url) if user.picture else None,
                'user_type': user.user_type,
                'role': user.role,
                'branch': user.branch,
            }
        })


class GoogleLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        credential = request.data.get('credential')
        client_id = os.getenv('GOOGLE_CLIENT_ID')
        if not credential or not client_id:
            return Response(
                {'message': 'Google sign-in is not configured.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            google_user = id_token.verify_oauth2_token(
                credential, google_requests.Request(), client_id
            )
        except ValueError:
            return Response(
                {'message': 'Invalid Google credential.'},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        email = google_user.get('email')
        if not email or not google_user.get('email_verified'):
            return Response(
                {'message': 'Google account email is not verified.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'first_name': google_user.get('given_name', ''),
                'last_name': google_user.get('family_name', ''),
                'user_type': 'working',
                'is_verified': True,
            },
        )
        if not user.is_verified:
            user.is_verified = True
            user.save(update_fields=['is_verified'])

        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': user.id,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'email': user.email,
                'picture': request.build_absolute_uri(user.picture.url) if user.picture else None,
                'user_type': user.user_type,
                'role': user.role,
                'branch': user.branch,
            },
        })
class IsAdminRole(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'admin')


class LogOutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            token = RefreshToken(request.data.get('refresh'))
            token.blacklist()
        except Exception:
            pass
        return Response({'message': 'Logged out.'})


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request):
        return Response(UserSerializer(request.user).data, status=status.HTTP_200_OK)

    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        print("Received data:", request.data)
        serializer = ChangePasswordSerializer(data=request.data)
        if not serializer.is_valid():
            print("Errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        if not request.user.check_password(serializer.validated_data['old_password']):
            return Response(
                {'error': 'Old password is incorrect.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        request.user.set_password(serializer.validated_data['new_password'])
        request.user.save()
        return Response({'message': 'Password changed successfully.'})