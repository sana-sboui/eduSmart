from django.db import models

class Quiz(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=200)
    course = models.ForeignKey("course.Course", on_delete=models.CASCADE, related_name="quizzes")



class Question(models.Model):
    QCU = 'QCU'  
    QCM = 'QCM'

    TYPES = [
        (QCU, "Choix unique"),
        (QCM, "Choix multiples"),
    ]

    id = models.AutoField(primary_key=True)
    text = models.TextField()
    questionType = models.CharField(max_length=10, choices=TYPES)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name="questions")


class Option(models.Model):
    id = models.AutoField(primary_key=True)
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="options")
    text = models.CharField(max_length=200)
    isCorrect = models.BooleanField(default=False)

class ReponseStudent(models.Model):
    id = models.AutoField(primary_key=True)
    student = models.ForeignKey("accounts.Student", on_delete=models.CASCADE, related_name="reponses")
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="reponses")
    option = models.ForeignKey(Option, on_delete=models.SET_NULL, null=True, blank=True)
    texte_libre = models.TextField(blank=True, null=True)
    submission_date = models.DateTimeField(auto_now_add=True)