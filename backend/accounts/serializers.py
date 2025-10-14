from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

from accounts.models import Student
from accounts.models import Teacher

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

class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'tel','date_of_birth', 'speciality', 'password']

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        teacher = Teacher(**validated_data)
        if password:
            teacher.set_password(password)
        teacher.role = 'ENSEIGNANT'
        teacher.save()
        return teacher
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance
