"""
Toggle Task Completion Tool

Stateless MCP tool for toggling task completion status.
"""

from typing import Any, Dict
from src.db_client import get_db_client


async def toggle_task_completion(task_id: str = "", user_id: str = "") -> Dict[str, Any]:
    """
    Toggles task completion status (completed <-> incomplete).

    Args:
        task_id: Task identifier to toggle
        user_id: User identifier (for isolation)

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

    try:
        db_client = get_db_client()
        result = await db_client.toggle_task_completion(user_id, task_id)
        return result
    except Exception as e:
        return {
            "status": "error",
            "error": {
                "code": "TASK_TOGGLE_FAILED",
                "message": f"Failed to toggle task completion: {str(e)}",
                "details": []
            }
        }
