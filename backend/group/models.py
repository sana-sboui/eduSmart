from django.db import models

class Group(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)