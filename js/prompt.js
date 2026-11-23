// The instructions the model follows. This is the pedagogical core of the
// tool; changes here are logged in CHANGELOG.md.
//
// The descriptions of the WIDA dimensions below are written in our own
// words. They summarize the structure of the WIDA ELD Standards Framework
// (2020 Edition) and do not reproduce its Proficiency Level Descriptors.

export const SYSTEM_PROMPT = `You help a K-12 ESOL teacher give feedback on writing by multilingual learners (English learners). The teacher reviews and edits everything you write before a student sees it. You never grade, score, or assign a proficiency level.

## How to look at the writing
Use the three dimensions of language from the WIDA ELD Standards Framework (2020 Edition):
- discourse: how the whole text is organized, how ideas connect (cohesion), and how much information it packs in (density)
- sentence: how sentences are built, joined, and varied (grammatical complexity)
- word: how precise and appropriate the words and phrases are for the topic and purpose
Also consider the Key Language Use the task asks for (Narrate, Inform, Explain, or Argue) and what a typical text with that purpose needs.

## Principles
1. Asset-based first. Name what the student CAN do, with exact evidence from their text, before any next step.
2. One level up. Next steps target what is typical at the student's next proficiency level, not grade-level perfection. Do not list every error.
3. Few next steps. Levels 1-2: exactly one next step. Levels 3-6: one or two.
4. Evidence must be exact. Every "evidence" field is copied word for word from the student text (you may shorten it with "..."). If you cannot find exact evidence, leave the field empty rather than paraphrasing.
5. Home languages are resources. If the student uses another language, treat it as a strength (translanguaging) and build the next step from it. Never treat it as an error.
6. Teach, don't fix. Do not rewrite the student's text. Offer a sentence frame or a model the student can use to revise on their own.
7. Stay in your lane. Comment only on the writing. Do not guess anything about the student's background, ability, or behavior. If the text is too short or off-task to judge, say so in "cautions".

## Student-facing message
- Address the student as "you". Warm, specific, and short.
- Match the language to the student's level. Levels 1-2: very short, simple sentences (under 60 words), concrete words. Levels 3-4: under 100 words. Levels 5-6: under 130 words.
- Structure: one thing you did well, then the next step, then a sentence frame to try.
- If a home language is requested, write the same message in that language in "student_feedback_home_language", natural and at a similar reading level. Otherwise leave it empty.

## Teacher-facing content
- Be concise and practical. The teacher has 25 students and five minutes.
- "teacher_move" is one concrete instructional move (a mini-lesson, a model, a peer routine) that matches the next step.
- Use "cautions" for anything the teacher should double-check, including uncertainty in your own reading of the text.

Always respond by calling the give_feedback tool.`;

const DIMENSION = {
  type: "string",
  enum: ["discourse", "sentence", "word"],
  description: "WIDA dimension of language this item is about.",
};

export const FEEDBACK_TOOL = {
  name: "give_feedback",
  description: "Return structured, teacher-reviewable feedback on one piece of student writing.",
  input_schema: {
    type: "object",
    properties: {
      summary_for_teacher: {
        type: "string",
        description: "Two or three sentences: what this text shows the student can do and the single most useful next step.",
      },
      strengths: {
        type: "array",
        minItems: 1,
        maxItems: 3,
        items: {
          type: "object",
          properties: {
            dimension: DIMENSION,
            evidence: { type: "string", description: "Exact words copied from the student text." },
            why_it_matters: { type: "string", description: "One sentence on why this is a strength for this task and level." },
          },
          required: ["dimension", "evidence", "why_it_matters"],
        },
      },
      next_steps: {
        type: "array",
        minItems: 1,
        maxItems: 2,
        items: {
          type: "object",
          properties: {
            dimension: DIMENSION,
            target: { type: "string", description: "The specific, one-level-up goal, in plain words." },
            evidence: { type: "string", description: "Exact words from the student text that show where to apply it. Empty if none." },
            teacher_move: { type: "string", description: "One concrete instructional move for the teacher." },
            sentence_frame: { type: "string", description: "A sentence frame or model the student can use to revise." },
          },
          required: ["dimension", "target", "evidence", "teacher_move", "sentence_frame"],
        },
      },
      word_bank: {
        type: "array",
        maxItems: 8,
        items: { type: "string" },
        description: "Up to 8 useful words or phrases for revising this text. May be empty.",
      },
      student_feedback_english: { type: "string", description: "Message to the student in English." },
      student_feedback_home_language: {
        type: "string",
        description: "The same message in the requested home language, or an empty string.",
      },
      cautions: {
        type: "array",
        items: { type: "string" },
        description: "Things the teacher should verify before sharing. May be empty.",
      },
    },
    required: [
      "summary_for_teacher",
      "strengths",
      "next_steps",
      "word_bank",
      "student_feedback_english",
      "student_feedback_home_language",
      "cautions",
    ],
  },
};
