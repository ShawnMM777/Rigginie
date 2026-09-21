from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.tokens import default_token_generator
from django.core.exceptions import ValidationError as DjangoValidationError
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode

User = get_user_model()

#Email Password Reset
class ForgotPassword(serializers.Serializer):
    email = serializers.EmailField()

class PasswordResetEmailConfirm(serializers.Serializer):
    usid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        try:
            uid = force_str(urlsafe_base64_decode(attrs["usid"]))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            raise serializers.ValidationError({"token": "Invalid or expired reset link. Please request a new one."})

        if not default_token_generator.check_token(user, attrs["token"]):
            raise serializers.ValidationError({"token": "Invalid or expired reset link. Please request a new one."})

        try:
            validate_password(attrs["new_password"], user=user)
        except DjangoValidationError as exc:
            raise serializers.ValidationError({"new_password": list(exc.messages)})

        attrs["user"] = user
        return attrs


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    user_type = serializers.ChoiceField(
        choices=User.USER_TYPE_CHOICES,required=True)

    class Meta:
        model  = User
        fields = ('email', 'password', 'first_name', 'last_name', 'contact', 'user_type')
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
            'email': {'required': True},
            'contact': {'required': False, 'allow_blank': True},
        }

    def create(self, validated_data):
        return User.objects.create_user(
            email = validated_data['email'],
            first_name = validated_data['first_name'],
            last_name = validated_data['last_name'],
            contact = validated_data.get('contact', ''),
            password = validated_data['password'],
            user_type=validated_data['user_type'],
        )


class UserSerializer(serializers.ModelSerializer):
    user_type_display = serializers.CharField(source='get_user_type_display', read_only=True)
    branch_display = serializers.CharField(source='get_branch_display', read_only=True)
    class Meta:
        model  = User
        fields = ['id', 'email', 'first_name', 'last_name', 'contact', 'addresses', 'picture', 'user_type_display', 'user_type', 'role', 'branch', 'branch_display']
        read_only_fields = ['user_type', 'user_type_display', 'role', 'branch', 'branch_display']


class StaffUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['email', 'password', 'first_name', 'last_name', 'contact', 'role', 'branch', 'user_type']

    def create(self, validated_data):
        password = validated_data.pop('password')
        return User.objects.create_user(password=password, is_verified=True, **validated_data)


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True)
    confirm_password = serializers.CharField(required=True, write_only=True)

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError("New passwords don't match.")
        return data