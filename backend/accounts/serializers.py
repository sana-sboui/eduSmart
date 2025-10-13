from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

from accounts.models import Student

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    status = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'tel', 'date_of_birth', 'status', 'role', 'password']

    def create(self, validated_data):  
        status = validated_data.pop('status', None)

        user = User.objects.create_user(**validated_data)

        Student.objects.create(user_ptr_id=user.id, 
                                   status=status if status else 'STUDENT',
                                   username=user.username,
                                   email=user.email,
                                   tel=user.tel,
                                   date_of_birth=user.date_of_birth,
                                   role=user.role,
                                   password=user.password)
        
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)