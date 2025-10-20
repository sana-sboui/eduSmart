from django.shortcuts import render
from rest_framework import viewsets
from .models import Group
from .serializers import GroupSerializer
from rest_framework import permissions
from django.db.models import Q
from rest_framework.views import APIView
from rest_framework.response import Response

class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    # permission_classes = [permissions.IsAdminUser]

class UserGroupsView(APIView):
    def get(self, request, user_id):
        groups = Group.objects.filter(
            Q(teacher__id=user_id) | Q(students__id=user_id)
        ).distinct()
        serializer = GroupSerializer(groups, many=True)
        return Response(serializer.data)