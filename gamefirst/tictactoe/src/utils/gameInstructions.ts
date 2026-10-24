export interface GameInstruction {
  title: string;
  objective: string;
  rules: string[];
  tips: string[];
}

export const GAME_INSTRUCTIONS: Record<string, GameInstruction> = {
  coding: {
    title: "Learn to code",
    objective: "Learn and increase your software development skills",
    rules: [
      "say something about python and programming languages and IDEs"
    ],
    tips: [
      "Keep an eye on your timer color state—it flashes dangerous red indicators when falling under 3 seconds.",
      "Focus purely on accuracy first; building an intuitive pattern rhythm allows you to bypass complex processing."
    ]
  }
};