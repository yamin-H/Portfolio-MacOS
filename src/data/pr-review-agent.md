# PR Review Agent

**Type:** GitHub App (Marketplace-installable)
**Status:** Live
**Period:** June 2026 – Present

## What it does

Ingests 6 months of merged PR history and posts inline review
comments that reference specific past team decisions — not
generic rules. Team knowledge becomes searchable and persistent.

Instead of "this function is too long", it says:
"your team rejected this pattern in PR #234"

## Architecture

Webhook → Node.js orchestrator → BullMQ/Redis queue
→ Python FastAPI agent → pgvector → Next.js dashboard

## Technical depth

- 6-node LangGraph pipeline
- Chunked diff processing
- pgvector cosine similarity search
- 384-dimensional embeddings
- Exponential backoff on all external calls
- Rollback handling
- Structured logging for incident traceability

## Stack
Next.js · TypeScript · Node.js · Express.js · Python · FastAPI
LangGraph · LangChain · pgvector · PostgreSQL · Prisma
BullMQ · Redis · Docker