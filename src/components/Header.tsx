import React, { useState } from 'react';
import { Settings, Moon, Sun, Monitor } from 'lucide-react';
import { useTheme, PASTEL_COLORS } from '../context/ThemeContext';

const Header: React.FC<{ title: string }> = ({ title }) => {
  const { theme, toggleMode, setColorTheme, isDarkMode } = useTheme();
  const [showSettings, setShowSettings] = useState(false);

  const getModeIcon = () => {
    switch (theme.mode) {
      case 'light': return <Sun size={18} />;
      case 'dark': return <Moon size={18} />;
      default: return <Monitor size={18} />;
    }
  };

  return (
    <header 
      className="flex justify-between items-center p-4 sticky top-0 z-10 transition-colors duration-300 backdrop-blur-sm"
      style={{
        backgroundColor: isDarkMode ? 'rgba(17, 24, 39, 0.85)' : 'rgba(255, 255, 255, 0.85)',
      }}
    >
      <h1 
        className="text-xl font-bold transition-colors duration-300"
        style={{ color: isDarkMode ? '#F9FAFB' : '#111827' }}
      >
        {title}
      </h1>
      <div className="relative">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 rounded-full transition-colors duration-300 hover:bg-opacity-10"
          style={{
            backgroundColor: showSettings 
              ? (isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)') 
              : 'transparent',
            color: isDarkMode ? '#F9FAFB' : '#111827'
          }}
        >
          <Settings size={20} />
        </button>
        
        {showSettings && (
          <div 
            className="absolute right-0 mt-2 p-4 rounded-lg shadow-lg min-w-52 transition-colors duration-300 border"
            style={{
              backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
              borderColor: isDarkMode ? '#374151' : '#E5E7EB'
            }}
          >
            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-2">Theme Mode</h3>
              <button 
                onClick={toggleMode}
                className="flex items-center space-x-2 p-2 w-full rounded-md transition-colors duration-300"
                style={{
                  backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                  color: isDarkMode ? '#F9FAFB' : '#111827'
                }}
              >
                {getModeIcon()}
                <span className="text-sm">
                  {theme.mode === 'system' ? 'System' : theme.mode === 'dark' ? 'Dark' : 'Light'}
                </span>
              </button>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold mb-2">Colors</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(PASTEL_COLORS).map(([name, colors]) => (
                  <button
                    key={name}
                    onClick={() => setColorTheme(name as keyof typeof PASTEL_COLORS)}
                    className="p-2 rounded-md text-left text-sm transition-all duration-300"
                    style={{
                      backgroundColor: colors.primary,
                      color: '#4B5563',
                      border: theme.primaryColor === colors.primary 
                        ? '2px solid #6B7280' 
                        : '2px solid transparent'
                    }}
                  >
                    {name.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;