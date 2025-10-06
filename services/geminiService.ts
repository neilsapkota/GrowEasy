import { GoogleGenAI, Type, Chat } from "@google/genai";
import { Language, LessonContent, Feedback, Story, DictionaryEntry, ChatResponse, PronunciationFeedback, PlacementTestQuestion, PlacementTestResult } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const lessonSchema = {
    type: Type.OBJECT,
    properties: {
        topic: { type: Type.STRING },
        vocabulary: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    word: { type: Type.STRING },
                    translation: { type: Type.STRING },
                    pronunciation: { type: Type.STRING },
                },
                required: ['word', 'translation', 'pronunciation'],
            },
        },
        challenges: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING },
                    options: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    },
                    correctAnswer: { type: Type.STRING },
                    type: { type: Type.STRING, enum: ['translate', 'fill-in-the-blank', 'multiple-choice'] },
                },
                required: ['question', 'options', 'correctAnswer', 'type'],
            },
        },
    },
    required: ['topic', 'vocabulary', 'challenges'],
};


const feedbackSchema = {
    type: Type.OBJECT,
    properties: {
        isCorrect: { type: Type.BOOLEAN },
        explanation: { type: Type.STRING },
        suggestion: { type: Type.STRING },
    },
    required: ['isCorrect', 'explanation'],
};

const storySchema = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING },
        title: { type: Type.STRING },
        content: { type: Type.STRING },
        level: { type: Type.STRING, enum: ['beginner', 'intermediate', 'advanced'] }
    },
    required: ['id', 'title', 'content', 'level']
};

const dictionaryEntrySchema = {
    type: Type.OBJECT,
    properties: {
        word: { type: Type.STRING },
        translation: { type: Type.STRING },
        pronunciation: { type: Type.STRING },
        definition: { type: Type.STRING },
        exampleSentence: { type: Type.STRING },
        exampleTranslation: { type: Type.STRING },
    },
    required: ['word', 'translation', 'pronunciation', 'definition', 'exampleSentence', 'exampleTranslation'],
};

const chatResponseSchema = {
    type: Type.OBJECT,
    properties: {
        reply: { type: Type.STRING, description: "Your conversational response in the target language." },
        correction: { type: Type.STRING, description: "A brief correction of the user's last message in English. If no correction is needed, this should be null." }
    },
    required: ['reply'],
};

const pronunciationFeedbackSchema = {
    type: Type.OBJECT,
    properties: {
        score: { type: Type.NUMBER, description: 'A score from 0 to 100 for pronunciation accuracy.' },
        feedback: { type: Type.STRING, description: 'A single, concise, actionable tip for improvement.' },
    },
    required: ['score', 'feedback'],
};

const placementTestQuestionSchema = {
    type: Type.OBJECT,
    properties: {
        question: { type: Type.STRING, description: "The question for the user." },
        options: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "An array of 4 possible answers."
        },
        correctAnswer: { type: Type.STRING, description: "The correct answer from the options." },
        difficulty: { type: Type.STRING, description: "The CEFR difficulty level of the question (e.g., 'A1', 'A2', 'B1')." }
    },
    required: ['question', 'options', 'correctAnswer', 'difficulty'],
};

const placementTestResultSchema = {
    type: Type.OBJECT,
    properties: {
        completedTopics: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "An array of topic IDs that the user has demonstrated mastery of. Valid IDs are 'greetings', 'family', 'food', 'hobbies', 'travel', 'work'."
        },
        summary: { type: Type.STRING, description: "A one-sentence summary of the user's proficiency level." },
    },
    required: ['completedTopics', 'summary'],
};


