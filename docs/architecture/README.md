# Architecture Decision Records (ADRs)

## Overview

This directory contains Architecture Decision Records (ADRs) for utm.one, documenting significant architectural decisions, their context, rationale, and consequences. ADRs serve as living documentation for the engineering team and provide historical context for future decisions.

---

## What is an ADR?

An Architecture Decision Record (ADR) captures:
- **Context**: What problem are we solving? What constraints exist?
- **Decision**: What solution did we choose?
- **Rationale**: Why this solution over alternatives?
- **Consequences**: What are the trade-offs and impacts?
- **Implementation**: How is this implemented in practice?

ADRs are **immutable once accepted**. If a decision changes, create a new ADR that supersedes the old one.

---

## Index of ADRs

| ADR | Title | Status | Date | Summary |
|-----|-------|--------|------|---------|
| [ADR-001](./ADR-001-performance-first-architecture.md) | Performance-First Architecture for Enterprise URL Shortening | ✅ Accepted | 2025-11-22 | Core architectural patterns for achieving sub-100ms redirect latency at scale: caching, async processing, batch writes, database optimization, feature flags, and rate limiting. Achieved 80% latency reduction and 100x write reduction. |
| [ADR-002](./ADR-002-caching-strategy.md) | Deno KV Caching for Link Lookups | ✅ Accepted | 2025-11-22 | Deno KV-based caching layer for link lookups with 5-minute TTL. Achieved 85-90% cache hit rate, 80% latency reduction, and $270/month cost savings at scale. Explicit cache invalidation on link updates. |
| [ADR-003](./ADR-003-batch-processing-system.md) | Deno KV Queue for Click Event Batching | ✅ Accepted | 2025-11-22 | Batch processing system using Deno KV queue to aggregate click events every 5 seconds. Achieved 100x write reduction, 97% fewer database connections, and $297/month cost savings. Graceful fallback to direct writes on queue failure. |
| [ADR-004](./ADR-004-feature-flags-runtime-control.md) | Database-Backed Feature Flags for Runtime Control | ✅ Accepted | 2025-11-22 | Feature flag system with Postgres storage and Deno KV caching for runtime control of expensive features. Enables instant toggles (60s propagation) via admin dashboard without redeployment. Used for geolocation, A/B testing, maintenance mode. |
| [ADR-005](./ADR-005-testing-discipline.md) | k6 Load Testing Standards and CI/CD Integration | ✅ Accepted | 2025-11-22 | Comprehensive k6 load testing suite with GitHub Actions CI/CD integration. PR smoke tests (2 min), main branch full tests (40 min), production smoke tests (3 min), and weekly comprehensive tests. Automated regression detection with 10% threshold. |

---

## ADR Lifecycle

### Statuses

- **🚧 Proposed**: Under discussion, not yet implemented
- **✅ Accepted**: Decision approved and implemented
- **❌ Rejected**: Considered but not chosen (document rationale)
- **⚠️ Deprecated**: Superseded by newer ADR
- **🔄 Amended**: Modified (create new ADR referencing original)

### Review Schedule

All ADRs are reviewed **quarterly** to ensure accuracy and relevance:
- **March 2026**: Q1 review
- **June 2026**: Q2 review
- **September 2026**: Q3 review
- **December 2026**: Q4 review

Updates should be made as new ADRs, not by editing existing ones (except for minor corrections).

---

## When to Write an ADR

Create an ADR when making decisions about:

✅ **Architecture & Infrastructure**
- Major architectural patterns (caching, batching, queuing)
- Database design decisions (indexes, materialized views, RLS)
- Infrastructure choices (hosting, edge functions, storage)
- Scaling strategies (read replicas, connection pooling)

✅ **Performance & Reliability**
- SLA targets and enforcement mechanisms
- Performance optimization strategies
- Feature flags and runtime control
- Graceful degradation patterns

