
# Smart To-Do List with AI

This is a full-stack web application that uses AI to help you manage your tasks intelligently. The system analyzes your daily context (notes, emails, etc.) to provide smart suggestions for task prioritization, deadlines, and more.

This project was built as a technical assignment.

## Features

- **Task Management:** Create, view, and manage your to-do list.
- **AI-Powered Suggestions:** Get intelligent recommendations for task priority, deadlines, categories, and descriptions.
- **Context Analysis:** The AI analyzes your daily notes and messages to understand your priorities.
- **REST API:** A Django REST Framework backend provides a full-featured API.
- **Modern Frontend:** A responsive user interface built with Next.js and Tailwind CSS.

## Screenshots

*Please add screenshots of the application UI here.*

**Task List Page:**

`[Screenshot of the main task list page with AI suggestions]`

**Context Input Page:**

`[Screenshot of the page where users can add daily context]`

## Tech Stack

- **Backend:** Django, Django REST Framework
- **Frontend:** Next.js, React, Tailwind CSS
- **Database:** PostgreSQL
- **AI Integration:** Google Gemini API

## Setup Instructions

Follow these steps to run the application locally:

### 1. Prerequisites

- Python 3.10+
- Node.js and npm
- PostgreSQL server

### 2. Backend Setup

```bash
# 1. Clone the repository

# 2. Navigate to the project directory
cd Smart-To-Do

# 3. Create and activate a Python virtual environment
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# 4. Install Python dependencies
pip install -r requirements.txt

# 5. Set up the database
# - Make sure your PostgreSQL server is running.
# - Create a new database (e.g., 'smarttodo').
# - Update the database credentials in backend/settings.py if they are different from the defaults.

# 6. Create a .env file in the root directory
#    Add your Gemini API key to this file:
#    GEMINI_API_KEY='your_actual_gemini_api_key'

# 7. Run database migrations
python manage.py migrate

# 8. Start the Django development server
python manage.py runserver
# The backend will be running at http://127.0.0.1:8000
```

### 3. Frontend Setup

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install Node.js dependencies
npm install

# 3. Start the Next.js development server
npm run dev

# The frontend will be running at http://localhost:3000
```

## API Documentation

The backend provides the following REST API endpoints:

- `GET /api/tasks/`: Retrieve a list of all tasks.
- `POST /api/tasks/`: Create a new task.
  - **Body:** `{ "title": "string", "description": "string" (optional) }`
- `GET /api/categories/`: Retrieve all task categories.
- `POST /api/categories/`: Create a new category.
- `GET /api/contexts/`: Retrieve all context entries.
- `POST /api/contexts/`: Add a new context entry.
  - **Body:** `{ "content": "string", "source_type": "string" }`
- `POST /api/ai-suggestions/`: Get AI-powered suggestions for all tasks based on the current context.

## Sample Data

### Sample Context Data

To test the AI features, you can add the following context entries using the "Add Context" page:

- **Source:** Email
  - **Content:** "Hi team, just a reminder that the Q3 report deadline is this Friday. Please make sure to submit all your sections by then. It's a top priority."
- **Source:** Note
  - **Content:** "Need to book a flight to the conference in New York for next month. Also, need to prepare the presentation slides for the keynote."

### Sample Tasks & AI Suggestions

After adding the context above and creating a few tasks, the AI might produce suggestions like this:

- **Task:** `Finish Q3 report`
  - **AI Suggestion:**
    - **Priority:** 0.9
    - **Deadline:** (A date close to the upcoming Friday)
    - **Category:** Work
    - **Enhanced Description:** "Submit all sections for the Q3 report, as the deadline is this Friday. This is a top priority according to the team email."

- **Task:** `Prepare presentation`
  - **AI Suggestion:**
    - **Priority:** 0.7
    - **Deadline:** (A date a few weeks from now)
    - **Category:** Work
    - **Enhanced Description:** "Prepare the keynote presentation slides for the upcoming conference in New York."

- **Task:** `Book flight`
  - **AI Suggestion:**
    - **Priority:** 0.6
    - **Deadline:** (A date a week or two from now)
    - **Category:** Travel
    - **Enhanced Description:** "Book a flight for the conference in New York next month."
