"""
Update Task Tool

Stateless MCP tool for updating an existing task.
"""

from typing import Any, Dict
from src.db_client import get_db_client


async def update_task(task_id: str = "", user_id: str = "", updates: Dict[str, Any] = None) -> Dict[str, Any]:
    """
    Updates an existing task.

    Args:
        task_id: Task identifier to update
        user_id: User identifier (for isolation)
        updates: Dictionary of fields to update (title, description, completed)

    Returns:
        API response with updated task data
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

    if not task_id:
        return {
            "status": "error",
            "error": {
                "code": "MISSING_TASK_ID",
                "message": "task_id parameter is required",
                "details": []
            }
        }

    if not updates or len(updates) == 0:
        return {
            "status": "error",
            "error": {
                "code": "MISSING_UPDATES",
                "message": "updates parameter is required and must contain at least one field",
                "details": []
            }
        }

    try:
        db_client = get_db_client()
        result = await db_client.update_task(user_id, task_id, updates)
        return result
    except Exception as e:
        return {
            "status": "error",
            "error": {
                "code": "TASK_UPDATE_FAILED",
                "message": f"Failed to update task: {str(e)}",
                "details": []
            }
        }
