
const API_URL = 'http://127.0.0.1:8000/api';

export const fetchTasks = async () => {
    const response = await fetch(`${API_URL}/tasks/`);
    if (!response.ok) {
        throw new Error('Failed to fetch tasks');
    }
    return response.json();
};

export const addTask = async (task) => {
    const response = await fetch(`${API_URL}/tasks/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
    });
    if (!response.ok) {
        throw new Error('Failed to add task');
    }
    return response.json();
};

export const addContext = async (context) => {
    const response = await fetch(`${API_URL}/contexts/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(context),
    });
    if (!response.ok) {
        throw new Error('Failed to add context');
    }
    return response.json();
};

export const getAiSuggestions = async () => {
    const response = await fetch(`${API_URL}/ai-suggestions/`, {
        method: 'POST',
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get AI suggestions');
    }
    return response.json();
};

export const updateTask = async (id, task) => {
    const response = await fetch(`${API_URL}/tasks/${id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
    });
    if (!response.ok) {
        throw new Error('Failed to update task');
    }
    return response.json();
};

export const deleteTask = async (id) => {
    const response = await fetch(`${API_URL}/tasks/${id}/`, {
        method: 'DELETE',
    });
    if (response.status === 204) {
        return null;
    }
    if (!response.ok) {
        throw new Error('Failed to delete task');
    }
    return response.json();
};
