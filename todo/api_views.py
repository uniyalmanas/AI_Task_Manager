from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Task, Category, ContextEntry
from .serializers import TaskSerializer, CategorySerializer, ContextEntrySerializer

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all().order_by('-created_at')
    serializer_class = TaskSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all().order_by('name')
    serializer_class = CategorySerializer

class ContextEntryViewSet(viewsets.ModelViewSet):
    queryset = ContextEntry.objects.all().order_by('-created_at')
    serializer_class = ContextEntrySerializer

from rest_framework.views import APIView
from .ai_module import analyze_context_with_gemini

class AISuggestionView(APIView):
    def post(self, request):
        # Fetch all tasks and context entries to provide full context to the AI
        tasks = Task.objects.all()
        context_entries = ContextEntry.objects.all()

        if not tasks.exists():
            return Response({"message": "No tasks found to analyze."}, status=status.HTTP_404_NOT_FOUND)

        # Get suggestions from the Gemini module
        ai_suggestions = analyze_context_with_gemini(context_entries, tasks)

        if 'error' in ai_suggestions:
            return Response(ai_suggestions, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(ai_suggestions, status=status.HTTP_200_OK)
