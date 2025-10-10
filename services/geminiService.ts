import { GoogleGenAI, Type, Chat } from "@google/genai";
import { Language, LessonContent, Feedback, Story, DictionaryEntry, ChatResponse, PronunciationFeedback, PlacementTestQuestion, PlacementTestResult, WritingFeedback, VisionFeedback } from '../types';

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

const visionFeedbackSchema = {
    type: Type.OBJECT,
    properties: {
        feedback: { type: Type.STRING, description: "Encouraging feedback about the user's description. Mention something they described well." },
        correction: { type: Type.STRING, description: "A corrected version of their sentence if there were grammatical errors. If no correction is needed, this should be null." }
    },
    required: ['feedback'],
};

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

export const startRoleplayConversation = (language: Language, scenario: string): Chat => {
    let scenarioPrompt = '';
    switch (scenario) {
        case 'coffee':
            scenarioPrompt = `You are a friendly barista in a café in a ${language.name}-speaking country. Your goal is to take the user's order. Start the conversation by greeting them and asking what they would like.`;
            break;
        case 'market':
            scenarioPrompt = `You are a friendly vendor at an outdoor market in a ${language.name}-speaking country. Your goal is to sell some fruits or vegetables to the user. Start the conversation by greeting them and asking if they need help.`;
            break;
        case 'taxi':
            scenarioPrompt = `You are a taxi driver in a ${language.name}-speaking country. Your goal is to find out where the user wants to go. Start the conversation by greeting them and asking for their destination.`;
            break;
        default:
            scenarioPrompt = `You are a friendly local. Start a simple conversation with the user.`;
    }

    const systemInstruction = `You are an AI for a language learning app. You are playing a role in a scenario. You are talking to a beginner learning ${language.name}.
    - Your Persona and Goal: ${scenarioPrompt}
    - Keep your responses short and simple (1-2 sentences).
    - Guide the conversation towards your goal.
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
- B1 Level: 'travel', 'work', 'shopping', 'directions'
- B2 Level: 'weather', 'home', 'health', 'emotions'
- C1 Level: 'school', 'tech', 'culture', 'nature'
- C2 Level: 'past', 'future'

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

export const evaluateLiveConversation = async (
    language: Language,
    transcript: string
): Promise<PlacementTestResult> => {
    const prompt = `A user has completed a live conversational placement test in ${language.name}. Here is the full transcript of the conversation: 
    ---
    ${transcript}
    ---
    Based on their performance in the conversation (grammar, vocabulary, fluency), what is their proficiency level?
    Determine which of the following topics they can skip. The available topics correspond to different levels:
    - A1 Level (Beginner): 'greetings', 'family'
    - A2 Level (Elementary): 'food', 'hobbies'
    - If they struggled with basic greetings, they should skip nothing (return an empty array for 'completedTopics').
    - If they handled greetings and introductions well, they can skip 'greetings' and 'family'.
    - If they showed a broader vocabulary and could form slightly more complex sentences (e.g., about food or hobbies), they can also skip 'food' and 'hobbies'.
    
    Be conservative. This is for beginners, so only mark the most basic topics as completed if they showed clear mastery.
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
        console.error("Error evaluating live conversation:", error);
        throw new Error("Failed to evaluate the live placement test results.");
    }
};

export const generateWritingPrompt = async (language: Language): Promise<string> => {
    const prompt = `Generate one simple and engaging writing prompt for a beginner learning ${language.name}. The prompt should be in English and encourage them to write 2-3 sentences. For example: "Describe your family." or "What did you do yesterday?". Return only the prompt text as a single string.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text.trim().replace(/"/g, '');
    } catch (error) {
        console.error("Error generating writing prompt:", error);
        throw new Error("Failed to generate a writing prompt.");
    }
};

export const evaluateWriting = async (language: Language, prompt: string, userText: string): Promise<WritingFeedback> => {
    const systemInstruction = `You are a friendly and encouraging language teacher. The user, a beginner in ${language.name}, was given the prompt: "${prompt}". They wrote: "${userText}".
    
    Please evaluate their writing. Provide feedback in JSON format.
    - Give a 'score' from 0 to 100. Be generous for beginners.
    - Write a brief, positive 'summary' highlighting something they did well.
    - Provide a list of 2-3 specific, actionable 'suggestions' for improvement. Frame them constructively (e.g., "You could also say...").`;

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
        return JSON.parse(jsonText) as WritingFeedback;
    } catch (error) {
        console.error("Error evaluating writing:", error);
        throw new Error("Failed to get writing feedback from the AI.");
    }
};

export const generateVisionFeedback = async (language: Language, imageBase64: string, userText: string): Promise<VisionFeedback> => {
    const prompt = `You are a language teacher. A user learning ${language.name} is describing the attached image.
    Their description is: "${userText}"
    
    Evaluate their description. Provide encouraging feedback and, if necessary, correct their grammar or vocabulary.
    Respond in JSON format with:
    - 'feedback': A positive and encouraging sentence about their description.
    - 'correction': A corrected version of their sentence in ${language.name}. If their sentence is perfect, make this null.`;

    try {
        const imagePart = {
            inlineData: {
                mimeType: 'image/jpeg',
                data: imageBase64,
            },
        };
        const textPart = {
            text: prompt
        };

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
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
        throw new Error("Failed to get feedback for the image description.");
    }
};
