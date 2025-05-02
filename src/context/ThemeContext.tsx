import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeSettings } from '../types';

// Define the pastel color presets
export const PASTEL_COLORS = {
  LAVENDER: {
    primary: '#D8B4FE',    // Light purple
    secondary: '#C4B5FD',  // Lighter purple
    accent: '#A78BFA'      // Medium purple
  },
  MINT: {
    primary: '#A7F3D0',    // Light mint
    secondary: '#6EE7B7',  // Medium mint
    accent: '#34D399'      // Darker mint
  },
  PEACH: {
    primary: '#FECACA',    // Light peach
    secondary: '#FCA5A5',  // Medium peach
    accent: '#F87171'      // Darker peach
  },
  POWDER_BLUE: {
    primary: '#BFDBFE',    // Light blue
    secondary: '#93C5FD',  // Medium blue
    accent: '#60A5FA'      // Darker blue
  }
};

interface ThemeContextType {
  theme: ThemeSettings;
  setTheme: React.Dispatch<React.SetStateAction<ThemeSettings>>;
  toggleMode: () => void;
  setColorTheme: (colorSet: keyof typeof PASTEL_COLORS) => void;
  isDarkMode: boolean;
}

const defaultTheme: ThemeSettings = {
  mode: 'system',
  ...PASTEL_COLORS.LAVENDER
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeSettings>(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? JSON.parse(savedTheme) : defaultTheme;
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(theme));
  }, [theme]);

  useEffect(() => {
    const updateThemeMode = () => {
      if (theme.mode === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDarkMode(prefersDark);
        document.documentElement.classList.toggle('dark', prefersDark);
      } else {
        const isDark = theme.mode === 'dark';
        setIsDarkMode(isDark);
        document.documentElement.classList.toggle('dark', isDark);
      }
    };

    updateThemeMode();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme.mode === 'system') {
        updateThemeMode();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme.mode]);

  // Apply CSS variables for theme colors
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', theme.primaryColor);
    root.style.setProperty('--secondary-color', theme.secondaryColor);
    root.style.setProperty('--accent-color', theme.accentColor);
  }, [theme.primaryColor, theme.secondaryColor, theme.accentColor]);

  const toggleMode = () => {
    setTheme(prev => ({
      ...prev,
      mode: prev.mode === 'light' ? 'dark' : prev.mode === 'dark' ? 'system' : 'light'
    }));
  };

  const setColorTheme = (colorSet: keyof typeof PASTEL_COLORS) => {
    setTheme(prev => ({
      ...prev,
      primaryColor: PASTEL_COLORS[colorSet].primary,
      secondaryColor: PASTEL_COLORS[colorSet].secondary,
      accentColor: PASTEL_COLORS[colorSet].accent
    }));
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleMode,
        setColorTheme,
        isDarkMode
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};