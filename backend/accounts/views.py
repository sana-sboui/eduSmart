from rest_framework import generics, status , permissions
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

from accounts.models import Teacher
from .serializers import RegisterSerializer, LoginSerializer, TeacherSerializer

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer

class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        user = authenticate(username=username, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            profile_picture = user.profile_picture.url if user.profile_picture else None
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'username': user.username,
                'role': user.role,
                'profile_picture':profile_picture,
                'last_name':user.last_name,
                'first_name':user.first_name
            })
        return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

# CReate Teacher 
class TeacherView(generics.CreateAPIView):
    queryset=Teacher.objects.all()
    serializer_class = TeacherSerializer
    permission_classes = [permissions.IsAdminUser]
    
    def perform_create(self, serializer):
       serializer.save(role='ENSEIGNANT')

# List all teachers
class TeacherListView(generics.ListAPIView):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer
    permission_classes = [permissions.IsAdminUser]

# Update teacher
class TeacherUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer
    permission_classes = [permissions.IsAdminUser]
    
    def get_serializer(self, *args, **kwargs):
        kwargs['partial'] = True  # allow partial update
        return super().get_serializer(*args, **kwargs)

# Delete teacher
class TeacherDeleteView(generics.DestroyAPIView):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer
    permission_classes = [permissions.IsAdminUser]

