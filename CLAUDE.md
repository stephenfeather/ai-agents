# AI Agent Spec Framework

## Purpose

This project defines a meta-framework for generating AI agent specifications. The goal is reusable patterns that work across domains (coding, research, data analysis, content creation, customer support, etc.) and LLM systems (Claude, OpenAI, Gemini).

## Creating Agent Specs

### Preferred: Interview-Driven

When creating a new agent spec, conduct a structured interview covering each section:

1. **Identity** - Name, role (one sentence), personality (tone, attitude, communication style)
2. **Capabilities** - What the agent does directly vs. delegates to specialists
3. **Knowledge** - In-scope expertise, out-of-scope (delegate)
4. **Constraints** - Hard (never violate) and soft (prefer to avoid)
5. **Interaction Style** - Tone, verbosity, initiative, clarification approach
6. **Success Criteria** - Measurable metrics with tools/methods
7. **Interfaces** - Standalone capability, handoff relationships

Ask focused questions for each section. Let the user define boundaries rather than assuming.

### Alternative: Template

Copy `SPEC-TEMPLATE.md` and fill in sections manually.

### Alternative: Example-Based

"Create an agent like PHP Expert but for [domain]" - adapt the reference implementation.

## Spec Conventions

### Format
- Canonical format: Markdown
- Generated outputs: YAML, JSON, LLM-specific prompts (not yet implemented)

### Output Directory
- Compiled specs are placed in `dist/`
- Source specs remain in their `ai-agent-*/` directories

### Versioning
- Use semantic versioning (major.minor.patch)
- Update version in header AND version history table
- Log changes in version history

### Minimum Viable Spec
- Start with Identity + one Capability
- Expand iteratively through interview or editing

## Agent Relationships

Specs should define how agents collaborate:

- **Standalone** - Can operate independently
- **Hierarchical** - Reports to coordinator, delegates to specialists
- **Peer** - Hands off to other agents at same level
- **Composable** - Extends another agent spec

Always document in the Interfaces section.

## Delegation Philosophy

Prefer specialist agents over broad generalists:

- Database queries → Database Expert (not PHP Expert)
- API design → API Agent (not language experts)
- Documentation → Documentation Agent
- Framework-specific → Framework Specialists (WordPress, Laravel, etc.)

This keeps agents focused and composable.

## Reference Implementation

See `ai-agent-php/spec.md` for the complete example:

- 10 core capabilities + 7 delegations
- 15 hard constraints, 7 soft constraints
- PHPStan v2 MAX, PHPUnit v13 via ParaTest, opengrep
- Vanilla PHP 7.4+ focus (frameworks delegated to specialists)

## Task Tracking

Use GitHub Issues for all task and to-do tracking:

- **New features** → Create issue before starting work
- **Bugs/fixes** → Create issue to document the problem
- **Agent specs** → Create issue when planning a new agent

Reference issues in commits when applicable.

Do NOT use local task lists, todo.md files, or in-memory task tracking.

### Issue Lifecycle

Update labels and status as work progresses:

| Stage | Action |
|-------|--------|
| **Created** | Add appropriate labels (`agent-spec`, `tooling`, `needs-interview`, etc.) |
| **Starting work** | Remove `needs-interview` if interview begins; add comment noting work started |
| **In progress** | Add comments with progress updates, decisions made |
| **Ready for review** | Add `review` label if applicable |
| **Completed** | Close issue with summary comment; reference closing commit |
| **Blocked** | Add `blocked` label and comment explaining blocker |

### Labels

| Label | Purpose |
|-------|---------|
| `agent-spec` | New agent specification |
| `tooling` | Build tools and automation |
| `needs-interview` | Requires interview to complete spec |
| `enhancement` | New feature or improvement |
| `bug` | Something isn't working |
| `blocked` | Work cannot proceed (document reason) |

### Commits

Reference issues in commit messages:
```
Add Python Expert spec

Closes #1
```

## Quality Standards

When reviewing or validating specs:

- All 7 sections present and filled
- Hard constraints are truly non-negotiable
- Soft constraints have rationale
- Knowledge boundaries clearly define delegation
- Success criteria are measurable
- Interfaces document all handoff relationships
