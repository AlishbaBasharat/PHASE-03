"""
Delete Task Tool

Stateless MCP tool for deleting a task.
"""

from typing import Any, Dict
from src.db_client import get_db_client


async def delete_task(task_id: str = "", user_id: str = "") -> Dict[str, Any]:
    """
    Deletes a task.

    Args:
        task_id: Task identifier to delete
        user_id: User identifier (for isolation)

    Returns:
        API response confirming deletion
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
        result = await db_client.delete_task(user_id, task_id)
        return result
    except Exception as e:
        return {
            "status": "error",
            "error": {
                "code": "TASK_DELETION_FAILED",
                "message": f"Failed to delete task: {str(e)}",
                "details": []
            }
        }
