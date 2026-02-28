# E2E Scenario Specifications

This directory contains Markdown-based end-to-end test scenarios executed by the Playwright Healer Agent.

## Structure

```
specs/
  e2e/        # Executable test scenarios (*.e2e.md)
  config/     # Agent configuration (prompts)
  README.md   # This document
```

## Scenario Files

* Location: `specs/e2e/`
* Format: Markdown (`*.e2e.md`)
* Purpose: Describe user flows in natural language
* Each file should represent a single independent scenario

Scenarios must be deterministic and runnable in isolation.

## Agent Configuration

* Prompt file: `specs/config/healer.prompt.md`
* Defines project-specific execution rules for the Playwright Healer Agent
* Shared across all scenarios

## Running Scenarios Locally

Run a single scenario:

```
pnpm agent:healer -- --spec=specs/e2e/<file>.e2e.md
```

Run all scenarios:

```
pnpm agent:healer -- --spec=specs/e2e
```

## Authoring Guidelines

* Use clear, step-by-step instructions
* Describe actions and expected outcomes
* Avoid ambiguous language
* Prefer user-visible behavior over implementation details
* Do not reference internal DOM structure

## Conventions

* Base URL is configured in the agent prompt
* Navigation should use relative paths
* Scenarios should not depend on execution order
* Do not include credentials or secrets in specs

## CI Usage

The same commands are used in CI to ensure consistent behavior between local development and automated pipelines.

---

For agent behavior customization, edit the prompt file in `specs/config/`.
