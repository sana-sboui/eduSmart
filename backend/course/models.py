from django.db import models
from accounts.models import Teacher, User
from group.models import Group


class Course(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    file = models.FileField(upload_to='courses/')
    teacher = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='courses'
    )
    groups = models.ManyToManyField(Group, related_name='courses')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} - {self.teacher.username}"
