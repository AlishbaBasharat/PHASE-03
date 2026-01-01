"""
Database Client for MCP Server

Provides HTTP client for calling backend API endpoints.
MCP Server remains stateless - all database operations via backend API.
"""

import os
import httpx
from typing import Dict, Any, Optional


class DatabaseClient:
    """
    HTTP client for backend API communication.

    MCP Server tools use this client to perform database operations
    by calling backend FastAPI endpoints with service authentication.
    """

    def __init__(self):
        self.base_url = os.getenv("BACKEND_API_URL", "http://localhost:8000")
        self.service_token = os.getenv("MCP_SERVICE_TOKEN", "")

        if not self.service_token:
            raise ValueError("MCP_SERVICE_TOKEN environment variable is required")

    def _get_headers(self) -> Dict[str, str]:
        """Get HTTP headers with service authentication"""
        return {
            "Authorization": f"Bearer {self.service_token}",
            "Content-Type": "application/json"
        }

    async def create_task(
        self, user_id: str, title: str, description: str = ""
    ) -> Dict[str, Any]:
        """Create a task via backend API"""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/api/tasks/",
                params={"user_id": user_id},
                json={"title": title, "description": description},
                headers=self._get_headers(),
                timeout=10.0
            )
            response.raise_for_status()
            return response.json()

    async def list_tasks(
        self, user_id: str, status_filter: str = "all"
    ) -> Dict[str, Any]:
        """List tasks via backend API"""
        print(f"📡 [MCP db_client] Requesting tasks for user_id: {user_id}, filter: {status_filter}")
        async with httpx.AsyncClient() as client:
            params = {"user_id": user_id}
            if status_filter != "all":
                params["completed"] = (status_filter == "completed")

            print(f"🔗 [MCP db_client] URL: {self.base_url}/api/tasks/ with params: {params}")
            response = await client.get(
                f"{self.base_url}/api/tasks/",
                params=params,
                headers=self._get_headers(),
                timeout=10.0
            )
            print(f"📥 [MCP db_client] Response Status: {response.status_code}")
            response.raise_for_status()
            return response.json()

    async def update_task(
        self, user_id: str, task_id: str, updates: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Update a task via backend API"""
        async with httpx.AsyncClient() as client:
            response = await client.put(
                f"{self.base_url}/api/tasks/{task_id}",
                params={"user_id": user_id},
                json=updates,
                headers=self._get_headers(),
                timeout=10.0
            )
            response.raise_for_status()
            return response.json()

    async def delete_task(self, user_id: str, task_id: str) -> Dict[str, Any]:
        """Delete a task via backend API"""
        async with httpx.AsyncClient() as client:
            response = await client.delete(
                f"{self.base_url}/api/tasks/{task_id}",
                params={"user_id": user_id},
                headers=self._get_headers(),
                timeout=10.0
            )
            response.raise_for_status()
            return response.json()

    async def toggle_task_completion(
        self, user_id: str, task_id: str
    ) -> Dict[str, Any]:
        """Toggle task completion status via backend API"""
        async with httpx.AsyncClient() as client:
            response = await client.patch(
                f"{self.base_url}/api/tasks/{task_id}/toggle",
                params={"user_id": user_id},
                headers=self._get_headers(),
                timeout=10.0
            )
            response.raise_for_status()
            return response.json()


# Singleton instance
_db_client: Optional[DatabaseClient] = None


def get_db_client() -> DatabaseClient:
    """Get or create singleton database client"""
    global _db_client
    if _db_client is None:
        _db_client = DatabaseClient()
    return _db_client
