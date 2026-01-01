import pytest
from sqlalchemy import text
from backend.src.database import async_engine, AsyncSessionLocal


@pytest.mark.asyncio
async def test_database_connection():
    """Test that we can connect to the database and execute a simple query."""
    async with AsyncSessionLocal() as session:
        # Execute a simple query to test the connection
        result = await session.execute(text("SELECT 1"))
        assert result.scalar() == 1


@pytest.mark.asyncio
async def test_async_session_creation():
    """Test that the async session is created properly."""
    async with AsyncSessionLocal() as session:
        assert session is not None
        # Test that we can execute a basic operation
        result = await session.execute(text("SELECT 1"))
        assert result is not None