import os
import google.generativeai as genai
import json

# Configure the Gemini API key
gemini_api_key = os.getenv("GEMINI_API_KEY")
if gemini_api_key:
    genai.configure(api_key=gemini_api_key)

def analyze_context_with_gemini(context_entries, tasks):
    """
    Analyze context and tasks using the Gemini API to provide AI-powered suggestions.
    """
    if not gemini_api_key:
        return {"error": "Gemini API key not configured."}

    model = genai.GenerativeModel('gemini-1.5-pro')

    # Prepare the prompt for the Gemini model
    context_text = "\n".join([f"Source: {c.source_type}, Content: {c.content}" for c in context_entries])
    task_text = "\n".join([f"- {t.title}" for t in tasks])

    prompt = f"""
    As a smart task assistant, analyze the following daily context and current tasks.
    Based on this information, provide intelligent suggestions for the tasks.

    **Daily Context:**
    {context_text}

    **Current Tasks:**
    {task_text}

    **Your goal is to return a single, valid JSON object** with suggestions for each task title.
    For each task, provide the following:
    1.  `priority_score`: A score from 0.0 to 1.0 (higher means more urgent).
    2.  `suggested_deadline`: A realistic deadline in YYYY-MM-DD format.
    3.  `enhanced_description`: A more detailed, context-aware description for the task.
    4.  `suggested_category`: A relevant category name for the task.

    **Example Response Format (JSON):**
    {{
      "task title 1": {{
        "priority_score": 0.8,
        "suggested_deadline": "2025-08-12",
        "enhanced_description": "Enhanced details based on context.",
        "suggested_category": "Work"
      }},
      "task title 2": {{
        "priority_score": 0.5,
        "suggested_deadline": "2025-08-14",
        "enhanced_description": "More details here.",
        "suggested_category": "Personal"
      }}
    }}

    Please provide the JSON response now.
    """

    try:
        response = model.generate_content(prompt)
        # The response might have ```json ... ``` markers, so we clean it up.
        cleaned_response = response.text.strip().replace("```json", "").replace("```", "").strip()
        ai_data = json.loads(cleaned_response)
        return ai_data
    except Exception as e:
        # Fallback or error logging
        print(f"Gemini API call failed: {e}")
        return {"error": f"Failed to get suggestions from AI: {str(e)}"}