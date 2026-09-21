"""
URL configuration for backendd project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.urls import path
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenRefreshView
from databaseusers.views import ( VerifyEmailView, RegisterView, LoginView, GoogleLoginView, ProfileView, ChangePasswordView, LogOutView, ResendVerificationCodeView, ForgotPasswordView, PasswordResetEmailConfirmView)
urlpatterns = [
    path('admin/',admin.site.urls),
    path('auth/register/',RegisterView.as_view(),name='register'),
    path('auth/verify-email/',VerifyEmailView.as_view(),name='verify-email'),
    path('auth/resend-verification-code/',ResendVerificationCodeView.as_view(), name='resend-verification-code'),
    path('auth/forgotpassword/', ForgotPasswordView.as_view(), name='forgot-password'),
    path('auth/forgotpassreset', PasswordResetEmailConfirmView.as_view(), name='forgotpassreset'),
    path('auth/login/',LoginView.as_view(),name='login'),
    path('auth/google/', GoogleLoginView.as_view(), name='google-login'),
    path('auth/logout/',LogOutView.as_view(),name='logout'),
    path('auth/refresh/',TokenRefreshView.as_view(),name='token-refresh'),
    path('users/profile/',ProfileView.as_view(),name='profile'),
    path('users/change-password/',ChangePasswordView.as_view(),name='change-password'),
    path('ml/', include('machinelearning.urls')),
    path('', include('cart.urls')),
] + static('/media/products/', document_root=settings.BASE_DIR / 'products') + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)