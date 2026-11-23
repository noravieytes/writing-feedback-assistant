import {
  API_URL,
  scrubIdentifiers,
  evidenceFound,
  buildRequest,
  parseResponse,
  validateForm,
} from "./lib.js";
import { SAMPLES } from "./samples.js";

const form = document.getElementById("feedback-form");
const results = document.getElementById("results");
const errors = document.getElementById("form-errors");
const submitBtn = document.getElementById("submit-btn");
const KEY_STORE = "wfa-api-key";

// ---------- small DOM helper (no innerHTML with user or model text) ----------
function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") node.className = v;
    else if (k.startsWith("on")) node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v);
  }
  for (const c of children.flat()) {
    if (c === null || c === undefined || c === false) continue;
    node.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return node;
}

// ---------- form <-> data ----------
function readForm() {
  const d = new FormData(form);
  return {
    gradeCluster: d.get("gradeCluster"),
    level: Number(d.get("level")) || 0,
    languageUse: d.get("languageUse"),
    focus: d.get("focus"),
    taskPrompt: d.get("taskPrompt").trim(),
    studentText: d.get("studentText"),
    homeLanguage: d.get("homeLanguage").trim(),
    teacherNotes: d.get("teacherNotes").trim(),
    confirmedNoIdentifiers: d.get("confirmedNoIdentifiers") === "on",
    apiKey: d.get("apiKey").trim(),
  };
}

function fillForm(values) {
  for (const [k, v] of Object.entries(values)) {
    const field = form.elements[k];
    if (field) field.value = v;
  }
  form.elements.confirmedNoIdentifiers.checked = true;
}

function showErrors(list) {
  errors.hidden = list.length === 0;
  errors.textContent = list.join(" ");
}

// ---------- rendering ----------
function evidenceLine(quote, studentText) {
  if (!quote) return null;
  const found = evidenceFound(quote, studentText);
  return el(
    "p",
    {},
    el("span", { class: "quote" }, `“${quote}”`),
    " ",
    found
      ? el("span", { class: "check-ok", title: "This quote appears in the student's text." }, "✓ found in text")
      : el("span", { class: "check-warn", title: "Not found word for word. Check before sharing." }, "⚠ not found verbatim, check")
  );
}

function copyButton(textarea) {
  return el(
    "button",
    {
      type: "button",
      class: "secondary",
      onclick: async (e) => {
        try {
          await navigator.clipboard.writeText(textarea.value);
          e.target.textContent = "Copied";
        } catch {
          textarea.select();
          e.target.textContent = "Press Ctrl+C";
        }
        setTimeout(() => (e.target.textContent = "Copy"), 1800);
      },
    },
    "Copy"
  );
}

function studentMessage(title, text) {
  const area = el("textarea", { "aria-label": title, rows: "4" });
  area.value = text;
  return el("div", { class: "student-msg" }, el("div", { class: "row" }, el("p", { class: "label" }, title), copyButton(area)), area);
}

function render(fb, studentText, { illustrative = false, removed = [] } = {}) {
  const parts = [
    illustrative &&
      el("span", { class: "badge" }, "Illustrative example · written to show the output format"),
    removed.length > 0 &&
      el("p", { class: "info" }, `Removed before sending: ${[...new Set(removed)].join(", ")}.`),

    el("h3", {}, "Summary"),
    el("p", { class: "summary" }, fb.summary_for_teacher),

    el("h3", {}, "Strengths"),
    fb.strengths.map((s) =>
      el(
        "div",
        { class: "card", "data-dim": s.dimension },
        el("span", { class: "dim" }, s.dimension),
        evidenceLine(s.evidence, studentText),
        el("p", {}, s.why_it_matters)
      )
    ),

    el("h3", {}, fb.next_steps.length === 1 ? "Next step" : "Next steps"),
    fb.next_steps.map((n) =>
      el(
        "div",
        { class: "card", "data-dim": n.dimension },
        el("span", { class: "dim" }, n.dimension),
        el("p", {}, el("span", { class: "label" }, "Goal: "), n.target),
        evidenceLine(n.evidence, studentText),
        el("p", {}, el("span", { class: "label" }, "Teacher move: "), n.teacher_move),
        el("p", {}, el("span", { class: "label" }, "Frame: "), el("span", { class: "frame" }, n.sentence_frame))
      )
    ),

    fb.word_bank?.length > 0 && el("h3", {}, "Word bank"),
    fb.word_bank?.length > 0 && el("ul", { class: "chips" }, fb.word_bank.map((w) => el("li", {}, w))),

    el("h3", {}, "Message to the student (edit before sharing)"),
    studentMessage("English", fb.student_feedback_english),
    fb.student_feedback_home_language &&
      studentMessage(form.elements.homeLanguage.value || "Home language", fb.student_feedback_home_language),

    fb.cautions?.length > 0 && el("h3", {}, "Check before sharing"),
    fb.cautions?.length > 0 && el("ul", { class: "cautions" }, fb.cautions.map((c) => el("li", {}, c))),
  ];
  results.replaceChildren(...parts.flat().filter((p) => p instanceof Node));
  results.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ---------- samples ----------
const sampleButtons = document.getElementById("sample-buttons");
for (const s of SAMPLES) {
  sampleButtons.append(
    el(
      "button",
      {
        type: "button",
        onclick: () => {
          fillForm(s.form);
          showErrors([]);
          render(s.feedback, s.form.studentText, { illustrative: true });
        },
      },
      s.label
    )
  );
}

// ---------- API key (session only) ----------
try {
  const saved = sessionStorage.getItem(KEY_STORE);
  if (saved) form.elements.apiKey.value = saved;
} catch { /* storage unavailable: key is simply not remembered */ }

// ---------- submit ----------
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const f = readForm();
  const problems = validateForm(f);
  if (!f.apiKey) problems.push("Add your Anthropic API key (or try a sample).");
  showErrors(problems);
  if (problems.length) return;

  try { sessionStorage.setItem(KEY_STORE, f.apiKey); } catch { /* ignore */ }

  const { text, removed } = scrubIdentifiers(f.studentText);
  f.studentText = text;

  submitBtn.disabled = true;
  submitBtn.textContent = "Reading the writing…";
  results.replaceChildren(el("p", { class: "empty" }, "Working… this usually takes 10 to 20 seconds."));

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": f.apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify(buildRequest(f)),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json?.error?.message || `API error ${res.status}`);
    render(parseResponse(json), text, { removed });
  } catch (err) {
    results.replaceChildren(el("p", { class: "errors" }, `Could not get feedback: ${err.message}`));
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Get feedback";
  }
});
