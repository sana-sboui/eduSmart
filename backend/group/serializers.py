from rest_framework import serializers
from .models import Group, Teacher, Student

class TeacherNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = ['first_name', 'last_name', 'speciality']

class StudentNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['first_name', 'last_name', 'status']

class GroupSerializer(serializers.ModelSerializer):
    # Input: accept IDs
    teacher = serializers.PrimaryKeyRelatedField(queryset=Teacher.objects.all())
    students = serializers.PrimaryKeyRelatedField(queryset=Student.objects.all(), many=True)

    # Output: show full objects
    teacher_detail = TeacherNestedSerializer(source='teacher', read_only=True)
    students_detail = StudentNestedSerializer(source='students', many=True, read_only=True)

    class Meta:
        model = Group
        fields = ['id', 'name', 'description', 'teacher', 'students', 'teacher_detail', 'students_detail']

    def create(self, validated_data):
        students_data = validated_data.pop('students', [])
        group = Group.objects.create(**validated_data)
        group.students.set(students_data)
        return group