# Remotion — Open Source Contribution

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
TypeScript · React · Web Audio API · Bun