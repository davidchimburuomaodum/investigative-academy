window.InvestigativeChallenges = [
  {
    id: "observation-easy",
    category: "Observation",
    difficulty: "Easy",
    title: "Notice the Details",
    prompt: "A meeting room inventory lists 4 chairs, 1 table and 2 notebooks. A later inspection records 4 chairs, 1 table and 1 notebook. What is the confirmed difference?",
    options: [
      "One notebook is unaccounted for in the later record.",
      "Someone stole a notebook.",
      "The table was moved."
    ],
    answer: 0,
    explanation: "The records show a difference of one notebook. They do not establish what happened to it.",
    xp: 10
  },
  {
    id: "observation-intermediate",
    category: "Observation",
    difficulty: "Intermediate",
    title: "Separate Fact from Interpretation",
    prompt: "A person arrives at a reception desk at 10:15 AM and leaves after two minutes. Which statement is an observation?",
    options: [
      "The person was nervous.",
      "The person arrived at 10:15 AM and left after two minutes.",
      "The person was hiding something."
    ],
    answer: 1,
    explanation: "The times and duration are observable details. Emotional state and motive cannot be established from this information.",
    xp: 15
  },
  {
    id: "observation-advanced",
    category: "Observation",
    difficulty: "Advanced",
    title: "Evaluate an Observation",
    prompt: "Two observers describe the same event differently. What is the best first step?",
    options: [
      "Choose the more confident observer.",
      "Treat both accounts as unreliable.",
      "Record each account separately and compare specific details against independent evidence."
    ],
    answer: 2,
    explanation: "Separate recording and independent comparison help identify agreement, differences and uncertainty.",
    xp: 20
  },
  {
    id: "memory-easy",
    category: "Memory",
    difficulty: "Easy",
    title: "Sequence Recall",
    prompt: "Read this sequence once: BLUE — 7 — TREE — 2. Which item appeared immediately after 7?",
    options: ["TREE", "BLUE", "2"],
    answer: 0,
    explanation: "TREE appeared immediately after 7.",
    xp: 10
  },
  {
    id: "memory-intermediate",
    category: "Memory",
    difficulty: "Intermediate",
    title: "Recall the Record",
    prompt: "A note contains: MONDAY, 14, NORTH, FILE C. Which direction was recorded?",
    options: ["South", "North", "East"],
    answer: 1,
    explanation: "The direction recorded in the note was NORTH.",
    xp: 15
  },
  {
    id: "memory-advanced",
    category: "Memory",
    difficulty: "Advanced",
    title: "Order Reconstruction",
    prompt: "A sequence is recorded as: key, envelope, register, receipt. Which item was third?",
    options: ["Envelope", "Receipt", "Register"],
    answer: 2,
    explanation: "The register was the third item in the recorded sequence.",
    xp: 20
  },
  {
    id: "patterns-easy",
    category: "Pattern Recognition",
    difficulty: "Easy",
    title: "Complete the Pattern",
    prompt: "What number comes next? 2, 4, 6, 8, ...",
    options: ["9", "10", "12"],
    answer: 1,
    explanation: "The sequence increases by 2 each time.",
    xp: 10
  },
  {
    id: "patterns-intermediate",
    category: "Pattern Recognition",
    difficulty: "Intermediate",
    title: "Identify the Rule",
    prompt: "What comes next? 3, 6, 12, 24, ...",
    options: ["30", "36", "48"],
    answer: 2,
    explanation: "Each number is multiplied by 2.",
    xp: 15
  },
  {
    id: "patterns-advanced",
    category: "Pattern Recognition",
    difficulty: "Advanced",
    title: "Alternating Sequence",
    prompt: "What comes next? 2, 5, 3, 6, 4, 7, ...",
    options: ["5", "8", "9"],
    answer: 0,
    explanation: "Two sequences alternate: 2, 3, 4, 5 and 5, 6, 7, 8.",
    xp: 20
  },
  {
    id: "logic-easy",
    category: "Logical Reasoning",
    difficulty: "Easy",
    title: "Evidence and Conclusions",
    prompt: "All archived files have reference numbers. File A has a reference number. What can you conclude?",
    options: [
      "File A is archived.",
      "File A is confidential.",
      "The information is insufficient to establish that File A is archived."
    ],
    answer: 2,
    explanation: "The rule only says archived files have reference numbers. It does not say every numbered file is archived.",
    xp: 10
  },
  {
    id: "logic-intermediate",
    category: "Logical Reasoning",
    difficulty: "Intermediate",
    title: "Test the Assumption",
    prompt: "A report was submitted late. Which conclusion is justified by that fact alone?",
    options: [
      "The author deliberately delayed it.",
      "The report was submitted after its expected time.",
      "The report contains false information."
    ],
    answer: 1,
    explanation: "A late submission establishes timing, not motive or accuracy.",
    xp: 15
  },
  {
    id: "logic-advanced",
    category: "Logical Reasoning",
    difficulty: "Advanced",
    title: "Competing Explanations",
    prompt: "A digital record differs from an earlier copy. An approved update was scheduled between the two copies. What is the best conclusion?",
    options: [
      "The difference proves deliberate alteration.",
      "The approved update definitely explains every difference.",
      "The update is a possible explanation that requires verification."
    ],
    answer: 2,
    explanation: "A possible explanation is not a proven explanation. Compare preserved copies and verify the documented update.",
    xp: 20
  }
];
