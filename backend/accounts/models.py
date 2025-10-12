from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    id = models.AutoField(primary_key=True)
    email = models.EmailField(unique=True,null=False)
    tel = models.CharField(max_length=15)
    profile_picture = models.ImageField(upload_to='profiles/', null=True, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    ROLE_CHOICES = [
        ('ADMIN', 'Admin'),
        ('ENSEIGNANT', 'Enseignant'),
        ('ETUDIANT', 'Etudiant'),
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)

    REQUIRED_FIELDS = ["first_name", "last_name","email"]
    USERNAME_FIELD = "username" 

class Student(User):
    STATUS_CHOICES = [
        ('STUDENT', 'Student'),
        ('EMPLOYEE', 'Employee'),
        ('OTHER', 'Other'),
    ]
    group = models.ForeignKey("group.Group", on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='STUDENT') 
class Teacher(User):
    speciality = models.CharField(max_length=100)