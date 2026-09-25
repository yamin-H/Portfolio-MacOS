# Stack

## AI & Agents
LangGraph · LangChain · RAG pipeline · pgvector
Prompt Engineering · Tool Calling · Guardrails

## Frontend
React.js · Next.js · TypeScript · Tailwind CSS · Zustand

## Backend
Python · FastAPI · Node.js · Express.js · TypeScript
BullMQ · REST APIs · WebSocket · SSE

## Databases
PostgreSQL · Prisma ORM · Redis · Neon · MySQL

## Infrastructure
Docker · Vercel · Render · Turborepo · Git · CI/CD pipeline

## Why this stack

LangGraph over raw LangChain for anything with branching logic —
conditional edges and persistent state are non-negotiable in
production agents.

FastAPI for the inference layer. Node.js for orchestration and
webhooks. They do different jobs and shouldn't be swapped.

BullMQ + Redis for queue. Every agent call that touches an external
API goes through a queue. No exceptions.