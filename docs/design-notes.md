# Design notes

## Pedagogical frame

The feedback is organized around the three dimensions of language in the WIDA ELD Standards Framework (2020 Edition):

| Dimension | What the tool looks at |
| --- | --- |
| Discourse | How the whole text is organized, how ideas connect, how much information it carries |
| Sentence | How sentences are built, joined, and varied |
| Word | How precise and appropriate words and phrases are for the topic and purpose |

It also uses the Key Language Use of the task (Narrate, Inform, Explain, Argue), because what counts as a strength depends on purpose: "because" matters more in Explain than in Narrate.

These descriptions are summaries in our own words. The tool does not reproduce WIDA's Proficiency Level Descriptors.

## Feedback principles

1. **Strengths first, with evidence.** Students and teachers trust feedback that points to their own words.
2. **One level up.** The target is what is typical at the next proficiency level. A Level 2 writer is not asked to write like a Level 5 writer.
3. **Fewer, better next steps.** One at levels 1-2, at most two above.
4. **Teach, don't fix.** The tool gives a sentence frame or model; it does not rewrite the student's text.
5. **Home languages are assets.** Mixed-language writing is treated as translanguaging, a resource for the next step.
6. **Teacher in the loop.** Everything is a draft for the teacher. The tool never scores.

## Guardrails against model errors

- **Evidence check:** every quote the model cites is matched against the student text in the browser. Mismatches are flagged.
- **Structured output:** a forced tool call with a JSON schema keeps sections consistent and makes systematic evaluation possible.
- **Stated uncertainty:** the model is asked to list anything the teacher should verify in "Check before sharing".

## Known limitations (v0.1)

- Identifier removal is pattern-based and incomplete; it does not detect most names.
- The model's judgment of what is typical "one level up" has not yet been validated against teacher judgment. That is the purpose of the evaluation plan.
- Home-language messages depend on the model's proficiency in that language and should be checked by a speaker when possible.
