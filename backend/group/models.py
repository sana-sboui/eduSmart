from django.db import models

from accounts.models import Teacher, Student

class Group(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    teacher = models.ForeignKey(
        Teacher, on_delete=models.SET_NULL, null=True, blank=True, related_name="teacher_groups"
    )
    students = models.ManyToManyField(Student, related_name="student_groups", blank=True)

    def __str__(self):
        return self.name