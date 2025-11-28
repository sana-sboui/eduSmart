from django.urls import path
from .views import QuizViewSet, StudentQuizResultViewSet

urlpatterns = [
    path('quiz/', QuizViewSet.as_view({'get': 'list'}), name='quiz-list'),
    path('quiz/<int:pk>/', QuizViewSet.as_view({'get': 'retrieve'}), name='quiz-detail'),
    path(
        'student-quiz-result/',
        StudentQuizResultViewSet.as_view({'post': 'create', 'get': 'list'}),
        name='student-quiz-result-list'
    ),
    path(
        'student-quiz-result/<int:pk>/',
        StudentQuizResultViewSet.as_view({'get': 'retrieve'}),
        name='student-quiz-result-detail'
    ),
]
