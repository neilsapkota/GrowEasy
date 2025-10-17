import { GoogleGenAI, Type, Chat } from "@google/genai";
import { Language, LessonContent, Feedback, Story, DictionaryEntry, ChatResponse, PronunciationFeedback, PlacementTestResult, WritingFeedback, Flashcard, VisionFeedback, GrammarTip, MistakeItem } from '../types';

const API_KEY = (import.meta as any).env?.VITE_API_KEY as string | undefined;
if (!API_KEY) {
    throw new Error("VITE_API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

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
            description: "An array of topic IDs that the user has demonstrated mastery of. Valid IDs are 'greetings', 'family', 'food', 'hobbies', 'travel', 'work', 'shopping', 'directions', 'weather', 'home', 'health', 'emotions', 'school', 'tech', 'culture', 'nature', 'past', 'future'."
        },
        summary: { type: Type.STRING, description: "A one-sentence summary of the user's proficiency level." },
    },
    required: ['completedTopics', 'summary'],
};

const writingFeedbackSchema = {
    type: Type.OBJECT,
    properties: {
        score: { type: Type.NUMBER, description: 'A score from 0 to 100 evaluating the user\'s writing based on grammar, vocabulary, and relevance.' },
        summary: { type: Type.STRING, description: 'A brief, encouraging summary of what the user did well.' },
        suggestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'A list of 2-3 specific, actionable suggestions for improvement.'
        },
    },
    required: ['score', 'summary', 'suggestions'],
};

const interactiveStorySchema = {
    type: Type.OBJECT,
    properties: {
        storySegment: { type: Type.STRING, description: 'A 2-3 sentence segment of an interactive story.' },
        choices: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'An array of 2-3 choices for the user to continue the story. If the story is over, this can be an empty array.'
        },
    },
    required: ['storySegment', 'choices'],
};

const flashcardSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            front: { type: Type.STRING, description: 'The front of the flashcard (e.g., a word in English).' },
            back: { type: Type.STRING, description: 'The back of the flashcard (e.g., the translation in the target language).' },
            exampleSentence: { type: Type.STRING, description: 'An optional example sentence in the target language using the word from the back.' },
        },
        required: ['front', 'back'],
    },
};

const visionFeedbackSchema = {
    type: Type.OBJECT,
    properties: {
        feedback: { type: Type.STRING, description: 'A helpful and encouraging comment on the user\'s description of the image.' },
        correction: { type: Type.STRING, description: 'A corrected version of the user\'s sentence if there are grammatical errors. If no correction is needed, this should be null.' },
    },
    required: ['feedback'],
};

const grammarTipSchema = {
    type: Type.OBJECT,
    properties: {
        tip: { type: Type.STRING, description: 'The name of the grammar rule or concept (e.g., "Gender of Nouns").' },
        explanation: { type: Type.STRING, description: 'A concise, easy-to-understand explanation of the rule for a beginner.' },
        example: { type: Type.STRING, description: 'A simple example sentence in the target language demonstrating the rule, followed by its English translation.' },
    },
    required: ['tip', 'explanation', 'example'],
};