export const generateLesson = async (language: Language, topic: string): Promise<LessonContent> => {
    const prompt = `Generate a beginner-level language lesson for learning ${language.name} about '${topic}'. The lesson should feel like a Duolingo lesson. It must include:
1. A list of 3-4 key vocabulary words with their English translations and a simple, IPA-based phonetic pronunciation guide.
2. A sequence of 5-7 interactive challenges to teach and test these vocabulary words. The challenges should be an array.
Good challenge types are:
- 'multiple-choice': Ask to translate a word from English to ${language.name} or vice-versa. Provide 4 options, one of which is correct.
- 'fill-in-the-blank': Provide a sentence in ${language.name} with a missing word (represented by '___'), and provide 4 options to fill it.
Ensure the questions are varied and directly relate to the provided vocabulary. For each challenge, provide the question, 4 options, the correct answer, and a type. Ensure the correct answer is always one of the provided options.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: lessonSchema,
            },
        });
        const jsonText = response.text.trim();
        const parsedContent = JSON.parse(jsonText) as LessonContent;

        // Data validation and cleanup
        parsedContent.challenges.forEach(challenge => {
            if (!challenge.options.includes(challenge.correctAnswer)) {
                challenge.options[Math.floor(Math.random() * challenge.options.length)] = challenge.correctAnswer;
            }
        });

        return parsedContent;
    } catch (error) {
        console.error("Error generating lesson:", error);
        throw new Error(`Failed to generate lesson content for ${topic}.`);
    }
};

export const getFeedback = async (language: Language, question: string, userAnswer: string, correctAnswer: string): Promise<Feedback> => {
    const prompt = `A user learning ${language.name} was asked the question: "${question}".
The correct answer is "${correctAnswer}".
They chose the answer: "${userAnswer}".
Is the user's chosen answer correct?
Provide feedback in a JSON format.
- 'isCorrect' should be a boolean.
- 'explanation' should be a concise, encouraging explanation for why the answer is correct or incorrect. If incorrect, briefly explain what the chosen answer means and why the correct answer is better.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: feedbackSchema,
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as Feedback;
    } catch (error) {
        console.error("Error getting feedback:", error);
        throw new Error("Failed to get feedback from the AI.");
    }
};

export const generatePracticeContent = async (language: Language, mode: 'conversation' | 'listening' | 'pronunciation', count: number): Promise<string[]> => {
    const prompt = `Generate ${count} simple, common, beginner-level ${mode === 'conversation' ? 'phrases' : 'sentences'} in ${language.name} for a language learner to practice.`;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                },
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as string[];
    } catch (error) {
        console.error(`Error generating ${mode} content:`, error);
        throw new Error(`Failed to generate ${mode} content.`);
    }
};

export const generateStory = async (language: Language): Promise<Story> => {
    const prompt = `Generate a very short, simple, beginner-level story in ${language.name}. The story should be only 3-4 sentences long. Return it in JSON format. The id should be a random string.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: storySchema,
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as Story;
    } catch (error) {
        console.error("Error generating story:", error);
        throw new Error("Failed to generate a story.");
    }
};

export const getDictionaryEntry = async (language: Language, word: string): Promise<DictionaryEntry> => {
    const prompt = `Provide a dictionary entry for the word "${word}" in ${language.name}. The user is an English speaker learning ${language.name}.
    Provide the following information:
    1. The word itself in ${language.name}.
    2. The English translation.
    3. A simple, IPA-based phonetic pronunciation guide.
    4. A concise definition of the word in English.
    5. An example sentence using the word in ${language.name}.
    6. The English translation of the example sentence.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: dictionaryEntrySchema,
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as DictionaryEntry;
    } catch (error) {
        console.error("Error getting dictionary entry:", error);
        throw new Error(`Failed to find a dictionary entry for "${word}".`);
    }
};

export const startConversation = (language: Language): Chat => {
    const systemInstruction = `You are Alex, a friendly and patient language practice partner. You are talking to a beginner learning ${language.name}. Your goal is to have a simple, natural conversation. 
    - Keep your responses short and simple (1-2 sentences).
    - Start the conversation by introducing yourself and asking the user's name in ${language.name}. For example, start with a scenario like "Hi! I'm Alex. We're in a park. What's your name?".
    - If the user makes a grammatical mistake, provide a brief, friendly correction in English, and then continue the conversation naturally in ${language.name}.
    - ALWAYS respond in JSON format with two keys: "reply" (your conversational response in ${language.name}) and "correction" (the correction in English, or null if there's no mistake).`;

    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: chatResponseSchema,
        },
    });
};

