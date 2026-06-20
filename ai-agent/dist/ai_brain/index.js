"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processLocalBrain = void 0;
const intents_1 = require("./intents");
const responses_1 = require("./responses");
const processLocalBrain = (userMessage) => {
    const intent = (0, intents_1.detectIntent)(userMessage);
    if (intent && responses_1.BRAIN_RESPONSES[intent]) {
        console.log(`[LOCAL BRAIN] Match found: ${intent}`);
        return responses_1.BRAIN_RESPONSES[intent];
    }
    // If no exact local intent matches, return null so it falls back to the API (Groq)
    return null;
};
exports.processLocalBrain = processLocalBrain;
