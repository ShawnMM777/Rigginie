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
from django.urls import path


from databaseusers.views import (VerifyEmailView,RegisterView,LoginView,ProfileView, ChangePasswordView, LogOutView, ResendVerificationCodeView,)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/emailverify/', VerifyEmailView.as_view(), name='verify-email'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/profile/', ProfileView.as_view(), name='profile'),
    path('auth/change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('auth/logout/', LogOutView.as_view(), name='logout'),
    path('auth/resend-verification-code/', ResendVerificationCodeView.as_view(), name='resend-verification-code'),
]
