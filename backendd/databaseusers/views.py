import random
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from rest_framework import status 
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import ChangePassword, RegisterSerializer, LoginSerializer
from .models import EmailVerificationCode

User = get_user_model()

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            verification_code = str(random.randint(100000, 999999))
            EmailVerificationCode.objects.create(user=user, code=verification_code)

            send_mail(
                'Email Verification Code',
                f'Your verification code is: {verification_code}',
                'noreply@riggenie.com',
                [user.email],
                fail_silently=True,  # ✅ won't crash if email fails
            )
            return Response(
                {"detail": "Registered. Check your email for the verification code."},
                status=status.HTTP_201_CREATED
            )

        # ✅ This tells you exactly what failed — check Django terminal
        print("Register errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyEmailView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        code = request.data.get('code')
        try:
            user = User.objects.get(email=email)
            verification_code = EmailVerificationCode.objects.get(user=user, code=code)
            user.is_active = True
            user.save()
            verification_code.delete()
            return Response({"detail": "Email verified successfully."}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        except EmailVerificationCode.DoesNotExist:
            return Response({"detail": "Invalid verification code."}, status=status.HTTP_400_BAD_REQUEST)
        
class ResendVerificationCodeView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        user = User.objects.get(email=email).first()
        if not user:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        code = f"{random.randint(100000, 999999)}"
        EmailVerificationCode.objects.update_or_create(user=user, defaults={'code': code})
        send_mail(
            'Email Verification Code',
            f'Your verification code is: {code}',
            'noreply@riggenie.com',
            [user.email],
            fail_silently=False,
        )
        return Response({"detail": "Verification code resent."}, status=status.HTTP_200_OK)

class LoginView(TokenObtainPairView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        if not user.is_active:
            return Response({"detail": "Email not verified."}, status=status.HTTP_403_FORBIDDEN)
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_200_OK)
    
class LogOutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"detail": "Logged out successfully."}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"detail": "Invalid token."}, status=status.HTTP_400_BAD_REQUEST)

class ChangePasswordView(APIView):
    def post(self, request):
        serializer = ChangePassword(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        user = request.user
        if not user.check_password(serializer.validated_data['old_password']):
            return Response({"error": "old password incorrect."}, status=status.HTTP_400_BAD_REQUEST)
        
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        return Response({'message': 'Password updated successfully.'}, status=status.HTTP_200_OK)
    
class ProfileView (APIView):
    def get(self, request):
        return Response(UserSerializer(request.user).data, status=status.HTTP_200_OK)
    
    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    
