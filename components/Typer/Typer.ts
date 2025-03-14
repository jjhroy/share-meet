interface TyperProps {
  text: string;
  typingSpeed?: number;
  startDelay?: number;
}

interface TyperState {
  displayText: string;
  isTypingComplete: boolean;
  currentIndex: number;
}

export type { TyperProps, TyperState };
