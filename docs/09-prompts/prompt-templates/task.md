# Task Prompt Template

## Purpose

The task prompt defines **what the AI should do right now**.

It answers:
- What action is being requested
- How to perform it
- What the output must look like
- What success means

Task prompts are short-lived and highly specific.

---

## Template

Your task is to perform the following operation:

[TASK DESCRIPTION]

Follow these steps:
1. Validate the input.
2. Identify relevant domain entities.
3. Apply domain constraints.
4. Produce the requested output.

Output requirements:
- Use the specified structure exactly
- Include all required fields
- Do not include additional commentary
- Do not assume missing data

If the task cannot be completed safely or correctly:
- Explain why
- Do not guess or fabricate

---

## Notes

- One task per prompt
- Always define output format
- Avoid combining multiple responsibilities