from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import GroupViewSet, UserGroupsView

router = DefaultRouter()
router.register(r'groups', GroupViewSet, basename='group')

urlpatterns = [
    *router.urls,
    path('groups/user/<int:user_id>/', UserGroupsView.as_view(), name='groups-by-user'),
]