export const sendChatMessage = async (chat: Chat, message: string): Promise<ChatResponse> => {
    try {
        const response = await chat.sendMessage({ message });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as ChatResponse;
    } catch (error) {
        console.error("Error sending chat message:", error);
        throw new Error("Failed to get a response from the AI conversation partner.");
    }
};

export const getPronunciationFeedback = async (language: Language, phrase: string, audioBase64: string, mimeType: string): Promise<PronunciationFeedback> => {
    const prompt = `You are a language pronunciation coach. A user learning ${language.name} is trying to say the phrase: "${phrase}".
Their attempt is in the provided audio.
Please evaluate their pronunciation.
Provide a score from 0 to 100, where 100 is perfect native-like pronunciation.
Also, provide one single, short, and encouraging piece of feedback to help them improve. The user is a beginner.
Respond ONLY with a JSON object.`;

    try {
        const audioPart = {
            inlineData: {
                mimeType,
                data: audioBase64,
            },
        };
        const textPart = {
            text: prompt
        };

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [textPart, audioPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: pronunciationFeedbackSchema,
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as PronunciationFeedback;
    } catch (error) {
        console.error("Error getting pronunciation feedback:", error);
        throw new Error("Failed to get pronunciation feedback from the AI.");
    }
};

export const generatePlacementTestQuestion = async (
    language: Language,
    history: { question: PlacementTestQuestion; userAnswer: string; isCorrect: boolean }[]
): Promise<PlacementTestQuestion> => {
    const historyString = history.length > 0
        ? `Here is the user's history so far: ${JSON.stringify(history)}`
        : "This is the first question.";

    const prompt = `You are a language assessment AI creating a placement test for a user learning ${language.name}. Your goal is to quickly determine their proficiency level.
${historyString}
Based on this history, generate the next single multiple-choice question.
- If the history is empty, create an easy 'A1' level question about basic greetings.
- If the user's last answer was correct, create a question that is slightly more difficult than the previous one.
- If the user's last answer was incorrect, create a question of similar or slightly easier difficulty, possibly on a different topic to probe their knowledge.
- The question should be a multiple-choice translation or a fill-in-the-blank sentence.
- Provide exactly 4 options.
- Ensure the correct answer is one of the provided options.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: placementTestQuestionSchema,
            },
        });
        const jsonText = response.text.trim();
        const parsed = JSON.parse(jsonText) as PlacementTestQuestion;

        // Data validation and cleanup
        if (parsed.options.length !== 4) {
             while(parsed.options.length < 4) parsed.options.push("Incorrect");
             while(parsed.options.length > 4) parsed.options.pop();
        }
        if (!parsed.options.includes(parsed.correctAnswer)) {
            parsed.options[Math.floor(Math.random() * parsed.options.length)] = parsed.correctAnswer;
        }

        return parsed;
    } catch (error) {
        console.error("Error generating placement test question:", error);
        throw new Error("Failed to generate the next test question.");
    }
};

export const evaluatePlacementTest = async (
    language: Language,
    history: { question: PlacementTestQuestion; userAnswer:string; isCorrect: boolean }[]
): Promise<PlacementTestResult> => {
    const prompt = `A user has completed a placement test in ${language.name}. Here is their performance history: ${JSON.stringify(history)}.
Based on this, what is their proficiency level?
Determine which of the following topics they can skip. The available topics correspond to different levels:
- A1 Level: 'greetings', 'family'
- A2 Level: 'food', 'hobbies'
- B1 Level: 'travel', 'work'

A user who answers mostly A1 questions correctly should skip 'greetings' and 'family'. A user who also answers A2 questions correctly can skip the first four topics, and so on. If they struggle with A1 questions, they should skip nothing.

Return your evaluation as a JSON object with 'completedTopics' (an array of topic IDs to skip) and a 'summary' (a brief, encouraging sentence about their level, e.g., "You've got a great handle on the basics!").`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: placementTestResultSchema,
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as PlacementTestResult;
    } catch (error) {
        console.error("Error evaluating placement test:", error);
        throw new Error("Failed to evaluate the placement test results.");
    }
};
