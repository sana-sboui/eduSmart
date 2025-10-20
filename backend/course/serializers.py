from group.models import Group
from rest_framework import serializers
from .models import Course


class CourseSerializer(serializers.ModelSerializer):
    groups = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Group.objects.all()
    )

    class Meta:
        model = Course
        fields = [
            'id', 'title', 'description', 'file',
            'teacher', 'groups', 'created_at', 'updated_at'
        ]
        read_only_fields = ['teacher', 'created_at', 'updated_at']

    def create(self, validated_data):
        groups = validated_data.pop('groups', [])
        course = Course.objects.create(**validated_data)
        course.groups.set(groups)
        return course

    def update(self, instance, validated_data):
        groups = validated_data.pop('groups', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if groups is not None:
            instance.groups.set(groups)
        instance.save()
        return instance