export const generateFlashcardsForTopic = async (language: Language, topic: string): Promise<Omit<Flashcard, 'nextReview' | 'interval' | 'easeFactor'>[]> => {
    const prompt = `You are a helpful assistant for a language learning app. Generate a list of 10-15 useful flashcards for a beginner learning ${language.name} about the topic "${topic}".
The front of the card should be in English, and the back should be the translation in ${language.name}.
Optionally, include a simple example sentence in ${language.name} for context.
Respond ONLY with a JSON array of objects.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: flashcardSchema,
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error generating flashcards:", error);
        throw new Error("Failed to generate flashcards.");
    }
};

export const generateFlashcardsFromMistakes = async (language: Language, mistakes: MistakeItem[]): Promise<Omit<Flashcard, 'nextReview' | 'interval' | 'easeFactor'>[]> => {
    const prompt = `A user learning ${language.name} has made the following mistakes in their lessons. For each mistake, create one flashcard to help them learn the correct concept.
The mistakes are provided as a JSON array: ${JSON.stringify(mistakes.slice(0, 10))}

For each mistake, create a flashcard where the 'front' is a question or prompt in English based on the mistake, and the 'back' is the correct answer in ${language.name}.
Focus on the core concept the user got wrong. The goal is to create targeted practice.
Return a JSON array of these flashcard objects.`;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: flashcardSchema,
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error generating flashcards from mistakes:", error);
        throw new Error("Failed to generate flashcards from mistakes.");
    }
}

export const generateGrammarTip = async (language: Language): Promise<GrammarTip> => {
    const prompt = `You are a language teacher for a learning app. Generate one random, simple, and useful grammar tip for a beginner learning ${language.name}.
The tip should cover a fundamental concept (e.g., noun gender, basic verb conjugation, sentence structure).
Respond ONLY with a JSON object.`;
    
     try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: grammarTipSchema,
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error generating grammar tip:", error);
        throw new Error("Failed to generate a grammar tip.");
    }
}


export const generateInitialStory = async (language: Language): Promise<{ storySegment: string; choices: string[] }> => {
    const prompt = `You are a creative storyteller for a language learning app. Create the beginning of a simple, engaging, interactive story for a beginner learning ${language.name}.
    The story should be a single paragraph (2-3 sentences).
    After the story segment, provide 2-3 choices for the user to decide what happens next. The choices should also be in ${language.name}.
    The story should be set in a common, simple scenario (e.g., a park, a market, a café).
    Respond ONLY with a JSON object.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: interactiveStorySchema,
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error generating initial story:", error);
        throw new Error("Failed to start an interactive story.");
    }
};

export const continueInteractiveStory = async (language: Language, storyHistory: string, userChoice: string): Promise<{ storySegment: string; choices: string[] }> => {
    const prompt = `You are a creative storyteller for a language learning app, continuing an interactive story for a beginner learning ${language.name}.
    Here is the story so far:
    ---
    ${storyHistory}
    ---
    The user has just made this choice: "${userChoice}"

    Continue the story with a new paragraph (2-3 sentences) in ${language.name} based on the user's choice.
    After the story segment, provide 2-3 new choices for the user.
    If this is a natural ending point for the story, you can provide an empty array for the choices.
    Respond ONLY with a JSON object.`;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: interactiveStorySchema,
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error continuing story:", error);
        throw new Error("Failed to continue the interactive story.");
    }
};

export const getPronunciationFeedback = async (language: Language, phrase: string, audioBase64: string, mimeType: string): Promise<PronunciationFeedback> => {
    const prompt = `A user learning ${language.name} is practicing pronunciation.
    The target phrase is: "${phrase}"
    Their spoken audio is attached.
    Please evaluate their pronunciation on a scale of 0 to 100, where 100 is native-like.
    Provide one single, concise, actionable tip for improvement.
    Respond ONLY with a JSON object.`;

    const audioPart = {
        inlineData: {
            mimeType: mimeType,
            data: audioBase64,
        },
    };

    const textPart = { text: prompt };

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [textPart, audioPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: pronunciationFeedbackSchema,
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error getting pronunciation feedback:", error);
        throw new Error("Failed to get pronunciation feedback from the AI.");
    }
};

export const evaluateLiveConversation = async (language: Language, transcript: string): Promise<PlacementTestResult> => {
    const prompt = `Based on the following conversation transcript of a beginner learning ${language.name}, please evaluate their proficiency level.
    The goal is to determine which introductory topics they have likely mastered.
    Transcript:
    ---
    ${transcript}
    ---
    Based on their performance, identify which of the following topic IDs they have mastered. Only include topics where they show clear understanding. If they struggle with everything, return an empty array.
    Valid topic IDs: 'greetings', 'family', 'food', 'hobbies', 'travel', 'work', 'shopping', 'directions', 'weather', 'home', 'health', 'emotions', 'school', 'tech', 'culture', 'nature', 'past', 'future'.
    Also provide a brief, one-sentence summary of their proficiency level.
    Respond ONLY with a JSON object.`;

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
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error evaluating conversation:", error);
        throw new Error("Failed to evaluate the conversation.");
    }
};