✅ **Testing & Quality**
- Load testing standards
- CI/CD integration strategies
- Regression detection thresholds

✅ **Security & Compliance**
- Authentication and authorization patterns
- Data privacy decisions
- Audit logging requirements

❌ **When NOT to Write an ADR**
- Minor bug fixes
- UI/UX changes (unless architectural impact)
- Routine dependency updates
- Code refactoring (unless pattern-changing)

---

## How to Write an ADR

### 1. Use the Template

Copy this template to create a new ADR:

```markdown
# ADR-XXX: [Title]

## Metadata
- **ADR Number**: XXX
- **Title**: [Descriptive Title]
- **Status**: 🚧 Proposed / ✅ Accepted / ❌ Rejected
- **Date**: YYYY-MM-DD
- **Authors**: [Names]
- **Supersedes**: [ADR-XXX] (if applicable)
- **Related**: [ADR-YYY], [ADR-ZZZ]

---

## Context
[Describe the problem, constraints, and requirements]

---

## Decision
[State the decision clearly and concisely]

---

## Rationale
[Explain why this decision over alternatives]

---

## Consequences
[List positive outcomes, negative trade-offs, and risks]

---

## Implementation
[Provide code examples, file locations, and implementation details]

---

## Alternatives Considered
[Document options that were evaluated but not chosen]

---

## Future Enhancements
[Optional: List potential future improvements]

---

## Related ADRs
[Link to related decisions]

---

## References
[Link to code, documentation, and external resources]

---

**Last Updated**: YYYY-MM-DD
**Next Review**: YYYY-MM-DD (quarterly)
**Status**: [Current status]
```

### 2. Numbering Convention

- Use sequential numbering: `ADR-001`, `ADR-002`, etc.
- Prefix with zeros for sorting: `ADR-001` not `ADR-1`
- Do not reuse numbers from rejected or deprecated ADRs

### 3. Filename Convention

```
ADR-[number]-[slug].md
```

**Examples**:
- `ADR-001-performance-first-architecture.md`
- `ADR-002-caching-strategy.md`
- `ADR-003-batch-processing-system.md`

### 4. Review Process

1. **Draft**: Author creates ADR in `🚧 Proposed` status
2. **Discussion**: Team reviews and provides feedback
3. **Decision**: Team votes to accept, reject, or amend
4. **Acceptance**: ADR status updated to ✅ Accepted
5. **Implementation**: Code changes reflect ADR decision
6. **Publication**: ADR merged to main branch

---

## Cross-Referencing ADRs

ADRs should reference related decisions:

```markdown
## Related ADRs
- [ADR-001: Performance-First Architecture](./ADR-001-performance-first-architecture.md)
- [ADR-002: Caching Strategy](./ADR-002-caching-strategy.md)
```

### Relationship Types

- **Supersedes**: New ADR replaces old decision
- **Related**: Complementary or adjacent decisions
- **Depends On**: Decision requires prior ADR
- **Conflicts With**: Identifies contradictions (should be resolved)

---

## Updating Existing ADRs

ADRs are **immutable** once accepted. To change a decision:

### Minor Corrections
- Fix typos, broken links, or clarify wording
- Mark as "Last Updated" with date
- No new ADR needed

### Major Changes
1. Create new ADR with:
   - Title: "Amending ADR-XXX: [Original Title]"
   - Supersedes: [ADR-XXX]
2. Explain why original decision changed
3. Document new decision and rationale
4. Update original ADR status to ⚠️ Deprecated

**Example**:
```markdown
# ADR-006: Amending ADR-002: Redis Caching for Link Lookups

## Metadata
- **ADR Number**: 006
- **Title**: Amending ADR-002: Redis Caching for Link Lookups
- **Status**: ✅ Accepted
- **Supersedes**: [ADR-002: Caching Strategy](./ADR-002-caching-strategy.md)

## Context
ADR-002 selected Deno KV for caching, but at 10M users scale, we exceeded Deno KV throughput limits (1000 ops/sec). Redis provides 10k+ ops/sec needed for growth.

## Decision
Migrate from Deno KV to Redis for link lookup caching...
```

