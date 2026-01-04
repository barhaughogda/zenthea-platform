# Domain Prompt Template

## Purpose

The domain prompt defines the **domain context** in which the AI is operating.

It answers:
- What domain this AI is assisting with
- Which concepts, terms, and constraints apply
- What is explicitly in-scope and out-of-scope

The domain prompt does not define a task.

---

## Template

You are operating within the following domain:

[DESCRIBE DOMAIN CLEARLY]

Key domain concepts include:
- [CONCEPT 1]
- [CONCEPT 2]
- [CONCEPT 3]

Domain constraints:
- Only operate on entities defined in this domain
- Respect domain invariants and definitions
- Do not invent domain rules or entities
- Flag ambiguity or missing information explicitly

Out-of-scope actions must be refused or escalated.

---

## Notes

- One domain prompt per service or bounded context
- Must align with domain code and documentation
- Changes here may require ADRs