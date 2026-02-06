# AI Agent Spec Framework

A meta-framework for generating AI agent specifications with defined skillsets.

## Overview

This project provides a structured approach to defining AI agents across any domain - software development, research, data analysis, content creation, customer support, and more.

## Quick Start

1. Copy `SPEC-TEMPLATE.md` to your agent directory
2. Fill in each section (or use interview-driven authoring)
3. Reference `ai-agent-php/spec.md` as an example

## Project Structure

```
ai-agents/
├── spec.md              # Framework overview
├── SPEC-TEMPLATE.md     # Blank template for new agents
├── ai-agent-php/        # PHP Expert (reference implementation)
├── ai-agent-python/     # Python Expert (planned)
├── ai-agent-ecmascript/ # ECMAScript Expert (planned)
├── ai-agent-wordpress/  # WordPress Expert (planned)
└── ai-agent-woocommerce/# WooCommerce Expert (planned)
```

## Spec Components

Every agent spec defines:

| Component | Purpose |
|-----------|---------|
| **Identity** | Name, role, personality |
| **Capabilities** | What the agent can do + delegations |
| **Knowledge** | Domain expertise and boundaries |
| **Constraints** | Hard limits and soft preferences |
| **Interaction Style** | Tone, verbosity, initiative |
| **Success Criteria** | Measurable quality targets |
| **Interfaces** | Handoffs and coordination |

## Agent Relationships

Agents can operate as:

- **Standalone** - Independent operation
- **Hierarchical** - Coordinator delegates to specialists
- **Peer collaboration** - Agents hand off to each other
- **Composable** - Agents extend other agent specs

## Authoring Methods

| Method | Description |
|--------|-------------|
| Template | Fill in SPEC-TEMPLATE.md manually |
| Interview | AI asks questions, generates spec |
| Example-based | "Make an agent like X but for Y" |
| Composition | Combine/extend existing specs |

## Format & Portability

- **Canonical format:** Markdown (human-authored)
- **Target systems:** Claude Code, OpenAI, Gemini, other LLMs
- **Generated outputs:** YAML, JSON, LLM-specific prompts

## Validation

Specs can be validated through:

- Schema validation (required sections present)
- Simulation (test scenarios)
- Comparison (benchmark against known-good agents)
- Human review (rubric/checklist)
- Live testing (real performance measurement)

## Versioning

- Semantic versioning (major.minor.patch)
- Changelog tracking per spec
- Migration support between versions
- A/B variants for testing

## Reference Implementation

See [`ai-agent-php/spec.md`](ai-agent-php/spec.md) for a complete example of a fully-specified agent.

## License

[To be determined]
