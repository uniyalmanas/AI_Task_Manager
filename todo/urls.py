
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api_views import TaskViewSet, CategoryViewSet, ContextEntryViewSet, AISuggestionView

router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='task')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'contexts', ContextEntryViewSet, basename='contextentry')

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/ai-suggestions/', AISuggestionView.as_view(), name='ai_suggestions'),
]
