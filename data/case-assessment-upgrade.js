(() => {
  "use strict";

  const cases = window.InvestigativeCases || [];

  const additionalQuestions = {
    "missing-document": [
      {
        prompt: "What can the previous afternoon's desk inventory establish?",
        options: [
          "That the missing document was definitely inside the folder.",
          "That a similarly described folder was previously recorded, but its contents remain unverified.",
          "That a particular staff member removed the document."
        ],
        answer: 1,
        explanation: "A similar description can help identify a possible record, but without an item-level contents list it is not conclusive."
      },
      {
        prompt: "What is the most defensible interpretation of the available access timeline?",
        options: [
          "It identifies a period for further examination but does not establish who handled the document.",
          "The last person recorded entering the room must be responsible.",
          "Everyone recorded in the room must have handled the document."
        ],
        answer: 0,
        explanation: "Access records establish recorded access, not the actions or intentions of the people involved."
      }
    ],

    "inconsistent-inventory": [
      {
        prompt: "Why is report B's use of serial numbers useful?",
        options: [
          "It allows individual listed devices to be identified and compared.",
          "It proves that report B's total is automatically correct.",
          "It proves that no device was transferred."
        ],
        answer: 0,
        explanation: "Serial numbers provide more specific item-level information, but the count and collection process still require verification."
      },
      {
        prompt: "What should investigators do about the missing transfer acknowledgement?",
        options: [
          "Assume the transfer was completed.",
          "Delete the transfer form from the review.",
          "Seek confirmation from the receiving department and compare the device identifiers."
        ],
        answer: 2,
        explanation: "Independent confirmation and device-level comparison can help establish whether the recorded transfer was completed."
      }
    ],

    "digital-record-discrepancy": [
      {
        prompt: "Does a matching SHA-256 hash establish who originally supplied a file?",
        options: [
          "Yes, every hash identifies its creator.",
          "No. A hash supports integrity comparison, not proof of the original supplier.",
          "Yes, if the file was archived."
        ],
        answer: 1,
        explanation: "A hash can show whether file contents match a reference. It does not independently establish provenance or authorship."
      },
      {
        prompt: "Which procedure best supports a reproducible comparison of the archived copies?",
        options: [
          "Preserve the original records, document their provenance and record the comparison process.",
          "Modify the older copy until it resembles the newer one.",
          "Discard the copy with incomplete collection notes."
        ],
        answer: 0,
        explanation: "Preservation, documented provenance and a reproducible examination allow another reviewer to understand and assess the findings."
      }
    ]
  };

  for (const item of cases) {
    const additions = additionalQuestions[item.id];

    if (!additions) continue;

    if (item.questions.length === 3) {
      item.questions.push(...additions);
    } else if (item.questions.length !== 5) {
      console.error(
        "Assessment upgrade: unexpected question count for",
        item.id
      );
    }
  }
})();
