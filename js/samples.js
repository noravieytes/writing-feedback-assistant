// Synthetic samples for the demo mode. The student texts were written for
// this project to resemble newcomer writing; they are NOT real student work.
// The feedback shown for each sample is illustrative: it was written to show
// the output format and is labeled as such in the interface.

export const SAMPLES = [
  {
    id: "level2-explain",
    label: "Level 2 · Explain · mixes English and Spanish",
    form: {
      gradeCluster: "Grades 6-8",
      level: 2,
      languageUse: "Explain",
      focus: "",
      homeLanguage: "Spanish",
      taskPrompt: "Explain one challenge Salva faced on his journey and how he responded.",
      teacherNotes: "",
      studentText:
        "Salva walk very far. No water, no food. He is tired y tiene miedo. Salva no stop. He is strong because his uncle help him.",
    },
    feedback: {
      summary_for_teacher:
        "The student names a clear challenge (no water, no food) and a response (he keeps going), and gives a reason with \"because\". Spanish carries the feelings the student cannot yet say in English. The most useful next step is naming feelings in English with a sentence frame.",
      strengths: [
        {
          dimension: "sentence",
          evidence: "He is strong because his uncle help him",
          why_it_matters: "Using \"because\" to give a reason is exactly what an Explain task needs, and it is above typical Level 2 writing.",
        },
        {
          dimension: "word",
          evidence: "He is tired y tiene miedo",
          why_it_matters: "The student uses Spanish to express a feeling precisely; this is a bridge to the English word \"scared\".",
        },
      ],
      next_steps: [
        {
          dimension: "word",
          target: "Say feelings in English with \"He is ___ and ___.\"",
          evidence: "He is tired y tiene miedo",
          teacher_move: "Show a feelings word bank with pictures and Spanish cognates; model one sentence aloud and have the student say it before writing.",
          sentence_frame: "Salva is ___ and ___ because ___.",
        },
      ],
      word_bank: ["scared", "tired", "hungry", "thirsty", "keeps walking", "because"],
      student_feedback_english:
        "Great job! You used \"because\" to give a reason. Next: say how Salva feels in English. Try: \"Salva is tired and scared because ___.\"",
      student_feedback_home_language:
        "¡Muy bien! Usaste \"because\" para dar una razón. Ahora: di cómo se siente Salva en inglés. Prueba: \"Salva is tired and scared because ___.\"",
      cautions: [
        "Confirm the student knows \"scared\" means \"tiene miedo\" before removing the Spanish support.",
      ],
    },
  },
  {
    id: "level3-argue",
    label: "Level 3 · Argue",
    form: {
      gradeCluster: "Grades 6-8",
      level: 3,
      languageUse: "Argue",
      focus: "",
      homeLanguage: "",
      taskPrompt: "Should Nya's village build a well? Write your opinion and give reasons.",
      teacherNotes: "We practiced claims and reasons this week.",
      studentText:
        "I think the village need a well because the people walk very far for water. Nya walk many hours every day and she can not go to school. The water from the pond is dirty and people get sick. If they have a well the kids can go to school and the people will be more healthy.",
    },
    feedback: {
      summary_for_teacher:
        "The student states a clear claim and supports it with three relevant reasons, including a conditional (\"If they have a well...\"). Reasons are listed but not yet connected to each other. The next step is using transition words to link reasons and closing with a sentence that returns to the claim.",
      strengths: [
        {
          dimension: "discourse",
          evidence: "I think the village need a well because the people walk very far for water",
          why_it_matters: "The opening sentence gives a claim and a reason together, which is the core move of an Argue task.",
        },
        {
          dimension: "sentence",
          evidence: "If they have a well the kids can go to school",
          why_it_matters: "A conditional sentence shows cause and effect, a structure typical of the next level.",
        },
      ],
      next_steps: [
        {
          dimension: "discourse",
          target: "Connect reasons with transition words (First, Also, Finally) and end by restating the claim.",
          evidence: "The water from the pond is dirty and people get sick",
          teacher_move: "Give the student their own sentences on strips; have them order the reasons and add a transition to each strip.",
          sentence_frame: "First, ___. Also, ___. For these reasons, the village should ___.",
        },
        {
          dimension: "sentence",
          target: "Add -s to verbs after he, she, or the village (she walks, the village needs).",
          evidence: "Nya walk many hours",
          teacher_move: "Highlight the three subject-verb pairs in the text and have the student fix them with a partner.",
          sentence_frame: "Nya walks ___. The village needs ___.",
        },
      ],
      word_bank: ["First", "Also", "Finally", "For these reasons", "needs", "walks", "healthier"],
      student_feedback_english:
        "You wrote a strong opinion with three good reasons, and your \"If...\" sentence shows what will change. Next, connect your reasons with words like First, Also, and Finally, and end by saying your opinion again. Try: \"For these reasons, the village should build a well.\"",
      student_feedback_home_language: "",
      cautions: [
        "\"more healthy\" vs. \"healthier\" is a minor form issue; consider leaving it for a later lesson.",
      ],
    },
  },
  {
    id: "level4-inform",
    label: "Level 4 · Inform",
    form: {
      gradeCluster: "Grades 6-8",
      level: 4,
      languageUse: "Inform",
      focus: "word",
      homeLanguage: "",
      taskPrompt: "Using the article, inform the reader about the water problem in South Sudan.",
      teacherNotes: "",
      studentText:
        "In South Sudan many people don't have clean water near their homes. Women and girls often walk for hours to get water from ponds or rivers, and this water can have bacteria that make people sick. Because they spend so much time getting water, many girls cannot attend school. Organizations are drilling wells so villages can have clean water. This thing is very important because it helps the health and education of the people.",
    },
    feedback: {
      summary_for_teacher:
        "This is an organized informational paragraph: problem, cause, effect, and solution, with accurate details and a clear causal sentence. The teacher asked for a word-level focus: general words like \"thing\" and \"helps\" are the main gap between this text and Level 5.",
      strengths: [
        {
          dimension: "discourse",
          evidence: "Because they spend so much time getting water, many girls cannot attend school",
          why_it_matters: "The student links cause and effect inside one complex sentence, which makes the explanation dense and clear.",
        },
        {
          dimension: "word",
          evidence: "Organizations are drilling wells",
          why_it_matters: "\"Drilling wells\" is precise, topic-specific language.",
        },
      ],
      next_steps: [
        {
          dimension: "word",
          target: "Replace general words (thing, helps) with precise academic words.",
          evidence: "This thing is very important because it helps the health and education",
          teacher_move: "Mini-lesson on \"general vs. precise\" words: the student finds two general words in their own text and chooses replacements from a word bank.",
          sentence_frame: "Access to clean water is essential because it improves ___ and increases ___.",
        },
      ],
      word_bank: ["access to clean water", "essential", "improves", "increases", "waterborne diseases", "school attendance"],
      student_feedback_english:
        "Your paragraph is well organized: you explain the problem, why it happens, what it causes, and a solution. Your sentence starting with \"Because\" is especially clear. Next, make your words more precise. Instead of \"This thing\" and \"helps\", try: \"Access to clean water is essential because it improves people's health and increases school attendance.\"",
      student_feedback_home_language: "",
      cautions: [],
    },
  },
];
