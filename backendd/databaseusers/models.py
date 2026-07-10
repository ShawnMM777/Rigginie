
from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    first_name = models.CharField(max_length=150, unique=True)
    last_name = models.CharField(max_length=150, unique=True, null=True, blank=True)
    addresses = models.CharField(max_length=255, unique=True, null=True, blank=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    contact = models.CharField(max_length=15)
    date_joined = models.DateTimeField(auto_now_add=True)

    USER_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'addresses', 'contact']

    def __str__(self):
        return self.email

class EmailVerificationCode(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    code = models.CharField(max_length=9)
    created_at = models.DateTimeField(auto_now_add=True)
