from django.urls import path
from .views import RegisterView, LoginView, TeacherView ,TeacherListView,TeacherDeleteView,TeacherUpdateView,ChangePasswordView, RegisterView, LoginView, UserProfileView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/profile/', UserProfileView.as_view(), name='user-profile'),
    path('auth/change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('admin/create-enseignant',TeacherView.as_view(),name='create_enseignant'),
    path('admin/liste-enseignant',TeacherListView.as_view(),name='liste_enseignant'),
    path('admin/delete-enseignant/<int:pk>',TeacherDeleteView.as_view(),name='delete'),
    path('admin/update-enseignant/<int:pk>',TeacherUpdateView.as_view(),name='update'),

]