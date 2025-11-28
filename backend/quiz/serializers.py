from rest_framework import serializers
from .models import Quiz, Question, Option, StudentQuizResult

class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ["id", "text", "isCorrect"]

class QuestionSerializer(serializers.ModelSerializer):
    options = OptionSerializer(many=True, read_only=True)  

    class Meta:
        model = Question
        fields = ["id", "text", "questionType", "options"]

class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)  

    class Meta:
        model = Quiz
        fields = ["id", "title", "course", "questions"]
class StudentQuizResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentQuizResult
        fields = ['id', 'student', 'quiz', 'correct_answers', 'incorrect_answers', 'percentage', 'submission_date']