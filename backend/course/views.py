import json
import re
from PyPDF2 import PdfReader
from rest_framework import viewsets, permissions,status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import action
from rest_framework.response import Response
from group.models import Group
from quiz.models import Option,Question,Quiz
from .models import Course
from .serializers import CourseSerializer
import google.generativeai as genai
from django.conf import settings
genai.configure(api_key=settings.GEMINI_API_KEY)

class IsTeacher(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'ENSEIGNANT'


class IsStudentOrTeacher(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role in ['ENSEIGNANT', 'ETUDIANT']


class CourseViewSet(viewsets.ModelViewSet):
    serializer_class = CourseSerializer
    queryset = Course.objects.all().order_by('-created_at')
    parser_classes = (MultiPartParser, FormParser)

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsTeacher]
        else:
            permission_classes = [IsStudentOrTeacher]
        return [perm() for perm in permission_classes]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'ENSEIGNANT':
            return Course.objects.filter(teacher=user)
        elif user.role == 'ETUDIANT':
            from accounts.models import Student
            try:
                student = Student.objects.get(pk=user.id)
                return Course.objects.filter(groups__in=student.student_groups.all()).distinct()
            except Student.DoesNotExist:
                return Course.objects.none()

    def perform_create(self, serializer):
        serializer.save(teacher=self.request.user)
        
    @action(detail=False, methods=['get'], url_path='by-group/(?P<group_id>[^/.]+)')
    def by_group(self, request, group_id=None):
        try:
            group = Group.objects.get(pk=group_id)
        except Group.DoesNotExist:
            return Response({"detail": "Group not found."}, status=status.HTTP_404_NOT_FOUND)

        courses = Course.objects.filter(groups=group).distinct()
        serializer = self.get_serializer(courses, many=True)
        return Response(serializer.data)
    def extract_text_from_pdf(self, file_path):
        try:
            reader = PdfReader(file_path)
            text = ""
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
            return text
        except Exception as e:
            print("PDF extraction error:", e)
            return None

    def generate_quiz_with_ai(self, text):
        prompt = f"""
        Génère un quiz structuré en JSON à partir de ce cours :

        {text}

        Format EXACT :
        {{
            "title": "Titre du quiz",
            "questions": [
                {{
                    "text": "Énoncé ?",
                    "type": "QCU",
                    "options": [
                        {{"text": "...", "isCorrect": true}},
                        {{"text": "...", "isCorrect": false}},
                        {{"text": "...", "isCorrect": false}}
                    ]
                }}
            ]
        }}
        """

        try:
            model = genai.GenerativeModel("gemini-2.5-flash") 
            response = model.generate_content(prompt)
            text_response = response.text

       
            cleaned_text = re.sub(r"^```json\s*|```$", "", text_response.strip(), flags=re.MULTILINE)

      
            data = json.loads(cleaned_text)
            

            return data

        except Exception as e:
            print("Gemini ERROR:", e)
            return None
        
    @action(detail=True, methods=['post'], url_path='generate-quiz')
    def generate_quiz(self, request, pk=None):
        course = self.get_object()
        
        text = self.extract_text_from_pdf(course.file)
        
      
        if not text:
            return Response({"detail": "Erreur extraction PDF"},
                            status=status.HTTP_400_BAD_REQUEST)

        quiz_data = self.generate_quiz_with_ai(text)
        
        if not quiz_data:
            return Response({"detail": "Erreur IA"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        quiz = Quiz.objects.create(
            title=quiz_data["title"],
            course=course
        )

        for q in quiz_data["questions"]:
            question = Question.objects.create(
                quiz=quiz,
                text=q["text"],
                questionType=q["type"]
            )

            for opt in q["options"]:
                Option.objects.create(
                    question=question,
                    text=opt["text"],
                    isCorrect=opt["isCorrect"]
                )

        return Response({
            "message": "Quiz généré avec succès",
            "quiz_id": quiz.id
        })