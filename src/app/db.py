"""
db.py — asyncpg connection pool, shared across the FastAPI app.
Raw SQL (no ORM) on purpose: 01_schema.sql already defines every table/
constraint, and duplicating that as ORM models is extra surface area
that can drift out of sync. FastAPI's job here is validation + insertion,
not schema ownership.
"""
import os
import asyncpg

DATABASE_URL = os.environ.get(
    "DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/amg_sync"
)

pool: asyncpg.Pool | None = None

async def connect():
    global pool
    pool = await asyncpg.create_pool(DATABASE_URL, min_size=1, max_size=10)

async def disconnect():
    if pool:
        await pool.close()

def get_pool() -> asyncpg.Pool:
    if pool is None:
        raise RuntimeError("DB pool not initialized — call connect() on startup")
    return pool