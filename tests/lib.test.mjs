import { test } from "node:test";
import assert from "node:assert/strict";
import {
  scrubIdentifiers,
  evidenceFound,
  buildRequest,
  parseResponse,
  validateForm,
  MODEL,
} from "../js/lib.js";
import { SAMPLES } from "../js/samples.js";
import { FEEDBACK_TOOL } from "../js/prompt.js";

test("scrub removes emails, phones, IDs and self-introduced names", () => {
  const { text, removed } = scrubIdentifiers(
    "My name is Ana Lopez. Mi correo es ana.l@school.org, tel 540-555-0199, ID 1234567."
  );
  assert.equal(text, "My name is [name]. Mi correo es [email], tel [phone], ID [id].");
  assert.deepEqual(removed.sort(), ["ID number", "email address", "phone number", "self-introduced name"]);
});

test("scrub keeps ordinary text, years and year ranges", () => {
  const input = "In 2025-2026 my name is very important to me. Salva walked 8 hours.";
  const { text, removed } = scrubIdentifiers(input);
  assert.equal(text, input);
  assert.deepEqual(removed, []);
});

test("scrub handles Spanish self-introductions", () => {
  assert.equal(scrubIdentifiers("Hola, me llamo José.").text, "Hola, me llamo [name].");
});

test("evidence check: exact, case/space-insensitive, ellipsis, and missing", () => {
  const s = "Salva walk very far.  No water, no food.";
  assert.ok(evidenceFound("salva walk very far", s));
  assert.ok(evidenceFound("“Salva walk ... no food”", s));
  assert.ok(!evidenceFound("Salva walked very far", s));
  assert.ok(!evidenceFound("no food ... Salva walk", s), "parts must appear in order");
  assert.ok(!evidenceFound("", s));
});

test("every evidence quote in the demo samples appears in its text", () => {
  for (const s of SAMPLES) {
    const quotes = [...s.feedback.strengths, ...s.feedback.next_steps]
      .map((i) => i.evidence)
      .filter(Boolean);
    for (const q of quotes) assert.ok(evidenceFound(q, s.form.studentText), `${s.id}: "${q}"`);
  }
});

test("demo samples respect the next-step limit for their level", () => {
  for (const s of SAMPLES) {
    const max = s.form.level <= 2 ? 1 : 2;
    assert.ok(s.feedback.next_steps.length <= max, s.id);
  }
});

test("buildRequest forces the feedback tool and includes the student text", () => {
  const form = { ...SAMPLES[0].form, confirmedNoIdentifiers: true };
  const req = buildRequest(form);
  assert.equal(req.model, MODEL);
  assert.deepEqual(req.tool_choice, { type: "tool", name: "give_feedback" });
  assert.equal(req.tools[0].name, FEEDBACK_TOOL.name);
  assert.match(req.messages[0].content, /<student_text>\nSalva walk very far/);
  assert.match(req.messages[0].content, /English plus Spanish/);
});

test("parseResponse returns tool input and rejects malformed replies", () => {
  const good = { content: [{ type: "tool_use", name: "give_feedback", input: SAMPLES[1].feedback }] };
  assert.equal(parseResponse(good).summary_for_teacher, SAMPLES[1].feedback.summary_for_teacher);
  assert.throws(() => parseResponse({ content: [{ type: "text", text: "hi" }] }), /structured feedback/);
  assert.throws(
    () => parseResponse({ content: [{ type: "tool_use", name: "give_feedback", input: {} }] }),
    /missing/
  );
});

test("validateForm lists every missing field", () => {
  assert.equal(validateForm({}).length, 4);
  assert.deepEqual(validateForm({ ...SAMPLES[0].form, confirmedNoIdentifiers: true }), []);
});

test("every sample satisfies the tool schema's required keys", () => {
  for (const s of SAMPLES) {
    for (const key of FEEDBACK_TOOL.input_schema.required) assert.ok(key in s.feedback, `${s.id}: ${key}`);
  }
});
