export const CONTENT: Record<string, string> = {
  'about.md': `# Yamin Hossain

AI-Native Software Engineer based in Rajshahi, Bangladesh.

I build production LLM agents, LangGraph pipelines, and RAG systems —
end-to-end, with reliability practices that hold up under real load.

Async queuing, exponential backoff, observable multi-agent pipelines.
Not just demos. Shipped products.

Currently open to early-stage remote teams who want someone to own
hard problems from day one.

## Contact
- Email: available on request
- GitHub: github.com/yamin
- LinkedIn: linkedin.com/in/yamin`,

  'stack.md': `# Stack

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
webhooks. They do different jobs and should not be swapped.

BullMQ + Redis for queue. Every agent call that touches an external
API goes through a queue. No exceptions.`,

  'philosophy.md': `# Engineering Philosophy

## Reliability is the feature

A demo that works once is not a product. Every system I build
has exponential backoff, structured logging, and rollback handling
before it ships.

## Agents need observability

A multi-agent pipeline that fails silently is worse than no pipeline.
Every node gets logged. Every decision gets traced. You cannot debug
what you cannot see.

## Queue everything external

If it calls an API, it goes through a queue. Webhooks, LLM calls,
GitHub API — all queued with retry logic. This is the difference
between a system that handles load and one that falls over.

## Build the full thing

I do not hand off. I own the webhook, the inference layer, the
dashboard, and the deployment. End-to-end or not at all.`,

  'pr-review-agent.md': `# PR Review Agent

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
BullMQ · Redis · Docker`,

  'bug-reproducer.md': `# Bug Reproducer

**Type:** Autonomous End-to-End Debugging API Service
**Status:** Live
**Period:** February 2026 – Present

## What it does

Takes a GitHub issue URL. Reproduces the bug. Writes a failing
test. Generates a fix. Opens a PR.

Full debugging cycle. No human intervention.

## The hard part

When a test fails for the wrong reason, most agents retry blindly.
This one parses the error output and rewrites the test using
that context before retrying.

Conditional retry logic that understands why it failed.

## Architecture

7-node LangGraph pipeline with conditional edges
based on test failure type.

## Stack
Next.js · TypeScript · Node.js · Express.js · Python · FastAPI
LangChain · LangGraph · PostgreSQL · Prisma · BullMQ · Docker`,

  'remotion-contribution.md': `# Remotion — Open Source Contribution

**Project:** Remotion (52.6k+ GitHub stars)
**URL:** remotion.dev

## PR #7074 — preserveSilence option

Added preserveSilence option to renderMediaOnWeb(), ensuring
silent head/tail frames are retained in the output file.

Fixes timing misalignment when feeding exports into ASR
transcription pipelines.

Included regression test: a 5s composition always produces
exactly 5s output regardless of silent segments.

## PR #7107 — playbackRate validation

Extended playbackRate validation in @remotion/player from
±4 to ±10 to match modern browser capabilities.

Updated validation logic, API documentation, and unit tests
(18 passing).

## Stack
TypeScript · React · Web Audio API · Bun`,

  'yamin_resume.pdf': `# Yamin Hossain

**Role:** AI-Native Software Engineer
**Location:** Rajshahi, Bangladesh

## Summary

Specializing in production LLM agents, LangGraph pipelines, and RAG systems.
Ships complete products end-to-end with production reliability practices —
async queuing, exponential backoff, and observable multi-agent pipelines.

## Projects

### PR Review Agent
- GitHub App (Marketplace-installable)
- 6-node LangGraph pipeline with chunked diff processing
- pgvector cosine similarity search across 384-dimensional embeddings
- Webhook → BullMQ/Redis → FastAPI → pgvector → Next.js dashboard
- **Stack:** Next.js · TypeScript · Python · FastAPI · LangGraph · pgvector · PostgreSQL · BullMQ · Redis · Docker

### Bug Reproducer
- Autonomous end-to-end debugging service
- 7-node LangGraph pipeline with conditional retry logic
- Parses test failure output to rewrite tests before retrying
- **Stack:** Next.js · TypeScript · Python · FastAPI · LangGraph · PostgreSQL · BullMQ · Docker

### Remotion Contributions
- PR #7074: preserveSilence option for renderMediaOnWeb()
- PR #7107: playbackRate validation extended from ±4 to ±10
- **Stack:** TypeScript · React · Web Audio API · Bun

## Skills

- **AI & Agents:** LangGraph · LangChain · RAG pipeline · pgvector · Prompt Engineering
- **Frontend:** React.js · Next.js · TypeScript · Tailwind CSS · Zustand
- **Backend:** Python · FastAPI · Node.js · Express.js · BullMQ · WebSocket
- **Databases:** PostgreSQL · Prisma ORM · Redis · Neon · MySQL
- **Infrastructure:** Docker · Vercel · Render · Turborepo · CI/CD

## Education
Varendra University — B.Eng Electrical and Electronic Engineering (Oct 2022 – Mar 2026)`,
}
