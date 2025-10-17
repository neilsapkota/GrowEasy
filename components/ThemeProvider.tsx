import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'system';
export type AccessibilitySettings = {
	highContrast: boolean;
	reducedMotion: boolean;
	largeText: boolean;
	focusVisible: boolean;
};

interface ThemeContextType {
	theme: Theme;
	setTheme: (theme: Theme) => void;
	accessibilitySettings: AccessibilitySettings;
	updateAccessibilitySettings: (settings: Partial<AccessibilitySettings>) => void;
	actualTheme: 'light' | 'dark'; // The actual theme being applied
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}
	return context;
};

interface ThemeProviderProps {
	children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
	const [theme, setTheme] = useState<Theme>(() => {
		const saved = localStorage.getItem('novaLingo-theme');
		return (saved as Theme) || 'system';
	});

	const [accessibilitySettings, setAccessibilitySettings] = useState<AccessibilitySettings>(() => {
		const saved = localStorage.getItem('novaLingo-accessibility');
		return saved ? JSON.parse(saved) : {
			highContrast: false,
			reducedMotion: false,
			largeText: false,
			focusVisible: true,
		};
	});

	const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('dark');

	// Determine actual theme based on system preference
	useEffect(() => {
		const updateActualTheme = () => {
			if (theme === 'system') {
				const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
				setActualTheme(systemPrefersDark ? 'dark' : 'light');
			} else {
				setActualTheme(theme);
			}
		};

		updateActualTheme();

		// Listen for system theme changes
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		mediaQuery.addEventListener('change', updateActualTheme);

		return () => mediaQuery.removeEventListener('change', updateActualTheme);
	}, [theme]);

	// Apply theme to document
	useEffect(() => {
		document.documentElement.setAttribute('data-theme', actualTheme);
		
		// Apply accessibility settings
		document.documentElement.classList.toggle('high-contrast', accessibilitySettings.highContrast);
		document.documentElement.classList.toggle('reduced-motion', accessibilitySettings.reducedMotion);
		document.documentElement.classList.toggle('large-text', accessibilitySettings.largeText);
		document.documentElement.classList.toggle('focus-visible', accessibilitySettings.focusVisible);
	}, [actualTheme, accessibilitySettings]);

	// Save theme to localStorage
	useEffect(() => {
		localStorage.setItem('novaLingo-theme', theme);
	}, [theme]);

	// Save accessibility settings to localStorage
	useEffect(() => {
		localStorage.setItem('novaLingo-accessibility', JSON.stringify(accessibilitySettings));
	}, [accessibilitySettings]);

	const updateAccessibilitySettings = (settings: Partial<AccessibilitySettings>) => {
		setAccessibilitySettings(prev => ({ ...prev, ...settings }));
	};

	const value: ThemeContextType = {
		theme,
		setTheme,
		accessibilitySettings,
		updateAccessibilitySettings,
		actualTheme,
	};

	return (
		<ThemeContext.Provider value={value}>
			{children}
		</ThemeContext.Provider>
	);
};

// Accessibility Hook
export const useAccessibility = () => {
	const { accessibilitySettings, updateAccessibilitySettings } = useTheme();
	
	return {
		...accessibilitySettings,
		updateSettings: updateAccessibilitySettings,
	};
};

// Theme Toggle Component
export const ThemeToggle: React.FC = () => {
	const { theme, setTheme, actualTheme } = useTheme();
	
	const toggleTheme = () => {
		const themes: Theme[] = ['light', 'dark', 'system'];
		const currentIndex = themes.indexOf(theme);
		const nextIndex = (currentIndex + 1) % themes.length;
		setTheme(themes[nextIndex]);
	};

	return (
		<button
			onClick={toggleTheme}
			className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
			aria-label={`Switch theme. Current: ${theme === 'system' ? 'system' : actualTheme}`}
			title={`Current theme: ${theme === 'system' ? 'system' : actualTheme}`}
		>
			{actualTheme === 'dark' ? (
				<svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
					<path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
				</svg>
			) : (
				<svg className="w-5 h-5 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
					<path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
				</svg>
			)}
		</button>
	);
};

// Accessibility Settings Component
export const AccessibilitySettings: React.FC = () => {
	const { accessibilitySettings, updateAccessibilitySettings } = useTheme();
	
	return (
		<div className="space-y-4 p-4 bg-slate-800 rounded-lg">
			<h3 className="text-lg font-semibold text-white mb-4">Accessibility Settings</h3>
			
			<div className="space-y-3">
				<label className="flex items-center space-x-3 cursor-pointer">
					<input
						type="checkbox"
						checked={accessibilitySettings.highContrast}
						onChange={(e) => updateAccessibilitySettings({ highContrast: e.target.checked })}
						className="w-4 h-4 text-indigo-600 bg-slate-700 border-slate-600 rounded focus:ring-indigo-500 focus:ring-2"
					/>
					<span className="text-slate-200">High Contrast Mode</span>
				</label>
				
				<label className="flex items-center space-x-3 cursor-pointer">
					<input
						type="checkbox"
						checked={accessibilitySettings.reducedMotion}
						onChange={(e) => updateAccessibilitySettings({ reducedMotion: e.target.checked })}
						className="w-4 h-4 text-indigo-600 bg-slate-700 border-slate-600 rounded focus:ring-indigo-500 focus:ring-2"
					/>
					<span className="text-slate-200">Reduce Motion</span>
				</label>
				
				<label className="flex items-center space-x-3 cursor-pointer">
					<input
						type="checkbox"
						checked={accessibilitySettings.largeText}
						onChange={(e) => updateAccessibilitySettings({ largeText: e.target.checked })}
						className="w-4 h-4 text-indigo-600 bg-slate-700 border-slate-600 rounded focus:ring-indigo-500 focus:ring-2"
					/>
					<span className="text-slate-200">Large Text</span>
				</label>
				
				<label className="flex items-center space-x-3 cursor-pointer">
					<input
						type="checkbox"
						checked={accessibilitySettings.focusVisible}
						onChange={(e) => updateAccessibilitySettings({ focusVisible: e.target.checked })}
						className="w-4 h-4 text-indigo-600 bg-slate-700 border-slate-600 rounded focus:ring-indigo-500 focus:ring-2"
					/>
					<span className="text-slate-200">Enhanced Focus Indicators</span>
				</label>
			</div>
		</div>
	);
};
