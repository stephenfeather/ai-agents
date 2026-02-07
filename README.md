# AI Agent Spec Framework

A meta-framework for generating AI agent specifications with defined skillsets.

## Overview

This project provides a structured approach to defining AI agents across any domain - software development, research, data analysis, content creation, customer support, and more. There is nothing particularly special about the agents of the framework.  This is my attempt to tune and perfect my agents with care given to tracking the changes.

## Quick Start

1. Copy `SPEC-TEMPLATE.md` to your agent directory
2. Fill in each section (or use interview-driven authoring)
3. Reference `ai-agent-php/spec.md` as an example

## Agent Specs

| Agent | Domain | Role |
|-------|--------|------|
| [PHP Expert](ai-agent-php/spec.md) | software-development | Writes PHP code and provides expert guidance |
| [ECMAScript Expert](ai-agent-ecmascript/spec.md) | software-development | ECMAScript/JavaScript/TypeScript development |
| [Python Expert](ai-agent-python/spec.md) | software-development | Python development |
| [Embedded Python Expert](ai-agent-embedded-python/spec.md) | embedded-systems | CircuitPython and MicroPython microcontroller development |
| [Rust Expert](ai-agent-rust/spec.md) | software-development | Rust development |
| [C/C++ Expert](ai-agent-cpp/spec.md) | systems-programming | Firmware, embedded systems, and systems-level C/C++ |
| [Kotlin Expert](ai-agent-kotlin/spec.md) | mobile-development | Android development with Kotlin and Jetpack Compose |
| [Swift Expert](ai-agent-swift/spec.md) | apple-platforms | iOS, macOS, watchOS, tvOS, visionOS with SwiftUI |
| [WordPress Expert](ai-agent-wordpress/spec.md) | site-management | WordPress site management and administration |
| [WordPress Developer](ai-agent-wordpress-developer/spec.md) | software-development | WordPress themes, plugins, and customizations |
| [WooCommerce Expert](ai-agent-woocommerce/spec.md) | e-commerce | WooCommerce store management and configuration |
| [Docker Expert](ai-agent-docker/spec.md) | containerization | Docker containerization and image optimization |
| [Electronics Expert](ai-agent-electronics/spec.md) | electronics | Hobbyist circuit design and prototyping |
| [Database Expert](ai-agent-database/spec.md) | databases | Database design, queries, and optimization |
| [API Expert](ai-agent-api/spec.md) | software-development | API design, documentation, and integration |
| [Documentation Agent](ai-agent-documentation/spec.md) | technical-writing | Technical and user documentation |
| [Coordinator Agent](ai-agent-coordinator/spec.md) | orchestration | Orchestrates multi-agent workflows and delegates to specialists |

## Project Structure

```
ai-agents/
├── spec.md              # Framework overview
├── SPEC-TEMPLATE.md     # Blank template for new agents
├── ai-agent-php/        # PHP Expert (reference implementation)
├── ai-agent-*/          # Additional agent specifications
└── dist/                # Compiled outputs (generated)
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

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.
