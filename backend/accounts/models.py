from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    id = models.AutoField(primary_key=True)
    username = None
    email = models.EmailField(unique=True)
    tel = models.CharField(max_length=15)
    
    ROLE_CHOICES = [
        ('ADMIN', 'Admin'),
        ('ENSEIGNANT', 'Enseignant'),
        ('ETUDIANT', 'Etudiant'),
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)

    REQUIRED_FIELDS = ["first_name", "last_name"]
    USERNAME_FIELD = "email" 

class Student(User):
    group = models.ForeignKey("group.Group", on_delete=models.SET_NULL, null=True, blank=True)

class Teacher(User):
    speciality = models.CharField(max_length=100)