from django.urls import path
from .views import record_frontend_request

urlpatterns = [
    path('track/', record_frontend_request),
]
