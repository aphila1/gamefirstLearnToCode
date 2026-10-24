import tttIIII from "./assets/learntocode.png";

export interface GameInfo 
{
  id: string;
  title: string;
  description: string;
  thumbnail: string; // Emoji, icon, or image path
  tags: string[];
  difficulty: "Easy" | "Medium" | "Hard";
}

export interface CodeLevel {
  id: number;
  language: "javascript" | "python";
  title: string;
  task: string;
  startingCode: string;
  expectedOutput: string;
  successHint: string;
}

export const PROGRAMMING_LEVELS: CodeLevel[] = [
  {
    id: 1,
    language: "javascript",
    title: "Level 1: System Boot Sequence",
    task: 'Initialize the compiler mainframe. Write a statement to print "Hello World" to the output console terminal.',
    startingCode: 'console.log("Hello World");',
    expectedOutput: "Hello World",
    successHint:
      "Excellent! Mainframe compiler connection successfully established.",
  },
  {
    id: 2,
    language: "javascript",
    title: "Level 2: Memory Variables Allocation",
    task: 'Create a variable named "score" and assign it a numerical value of 100. Then print that variable to the screen console.',
    startingCode: "let score = 100;\nconsole.log(score);",
    expectedOutput: "100",
    successHint:
      "Data buffers allocated. Numeric score value stored in system memory.",
  },
  {
    id: 3,
    language: "javascript",
    title: "Level 3: Conditional Routing Matrix",
    task: 'We need a protective gateway barrier. Write a condition script where if a variable "xp" is greater than 50, it logs "Access Granted". Ensure xp is initialized to 60.',
    startingCode:
      'let xp = 60;\nif (xp > 50) {\n  console.log("Access Granted");\n}',
    expectedOutput: "Access Granted",
    successHint:
      "Firewall protocol authorized! Access routing pathways verified.",
  },
  {
    id: 4,
    language: "javascript",
    title: "Level 4: Spreadsheet Data Arrays",
    task: 'Imagine this array represents a column of row data extracted from an Excel sheet. Create an array named "rows" containing any 4 numbers you want (e.g., cell IDs). Then, print out the total number of items using console.log(rows.length);',
    startingCode: "let rows = [10, 20, 30, 40];\nconsole.log(rows.length);",
    expectedOutput: "4",
    successHint:
      "Array matrix verified! Counting rows dynamically is the first step to automating Excel data processing pipelines.",
  },
];

export const GAMES_LIST: GameInfo[] = [
  {
    id: "coding",
    title: "Learn to code",
    description: "Learn software development whilst having fun",
    thumbnail: tttIIII,
    tags: ["Educational", "Casual"],
    difficulty: "Easy",
  },
];
