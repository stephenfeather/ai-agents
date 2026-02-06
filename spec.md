# AI Agent Spec Framework

A meta-framework for generating AI agent specifications with defined skillsets.

## Vision

Create reusable patterns to generate specs for various agents - coding, research, data analysis, content creation, customer support, and beyond.

## Spec Components

Every agent spec includes:

1. **Identity** - Name, role, personality
2. **Capabilities** - Actions the agent performs + delegations
3. **Knowledge** - Domain expertise and boundaries
4. **Constraints** - Hard limits and soft preferences
5. **Interaction Style** - Tone, verbosity, initiative, clarification approach
6. **Success Criteria** - Measurable quality targets
7. **Interfaces** - Handoffs, coordination, standalone capability

## Agent Relationships

Agents can operate as:

- **Standalone** - Independent operation
- **Hierarchical** - Coordinator delegates to specialists
- **Peer collaboration** - Agents hand off to each other
- **Composable** - Agents extend other agent specs

## Authoring Methods

1. **Template** - Fill in SPEC-TEMPLATE.md
2. **Interview** - AI asks questions, generates spec
3. **Example-based** - "Like X but for Y"
4. **Composition** - Combine/extend existing specs

## Format

- **Canonical:** Markdown (human-authored)
- **Generated:** YAML, JSON, LLM-specific prompts

## Validation

- Schema validation (required sections)
- Simulation (test scenarios)
- Comparison (benchmark against known-good)
- Human review (rubric/checklist)
- Live testing (real performance)

## Versioning

- Semantic versioning (major.minor.patch)
- Changelog tracking
- Migration support between versions
- A/B variants for testing

## Reference Implementation

See `ai-agent-php/spec.md` for the first fully-specified agent.
