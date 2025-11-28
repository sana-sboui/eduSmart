from rest_framework import viewsets
from .models import Quiz, StudentQuizResult
from .serializers import QuizSerializer, StudentQuizResultSerializer
from rest_framework.response import Response
from rest_framework import status, viewsets

class QuizViewSet(viewsets.ReadOnlyModelViewSet):
    
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
class StudentQuizResultViewSet(viewsets.ModelViewSet):
    queryset = StudentQuizResult.objects.all()
    serializer_class = StudentQuizResultSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)