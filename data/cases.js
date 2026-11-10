window.InvestigativeCases = [
  {
    id: "missing-document",
    title: "The Missing Document",
    difficulty: "Easy",
    department: "Evidence Assessment",
    summary: "A confidential paper document cannot be located after an office meeting.",
    briefing: "At 3:00 PM, an office team completed a meeting. A paper document listed in the meeting register was later reported missing. Several people had access to the meeting room. Your task is to establish what is known, what remains uncertain and what evidence should be collected next.",
    objectives: [
      "Separate confirmed facts from assumptions.",
      "Compare the available accounts.",
      "Identify the most useful next investigative step."
    ],
    evidence: [
      {
        title: "Meeting register",
        type: "Administrative record",
        detail: "The register confirms that the document was present at the beginning of the meeting. It does not record who handled it afterwards.",
        significance: "Confirms earlier presence, but not the document's later location."
      },
      {
        title: "Room access log",
        type: "Access record",
        detail: "The room was accessed by three authorised staff members between 2:45 PM and 3:30 PM.",
        significance: "Establishes an access window. It does not prove that any person removed the document."
      },
      {
        title: "Desk inventory",
        type: "Administrative record",
        detail: "A desk inventory was completed the previous afternoon. It lists a folder with a similar description, but its contents were not individually recorded.",
        significance: "May help identify the document, but the description is not conclusive."
      }
    ],
    statements: [
      {
        person: "Staff member A",
        statement: "I saw the document on the meeting table before the meeting began. I left at approximately 3:10 PM."
      },
      {
        person: "Staff member B",
        statement: "I collected my notebook after the meeting. I do not remember seeing the document on the table."
      },
      {
        person: "Staff member C",
        statement: "I entered the room briefly at about 3:20 PM to collect a charger."
      }
    ],
    timeline: [
      { time: "2:45 PM", event: "First recorded room access in the relevant period." },
      { time: "3:00 PM", event: "Meeting begins; document is recorded as present." },
      { time: "3:10 PM", event: "Staff member A says they left." },
      { time: "3:20 PM", event: "Staff member C says they briefly entered." },
      { time: "3:30 PM", event: "Last recorded access in the relevant period." }
    ],
    questions: [
      {
        prompt: "What does the meeting register establish?",
        options: [
          "Who removed the document.",
          "That the document was recorded as present at the beginning.",
          "That the document was destroyed."
        ],
        answer: 1,
        explanation: "The register establishes recorded presence at a particular time. It does not identify what happened afterwards."
      },
      {
        prompt: "What is the strongest next investigative step?",
        options: [
          "Accuse the last person who entered.",
          "Interview everyone again without reviewing records.",
          "Check relevant document-handling records and clarify the access timeline."
        ],
        answer: 2,
        explanation: "A careful review of relevant records and a verified timeline can narrow uncertainty without making unsupported accusations."
      },
      {
        prompt: "Does room access prove that someone took the document?",
        options: [
          "No. Access alone does not establish an action.",
          "Yes. Everyone with access is responsible.",
          "Yes, if the document is missing."
        ],
        answer: 0,
        explanation: "Opportunity is not proof. Conclusions must be supported by evidence."
      }
    ]
  },
  {
    id: "inconsistent-inventory",
    title: "The Inconsistent Inventory",
    difficulty: "Hard",
    department: "Records Investigation",
    summary: "Two inventory reports contain different totals for the same equipment room.",
    briefing: "A facilities department has discovered that two inventory reports for the same equipment room contain different totals. The reports were prepared on different dates. You must determine which records can be compared reliably and what additional documentation is needed before drawing a conclusion.",
    objectives: [
      "Compare records while accounting for their dates.",
      "Identify missing documentation.",
      "Avoid treating a discrepancy as proof of misconduct."
    ],
    evidence: [
      {
        title: "Inventory report A",
        type: "Inventory record",
        detail: "Prepared on Monday. It lists 24 devices, but does not include individual serial numbers.",
        significance: "Provides a total but limited item-level identification."
      },
      {
        title: "Inventory report B",
        type: "Inventory record",
        detail: "Prepared on Thursday. It lists 22 devices and includes serial numbers for all listed items.",
        significance: "Provides stronger item-level detail, but it is a later snapshot."
      },
      {
        title: "Equipment transfer form",
        type: "Transfer record",
        detail: "A form dated Wednesday records the authorised transfer of one device. The receiving department's acknowledgement is missing.",
        significance: "May explain part of the difference, but the transfer is not fully documented."
      }
    ],
    statements: [
      {
        person: "Inventory officer",
        statement: "The Monday count was completed before the scheduled transfer."
      },
      {
        person: "Facilities assistant",
        statement: "I remember preparing a device for collection on Wednesday, but I did not witness the receiving department sign for it."
      },
      {
        person: "Department supervisor",
        statement: "I received the Thursday report but did not personally verify the count."
      }
    ],
    timeline: [
      { time: "Monday", event: "Inventory report A records 24 devices." },
      { time: "Wednesday", event: "Transfer form records one device scheduled for transfer." },
      { time: "Thursday", event: "Inventory report B records 22 devices." }
    ],
    questions: [
      {
        prompt: "Can the two totals be compared without considering the dates?",
        options: [
          "Yes, different totals always prove a loss.",
          "No. The authorised transfer and timing must be considered.",
          "Yes, because both reports concern the same room."
        ],
        answer: 1,
        explanation: "Inventory records are snapshots. Events between the reporting dates matter."
      },
      {
        prompt: "What is the key weakness in the transfer documentation?",
        options: [
          "It has no equipment-related information.",
          "It was prepared on Wednesday.",
          "The receiving department's acknowledgement is missing."
        ],
        answer: 2,
        explanation: "The missing acknowledgement leaves the transfer's completion insufficiently verified."
      },
      {
        prompt: "What conclusion is justified at this stage?",
        options: [
          "The records contain an unresolved discrepancy requiring verification.",
          "The inventory officer stole two devices.",
          "The Thursday report must be correct."
        ],
        answer: 0,
        explanation: "The evidence supports further verification, not an accusation or a final finding."
      }
    ]
  },
  {
    id: "digital-record-discrepancy",
    title: "The Digital Record Discrepancy",
    difficulty: "Professional",
    department: "Digital Evidence",
    summary: "A project file appears different in two archived records.",
    briefing: "An organisation is reviewing a project file after staff noticed differences between two archived versions. The records were exported at different times, and one export lacks a complete collection log. Your task is to assess provenance, integrity and the limits of the available information.",
    objectives: [
      "Assess the provenance and completeness of records.",
      "Distinguish a file difference from proof of deliberate alteration.",
      "Recommend a defensible verification process."
    ],
    evidence: [
      {
        title: "Archive record A",
        type: "Digital record",
        detail: "An archived copy was recorded on Tuesday. Its collection notes identify the source workstation, but no cryptographic hash is included.",
        significance: "The source is partly documented, but integrity verification is limited."
      },
      {
        title: "Archive record B",
        type: "Digital record",
        detail: "A second copy was recorded on Friday. It has a recorded SHA-256 hash, but the collection notes do not identify the person who supplied it.",
        significance: "A hash supports later integrity checks, but does not independently establish provenance."
      },
      {
        title: "Change register",
        type: "Administrative record",
        detail: "The project register lists an approved update on Thursday. It does not identify the exact file version distributed.",
        significance: "An authorised update is a possible explanation, but the precise version remains unverified."
      }
    ],
    statements: [
      {
        person: "Project coordinator",
        statement: "An approved update was expected on Thursday. I cannot confirm which archived copy reflects that update."
      },
      {
        person: "Records custodian",
        statement: "I received the Friday copy from another team. I did not personally observe its original collection."
      },
      {
        person: "Technical reviewer",
        statement: "The two copies appear different, but I have not completed a documented comparison."
      }
    ],
    timeline: [
      { time: "Tuesday", event: "Archive record A is created." },
      { time: "Thursday", event: "An approved project update is listed in the change register." },
      { time: "Friday", event: "Archive record B is created." },
      { time: "Review date", event: "Differences between the archived copies are reported." }
    ],
    questions: [
      {
        prompt: "What does a matching cryptographic hash establish when used correctly?",
        options: [
          "Who created the file.",
          "That the compared file contents match the hashed reference.",
          "That the file was authorised."
        ],
        answer: 1,
        explanation: "A matching hash supports integrity comparison. It does not prove authorship, origin or authorisation."
      },
      {
        prompt: "What is the main limitation of archive record B?",
        options: [
          "It was recorded on Friday.",
          "It contains a hash.",
          "Its collection notes do not identify the supplier."
        ],
        answer: 2,
        explanation: "Incomplete provenance makes it harder to establish where the copy came from and how it was collected."
      },
      {
        prompt: "Which approach is most defensible?",
        options: [
          "Preserve both copies, document provenance, verify hashes and conduct a reproducible comparison.",
          "Select the newer copy and discard the older one.",
          "Conclude that someone deliberately altered the file."
        ],
        answer: 0,
        explanation: "Preservation, documented provenance and reproducible examination support a more defensible assessment."
      }
    ]
  }
];
