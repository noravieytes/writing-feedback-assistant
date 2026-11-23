# Next-Step Writing Feedback

Asset-based, teacher-reviewed feedback on writing by multilingual learners, built with Claude.

**Live demo:** https://noravieytes.github.io/writing-feedback-assistant/ (try a sample, no key needed)

A teacher pastes a de-identified piece of student writing, the student's WIDA writing proficiency level, and the Key Language Use of the task. The tool returns:

- what the student **can** do, with exact quotes from the text as evidence
- one or two next steps aimed **one proficiency level up**, not at grade-level perfection
- a concrete teacher move and a sentence frame for each next step
- a short message to the student, at a reading level that matches their proficiency, optionally also in their home language

The teacher reviews and edits everything before a student sees it. The tool never scores writing or assigns a level.

## Why this exists

Feedback for English learners often fails in one of two ways: it lists every error, or it is too general to act on. Teachers of multilingual learners know the fix (start from strengths, pick the next step that matters, give a frame), but doing that well for 25 students takes hours. This tool drafts that feedback in seconds so the teacher's time goes to judgment, not first drafts.

## Design choices

| Choice | Reason |
| --- | --- |
| Organized by the three WIDA dimensions of language (discourse, sentence, word) | Matches how ESOL teachers already plan and talk about language. See [design notes](docs/design-notes.md). |
| One next step at levels 1-2, at most two above | Newcomers need one clear target; more feedback lowers uptake. |
| Every evidence quote is checked against the student text in the browser | Language models can paraphrase or invent quotes. Any quote not found word for word is flagged for the teacher. |
| Home languages treated as resources | Translanguaging is a strength to build from, never marked as an error. |
| Structured output (forced tool call with a JSON schema) | Predictable sections the teacher can scan; easy to evaluate systematically. |
| No server, no storage | Text goes only from the teacher's browser to Anthropic's API. See [privacy](docs/privacy.md). |

## Run it

It is a static site: open `index.html` through any web server, or use the live demo.
To analyze new writing, open "Use your own Claude API key" and paste an [Anthropic API key](https://console.anthropic.com/). The key is kept only for the browser session.

```bash
npm test          # unit tests (Node 20+), no dependencies
```

## Project layout

```
index.html          interface
js/prompt.js        system prompt and output schema (the pedagogical core)
js/lib.js           pure logic: identifier scrubbing, evidence check, request building
js/app.js           browser UI
js/samples.js       synthetic student texts and illustrative feedback for the demo
tests/              unit tests
docs/               privacy, design notes, evaluation plan
```

## Status and evaluation

Version 0.1 is a pilot. The next stage is a teacher review study, described in the [evaluation plan](docs/evaluation-plan.md), before any use with students. Results will be published here.

## How AI was used to build this

The tool was designed by Nora Vieytes (pedagogy, levels, feedback principles, evaluation design) and coded with Claude (Anthropic) as a pair programmer. All code was reviewed, tested, and is covered by the unit tests in `tests/`. Prompt changes are logged in [CHANGELOG.md](CHANGELOG.md).

## Author

**Nora Vieytes** · K-12 ESOL educator and applied researcher · [ORCID 0009-0005-8499-1781](https://orcid.org/0009-0005-8499-1781)

## License

Code: [MIT](LICENSE). Documentation and sample texts: CC BY 4.0.
Not affiliated with or endorsed by WIDA or Anthropic. "WIDA" is a trademark of the Board of Regents of the University of Wisconsin System.
