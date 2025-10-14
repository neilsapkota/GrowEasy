
import { RegisteredUser, Message, LeagueTier } from '../types';

// --- INITIAL DATA (THE "DATABASE" SEED) ---

const initialRegisteredUsers: RegisteredUser[] = [
  {
    user: {
      name: "Alice",
      email: "alice@wordvine.com",
      avatarUrl: "https://api.dicebear.com/8.x/initials/svg?seed=Alice",
      bio: "Learning Spanish for my trip to Colombia!"
    },
    progress: {
      "es": {
        xp: 125,
        streak: 3,
        completedTopics: ["greetings", "numbers"],
        mistakes: [],
        learnedVocabulary: [],
        league: LeagueTier.Bronze,
        unlockedAchievements: ["xp_100", "streak_3", "lessons_1"],
        practiceSessions: 2,
        perfectLessons: 1,
        activityLog: [],
        flashcardDecks: []
      }
    },
    friends: ["bob@wordvine.com"],
    friendRequests: []
  },
  {
    user: {
      name: "Bob",
      email: "bob@wordvine.com",
      avatarUrl: "https://api.dicebear.com/8.x/initials/svg?seed=Bob",
      bio: "Trying to learn French."
    },
    progress: {
      "fr": {
        xp: 80,
        streak: 1,
        completedTopics: ["greetings"],
        mistakes: [],
        learnedVocabulary: [],
        league: LeagueTier.Bronze,
        unlockedAchievements: [],
        practiceSessions: 0,
        perfectLessons: 0,
        activityLog: [],
        flashcardDecks: []
      }
    },
    friends: ["alice@wordvine.com"],
    friendRequests: []
  }
];

const initialMessages: Message[] = [
    { id: '1', from: 'alice@wordvine.com', to: 'bob@wordvine.com', content: 'Hey Bob, ready for the weekly leaderboard race?', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), read: true },
    { id: '2', from: 'bob@wordvine.com', to: 'alice@wordvine.com', content: 'You bet! I\'ve been practicing my Spanish. Watch out!', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(), read: false },
];


// --- LOCALSTORAGE INTERACTION FUNCTIONS ---

// Ensures the test user "neilsapkota@gmail.com" always exists for easy testing.
export const ensureTestUserExists = (users: RegisteredUser[]): RegisteredUser[] => {
    const testUserEmail = "neilsapkota@gmail.com";
    const testUserExists = users.some(u => u.user.email === testUserEmail);

    if (!testUserExists) {
        const testUser: RegisteredUser = {
            user: {
                name: "Neil",
                email: testUserEmail,
                avatarUrl: `https://api.dicebear.com/8.x/initials/svg?seed=Neil`,
                bio: ""
            },
            progress: {},
            friends: [],
            friendRequests: []
        };
        return [...users, testUser];
    }
    return users;
};


// For Registered Users
export const getRegisteredUsers = (): RegisteredUser[] => {
    try {
        const savedUsers = localStorage.getItem('fluentliUsers');
        if (savedUsers) {
            return JSON.parse(savedUsers);
        } else {
            // If nothing in localStorage, seed it with initial data
            localStorage.setItem('fluentliUsers', JSON.stringify(initialRegisteredUsers));
            return initialRegisteredUsers;
        }
    } catch (error) {
        console.error("Failed to parse or get registered users from localStorage", error);
        return initialRegisteredUsers;
    }
};

export const saveRegisteredUsers = (users: RegisteredUser[]): void => {
    try {
        localStorage.setItem('fluentliUsers', JSON.stringify(users));
    } catch (error) {
        console.error("Failed to save registered users to localStorage", error);
    }
};


// For Messages
export const getMessages = (): Message[] => {
    try {
        const savedMessages = localStorage.getItem('fluentliMessages');
        if (savedMessages) {
            return JSON.parse(savedMessages);
        } else {
            // If nothing in localStorage, seed it with initial data
            localStorage.setItem('fluentliMessages', JSON.stringify(initialMessages));
            return initialMessages;
        }
    } catch (error) {
        console.error("Failed to parse or get messages from localStorage", error);
        return initialMessages;
    }
};

export const saveMessages = (messages: Message[]): void => {
    try {
        localStorage.setItem('fluentliMessages', JSON.stringify(messages));
    } catch (error) {
        console.error("Failed to save messages to localStorage", error);
    }
};
