import { detectIntent } from './intents';
import { BRAIN_RESPONSES } from './responses';

export const processLocalBrain = (userMessage: string): string | null => {
  const intent = detectIntent(userMessage);
  
  if (intent && BRAIN_RESPONSES[intent as keyof typeof BRAIN_RESPONSES]) {
    console.log(`[LOCAL BRAIN] Match found: ${intent}`);
    return BRAIN_RESPONSES[intent as keyof typeof BRAIN_RESPONSES];
  }
  
  // If no exact local intent matches, return null so it falls back to the API (Groq)
  return null;
};
