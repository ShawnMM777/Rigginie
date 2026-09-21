from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")

        email = self.normalize_email(email)
        extra_fields.setdefault("is_active", True)

        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)
        extra_fields.setdefault("is_verified", True)
        extra_fields.setdefault("role", "admin") 
        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    username = None 
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150, blank=True)
    email = models.EmailField(unique=True)
    contact = models.CharField(max_length=15, blank=True)
    addresses = models.CharField(max_length=255, blank=True)
    is_verified = models.BooleanField(default=False)
    picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)
    USER_TYPE_CHOICES = [ ("student", "Student"), ("working", "Working"), ("gamer", "Gamer"), ("enthusiast", "Enthusiast"), ]
    user_type = models.CharField( max_length=20, choices=USER_TYPE_CHOICES, blank=True, null=True )
    ROLE_CHOICES = [("user", "User"),("merchant", "Merchant"),("admin", "Admin"),]
    BRANCH_CHOICES = [ ('ALL', 'ALL BRANCHES'),('PasigMain', 'Pasig City Main Branch'),('QC', 'Quezon City Branch'),('MALABON', 'MALABON BRANCH'),('PARAÑAQUE', 'PARAÑAQUE BRANCH'),('TAGUIG', 'TAGUIG BRANCH'),('PASAY', 'PASAY BRANCH'),('CEBU', 'CEBU CITY BRANCH'),]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="user")
    branch = models.CharField(max_length=20, choices=BRANCH_CHOICES, blank=True, default='')
    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email


class PasswordResetCode(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    code = models.CharField(max_length=9)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} — {self.code}"


class EmailVerificationCode(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    code = models.CharField(max_length=9)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} — {self.code}"