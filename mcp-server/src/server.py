"""
MCP Server for Todo Task Management

Exposes stateless task management tools via the Model Context Protocol.
Each tool accepts explicit user_id parameter for isolation.
"""

import logging
from mcp.server.fastmcp import FastMCP

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("mcp-server")

# Initialize FastMCP server
mcp = FastMCP("todo-mcp-server")

logger.info("MCP Server initialized: todo-mcp-server")


# Import task management tools
from src.tools.create_task import create_task
from src.tools.list_tasks import list_tasks
from src.tools.update_task import update_task
from src.tools.delete_task import delete_task
from src.tools.toggle_task import toggle_task_completion


# Register tools with MCP server using FastMCP decorators
@mcp.tool()
async def create_task_tool(title: str, description: str = "", user_id: str = "") -> dict:
    """Creates a new task for the authenticated user"""
    return await create_task(title, description, user_id)


@mcp.tool()
async def list_tasks_tool(user_id: str = "", status_filter: str = "all") -> dict:
    """Lists tasks for the authenticated user with optional filtering"""
    return await list_tasks(user_id, status_filter)


@mcp.tool()
async def update_task_tool(task_id: str = "", user_id: str = "", updates: dict = None) -> dict:
    """Updates an existing task"""
    return await update_task(task_id, user_id, updates or {})


@mcp.tool()
async def delete_task_tool(task_id: str = "", user_id: str = "") -> dict:
    """Deletes a task"""
    return await delete_task(task_id, user_id)


@mcp.tool()
async def toggle_task_completion_tool(task_id: str = "", user_id: str = "") -> dict:
    """Toggles task completion status"""
    return await toggle_task_completion(task_id, user_id)


logger.info("Registered 5 task management tools")


def main():
    """Run the MCP server with stdio transport"""
    logger.info("Starting MCP Server on stdio transport...")
    mcp.run()


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        logger.info("MCP Server shutting down...")
    except Exception as e:
        logger.error(f"MCP Server error: {e}", exc_info=True)
        raise
