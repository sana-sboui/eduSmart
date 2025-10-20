from rest_framework import viewsets, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import action
from rest_framework.response import Response
from group.models import Group
from .models import Course
from .serializers import CourseSerializer


class IsTeacher(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'ENSEIGNANT'


class IsStudentOrTeacher(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role in ['ENSEIGNANT', 'ETUDIANT']


class CourseViewSet(viewsets.ModelViewSet):
    serializer_class = CourseSerializer
    queryset = Course.objects.all().order_by('-created_at')
    parser_classes = (MultiPartParser, FormParser)

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsTeacher]
        else:
            permission_classes = [IsStudentOrTeacher]
        return [perm() for perm in permission_classes]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'ENSEIGNANT':
            return Course.objects.filter(teacher=user)
        elif user.role == 'ETUDIANT':
            return Course.objects.filter(groups__in=user.student_groups.all()).distinct()
        return Course.objects.none()

    def perform_create(self, serializer):
        serializer.save(teacher=self.request.user)
        
    @action(detail=False, methods=['get'], url_path='by-group/(?P<group_id>[^/.]+)')
    def by_group(self, request, group_id=None):
        try:
            group = Group.objects.get(pk=group_id)
        except Group.DoesNotExist:
            return Response({"detail": "Group not found."}, status=status.HTTP_404_NOT_FOUND)

        courses = Course.objects.filter(groups=group).distinct()
        serializer = self.get_serializer(courses, many=True)
        return Response(serializer.data)
