from rest_framework import generics, status,permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import update_session_auth_hash
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth import authenticate,get_user_model
from .serializers import ChangePasswordSerializer, RegisterSerializer, LoginSerializer, StudentProfileSerializer, TeacherProfileSerializer, UserProfileSerializer

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
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'username': user.username,
                'role': user.role
            })
        return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
    
class UserProfileView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request):
        user = request.user

        if hasattr(user, 'student'):
            serializer = StudentProfileSerializer(user.student,context={'request': request})
        elif hasattr(user, 'teacher'):
            serializer = TeacherProfileSerializer(user.teacher,context={'request': request})
        else:
            serializer = UserProfileSerializer(user,context={'request': request})

        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request):
        user = request.user

        if hasattr(user, 'student'):
            instance = user.student
            serializer = StudentProfileSerializer(instance, data=request.data, partial=True,context={'request': request})
        elif hasattr(user, 'teacher'):
            instance = user.teacher
            serializer = TeacherProfileSerializer(instance, data=request.data, partial=True,context={'request': request})
        else:
            serializer = UserProfileSerializer(user, data=request.data, partial=True,context={'request': request})

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        user = request.user

        if serializer.is_valid():
            if not user.check_password(serializer.validated_data.get("old_password")):
                return Response({"old_password": "Your current password is incorrect."}, status=status.HTTP_400_BAD_REQUEST)

            user.set_password(serializer.validated_data.get("new_password"))
            user.save()
            update_session_auth_hash(request, user)  

            return Response({"detail": "Password updated successfully."}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)    