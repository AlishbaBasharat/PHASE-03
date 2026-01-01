"""
List Tasks Tool

Stateless MCP tool for listing tasks with optional filtering.
"""

from typing import Any, Dict
from src.db_client import get_db_client


async def list_tasks(user_id: str = "", status_filter: str = "all") -> Dict[str, Any]:
    """
    Lists tasks for the authenticated user with optional filtering.

    Args:
        user_id: User identifier (for isolation)
        status_filter: Filter by status ('all', 'completed', 'incomplete')

    Returns:
        API response with task list
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

    valid_filters = ["all", "completed", "incomplete"]
    if status_filter not in valid_filters:
        return {
            "status": "error",
            "error": {
                "code": "INVALID_FILTER",
                "message": f"status_filter must be one of: {', '.join(valid_filters)}",
                "details": []
            }
        }

    try:
        db_client = get_db_client()
        result = await db_client.list_tasks(user_id, status_filter)

        # Ensure result is wrapped in a consistent format
        if isinstance(result, list):
            return {
                "status": "success",
                "tasks": result,
                "count": len(result)
            }
        return result
    except Exception as e:
        return {
            "status": "error",
            "error": {
                "code": "TASK_LIST_FAILED",
                "message": f"Failed to list tasks: {str(e)}",
                "details": []
            }
        }
