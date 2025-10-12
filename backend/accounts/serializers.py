from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

from accounts.models import Student, Teacher

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ['username', 'email', 'tel', 'role', 'password']

    def create(self, validated_data):      
        user = User.objects.create_user(**validated_data)
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
        teacher.raw_password = password
        return teacher
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


class UserSerializer(serializers.ModelSerializer):
    profile_picture = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = [
            'id','username', 'first_name', 'last_name', 'email','tel', 'date_of_birth', 'role',
        ]
        read_only_fields = ['username', 'role']
    def get_profile_picture(self, obj):
        request = self.context.get('request')
        if obj.profile_picture:
            return request.build_absolute_uri(obj.profile_picture.url)
        return None

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = UserSerializer.Meta.fields + ['status']
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        student = Student(**validated_data)
        if password:
            student.set_password(password)
        student.role = 'ETUDIANT'
        student.save()
        return student