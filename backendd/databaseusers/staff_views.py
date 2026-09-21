from django.contrib.auth import get_user_model
from django.db.models import Q
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .permissions import IsAdminRole
from .serializers import StaffUserSerializer, UserSerializer

User = get_user_model()


class StaffUserListCreateView(APIView):
    permission_classes = [IsAdminRole]

    def get(self, request):
        search = (request.query_params.get('search') or '').strip()
        users = User.objects.all().order_by('-id')
        if search:
            users = users.filter( Q(email__icontains=search) | Q(first_name__icontains=search)  | Q(last_name__icontains=search))
        return Response(UserSerializer(users, many=True).data)

    def post(self, request):
        serializer = StaffUserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)


class StaffUserDetailView(APIView):
    permission_classes = [IsAdminRole]

    def delete(self, request, user_id):
        user = User.objects.filter(pk=user_id).first()
        if not user:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        if user.pk == request.user.pk:
            return Response({'error': 'You cannot remove your own account.'}, status=status.HTTP_400_BAD_REQUEST)
        if user.role == 'admin' and User.objects.filter(role='admin').count() <= 1:
            return Response({'error': 'Cannot remove the last admin.'}, status=status.HTTP_400_BAD_REQUEST)
        user.delete()
        return Response({'message': 'User removed.'})
