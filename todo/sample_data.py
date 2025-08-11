# Sample data script for Smart To-Do
from todo.models import Category, Task, ContextEntry
from django.utils import timezone

# Create categories
def create_categories():
    work = Category.objects.create(name='Work', description='Work related tasks')
    personal = Category.objects.create(name='Personal', description='Personal tasks')
    return work, personal

# Create tasks
def create_tasks(work, personal):
    Task.objects.create(title='Finish assignment', description='Complete the Smart Todo List assignment', category=work, status='pending')
    Task.objects.create(title='Buy groceries', description='Milk, Bread, Eggs', category=personal, status='pending')

# Create context entries
def create_context_entries():
    ContextEntry.objects.create(content='Project deadline is Friday', source_type='email')
    ContextEntry.objects.create(content='Remember to call mom', source_type='note')

def run():
    work, personal = create_categories()
    create_tasks(work, personal)
    create_context_entries()
    print('Sample data created.')

# To run: python manage.py shell < todo/sample_data.py
