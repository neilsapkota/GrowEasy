import { GoogleGenAI, Type } from "@google/genai";
import { Language, LessonContent, Feedback, Story, DictionaryEntry } from '../types';

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
        examples: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
        },
        quiz: {
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
    required: ['topic', 'vocabulary', 'examples', 'quiz'],
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


export const generateLesson = async (language: Language, topic: string): Promise<LessonContent> => {
    const prompt = `Generate a beginner-level language lesson for learning ${language.name} about '${topic}'. The lesson must include:
1. A list of 3-5 key vocabulary words with their English translations and a simple, IPA-based phonetic pronunciation guide for each word.
2. One simple example sentence in ${language.name} for each vocabulary word.
3. A single, simple multiple-choice quiz question to test understanding. Provide the question in English. Provide 4 options in ${language.name}: one correct answer and three plausible but incorrect distractors. Also, specify the correct answer.`;

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

        if (!parsedContent.quiz.options.includes(parsedContent.quiz.correctAnswer)) {
            const incorrectOptions = parsedContent.quiz.options.filter(opt => opt !== parsedContent.quiz.correctAnswer);
            const options = incorrectOptions.slice(0, 3);
            options.push(parsedContent.quiz.correctAnswer);
            parsedContent.quiz.options = options.sort(() => Math.random() - 0.5);
        }
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

export const generatePracticeContent = async (language: Language, mode: 'conversation' | 'listening', count: number): Promise<string[]> => {
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
