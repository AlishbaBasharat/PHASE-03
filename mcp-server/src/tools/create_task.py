"""
Create Task Tool

Stateless MCP tool for creating a new task.
"""

from typing import Any, Dict
from src.db_client import get_db_client


async def create_task(title: str, description: str = "", user_id: str = "") -> Dict[str, Any]:
    """
    Creates a new task for the authenticated user.

    Args:
        title: Task title
        description: Optional task description
        user_id: User identifier (for isolation)

    Returns:
        API response with created task data
    """
    if not user_id:
        return {
            "status": "error",
            "error": {
                "code": "MISSING_USER_ID",
                "message": "user_id parameter is required",
                "details": []
            }
        }

    if not title or len(title.strip()) == 0:
        return {
            "status": "error",
            "error": {
                "code": "INVALID_TITLE",
                "message": "Task title cannot be empty",
                "details": []
            }
        }

    try:
        db_client = get_db_client()
        result = await db_client.create_task(user_id, title.strip(), description.strip())
        return result
    except Exception as e:
        return {
            "status": "error",
            "error": {
                "code": "TASK_CREATION_FAILED",
                "message": f"Failed to create task: {str(e)}",
                "details": []
            }
        }