---

## Best Practices

### Writing Style

✅ **DO**:
- Use clear, concise language
- Provide concrete examples and code snippets
- Quantify performance impacts (latency, cost, reduction factors)
- Include diagrams for complex architecture
- Link to actual code implementations
- Document monitoring and observability

❌ **DON'T**:
- Write novels (aim for 500-1000 lines per ADR)
- Use jargon without explanation
- Make decisions without alternatives analysis
- Skip consequences (trade-offs are critical)
- Forget to update when superseded

### Code References

Always link to implementation:

```markdown
**Code Reference**: `supabase/functions/redirect/index.ts`
**Database Schema**: See migration `20250101_create_feature_flags.sql`
**Test Suite**: `load-tests/redirect-performance.js`
```

### Metrics & Validation

Include quantifiable success criteria:

```markdown
**Performance Impact**:
- Before: 300-600ms p95 latency
- After: 50-80ms p95 latency
- Reduction: 80% ✅ (target: 70%)
```

---

## Decision Making Process

### 1. Problem Identification
- Describe current state and pain points
- Quantify impact (latency, cost, error rate)
- Define requirements and constraints

### 2. Solution Exploration
- Research alternatives (3-5 options minimum)
- Evaluate against criteria (performance, cost, complexity)
- Create comparison matrix

### 3. Prototyping
- Spike most promising solutions
- Measure actual performance impact
- Validate assumptions with data

### 4. Decision
- Present findings to team
- Vote or achieve consensus
- Document chosen solution in ADR

### 5. Implementation
- Code changes reflect ADR
- Add monitoring and observability
- Validate with load testing

### 6. Review
- Quarterly review of all ADRs
- Update with lessons learned
- Create amendment ADRs if decision changes

---

## Tools & Resources

### Markdown Editors
- **VS Code**: Built-in Markdown preview
- **Obsidian**: Graph view for ADR relationships
- **Typora**: Clean WYSIWYG Markdown editor

### Diagram Tools
- **Mermaid**: Text-based diagrams (embed in Markdown)
- **Excalidraw**: Hand-drawn style diagrams
- **draw.io**: Traditional flowcharts

### Version Control
- **Git**: All ADRs version controlled in `/docs/architecture/`
- **GitHub**: Review ADRs via Pull Requests
- **GitHub Issues**: Discuss proposed ADRs

---

## Contact & Questions

**Questions about ADRs?**
- **Slack**: #engineering channel
- **Email**: engineering@utm.one
- **GitHub**: Open issue with `documentation` label

**Suggesting a New ADR?**
1. Create draft ADR in feature branch
2. Open Pull Request with `ADR` label
3. Request review from engineering team
4. Discuss in next engineering meeting

---

## Appendix: Full ADR List

### Performance & Scalability (5 ADRs)
1. [ADR-001: Performance-First Architecture](./ADR-001-performance-first-architecture.md) - Core patterns
2. [ADR-002: Caching Strategy](./ADR-002-caching-strategy.md) - Link lookup caching
3. [ADR-003: Batch Processing System](./ADR-003-batch-processing-system.md) - Click event batching
4. [ADR-004: Feature Flags Runtime Control](./ADR-004-feature-flags-runtime-control.md) - Runtime toggles
5. [ADR-005: Testing Discipline](./ADR-005-testing-discipline.md) - Load testing standards

### Database & Storage (0 ADRs)
*No ADRs yet - add here as database decisions are made*

### Security & Compliance (0 ADRs)
*No ADRs yet - add here as security decisions are made*

### Integrations & External Services (0 ADRs)
*No ADRs yet - add here as integration decisions are made*

---

**Last Updated**: 2025-11-22  
**Next Review**: 2026-02-22 (quarterly)