export const generateWritingPrompt = async (language: Language): Promise<string> => {
    const prompt = `You are a helpful assistant for a language learning app. Generate a single, simple, and engaging writing prompt for a beginner learning ${language.name}.
    The prompt should be in English and ask the user to write 2-3 sentences in ${language.name}.
    Example prompts: "Describe your favorite food.", "What did you do last weekend?", "Write about your family."
    Respond with ONLY the prompt text, no extra formatting or quotation marks.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error generating writing prompt:", error);
        throw new Error("Failed to generate a writing prompt.");
    }
};

export const evaluateWriting = async (language: Language, prompt: string, userText: string): Promise<WritingFeedback> => {
    const systemInstruction = `You are an expert language teacher providing feedback on a student's writing. The student is a beginner learning ${language.name}.
    The writing prompt was: "${prompt}"
    The student's response is: "${userText}"
    Evaluate their writing on a scale of 0-100 based on grammar, vocabulary, and relevance to the prompt.
    Provide a brief, encouraging summary of what they did well.
    Provide a list of 2-3 specific, actionable suggestions for improvement.
    Respond ONLY with a JSON object.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: systemInstruction,
            config: {
                responseMimeType: "application/json",
                responseSchema: writingFeedbackSchema,
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error evaluating writing:", error);
        throw new Error("Failed to evaluate writing.");
    }
};

export const generateVisionFeedback = async (language: Language, imageBase64: string, userText: string): Promise<VisionFeedback> => {
    const prompt = `A user learning ${language.name} is describing the attached image.
    Their description is: "${userText}"
    Please provide helpful feedback. Comment on what they described correctly and offer a concise correction if there are any grammatical errors.
    The feedback should be encouraging for a beginner.
    Respond ONLY with a JSON object.`;
    
    const imagePart = {
        inlineData: {
            mimeType: 'image/jpeg',
            data: imageBase64,
        },
    };
    const textPart = { text: prompt };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: visionFeedbackSchema,
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as VisionFeedback;
    } catch (error) {
        console.error("Error generating vision feedback:", error);
        throw new Error("Failed to get vision feedback.");
    }
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
        throw new Error("Failed to get a response from the AI partner.");
    }
};

export const startRoleplayConversation = (language: Language, scenario: string): Chat => {
    let scenarioPrompt = '';
    switch (scenario) {
        case 'coffee':
            scenarioPrompt = `You are a friendly barista in a café in a ${language.name}-speaking country. Your goal is to take the user's order. Start the conversation by greeting them and asking what they would like in a natural, friendly way.`;
            break;
        case 'market':
            scenarioPrompt = `You are a friendly vendor at an outdoor market in a ${language.name}-speaking country. Your goal is to sell some fruits or vegetables to the user. Start the conversation by greeting them warmly and asking if they need help finding something.`;
            break;
        case 'taxi':
            scenarioPrompt = `You are a taxi driver in a ${language.name}-speaking country. Your goal is to find out where the user wants to go. Start the conversation by greeting them and asking for their destination, as a real driver would.`;
            break;
        default:
            scenarioPrompt = `You are a friendly local. Start a simple, natural conversation with the user.`;
    }

    const systemInstruction = `You are an AI for a language learning app. You are playing a role in a scenario. You are talking to a beginner learning ${language.name}.
    - Your Persona and Goal: ${scenarioPrompt}
    - Your conversation style must be natural, friendly, and context-rich. Avoid robotic questions.
    - Keep your responses short and simple (1-2 sentences).
    - Guide the conversation towards your goal, but allow for small talk.
    - If the user makes a grammatical mistake, provide a brief, friendly correction in English, and then continue the conversation naturally in ${language.name} in character.
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