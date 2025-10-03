from django.db import models


class Course(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    creationDate = models.DateTimeField(auto_now_add=True)
    teacher = models.ForeignKey("accounts.Teacher", on_delete=models.CASCADE, related_name="course")