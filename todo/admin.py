from django.contrib import admin
from .models import Task, Category, ContextEntry

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'completed', 'created_at', 'updated_at', 'deadline', 'priority_score', 'status', 'category')
    list_filter = ('completed', 'created_at', 'status', 'category')
    search_fields = ('title', 'description')

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'usage_count')
    search_fields = ('name',)

@admin.register(ContextEntry)
class ContextEntryAdmin(admin.ModelAdmin):
    list_display = ('source_type', 'created_at')
    search_fields = ('content',)
