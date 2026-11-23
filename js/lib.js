// Pure helpers shared by the browser app and the test suite.
// No DOM access here, so every function can be tested with `node --test`.

import { SYSTEM_PROMPT, FEEDBACK_TOOL } from "./prompt.js";

export const API_URL = "https://api.anthropic.com/v1/messages";
export const MODEL = "claude-sonnet-5-5";

export const LEVELS = {
  1: "Entering",
  2: "Emerging",
  3: "Developing",
  4: "Expanding",
  5: "Bridging",
  6: "Reaching",
};

export const LANGUAGE_USES = ["Narrate", "Inform", "Explain", "Argue"];

/**
 * Remove common direct identifiers before any text leaves the browser.
 * This is a safety net, not a guarantee: teachers are still asked to
 * remove names themselves (see docs/privacy.md).
 * Returns the cleaned text and a list of what was removed.
 */
export function scrubIdentifiers(text) {
  const removed = [];
  const rules = [
    { label: "email address", re: /[\w.+-]+@[\w-]+(\.[\w-]+)+/g, sub: () => "[email]" },
    {
      label: "phone number",
      re: /\+?\d[\d\s().-]{7,}\d/g,
      // Only treat it as a phone number if it has 10+ digits (keeps "2025-2026").
      sub: (m) => (m.replace(/\D/g, "").length >= 10 ? "[phone]" : null),
    },
    { label: "ID number", re: /\b\d{5,}\b/g, sub: () => "[id]" },
    {
      label: "self-introduced name",
      // No `i` flag on purpose: with it, \p{Lu} would also match lowercase words.
      re: /\b([Mm]y name is|[Mm]e llamo|[Mm]i nombre es)\s+(\p{Lu}[\p{L}'-]+(?:\s+\p{Lu}[\p{L}'-]+)?)/gu,
      sub: (_m, intro) => `${intro} [name]`,
    },
  ];
  let out = text;
  for (const { label, re, sub } of rules) {
    out = out.replace(re, (...args) => {
      const replacement = sub(...args);
      if (replacement === null) return args[0];
      removed.push(label);
      return replacement;
    });
  }
  return { text: out, removed };
}

/** Normalize whitespace and quote marks so evidence checks are fair. */
export function normalize(s) {
  return s
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

/**
 * Check that a quote the model cites as evidence really appears in the
 * student's text. Ellipses ("...") split a quote into parts that must all
 * appear in order. This keeps the feedback honest: the teacher sees a
 * warning on any evidence the model may have paraphrased or invented.
 */
export function evidenceFound(quote, studentText) {
  if (!quote) return false;
  const hay = normalize(studentText);
  const parts = normalize(quote)
    .replace(/^["']|["']$/g, "")
    .split(/\s*(?:\.\.\.|…)\s*/)
    .filter(Boolean);
  let from = 0;
  for (const part of parts) {
    const at = hay.indexOf(part, from);
    if (at === -1) return false;
    from = at + part.length;
  }
  return parts.length > 0;
}

/** Build the user turn sent to the model from the teacher's form. */
export function buildUserMessage(f) {
  const lines = [
    `Grade cluster: ${f.gradeCluster}`,
    `Student's current WIDA writing proficiency level (teacher-reported): ${f.level} (${LEVELS[f.level]})`,
    `Key Language Use of the task: ${f.languageUse}`,
    `Teacher's focus: ${f.focus || "Let the assistant choose the most useful dimension"}`,
    `Student feedback language: ${f.homeLanguage ? `English plus ${f.homeLanguage}` : "English only"}`,
  ];
  if (f.taskPrompt) lines.push(`Writing task given to the student:\n${f.taskPrompt}`);
  if (f.teacherNotes) lines.push(`Teacher notes:\n${f.teacherNotes}`);
  lines.push(`Student writing (identifiers removed):\n<student_text>\n${f.studentText}\n</student_text>`);
  return lines.join("\n\n");
}

/** Full request body for the Messages API. */
export function buildRequest(form) {
  return {
    model: MODEL,
    max_tokens: 2000,
    system: SYSTEM_PROMPT,
    tools: [FEEDBACK_TOOL],
    tool_choice: { type: "tool", name: FEEDBACK_TOOL.name },
    messages: [{ role: "user", content: buildUserMessage(form) }],
  };
}

/** Extract the structured feedback from an API response. */
export function parseResponse(json) {
  const block = (json.content || []).find(
    (b) => b.type === "tool_use" && b.name === FEEDBACK_TOOL.name
  );
  if (!block) throw new Error("The model did not return structured feedback. Please try again.");
  const fb = block.input;
  for (const key of ["summary_for_teacher", "strengths", "next_steps", "student_feedback_english"]) {
    if (!(key in fb)) throw new Error(`Feedback is missing "${key}". Please try again.`);
  }
  return fb;
}

/** Validate the teacher form; returns a list of problems (empty = OK). */
export function validateForm(f) {
  const problems = [];
  if (!f.studentText || f.studentText.trim().length < 3) problems.push("Paste the student's writing.");
  if (!LEVELS[f.level]) problems.push("Choose the student's WIDA writing level.");
  if (!LANGUAGE_USES.includes(f.languageUse)) problems.push("Choose the Key Language Use of the task.");
  if (!f.confirmedNoIdentifiers) problems.push("Confirm that names and identifiers are removed.");
  return problems;
}
