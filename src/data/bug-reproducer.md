# Bug Reproducer

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
LangChain · LangGraph · PostgreSQL · Prisma · BullMQ · Docker