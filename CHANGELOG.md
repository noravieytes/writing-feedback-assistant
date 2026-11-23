# Changelog

## 0.1.0 · 2026-11-23

First public pilot version.

- Feedback organized by the WIDA dimensions of language (discourse, sentence, word) and the Key Language Use of the task.
- System prompt v1: asset-based, one level up, one next step at levels 1-2 and at most two above, exact evidence, home languages as resources, no scoring.
- Structured output through a forced tool call with a JSON schema.
- In-browser evidence check: quotes not found verbatim in the student text are flagged.
- Automatic removal of emails, phone numbers, ID numbers, and self-introduced names before sending.
- Demo mode with three synthetic texts and illustrative feedback.
- Unit tests for scrubbing, evidence checks, request building, and response parsing.
